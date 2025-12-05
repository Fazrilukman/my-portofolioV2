# File Upload Implementation Guide

## Current Status
✅ Profile settings can be updated via URL input
❌ File upload functionality not yet implemented

## To Implement File Upload for Images:

### 1. Create Supabase Storage Bucket
```sql
-- Run in Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true);

-- Enable public access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'profile-images' );

-- Allow authenticated uploads
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'profile-images' );
```

### 2. Update AdminProfile.jsx

Add file upload logic in the Photo Section:

```jsx
const [uploading, setUploading] = useState(false);

const handleFileUpload = async (event) => {
  try {
    setUploading(true);
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);
    
    // Update photo_url in state
    handleInputChange('photo_url', data.publicUrl);
    
    alert('Image uploaded successfully!');
  } catch (error) {
    console.error('Upload error:', error);
    alert('Error uploading image: ' + error.message);
  } finally {
    setUploading(false);
  }
};
```

### 3. Update the UI (replace URL-only input)

In the Photo Section of AdminProfile.jsx:

```jsx
{/* Photo Section */}
<div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
  <div className="flex items-center gap-3 mb-4">
    <Camera className="w-5 h-5 text-indigo-400" />
    <h2 className="text-xl font-semibold text-white">Profile Photo</h2>
  </div>
  
  <div className="space-y-4">
    {/* File Upload Option */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Upload Photo
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={uploading}
        className="block w-full text-sm text-gray-400
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-indigo-600 file:text-white
          hover:file:bg-indigo-700
          file:cursor-pointer cursor-pointer"
      />
      <p className="mt-1 text-xs text-gray-500">
        Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
      </p>
    </div>
    
    {/* Divider */}
    <div className="flex items-center gap-2">
      <div className="flex-1 h-px bg-gray-700"></div>
      <span className="text-xs text-gray-500">OR</span>
      <div className="flex-1 h-px bg-gray-700"></div>
    </div>
    
    {/* URL Input Option */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Photo URL
      </label>
      <input
        type="url"
        value={profileData.photo_url}
        onChange={(e) => handleInputChange('photo_url', e.target.value)}
        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
        placeholder="https://example.com/photo.jpg"
      />
    </div>
    
    {/* Preview */}
    {profileData.photo_url && (
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Preview
        </label>
        <img
          src={profileData.photo_url}
          alt="Preview"
          className="w-32 h-32 rounded-full object-cover border-2 border-indigo-500"
          onError={(e) => {
            e.target.src = '/Photo.jpg'; // Fallback image
          }}
        />
      </div>
    )}
  </div>
</div>
```

## Benefits
✅ Users can upload images directly without hosting them elsewhere
✅ Automatic URL generation
✅ File validation (size and type)
✅ Preview before saving
✅ Still supports URL input for external images

## Next Steps
1. Create storage bucket in Supabase
2. Add file upload logic to AdminProfile.jsx
3. Test upload functionality
4. Test that uploaded images display on frontend
