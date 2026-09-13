const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Simple script to generate valid PNG images for PWA icons
function createPNG(size, bgR, bgG, bgB, accentR, accentG, accentB) {
  const width = size;
  const height = size;
  
  // Create raw RGBA buffer with filter byte per scanline
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);
  
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.42;
  const innerRadius = width * 0.30;
  
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None
    
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Rounded card or circular logo
      const cornerRadius = size * 0.22;
      const insideBox = (
        x >= cornerRadius && x < width - cornerRadius &&
        y >= cornerRadius && y < height - cornerRadius
      ) || (
        Math.hypot(Math.max(0, Math.abs(x - cx) - (cx - cornerRadius)), Math.max(0, Math.abs(y - cy) - (cy - cornerRadius))) <= cornerRadius
      );

      if (insideBox) {
        // Gold / Amber burger-POS emblem
        const isEmblem = (Math.abs(dx) < size * 0.26 && Math.abs(dy) < size * 0.22);
        const isBun = (Math.abs(dx) < size * 0.24 && dy > -size * 0.20 && dy < -size * 0.08);
        const isPatty = (Math.abs(dx) < size * 0.25 && dy >= -size * 0.04 && dy <= size * 0.04);
        const isBottomBun = (Math.abs(dx) < size * 0.24 && dy > size * 0.08 && dy < size * 0.18);
        
        if (isBun || isPatty || isBottomBun) {
          rawData[pxOffset] = accentR;
          rawData[pxOffset + 1] = accentG;
          rawData[pxOffset + 2] = accentB;
          rawData[pxOffset + 3] = 255;
        } else {
          rawData[pxOffset] = bgR;
          rawData[pxOffset + 1] = bgG;
          rawData[pxOffset + 2] = bgB;
          rawData[pxOffset + 3] = 255;
        }
      } else {
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0; // transparent outside rounded container
      }
    }
  }

  // Compress IDAT
  const compressed = zlib.deflateSync(rawData);

  // Helper to build chunks
  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crc = crc32(Buffer.concat([typeBuf, data]));
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // Standard CRC32
  function crc32(buf) {
    let c = 0xffffffff;
    for (let n = 0; n < buf.length; n++) {
      c ^= buf[n];
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression: deflate
  ihdr[11] = 0; // Filter: standard
  ihdr[12] = 0; // Interlace: none

  const ihdrChunk = chunk('IHDR', ihdr);
  const idatChunk = chunk('IDAT', compressed);
  const iendChunk = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate 192x192, 512x512, apple-touch-icon 180x180
// Dark Slate #0f172a bg, Amber #f59e0b burger icon
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPNG(192, 15, 23, 42, 245, 158, 11));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPNG(512, 15, 23, 42, 245, 158, 11));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPNG(180, 15, 23, 42, 245, 158, 11));
console.log('PNG PWA icons created successfully!');
