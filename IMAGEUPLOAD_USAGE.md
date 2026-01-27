# ImageUpload Component Usage Guide

The `ImageUpload` component is a reusable drag-and-drop image upload component that integrates with the backend Cloudinary service.

## Component Location
`/src/components/common/ImageUpload.tsx`

## Features
- ✅ Drag and drop support
- ✅ Image preview with aspect-video ratio
- ✅ File validation (type & size)
- ✅ Upload to Cloudinary via backend API
- ✅ Loading states and error handling
- ✅ Remove/clear functionality
- ✅ Modern design matching the system theme

## Props

```typescript
interface ImageUploadProps {
  onUpload: (url: string) => void  // Callback when image is uploaded
  currentImage?: string            // Current image URL to display
  label?: string                   // Custom label text
  maxSize?: number                 // Max file size in MB (default: 5MB)
  acceptedFormats?: string[]       // Array of accepted formats (default: ['jpeg', 'jpg', 'png', 'webp'])
}
```

## Basic Usage

### 1. Simple Image Upload

```tsx
import ImageUpload from '@/components/common/ImageUpload'

function MyForm() {
  const [imageUrl, setImageUrl] = useState('')

  return (
    <form>
      <ImageUpload
        onUpload={(url) => setImageUrl(url)}
        currentImage={imageUrl}
        label="Product Image"
      />
    </form>
  )
}
```

### 2. Multiple Images (Gallery)

```tsx
import ImageUpload from '@/components/common/ImageUpload'

function ProductForm() {
  const [images, setImages] = useState<string[]>([])

  const handleImageUpload = (url: string) => {
    setImages([...images, url])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <div>
      {/* Main Image */}
      <ImageUpload
        onUpload={handleImageUpload}
        currentImage={images[0]}
        label="Main Product Image"
      />

      {/* Additional Images */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {images.slice(1).map((img, index) => (
          <div key={index} className="relative">
            <img src={img} alt={`Image ${index + 1}`} className="rounded-[12px]" />
            <button
              onClick={() => removeImage(index + 1)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
            >
              ×
            </button>
          </div>
        ))}
        
        <ImageUpload
          onUpload={handleImageUpload}
          label="Add More"
        />
      </div>
    </div>
  )
}
```

### 3. With Custom Validation

```tsx
<ImageUpload
  onUpload={(url) => console.log('Uploaded:', url)}
  currentImage="/current-image.jpg"
  label="Profile Picture"
  maxSize={2}  // 2MB max
  acceptedFormats={['jpeg', 'jpg', 'png']}  // No WebP
/>
```

### 4. Event Cover Image Example

```tsx
function EventForm() {
  const [formData, setFormData] = useState({
    title: '',
    coverImage: '',
    description: ''
  })

  return (
    <form>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        placeholder="Event Title"
      />

      <ImageUpload
        onUpload={(url) => setFormData({...formData, coverImage: url})}
        currentImage={formData.coverImage}
        label="Event Cover Image"
      />

      <textarea
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        placeholder="Description"
      />

      <button type="submit">Create Event</button>
    </form>
  )
}
```

## Backend API

The component uploads to: `POST http://localhost:5000/api/uploads`

### Request
- Method: `POST`
- Headers: `Authorization: Bearer <token>`
- Body: `FormData` with `file` field

### Response
```json
{
  "url": "https://res.cloudinary.com/...",
  "public_id": "lifting-social/...",
  "width": 1920,
  "height": 1080,
  "format": "jpg"
}
```

### Authentication
The component automatically includes the auth token from localStorage (`token` key).

## Styling

The component uses the system design theme:
- Zinc color palette
- Rounded corners: `rounded-[12px]`
- Border: `border-2 border-dashed`
- Hover effects with smooth transitions
- Loading spinner with brand accent color
- Error messages in red-500

## Error Handling

The component handles:
- File type validation
- File size validation
- Upload failures
- Network errors
- Missing authentication

Errors are displayed below the upload area in red text.

## Integration Points

### Where to Use This Component

1. **Admin Product Form** - Main product image and gallery
2. **Admin Event Form** - Event cover images
3. **Admin Story Form** - Story featured images
4. **Admin Coach Form** - Coach profile pictures
5. **User Profile** - Profile picture upload
6. **Any form that needs image uploads**

### Example: Replace Existing Upload in Admin

Instead of:
```tsx
<input type="file" onChange={handleImageUpload} />
```

Use:
```tsx
<ImageUpload
  onUpload={(url) => setFormData({...formData, image: url})}
  currentImage={formData.image}
/>
```

## Advanced: Multiple Files at Once

If you need to upload multiple files simultaneously, you can wrap multiple ImageUpload components or modify the component to accept multiple files.

## Notes

- The backend automatically optimizes images (max 1920x1080, auto quality, auto format)
- Images are stored in Cloudinary under the `lifting-social` folder
- Requires Cloudinary credentials in backend .env file
- Upload route requires authentication (any logged-in user can upload)
