#!/bin/bash

# This script optimizes images for the web.
# It finds all jpg, jpeg, and png images in the public/images directory,
# resizes them to a maximum width of 1200px,
# compresses them to a quality of 80%,
# and saves them in the public/images_optimized directory.

# Create the output directory if it doesn't exist
mkdir -p public/images_optimized

# Find and process the images
find public/images -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -print0 | while IFS= read -r -d $'\0' file; do
  echo "Optimizing $file"
  
  # Get the filename from the path
  filename=$(basename -- "$file")
  
  # Optimize the image
  convert "$file" -resize 1200x\> -quality 80 "public/images_optimized/$filename"
done

echo "Image optimization complete."
echo "Optimized images are in public/images_optimized."
echo "Please review the optimized images and replace the original ones in public/images with the optimized ones."
echo "You can also update your content to point to the new images."
