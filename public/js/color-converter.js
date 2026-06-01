// Color Converter for Garments & Textile Industry

let currentRGB = { r: 255, g: 0, b: 0 };

// Popular garment colors palette
const garmentPalette = [
  '#000000', '#FFFFFF', '#FF0000', '#0000FF', '#FFFF00', '#00FF00',
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#800000',
  '#000080', '#008080', '#FFC0CB', '#A52A2A', '#808080', '#FFD700',
  '#4B0082', '#F0E68C', '#E6E6FA', '#FF6347', '#40E0D0', '#EE82EE',
  '#F5DEB3', '#FFFFFF', '#000000', '#DC143C', '#FF1493', '#00CED1',
  '#1E90FF', '#FFDAB9', '#98FB98', '#DDA0DD', '#B0E0E6', '#FF4500'
];

// Pantone TCX color database (simplified subset)
const pantoneColors = [
  { name: '19-1664 TCX', hex: '#FF0000', r: 255, g: 0, b: 0 },
  { name: '19-4052 TCX', hex: '#0000FF', r: 0, g: 0, b: 255 },
  { name: '13-0647 TCX', hex: '#FFFF00', r: 255, g: 255, b: 0 },
  { name: '15-0343 TCX', hex: '#00FF00', r: 0, g: 255, b: 0 },
  { name: '17-2036 TCX', hex: '#FF00FF', r: 255, g: 0, b: 255 },
  { name: '14-4816 TCX', hex: '#00FFFF', r: 0, g: 255, b: 255 },
  { name: '16-1546 TCX', hex: '#FFA500', r: 255, g: 165, b: 0 },
  { name: '19-3528 TCX', hex: '#800080', r: 128, g: 0, b: 128 },
  { name: '18-6320 TCX', hex: '#008000', r: 0, g: 128, b: 0 },
  { name: '19-1729 TCX', hex: '#800000', r: 128, g: 0, b: 0 },
  { name: '19-3955 TCX', hex: '#000080', r: 0, g: 0, b: 128 },
  { name: '15-5519 TCX', hex: '#008080', r: 0, g: 128, b: 128 },
  { name: '13-1108 TCX', hex: '#FFC0CB', r: 255, g: 192, b: 203 },
  { name: '19-1318 TCX', hex: '#A52A2A', r: 165, g: 42, b: 42 },
  { name: '17-4402 TCX', hex: '#808080', r: 128, g: 128, b: 128 },
  { name: '14-0955 TCX', hex: '#FFD700', r: 255, g: 215, b: 0 },
  { name: '19-3024 TCX', hex: '#4B0082', r: 75, g: 0, b: 130 },
  { name: '14-0951 TCX', hex: '#F0E68C', r: 240, g: 230, b: 140 },
  { name: '15-3817 TCX', hex: '#E6E6FA', r: 230, g: 230, b: 250 },
  { name: '17-1463 TCX', hex: '#FF6347', r: 255, g: 99, b: 71 },
  { name: '14-4318 TCX', hex: '#40E0D0', r: 64, g: 224, b: 208 },
  { name: '16-3320 TCX', hex: '#EE82EE', r: 238, g: 130, b: 238 },
  { name: '16-1345 TCX', hex: '#F5DEB3', r: 245, g: 222, b: 179 },
  { name: '11-0601 TCX', hex: '#FFFFFF', r: 255, g: 255, b: 255 },
  { name: '19-0303 TCX', hex: '#000000', r: 0, g: 0, b: 0 },
  { name: '18-1664 TCX', hex: '#DC143C', r: 220, g: 20, b: 60 },
  { name: '17-1927 TCX', hex: '#FF1493', r: 255, g: 20, b: 147 },
  { name: '15-5517 TCX', hex: '#00CED1', r: 0, g: 206, b: 209 },
  { name: '18-3940 TCX', hex: '#1E90FF', r: 30, g: 144, b: 255 },
  { name: '13-1107 TCX', hex: '#FFDAB9', r: 255, g: 218, b: 185 },
  { name: '14-0152 TCX', hex: '#98FB98', r: 152, g: 251, b: 152 },
  { name: '16-3310 TCX', hex: '#DDA0DD', r: 221, g: 160, b: 221 },
  { name: '14-4314 TCX', hex: '#B0E0E6', r: 176, g: 224, b: 230 },
  { name: '17-1454 TCX', hex: '#FF4500', r: 255, g: 69, b: 0 }
];

