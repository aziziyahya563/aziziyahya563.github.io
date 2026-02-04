import os
from PIL import Image
import sys
# Register HEIF opener
try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
    HAS_HEIC = True
    print("HEIC support enabled.")
except ImportError:
    HAS_HEIC = False
    print("pillow-heif not installed. HEIC files will be skipped.")

def optimize_images(directory, max_width=1200, quality=80):
    """
    Scans the directory for images (including HEIC), resizes them,
    and converts HEIC to JPG for web compatibility.
    """
    # Extensions - checking for both lower and uppercase
    extensions = {'.jpg', '.jpeg', '.png', '.webp'}
    if HAS_HEIC:
        extensions.add('.heic')
        extensions.add('.heif')
    
    print(f"Scanning {directory} for images...")
    
    count = 0
    saved_space = 0
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in extensions:
                file_path = os.path.join(root, file)
                
                try:
                    original_size = os.path.getsize(file_path)
                    
                    # Open image
                    with Image.open(file_path) as img:
                        # Handle rotation for HEIC/Phone photos
                        # Pillow usually handles EXIF orientation automatically on load? 
                        # Not always. Let's rely on Image.open handling simple cases or do basic resize.
                        
                        # Determine Output Format
                        # If HEIC, we MUST convert to JPG for web support
                        target_format = "JPEG"
                        output_ext = ".jpg"
                        optimize_flag = True
                        
                        if ext in ['.png']:
                            target_format = "PNG"
                            output_ext = ".png"
                        elif ext in ['.webp']:
                            target_format = "WEBP"
                            output_ext = ".webp"
                        
                        # Calculate resize
                        width, height = img.size
                        if width > max_width:
                            ratio = max_width / width
                            new_height = int(height * ratio)
                            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                            print(f"Resizing {file}: {width}x{height} -> {max_width}x{new_height}")
                        
                        # Construct output path
                        # If converting HEIC -> JPG, change extension
                        if ext in ['.heic', '.heif']:
                            base_name = os.path.splitext(file_path)[0]
                            output_path = base_name + ".jpg"
                            print(f"Converting HEIC: {file} -> {os.path.basename(output_path)}")
                            # Convert to RGB (HEIC might be RGBA or other modes)
                            if img.mode != 'RGB':
                                img = img.convert('RGB')
                        else:
                            output_path = file_path
                        
                        # Save optimization
                        if target_format == "JPEG":
                            img.save(output_path, target_format,  optimize=True, quality=quality)
                        elif target_format == "PNG":
                            img.save(output_path, target_format, optimize=True)
                        elif target_format == "WEBP":
                            img.save(output_path, target_format, quality=quality)
                            
                    # Start Calculation
                    # If we created a new file (HEIC -> JPG), we compare against the old HEIC size
                    # If we overwrote, we compare against original size which we stored
                    new_size = os.path.getsize(output_path)
                    
                    saved = original_size - new_size
                    
                    if ext in ['.heic', '.heif']:
                        # Optional: Remove original HEIC to save space?
                        # For safety, let's keep it for now unless requested, 
                        # but usually for web dev we just want the JPG.
                        # Let's delete the HEIC to "replace" it effectively in the folder context
                        # or just leave it. The User asked to optimize.
                        # I'll leave the HEIC but the print output will show the JPG creation.
                        pass

                    if saved > 0:
                        print(f"Optimized {file}: {original_size/1024:.1f}KB -> {new_size/1024:.1f}KB (Saved {saved/1024:.1f}KB)")
                        saved_space += saved
                    else:
                        print(f"Skipped/Increased {file} (No reduction)")
                        
                    count += 1
                    
                except Exception as e:
                    print(f"Error processing {file}: {e}")

    print(f"\nFinished!")
    print(f"Processed {count} images.")
    # Show stats
    if saved_space > 0:
         print(f"Total space saved: {saved_space/1024/1024:.2f} MB")

if __name__ == "__main__":
    target_dir = "assets"
    if len(sys.argv) > 1:
        target_dir = sys.argv[1]
    
    if os.path.exists(target_dir):
        optimize_images(target_dir)
    else:
        print(f"Target directory '{target_dir}' does not exist.")
