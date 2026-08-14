import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const TARGET_DIR = './public/images/Test';

async function run() {
  if (!fs.existsSync(TARGET_DIR)) {
    console.error(`❌ Thư mục không tồn tại: ${TARGET_DIR}`);
    return;
  }

  const files = fs.readdirSync(TARGET_DIR);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ext === '.png' || ext === '.jpg' || ext === '.jpeg';
  });

  if (imageFiles.length === 0) {
    console.log('ℹ️ Không tìm thấy file ảnh gốc nào (.png, .jpg, .jpeg) trong thư mục Test.');
    return;
  }

  console.log(`🚀 Bắt đầu tối ưu hóa ${imageFiles.length} hình ảnh trong thư mục Test...\n`);

  for (const file of imageFiles) {
    const inputPath = path.join(TARGET_DIR, file);
    const ext = path.extname(file);
    const filenameWithoutExt = path.basename(file, ext);
    const outputPath = path.join(TARGET_DIR, `${filenameWithoutExt}.webp`);

    const inputSize = fs.statSync(inputPath).size;
    console.log(`⚙️ Đang xử lý: ${file} (${(inputSize / 1024 / 1024).toFixed(2)} MB)...`);

    try {
      await sharp(inputPath)
        .resize({ width: 1200, withoutEnlargement: true }) // Resize chiều rộng về tối đa 1200px
        .webp({ quality: 75 }) // Chuyển đổi sang WebP chất lượng 75
        .toFile(outputPath);

      const outputSize = fs.statSync(outputPath).size;
      const reduction = (((inputSize - outputSize) / inputSize) * 100).toFixed(1);
      console.log(`   + Xuất file: ${path.basename(outputPath)} (${(outputSize / 1024).toFixed(1)} KB)`);
      console.log(`   + Nén giảm: ${reduction}%\n`);
    } catch (error) {
      console.error(`❌ Lỗi khi xử lý file ${file}:`, error);
    }
  }

  console.log('🎉 Hoàn thành tối ưu hóa toàn bộ hình ảnh trong thư mục Test!');
}

run();
