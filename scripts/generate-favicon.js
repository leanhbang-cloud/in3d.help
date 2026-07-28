import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

async function generateFavicon() {
  const logoPath = './public/logo.jpg';
  const icoPath = './public/favicon.ico';
  const pngPath = './public/favicon.png';
  const appleTouchPath = './public/apple-touch-icon.png';

  try {
    console.log('⏳ Đang đọc logo và khởi tạo favicon...');
    
    // Đọc metadata để kiểm tra kích thước
    const metadata = await sharp(logoPath).metadata();
    const size = Math.min(metadata.width || 0, metadata.height || 0);
    
    // Cắt ảnh thành hình vuông từ giữa (nếu ảnh không vuông)
    const squaredImage = sharp(logoPath).extract({
      left: Math.round(((metadata.width || 0) - size) / 2),
      top: Math.round(((metadata.height || 0) - size) / 2),
      width: size,
      height: size
    });

    // 1. Tạo file favicon.png (192x192) làm icon chất lượng cao
    await squaredImage
      .clone()
      .resize(192, 192)
      .png()
      .toFile(pngPath);
    console.log('✅ Đã tạo public/favicon.png (192x192)');

    // 2. Tạo file apple-touch-icon.png (180x180) cho thiết bị iOS
    await squaredImage
      .clone()
      .resize(180, 180)
      .png()
      .toFile(appleTouchPath);
    console.log('✅ Đã tạo public/apple-touch-icon.png (180x180)');

    // 3. Tạo file favicon.ico (32x32) sử dụng định dạng ICO chuẩn
    const png32Buffer = await squaredImage
      .clone()
      .resize(32, 32)
      .png()
      .toBuffer();

    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // Reserved
    header.writeUInt16LE(1, 2); // Type: 1 = ICO
    header.writeUInt16LE(1, 4); // Number of images: 1

    const entry = Buffer.alloc(16);
    entry.writeUInt8(32, 0); // Width: 32
    entry.writeUInt8(32, 1); // Height: 32
    entry.writeUInt8(0, 2);  // Color palette: 0 (none)
    entry.writeUInt8(0, 3);  // Reserved: 0
    entry.writeUInt16LE(1, 4); // Color planes: 1
    entry.writeUInt16LE(32, 6); // Bits per pixel: 32
    entry.writeUInt32LE(png32Buffer.length, 8); // Image size
    entry.writeUInt32LE(22, 12); // Offset: 6 (header) + 16 (entry) = 22

    const icoBuffer = Buffer.concat([header, entry, png32Buffer]);
    await fs.writeFile(icoPath, icoBuffer);
    console.log('✅ Đã tạo public/favicon.ico (32x32)');

    console.log('🎉 Đã tạo toàn bộ Favicon thành công từ logo!');
  } catch (error) {
    console.error('❌ Lỗi khi tạo Favicon từ logo:', error);
    process.exit(1);
  }
}

generateFavicon();
