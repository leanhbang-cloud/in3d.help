const CACHE_NAME = 'nuidinh-help-v1';
const MAP_TILES_CACHE = 'map-tiles-v1';
const GEOJSON_CACHE = 'geojson-v1';

// Danh sách các tài nguyên tĩnh cốt lõi cần pre-cache ngay khi Service Worker được install
const PRECACHE_ASSETS = [
  '/',
  '/cac-cung-duong',
  '/vendor/leaflet/leaflet.js',
  '/vendor/leaflet/leaflet.css'
];

// Giới hạn số lượng map tiles lưu trong cache để tránh đầy bộ nhớ thiết bị
const MAX_MAP_TILES = 300;

// Hàm dọn dẹp cache theo cơ chế FIFO (First-In, First-Out) khi vượt quá số lượng tối đa
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    // Xóa bớt các tiles cũ nhất
    const itemsToDelete = keys.length - maxItems;
    for (let i = 0; i < itemsToDelete; i++) {
      await cache.delete(keys[i]);
    }
  }
}

// 1. Sự kiện INSTALL: Tải và lưu các core assets vào cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Sự kiện ACTIVATE: Xóa bỏ các caches cũ không còn sử dụng
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, MAP_TILES_CACHE, GEOJSON_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Sự kiện FETCH: Intercept các request để phục vụ offline
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // A. Xử lý Map Tiles (CartoDB hoặc OpenStreetMap) -> Chiến lược Cache-First
  if (requestUrl.hostname.includes('basemaps.cartocdn.com') || requestUrl.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.open(MAP_TILES_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse; // Có trong cache, trả về luôn
          }
          // Chưa có trong cache, fetch từ mạng rồi lưu vào cache
          return fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            // Giới hạn kích thước cache bất đồng bộ
            limitCacheSize(MAP_TILES_CACHE, MAX_MAP_TILES);
            return networkResponse;
          }).catch(() => {
            // Lỗi mạng và không có cache -> Trả về ảnh trống hoặc null
            return new Response('');
          });
        });
      })
    );
    return;
  }

  // B. Xử lý dữ liệu GeoJSON -> Chiến lược Stale-While-Revalidate
  if (requestUrl.pathname.includes('/data/geojson/')) {
    event.respondWith(
      caches.open(GEOJSON_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // C. Các tài nguyên tĩnh khác (CSS, JS, Images, HTML của trang) -> Chiến lược Network-First, Fallback to Cache
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Chỉ cache các request thành công (status 200) của chính domain hiện tại
        if (networkResponse.status === 200 && requestUrl.origin === self.location.origin) {
          // Tránh cache API downloads hoặc các API động khác
          if (!requestUrl.pathname.startsWith('/api/')) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
        }
        return networkResponse;
      })
      .catch(() => {
        // Mất mạng -> tìm kiếm trong cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Nếu mất mạng hoàn toàn và yêu cầu trang HTML mới -> Trả về trang offline fallback nếu có
          if (event.request.mode === 'navigate') {
            return caches.match('/'); // Tạm thời fallback về trang chủ tĩnh
          }
        });
      })
  );
});