// RAL color database (simplified subset)
const ralColors = [
  { name: 'RAL 3020', hex: '#CB2821', r: 203, g: 40, b: 33 },
  { name: 'RAL 5000', hex: '#354D73', r: 53, g: 77, b: 115 },
  { name: 'RAL 1003', hex: '#F5A300', r: 245, g: 163, b: 0 },
  { name: 'RAL 6000', hex: '#316650', r: 49, g: 102, b: 80 },
  { name: 'RAL 5015', hex: '#237841', r: 35, g: 120, b: 65 },
  { name: 'RAL 8017', hex: '#434750', r: 67, g: 71, b: 80 },
  { name: 'RAL 9010', hex: '#FFFFFF', r: 255, g: 255, b: 255 },
  { name: 'RAL 9005', hex: '#09090B', r: 9, g: 9, b: 11 },
  { name: 'RAL 3000', hex: '#AF2B1E', r: 175, g: 43, b: 30 },
  { name: 'RAL 4001', hex: '#692545', r: 105, g: 37, b: 69 },
  { name: 'RAL 2000', hex: '#ED760E', r: 237, g: 118, b: 14 },
  { name: 'RAL 7001', hex: '#7E7B52', r: 126, g: 123, b: 82 },
  { name: 'RAL 1016', hex: '#EDFF21', r: 237, g: 255, b: 33 },
  { name: 'RAL 5002', hex: '#20214F', r: 32, g: 33, b: 79 },
  { name: 'RAL 6001', hex: '#287233', r: 40, g: 114, b: 51 }
];

// Named garment/textile colors database
const namedColors = [
  { name: 'Ivory', r: 255, g: 255, b: 240 },
  { name: 'Ecru', r: 194, g: 178, b: 128 },
  { name: 'Off White', r: 250, g: 250, b: 245 },
  { name: 'Cream', r: 245, g: 245, b: 220 },
  { name: 'Sand', r: 194, g: 178, b: 128 },
  { name: 'Beige', r: 245, g: 245, b: 220 },
  { name: 'Camel', r: 193, g: 154, b: 107 },
  { name: 'Khaki', r: 195, g: 176, b: 145 },
  { name: 'Olive', r: 128, g: 128, b: 0 },
  { name: 'Navy', r: 0, g: 0, b: 128 },
  { name: 'Royal Blue', r: 65, g: 105, b: 225 },
  { name: 'Cobalt', r: 0, g: 71, b: 171 },
  { name: 'Teal', r: 0, g: 128, b: 128 },
  { name: 'Emerald', r: 80, g: 200, b: 120 },
  { name: 'Forest Green', r: 34, g: 139, b: 34 },
  { name: 'Burgundy', r: 128, g: 0, b: 32 },
  { name: 'Wine', r: 114, g: 47, b: 55 },
  { name: 'Maroon', r: 128, g: 0, b: 0 },
  { name: 'Coral', r: 255, g: 127, b: 80 },
  { name: 'Rust', r: 183, g: 65, b: 14 },
  { name: 'Mustard', r: 255, g: 219, b: 88 },
  { name: 'Charcoal', r: 54, g: 69, b: 79 },
  { name: 'Slate', r: 112, g: 128, b: 144 },
  { name: 'Pearl', r: 240, g: 248, b: 255 },
  { name: 'Taupe', r: 72, g: 60, b: 50 },
  { name: 'Chocolate', r: 210, g: 105, b: 30 },
  { name: 'Bronze', r: 205, g: 127, b: 50 },
  { name: 'Gold', r: 255, g: 215, b: 0 },
  { name: 'Silver', r: 192, g: 192, b: 192 },
  { name: 'Platinum', r: 229, g: 228, b: 226 },
  { name: 'Copper', r: 184, g: 115, b: 51 },
  { name: 'Rose', r: 255, g: 0, b: 127 },
  { name: 'Lavender', r: 230, g: 230, b: 250 },
  { name: 'Lilac', r: 200, g: 162, b: 200 },
  { name: 'Magenta', r: 255, g: 0, b: 255 },
  { name: 'Fuchsia', r: 255, g: 0, b: 255 },
  { name: 'Turquoise', r: 64, g: 224, b: 208 },
  { name: 'Aqua', r: 0, g: 255, b: 255 },
  { name: 'Cyan', r: 0, g: 255, b: 255 },
  { name: 'Indigo', r: 75, g: 0, b: 130 },
  { name: 'Violet', r: 238, g: 130, b: 238 },
  { name: 'Purple', r: 128, g: 0, b: 128 },
  { name: 'Scarlet', r: 255, g: 36, b: 0 },
  { name: 'Crimson', r: 220, g: 20, b: 60 },
  { name: 'Cardinal', r: 196, g: 30, b: 58 },
  { name: 'Ruby', r: 224, g: 17, b: 95 },
  { name: 'Sapphire', r: 15, g: 82, b: 186 },
  { name: 'Topaz', r: 255, g: 200, b: 124 },
  { name: 'Amber', r: 255, g: 191, b: 0 },
  { name: 'Citrine', r: 255, g: 228, b: 0 },
  { name: 'Peridot', r: 230, g: 226, b: 0 },
  { name: 'Jade', r: 0, g: 168, b: 107 },
  { name: 'Mint', r: 152, g: 255, b: 152 },
  { name: 'Lime', r: 0, g: 255, b: 0 },
  { name: 'Chartreuse', r: 127, g: 255, b: 0 },
  { name: 'Sage', r: 188, g: 184, b: 138 },
  { name: 'Hunter Green', r: 53, g: 94, b: 59 },
  { name: 'Moss Green', r: 138, g: 154, b: 91 },
  { name: 'Sea Green', r: 46, g: 139, b: 87 },
  { name: 'Sky Blue', r: 135, g: 206, b: 235 },
  { name: 'Baby Blue', r: 137, g: 207, b: 240 },
  { name: 'Powder Blue', r: 176, g: 224, b: 230 },
  { name: 'Steel Blue', r: 70, g: 130, b: 180 },
  { name: 'Midnight Blue', r: 25, g: 25, b: 112 },
  { name: 'Denim', r: 66, g: 105, b: 145 },
  { name: 'Carnation', r: 255, g: 127, b: 80 },
  { name: 'Peach', r: 255, g: 218, b: 185 },
  { name: 'Apricot', r: 251, g: 206, b: 177 },
  { name: 'Blush', r: 222, g: 165, b: 164 },
  { name: 'Berry', r: 137, g: 43, b: 226 },
  { name: 'Plum', r: 221, g: 160, b: 221 },
  { name: 'Mauve', r: 224, g: 176, b: 255 },
  { name: 'Orchid', r: 218, g: 112, b: 214 },
  { name: 'Tangerine', r: 255, g: 140, b: 0 },
  { name: 'Pumpkin', r: 255, g: 117, b: 24 },
  { name: 'Cinnamon', r: 210, g: 105, b: 30 },
  { name: 'Ginger', r: 250, g: 160, b: 122 },
  { name: 'Chestnut', r: 205, g: 92, b: 92 },
  { name: 'Coffee', r: 111, g: 78, b: 55 },
  { name: 'Espresso', r: 84, g: 63, b: 47 },
  { name: 'Black', r: 0, g: 0, b: 0 },
  { name: 'White', r: 255, g: 255, b: 255 },
  { name: 'Gray', r: 128, g: 128, b: 128 },
  { name: 'Grey', r: 128, g: 128, b: 128 }
];

