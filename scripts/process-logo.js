const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcPath = 'C:\\Users\\maharshi patel\\.gemini\\antigravity-ide\\brain\\1341d6a5-79ae-4771-bbbc-4b91562c3895\\media__1785315029511.png';
const logoDir = path.join(__dirname, '..', 'src', 'assets', 'logo');
const assetsLogoDir = path.join(__dirname, '..', 'assets', 'logo');
const assetsImgDir = path.join(__dirname, '..', 'assets', 'images');

if (!fs.existsSync(logoDir)) fs.mkdirSync(logoDir, { recursive: true });
if (!fs.existsSync(assetsLogoDir)) fs.mkdirSync(assetsLogoDir, { recursive: true });
if (!fs.existsSync(assetsImgDir)) fs.mkdirSync(assetsImgDir, { recursive: true });

async function processLogo() {
  console.log('Processing Halcyon razor-sharp glowing logo assets...');

  const image = sharp(srcPath);
  const metadata = await image.metadata();
  const width = metadata.width;
  const height = metadata.height;

  // 1. Threshold white pixels to transparent/black
  const rawBuffer = await image.raw().toBuffer();
  const channels = metadata.channels;

  const transparentBuffer = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const srcIndex = i * channels;
    const r = rawBuffer[srcIndex];
    const g = rawBuffer[srcIndex + 1];
    const b = rawBuffer[srcIndex + 2];

    const destIndex = i * 4;
    transparentBuffer[destIndex] = r;
    transparentBuffer[destIndex + 1] = g;
    transparentBuffer[destIndex + 2] = b;

    // White threshold
    if (r > 220 && g > 220 && b > 220) {
      transparentBuffer[destIndex + 3] = 0; // Transparent
    } else {
      transparentBuffer[destIndex + 3] = 255;
    }
  }

  // Create base transparent sharp image with enhanced contrast and sharpness
  const transparentFull = sharp(transparentBuffer, {
    raw: { width, height, channels: 4 }
  })
    .sharpen({ sigma: 1.5, m1: 1.2, m2: 2.0 }) // High sharpness
    .modulate({ brightness: 1.05, saturation: 1.25 }); // Enhanced cyan color vibrancy

  // Save Full Logo (Transparent background)
  const fullBuffer = await transparentFull.png().toBuffer();
  fs.writeFileSync(path.join(logoDir, 'halcyon-full.png'), fullBuffer);
  fs.writeFileSync(path.join(assetsLogoDir, 'halcyon-full.png'), fullBuffer);

  console.log('Saved halcyon-full.png (High sharpness & cyan vibrancy)');

  // Crop Shield Only (Bounding box for shield top half)
  const shieldCropWidth = Math.floor(width * 0.45);
  const shieldCropHeight = Math.floor(height * 0.45);
  const shieldLeft = Math.floor((width - shieldCropWidth) / 2);
  const shieldTop = Math.floor(height * 0.18);

  const shieldOnly = sharp(transparentBuffer, {
    raw: { width, height, channels: 4 }
  })
    .extract({
      left: shieldLeft,
      top: shieldTop,
      width: shieldCropWidth,
      height: shieldCropHeight,
    })
    .sharpen({ sigma: 1.8, m1: 1.5, m2: 2.5 }) // Extra sharp shield edges
    .modulate({ brightness: 1.08, saturation: 1.3 });

  const shieldBuffer = await shieldOnly.png().toBuffer();

  fs.writeFileSync(path.join(logoDir, 'halcyon-icon.png'), shieldBuffer);
  fs.writeFileSync(path.join(assetsLogoDir, 'halcyon-icon.png'), shieldBuffer);
  fs.writeFileSync(path.join(logoDir, 'halcyon-glow.png'), shieldBuffer);
  fs.writeFileSync(path.join(assetsLogoDir, 'halcyon-glow.png'), shieldBuffer);

  console.log('Saved halcyon-icon.png & halcyon-glow.png (Razor sharp)');

  // Save Splash Logo
  fs.writeFileSync(path.join(logoDir, 'splash-logo.png'), fullBuffer);
  fs.writeFileSync(path.join(assetsLogoDir, 'splash-logo.png'), fullBuffer);

  console.log('Saved splash-logo.png');

  // Save App Icon (Pure Black Background + Centered Shield)
  const appIconSize = 1024;
  const scaledShield = await shieldOnly
    .clone()
    .resize(720, 720, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const appIconBuffer = await sharp({
    create: {
      width: appIconSize,
      height: appIconSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 } // #000000 Pitch Black
    }
  })
    .composite([{ input: scaledShield, gravity: 'center' }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(assetsImgDir, 'icon.png'), appIconBuffer);

  console.log('Saved app-icon (icon.png)');

  console.log('High sharpness & glowing logo process complete!');
}

processLogo().catch(err => console.error('Logo process error:', err));
