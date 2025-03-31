import { supabase, STORAGE_BUCKETS } from '../src/lib/supabase';
import fs from 'fs';
import path from 'path';

async function uploadImages() {
  // Upload product images
  const productImagesDir = path.join(process.cwd(), 'public', 'products');
  const productFiles = fs.readdirSync(productImagesDir);
  
  console.log('Uploading product images...');
  for (const file of productFiles) {
    const filePath = path.join(productImagesDir, file);
    const fileBuffer = fs.readFileSync(filePath);
    
    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS.PRODUCTS)
      .upload(file, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });
      
    if (error) {
      console.error(`Error uploading ${file}:`, error);
    } else {
      console.log(`✓ Uploaded ${file}`);
    }
  }

  // Upload owner images
  const ownerImagesDir = path.join(process.cwd(), 'public', 'owners');
  const ownerFiles = fs.readdirSync(ownerImagesDir);
  
  console.log('\nUploading owner images...');
  for (const file of ownerFiles) {
    const filePath = path.join(ownerImagesDir, file);
    const fileBuffer = fs.readFileSync(filePath);
    
    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS.OWNERS)
      .upload(file, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });
      
    if (error) {
      console.error(`Error uploading ${file}:`, error);
    } else {
      console.log(`✓ Uploaded ${file}`);
    }
  }
}

uploadImages()
  .then(() => {
    console.log('\nAll images uploaded successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error uploading images:', error);
    process.exit(1);
  }); 