// Initialize on page load
function initAll() {
  initColorWheel();
  initPalette();
  updateAllConversions();
  initFAQ();
  calculateDistance();

  // Event listeners for input fields
  document.getElementById('colorInput').addEventListener('input', handleColorInput);
  document.getElementById('rInput').addEventListener('input', handleRGBInput);
  document.getElementById('gInput').addEventListener('input', handleRGBInput);
  document.getElementById('bInput').addEventListener('input', handleRGBInput);
  document.getElementById('colorAInput').addEventListener('input', calculateDistance);
  document.getElementById('colorBInput').addEventListener('input', calculateDistance);

  // Color preview event listeners
  document.getElementById('colorPreviewLighter1').addEventListener('click', function() { selectPreviewColor(1); });
  document.getElementById('colorPreview').addEventListener('click', function() { selectPreviewColor(2); });
  document.getElementById('colorPreviewDarker1').addEventListener('click', function() { selectPreviewColor(3); });
  document.getElementById('colorPreviewDarker2').addEventListener('click', function() { selectPreviewColor(4); });

  // Copy button event listeners
  document.getElementById('copy-hex').addEventListener('click', function() { copyToClipboard('hexValue'); });
  document.getElementById('copy-rgb').addEventListener('click', function() { copyToClipboard('rgbValue'); });
  document.getElementById('copy-cmyk').addEventListener('click', function() { copyToClipboard('cmykValue'); });
  document.getElementById('copy-lab').addEventListener('click', function() { copyToClipboard('labValue'); });
  document.getElementById('copy-lch').addEventListener('click', function() { copyToClipboard('lchValue'); });
  document.getElementById('copy-hsl').addEventListener('click', function() { copyToClipboard('hslValue'); });
  document.getElementById('copy-hsv').addEventListener('click', function() { copyToClipboard('hsvValue'); });
  document.getElementById('copy-ncs').addEventListener('click', function() { copyToClipboard('ncsValue'); });
  document.getElementById('copy-pantone').addEventListener('click', function() { copyToClipboard('pantoneValue'); });
  document.getElementById('copy-ral').addEventListener('click', function() { copyToClipboard('ralValue'); });
  document.getElementById('copy-munsell').addEventListener('click', function() { copyToClipboard('munsellValue'); });
  document.getElementById('copy-xyz').addEventListener('click', function() { copyToClipboard('xyzValue'); });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

// Color Wheel
function initColorWheel() {
  const canvas = document.getElementById('colorWheel');
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = canvas.width / 2 - 10;

  // Draw color wheel
  for (let angle = 0; angle < 360; angle++) {
    const startAngle = (angle - 2) * Math.PI / 180;
    const endAngle = (angle + 2) * Math.PI / 180;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    
    const hue = angle;
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fill();
  }

  // Add saturation gradient overlay
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  gradient.addColorStop(0, '#FFFFFF');
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();

  // Event listeners
  let isDragging = false;

  canvas.addEventListener('mousedown', function(e) {
    isDragging = true;
    pickColor(e);
  });

  canvas.addEventListener('mousemove', function(e) {
    if (isDragging) {
      pickColor(e);
    }
  });

  canvas.addEventListener('mouseup', function() {
    isDragging = false;
  });

  canvas.addEventListener('mouseleave', function() {
    isDragging = false;
  });

  function pickColor(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    currentRGB = { r: pixel[0], g: pixel[1], b: pixel[2] };
    
    updateAllConversions();
  }
}

// Initialize palette
function initPalette() {
  const paletteGrid = document.getElementById('paletteGrid');
  
  garmentPalette.forEach(color => {
    const swatch = document.createElement('div');
    swatch.className = 'palette-swatch';
    swatch.style.backgroundColor = color;
    swatch.addEventListener('click', function() {
      const rgb = hexToRgb(color);
      currentRGB = rgb;
      updateAllConversions();
    });
    paletteGrid.appendChild(swatch);
  });
}

// Update all conversions
function updateAllConversions() {
  const { r, g, b } = currentRGB;
  const hex = rgbToHex(r, g, b);
  
  // Update preview row
  const lighter2 = adjustBrightness(r, g, b, 40);
  const lighter1 = adjustBrightness(r, g, b, 20);
  const darker1 = adjustBrightness(r, g, b, -20);
  const darker2 = adjustBrightness(r, g, b, -40);
  
  document.getElementById('colorPreviewLighter2').style.backgroundColor = rgbToHex(lighter2.r, lighter2.g, lighter2.b);
  document.getElementById('colorPreviewLighter1').style.backgroundColor = rgbToHex(lighter1.r, lighter1.g, lighter1.b);
  document.getElementById('colorPreview').style.backgroundColor = hex;
  document.getElementById('colorPreviewDarker1').style.backgroundColor = rgbToHex(darker1.r, darker1.g, darker1.b);
  document.getElementById('colorPreviewDarker2').style.backgroundColor = rgbToHex(darker2.r, darker2.g, darker2.b);
  
  // Update named colors
  updateNamedColors(r, g, b);
  
  // Update all swatches
  document.getElementById('hexSwatch').style.backgroundColor = hex;
  document.getElementById('rgbSwatch').style.backgroundColor = hex;
  document.getElementById('cmykSwatch').style.backgroundColor = hex;
  document.getElementById('labSwatch').style.backgroundColor = hex;
  document.getElementById('lchSwatch').style.backgroundColor = hex;
  document.getElementById('hslSwatch').style.backgroundColor = hex;
  document.getElementById('hsvSwatch').style.backgroundColor = hex;
  document.getElementById('ncsSwatch').style.backgroundColor = hex;
  document.getElementById('munsellSwatch').style.backgroundColor = hex;
  document.getElementById('xyzSwatch').style.backgroundColor = hex;
  
  // Update conversions
  document.getElementById('hexValue').textContent = hex.toUpperCase();
  document.getElementById('rgbValue').textContent = `rgb(${r}, ${g}, ${b})`;
  
  const cmyk = rgbToCmyk(r, g, b);
  document.getElementById('cmykValue').textContent = `${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`;
  
  const lab = rgbToLab(r, g, b);
  document.getElementById('labValue').textContent = `L:${Math.round(lab.L)}, A:${Math.round(lab.a)}, B:${Math.round(lab.b)}`;
  
  const lch = labToLch(lab.L, lab.a, lab.b);
  document.getElementById('lchValue').textContent = `L:${Math.round(lch.L)}, C:${Math.round(lch.C)}, H:${Math.round(lch.h)}°`;
  
  const hsl = rgbToHsl(r, g, b);
  document.getElementById('hslValue').textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  
  const hsv = rgbToHsv(r, g, b);
  document.getElementById('hsvValue').textContent = `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
  
  const ncs = rgbToNcs(lab);
  document.getElementById('ncsValue').textContent = ncs;
  
  const pantone = findNearestPantone(r, g, b);
  document.getElementById('pantoneValue').textContent = pantone.name;
  document.getElementById('pantoneSwatch').style.backgroundColor = pantone.hex;
  
  const deltaE = calculateDeltaE2000(lab, rgbToLab(pantone.r, pantone.g, pantone.b));
  document.getElementById('deltaEValue').textContent = deltaE.toFixed(2);
  
  const ral = findNearestRal(r, g, b);
  document.getElementById('ralValue').textContent = ral.name;
  document.getElementById('ralSwatch').style.backgroundColor = ral.hex;
  
  const munsell = labToMunsell(lab);
  document.getElementById('munsellValue').textContent = munsell;
  
  const xyz = rgbToXyz(r, g, b);
  document.getElementById('xyzValue').textContent = `X:${Math.round(xyz.X)}, Y:${Math.round(xyz.Y)}, Z:${Math.round(xyz.Z)}`;
  
  // Update input fields
  document.getElementById('rInput').value = r;
  document.getElementById('gInput').value = g;
  document.getElementById('bInput').value = b;
  document.getElementById('colorInput').value = hex.toUpperCase();
}

// Adjust brightness
function adjustBrightness(r, g, b, amount) {
  return {
    r: Math.max(0, Math.min(255, r + amount)),
    g: Math.max(0, Math.min(255, g + amount)),
    b: Math.max(0, Math.min(255, b + amount))
  };
}

// Update named colors grid
function updateNamedColors(r, g, b) {
  const lab1 = rgbToLab(r, g, b);
  
  // Calculate Delta E for all named colors
  const colorsWithDelta = namedColors.map(color => {
    const lab2 = rgbToLab(color.r, color.g, color.b);
    const delta = calculateDeltaE2000(lab1, lab2);
    return { ...color, delta };
  });
  
  // Sort by Delta E and get top 10
  const closestColors = colorsWithDelta
    .sort((a, b) => a.delta - b.delta)
    .slice(0, 10);
  
  // Display in grid
  const grid = document.getElementById('namedColorsGrid');
  grid.innerHTML = '';
  
  closestColors.forEach(color => {
    const item = document.createElement('div');
    item.className = 'named-color-item';
    item.onclick = () => selectNamedColor(color.r, color.g, color.b);
    
    const swatch = document.createElement('div');
    swatch.className = 'named-color-swatch';
    swatch.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
    
    const name = document.createElement('span');
    name.className = 'named-color-name';
    name.textContent = color.name;
    
    item.appendChild(swatch);
    item.appendChild(name);
    grid.appendChild(item);
  });
}

// Select named color
function selectNamedColor(r, g, b) {
  currentRGB = { r, g, b };
  updateAllConversions();
}

// Select preview color
function selectPreviewColor(index) {
  const previews = [
    'colorPreviewLighter2',
    'colorPreviewLighter1',
    'colorPreview',
    'colorPreviewDarker1',
    'colorPreviewDarker2'
  ];
  
  // Remove selected class from all
  previews.forEach(id => {
    document.getElementById(id).classList.remove('color-preview--selected');
  });
  
  // Add selected class to clicked
  document.getElementById(previews[index]).classList.add('color-preview--selected');
  
  // Get the color from the clicked preview
  const bgColor = document.getElementById(previews[index]).style.backgroundColor;
  const match = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);
  if (match) {
    currentRGB = {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3])
    };
    updateAllConversions();
  }
}

// Color conversion functions
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function rgbToCmyk(r, g, b) {
  let c = 1 - (r / 255);
  let m = 1 - (g / 255);
  let y = 1 - (b / 255);
  let k = Math.min(c, Math.min(m, y));
  
  c = (c - k) / (1 - k) || 0;
  m = (m - k) / (1 - k) || 0;
  y = (y - k) / (1 - k) || 0;
  
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
}

function rgbToLab(r, g, b) {
  let [lr, lg, lb] = [r, g, b].map(x => {
    x = x / 255;
    return x > 0.04045 ? Math.pow((x + 0.055) / 1.055, 2.4) : x / 12.92;
  });
  
  lr = lr * 100;
  lg = lg * 100;
  lb = lb * 100;
  
  let x = lr * 0.4124 + lg * 0.3576 + lb * 0.1805;
  let y = lr * 0.2126 + lg * 0.7152 + lb * 0.0722;
  let z = lr * 0.0193 + lg * 0.1192 + lb * 0.9505;
  
  x /= 95.047;
  y /= 100;
  z /= 108.883;
  
  [x, y, z] = [x, y, z].map(v => v > 0.008856 ? Math.pow(v, 1/3) : (7.787 * v) + 16/116);
  
  return {
    L: (116 * y) - 16,
    a: 500 * (x - y),
    b: 200 * (y - z)
  };
}

function labToLch(L, a, b) {
  const C = Math.sqrt(a * a + b * b);
  const h = Math.atan2(b, a) * 180 / Math.PI;
  return { L, C, h: h < 0 ? h + 360 : h };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function rgbToXyz(r, g, b) {
  let [lr, lg, lb] = [r, g, b].map(x => {
    x = x / 255;
    return x > 0.04045 ? Math.pow((x + 0.055) / 1.055, 2.4) : x / 12.92;
  });
  
  return {
    X: (lr * 41.24 + lg * 35.76 + lb * 18.05),
    Y: (lr * 21.26 + lg * 71.52 + lb * 7.22),
    Z: (lr * 1.93 + lg * 11.92 + lb * 95.05)
  };
}

function rgbToNcs(lab) {
  // Simplified NCS approximation
  const L = lab.L;
  const C = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  const h = Math.atan2(lab.b, lab.a) * 180 / Math.PI;
  
  const blackness = Math.round((100 - L) / 2);
  const chromaticness = Math.round(C / 1.5);
  const hueAngle = h < 0 ? h + 360 : h;
  
  let hueCode = '';
  if (hueAngle < 45) hueCode = 'Y' + Math.round(hueAngle / 45 * 90) + 'R';
  else if (hueAngle < 90) hueCode = 'R' + Math.round((hueAngle - 45) / 45 * 90) + 'Y';
  else if (hueAngle < 135) hueCode = 'Y' + Math.round((hueAngle - 90) / 45 * 90) + 'G';
  else if (hueAngle < 180) hueCode = 'G' + Math.round((hueAngle - 135) / 45 * 90) + 'Y';
  else if (hueAngle < 225) hueCode = 'G' + Math.round((hueAngle - 180) / 45 * 90) + 'B';
  else if (hueAngle < 270) hueCode = 'B' + Math.round((hueAngle - 225) / 45 * 90) + 'G';
  else if (hueAngle < 315) hueCode = 'B' + Math.round((hueAngle - 270) / 45 * 90) + 'R';
  else hueCode = 'R' + Math.round((hueAngle - 315) / 45 * 90) + 'B';
  
  const s = blackness > 0 ? 'S' : 'N';
  return `${s} ${String(chromaticness).padStart(2, '0')}${String(blackness).padStart(2, '0')}-${hueCode}`;
}

function labToMunsell(lab) {
  // Simplified Munsell approximation
  const L = lab.L;
  const C = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  const h = Math.atan2(lab.b, lab.a) * 180 / Math.PI;
  
  const value = Math.round(L / 10);
  const chroma = Math.round(C / 2);
  
  let hue = '';
  const hueAngle = h < 0 ? h + 360 : h;
  if (hueAngle < 36) hue = '5R';
  else if (hueAngle < 72) hue = '5YR';
  else if (hueAngle < 108) hue = '5Y';
  else if (hueAngle < 144) hue = '5GY';
  else if (hueAngle < 180) hue = '5G';
  else if (hueAngle < 216) hue = '5BG';
  else if (hueAngle < 252) hue = '5B';
  else if (hueAngle < 288) hue = '5PB';
  else if (hueAngle < 324) hue = '5P';
  else hue = '5RP';
  
  return `${hue} ${Math.min(value, 10)}/${Math.min(chroma, 20)}`;
}

function findNearestPantone(r, g, b) {
  let minDelta = Infinity;
  let nearest = pantoneColors[0];
  
  const lab1 = rgbToLab(r, g, b);
  
  pantoneColors.forEach(color => {
    const lab2 = rgbToLab(color.r, color.g, color.b);
    const delta = calculateDeltaE2000(lab1, lab2);
    if (delta < minDelta) {
      minDelta = delta;
      nearest = color;
    }
  });
  
  return nearest;
}

function findNearestRal(r, g, b) {
  let minDelta = Infinity;
  let nearest = ralColors[0];
  
  const lab1 = rgbToLab(r, g, b);
  
  ralColors.forEach(color => {
    const lab2 = rgbToLab(color.r, color.g, color.b);
    const delta = calculateDeltaE2000(lab1, lab2);
    if (delta < minDelta) {
      minDelta = delta;
      nearest = color;
    }
  });
  
  return nearest;
}

// Delta E calculations
function calculateDeltaE2000(lab1, lab2) {
  const L1 = lab1.L, a1 = lab1.a, b1 = lab1.b;
  const L2 = lab2.L, a2 = lab2.a, b2 = lab2.b;
  
  const Lbar = (L1 + L2) / 2;
  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const Cbar = (C1 + C2) / 2;
  
  let a1prime = a1 + a1 / 2 * (1 - Math.sqrt(Math.pow(Cbar, 7) / (Math.pow(Cbar, 7) + Math.pow(25, 7))));
  let a2prime = a2 + a2 / 2 * (1 - Math.sqrt(Math.pow(Cbar, 7) / (Math.pow(Cbar, 7) + Math.pow(25, 7))));
  
  const C1prime = Math.sqrt(a1prime * a1prime + b1 * b1);
  const C2prime = Math.sqrt(a2prime * a2prime + b2 * b2);
  const Cbarprime = (C1prime + C2prime) / 2;
  
  let h1prime = Math.atan2(b1, a1prime) * 180 / Math.PI;
  if (h1prime < 0) h1prime += 360;
  let h2prime = Math.atan2(b2, a2prime) * 180 / Math.PI;
  if (h2prime < 0) h2prime += 360;
  
  const Hbarprime = Math.abs(h1prime - h2prime) > 180 ? (h1prime + h2prime + 360) / 2 : (h1prime + h2prime) / 2;
  
  const T = 1 - 0.17 * Math.cos((Hbarprime - 30) * Math.PI / 180) +
            0.24 * Math.cos(2 * Hbarprime * Math.PI / 180) +
            0.32 * Math.cos((3 * Hbarprime + 6) * Math.PI / 180) -
            0.20 * Math.cos((4 * Hbarprime - 63) * Math.PI / 180);
  
  let deltaHprime;
  if (Math.abs(h2prime - h1prime) <= 180) {
    deltaHprime = h2prime - h1prime;
  } else if (h2prime - h1prime > 180) {
    deltaHprime = h2prime - h1prime - 360;
  } else {
    deltaHprime = h2prime - h1prime + 360;
  }
  
  const deltaLprime = L2 - L1;
  const deltaCprime = C2prime - C1prime;
  const deltaHprime2 = 2 * Math.sqrt(C1prime * C2prime) * Math.sin(deltaHprime * Math.PI / 360);
  
  const SL = 1 + (0.015 * Math.pow(Lbar - 50, 2)) / Math.sqrt(20 + Math.pow(Lbar - 50, 2));
  const SC = 1 + 0.045 * Cbarprime;
  const SH = 1 + 0.015 * Cbarprime * T;
  
  const RT = -2 * Math.sqrt(Math.pow(Cbarprime, 7) / (Math.pow(Cbarprime, 7) + Math.pow(25, 7))) *
             Math.sin(60 * Math.exp(-Math.pow((Hbarprime - 275) / 25, 2)) * Math.PI / 180);
  
  const deltaE = Math.sqrt(
    Math.pow(deltaLprime / SL, 2) +
    Math.pow(deltaCprime / SC, 2) +
    Math.pow(deltaHprime2 / SH, 2) +
    RT * (deltaCprime / SC) * (deltaHprime2 / SH)
  );
  
  return deltaE;
}

function calculateDeltaE1994(lab1, lab2) {
  const deltaL = lab1.L - lab2.L;
  const deltaC = Math.sqrt(lab1.a * lab1.a + lab1.b * lab1.b) - Math.sqrt(lab2.a * lab2.a + lab2.b * lab2.b);
  const deltaH = Math.sqrt(
    Math.pow(lab1.a - lab2.a, 2) + 
    Math.pow(lab1.b - lab2.b, 2) - 
    Math.pow(deltaC, 2)
  );
  
  const C1 = Math.sqrt(lab1.a * lab1.a + lab1.b * lab1.b);
  const SL = 1;
  const SC = 1 + 0.045 * C1;
  const SH = 1 + 0.015 * C1;
  
  return Math.sqrt(
    Math.pow(deltaL / SL, 2) +
    Math.pow(deltaC / SC, 2) +
    Math.pow(deltaH / SH, 2)
  );
}

function calculateDeltaE1976(lab1, lab2) {
  return Math.sqrt(
    Math.pow(lab1.L - lab2.L, 2) +
    Math.pow(lab1.a - lab2.a, 2) +
    Math.pow(lab1.b - lab2.b, 2)
  );
}

// Input handlers
function handleColorInput() {
  const input = document.getElementById('colorInput').value.trim();
  
  if (input.startsWith('#')) {
    const rgb = hexToRgb(input);
    currentRGB = rgb;
    updateAllConversions();
  } else if (input.startsWith('rgb')) {
    const match = input.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);
    if (match) {
      currentRGB = { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
      updateAllConversions();
    }
  } else {
    // Try color name
    const tempDiv = document.createElement('div');
    tempDiv.style.color = input;
    document.body.appendChild(tempDiv);
    const computed = window.getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);
    
    const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);
    if (match) {
      currentRGB = { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
      updateAllConversions();
    }
  }
}

function handleRGBInput() {
  const r = parseInt(document.getElementById('rInput').value) || 0;
  const g = parseInt(document.getElementById('gInput').value) || 0;
  const b = parseInt(document.getElementById('bInput').value) || 0;
  
  currentRGB = { 
    r: Math.max(0, Math.min(255, r)), 
    g: Math.max(0, Math.min(255, g)), 
    b: Math.max(0, Math.min(255, b)) 
  };
  
  updateAllConversions();
}

// Distance calculator
function calculateDistance() {
  const colorAHex = document.getElementById('colorAInput').value.trim();
  const colorBHex = document.getElementById('colorBInput').value.trim();
  
  const rgbA = hexToRgb(colorAHex);
  const rgbB = hexToRgb(colorBHex);
  
  document.getElementById('colorAPreview').style.backgroundColor = colorAHex;
  document.getElementById('colorBPreview').style.backgroundColor = colorBHex;
  document.getElementById('comparisonA').style.backgroundColor = colorAHex;
  document.getElementById('comparisonB').style.backgroundColor = colorBHex;
  
  const labA = rgbToLab(rgbA.r, rgbA.g, rgbA.b);
  const labB = rgbToLab(rgbB.r, rgbB.g, rgbB.b);
  
  const deltaE2000 = calculateDeltaE2000(labA, labB);
  const deltaE1994 = calculateDeltaE1994(labA, labB);
  const deltaE1976 = calculateDeltaE1976(labA, labB);
  
  document.getElementById('deltaE2000').textContent = deltaE2000.toFixed(2);
  document.getElementById('deltaE1994').textContent = deltaE1994.toFixed(2);
  document.getElementById('deltaE1976').textContent = deltaE1976.toFixed(2);
  
  const matchQuality = document.getElementById('matchQuality');
  matchQuality.className = 'match-quality';
  
  if (deltaE2000 < 1) {
    matchQuality.textContent = 'Excellent Match (Imperceptible)';
    matchQuality.classList.add('match-excellent');
  } else if (deltaE2000 < 2) {
    matchQuality.textContent = 'Good Match';
    matchQuality.classList.add('match-good');
  } else if (deltaE2000 < 5) {
    matchQuality.textContent = 'Acceptable Match';
    matchQuality.classList.add('match-acceptable');
  } else {
    matchQuality.textContent = 'Poor Match (Needs Correction)';
    matchQuality.classList.add('match-poor');
  }
}

// Copy to clipboard
function copyToClipboard(elementId) {
  const text = document.getElementById(elementId).textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 1500);
  });
}

// FAQ accordion
function initFAQ() {
  const questions = document.querySelectorAll('.faq-question');
  
  questions.forEach(question => {
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const icon = this.querySelector('.faq-icon');
      const isOpen = answer.classList.contains('faq-answer--visible');
      
      // Close all
      document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('faq-answer--visible'));
      document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('faq-icon--open'));
      document.querySelectorAll('.faq-question').forEach(q => q.setAttribute('aria-expanded', 'false'));
      
      // Open clicked if it was closed
      if (!isOpen) {
        answer.classList.add('faq-answer--visible');
        icon.classList.add('faq-icon--open');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// Event listeners for input fields
document.getElementById('colorInput').addEventListener('input', handleColorInput);
document.getElementById('rInput').addEventListener('input', handleRGBInput);
document.getElementById('gInput').addEventListener('input', handleRGBInput);
document.getElementById('bInput').addEventListener('input', handleRGBInput);
document.getElementById('colorAInput').addEventListener('input', calculateDistance);
document.getElementById('colorBInput').addEventListener('input', calculateDistance);
