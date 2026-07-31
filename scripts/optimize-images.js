import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const IMAGES_DIR = './public/images';
const BACKUP_DIR = './public/images/backup_raw';

// Tạo thư mục backup nếu chưa có
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

async function optimizeFile(inputPath, relativePath) {
  const ext = path.extname(inputPath).toLowerCase();
  const filename = path.basename(inputPath);
  
  // Bỏ qua nếu không phải định dạng ảnh cần xử lý hoặc nằm trong backup_raw
  if (inputPath.includes('backup_raw')) return;
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') return;

  console.log(`\n⚙️ Đang tối ưu: ${relativePath}...`);

  // Copy tệp gốc vào backup_raw trước khi làm bất kỳ điều gì (giữ nguyên cấu trúc thư mục)
  const backupPath = path.join(BACKUP_DIR, relativePath);
  const backupSubdir = path.dirname(backupPath);
  if (!fs.existsSync(backupSubdir)) {
    fs.mkdirSync(backupSubdir, { recursive: true });
  }
  fs.copyFileSync(inputPath, backupPath);

  const filenameWithoutExt = path.basename(filename, ext);
  const outputDir = path.dirname(inputPath);
  const outputPath = path.join(outputDir, `${filenameWithoutExt}.webp`);

  let builder = sharp(inputPath);
  let quality = 75;

  if (filename === 'hero-pegboard.png' || filename === 'hero-desk-setup.jpg') {
    quality = 80;
    const mobileFilename = filename === 'hero-pegboard.png' ? 'hero-pegboard-mobile.webp' : 'hero-desk-setup-mobile.webp';
    // Tạo thêm bản mobile
    const mobileOutputPath = path.join(outputDir, mobileFilename);
    await sharp(inputPath)
      .resize({ width: 768, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(mobileOutputPath);
    const mobileSize = fs.statSync(mobileOutputPath).size;
    console.log(`   + Tạo bản Mobile Hero: ${mobileFilename} (${(mobileSize / 1024).toFixed(1)} KB)`);
    
    // Bản desktop
    builder = builder.resize({ width: 1200, withoutEnlargement: true });
  } else if (filename === 'ledainhan-portrait.jpg') {
    quality = 75;
    builder = builder.resize({ width: 800, withoutEnlargement: true });
  } else if (filename === 'ledainhan-avatar.jpg') {
    quality = 70;
    builder = builder.resize({ width: 150, withoutEnlargement: true });
  } else if (filename === 'modular-assembly.png' || filename === 'detail-assembly.jpg') {
    quality = 75;
    builder = builder.resize({ width: 1000, withoutEnlargement: true });
  } else if (filename === 'lifestyle-student.jpg' || filename === 'lifestyle-kids.jpg') {
    quality = 75;
    builder = builder.resize({ width: 1000, withoutEnlargement: true });
  } else if (filename === 'detail-3dprint.jpg') {
    quality = 75;
    builder = builder.resize({ width: 800, withoutEnlargement: true });
  } else if (relativePath.startsWith('gallery/')) {
    quality = 75;
    builder = builder.resize({ width: 800, withoutEnlargement: true });
  }

  await builder
    .webp({ quality })
    .toFile(outputPath);

  const inputSize = fs.statSync(inputPath).size;
  const outputSize = fs.statSync(outputPath).size;
  const reduction = (((inputSize - outputSize) / inputSize) * 100).toFixed(1);

  console.log(`✅ Đã xuất: ${outputPath} (${(outputSize / 1024).toFixed(1)} KB) - Nén: ${reduction}% (Backup gốc lưu tại ${backupPath})`);
}

async function walkAndOptimize(dir, baseDir = IMAGES_DIR) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relativePath = path.relative(baseDir, fullPath);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await walkAndOptimize(fullPath, baseDir);
    } else {
      await optimizeFile(fullPath, relativePath);
    }
  }
}

async function run() {
  try {
    await walkAndOptimize(IMAGES_DIR);
    console.log('\n🎉 Đã tối ưu hóa và chuyển đổi toàn bộ ảnh sang WebP thành công!');
  } catch (error) {
    console.error('❌ Lỗi khi tối ưu ảnh:', error);
  }
}

run();
