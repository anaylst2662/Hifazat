// Creates the app icons in public/icons from one drawing (a shield).
// Run with: node scripts/make-icons.mjs
import sharp from "sharp";

const shield = (scale) => `
  <g transform="translate(256 256) scale(${scale}) translate(-256 -256)">
    <path d="M256 72 L400 128 V240 C400 332 340 404 256 440 C172 404 112 332 112 240 V128 Z"
          fill="none" stroke="#ffffff" stroke-width="30" stroke-linejoin="round"/>
    <path d="M196 252 L240 296 L320 212" fill="none" stroke="#ffffff" stroke-width="30"
          stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;

const svg = ({ rounded, scale }) => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${rounded ? 112 : 0}" fill="#14325a"/>
  ${shield(scale)}
</svg>`);

const out = "public/icons";
await sharp(svg({ rounded: true, scale: 1 })).resize(192).png().toFile(`${out}/icon-192.png`);
await sharp(svg({ rounded: true, scale: 1 })).resize(512).png().toFile(`${out}/icon-512.png`);
// "Maskable": the phone may crop it to a circle, so the shield is smaller.
await sharp(svg({ rounded: false, scale: 0.75 })).resize(512).png().toFile(`${out}/icon-maskable-512.png`);
await sharp(svg({ rounded: false, scale: 0.9 })).resize(180).png().toFile(`${out}/apple-touch-icon.png`);
console.log("Icons written to", out);
