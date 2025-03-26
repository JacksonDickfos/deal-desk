const fs = require('fs');
const { createCanvas } = require('canvas');

const OWNERS = ['Hasan', 'Jared', 'Guillermo', 'Ricardo', 'Kamran'];
const PRODUCTS = ['Kayako', 'Influitive', 'Agents', 'CRMagic', 'Ephor', 'AI Caller'];

// Ensure directories exist
fs.mkdirSync('public/images/owners', { recursive: true });
fs.mkdirSync('public/images/products', { recursive: true });

function generatePlaceholder(text, filename, type) {
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = type === 'owner' ? '#4F46E5' : '#2563EB';
  ctx.fillRect(0, 0, 200, 200);

  // Text
  ctx.font = '40px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Get first letter or first letters of words
  const initials = text.split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  ctx.fillText(initials, 100, 100);

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
}

// Generate owner images
OWNERS.forEach(owner => {
  const filename = `public/images/owners/${owner.toLowerCase()}.png`;
  generatePlaceholder(owner, filename, 'owner');
  console.log(`Generated ${filename}`);
});

// Generate product images
PRODUCTS.forEach(product => {
  const filename = `public/images/products/${product.toLowerCase()}.png`;
  generatePlaceholder(product, filename, 'product');
  console.log(`Generated ${filename}`);
}); 