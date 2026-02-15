'use client'

import { useState, useEffect } from 'react'
import { Upload, Camera, Video, Image as ImageIcon, Trash2, Edit2, X } from 'lucide-react'
import Image from 'next/image'

type UploadSection = 'photography' | 'events' | 'gallery'

interface GalleryImage {
  id: number
  image_url: string
  category: string
  title: string
  alt_text: string
  created_at: string
}

export default function GalleryManagementPage() {
  const [uploadingSection, setUploadingSection] = useState<UploadSection | null>(null)
  const [errors, setErrors] = useState<Record<UploadSection, string>>({
    photography: '',
    events: '',
    gallery: '',
  })
  const [successes, setSuccesses] = useState<Record<UploadSection, string>>({
    photography: '',
    events: '',
    gallery: '',
  })
  const [dragActiveSection, setDragActiveSection] = useState<UploadSection | null>(null)
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  useEffect(() => {
    fetchGalleryImages()
  }, [])

  const fetchGalleryImages = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery`)
      if (response.ok) {
        const data = await response.json()
        setGalleryImages(data)
      }
    } catch (error) {
      console.error('Failed to fetch gallery images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File, section: UploadSection) => {
    if (!file) return

    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, [section]: 'Please upload an image file (PNG, JPG, GIF, WebP)' })
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setErrors({ ...errors, [section]: 'File size must be less than 10MB' })
      return
    }

    // Determine category based on section
    let category = 'Other'
    if (section === 'photography') category = 'Competition'
    if (section === 'events') category = 'Events'

    try {
      setErrors({ ...errors, [section]: '' })
      setSuccesses({ ...successes, [section]: '' })
      setUploadingSection(section)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', category)
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''))
      formData.append('alt_text', `${category} image - ${file.name}`)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setSuccesses({ ...successes, [section]: `✅ Image uploaded successfully: ${file.name}` })
      
      // Refresh gallery images
      fetchGalleryImages()
      
      // Reset after 3 seconds
      setTimeout(() => setSuccesses({ ...successes, [section]: '' }), 3000)
    } catch (err: any) {
      setErrors({ ...errors, [section]: err.message || 'Failed to upload image' })
    } finally {
      setUploadingSection(null)
    }
  }

  const handleUpdateImage = async (id: number, updates: Partial<GalleryImage>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) throw new Error('Update failed')

      await fetchGalleryImages()
      setEditingImage(null)
    } catch (error) {
      console.error('Failed to update image:', error)
      alert('Failed to update image')
    }
  }

  const handleDeleteImage = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      })

      if (!response.ok) throw new Error('Delete failed')

      await fetchGalleryImages()
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete image:', error)
      alert('Failed to delete image')
    }
  }

  const handleDrag = (e: React.DragEvent, section: UploadSection) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActiveSection(section)
    } else if (e.type === 'dragleave') {
      setDragActiveSection(null)
    }
  }

  const handleDrop = (e: React.DragEvent, section: UploadSection) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActiveSection(null)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileUpload(files[0], section)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, section: UploadSection) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileUpload(files[0], section)
    }
  }

  const UploadCard = ({ 
    section, 
    title, 
    description, 
    icon: Icon, 
    colorClass 
  }: { 
    section: UploadSection
    title: string
    description: string
    icon: any
    colorClass: string
  }) => {
    const isUploading = uploadingSection === section
    const isDragActive = dragActiveSection === section
    const error = errors[section]
    const success = successes[section]

    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-zinc-100">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-zinc-900">{title}</h3>
            <p className="text-sm text-zinc-600">{description}</p>
          </div>
        </div>

        {/* Upload Area */}
        <div
          onDragEnter={(e) => handleDrag(e, section)}
          onDragLeave={(e) => handleDrag(e, section)}
          onDragOver={(e) => handleDrag(e, section)}
          onDrop={(e) => handleDrop(e, section)}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-blue-500 bg-blue-50 scale-105'
              : 'border-zinc-300 bg-zinc-50 hover:border-blue-400'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileInputChange(e, section)}
            disabled={isUploading}
            className="hidden"
            id={`upload-${section}`}
          />
          <label htmlFor={`upload-${section}`} className="block cursor-pointer">
            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin">
                  <Upload className="w-10 h-10 text-blue-600" />
                </div>
                <div className="text-base font-semibold text-zinc-700">Uploading...</div>
                <div className="w-full max-w-xs bg-zinc-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse w-full" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-10 h-10 text-zinc-400" />
                <div className="text-base font-semibold text-zinc-900">Drop image here</div>
                <div className="text-sm text-zinc-600">or click to select</div>
              </div>
            )}
          </label>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-semibold text-sm">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-semibold text-sm">❌ {error}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black pt-20 sm:pt-28 md:pt-32 pb-8 sm:pb-12 md:pb-16">
      <div className="container mx-auto px-3 sm:px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4">
            Gallery Management
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg">
            Upload images for sports media sections
          </p>
        </div>

        {/* Upload Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <UploadCard
            section="photography"
            title="Sports Photography"
            description="Cover & gallery images"
            icon={Camera}
            colorClass="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          
          <UploadCard
            section="events"
            title="Live Events"
            description="Event coverage images"
            icon={Video}
            colorClass="bg-gradient-to-br from-red-500 to-red-600"
          />
        </div>

        <UploadCard
          section="gallery"
          title="General Gallery"
          description="Other sports media images"
          icon={ImageIcon}
          colorClass="bg-gradient-to-br from-blue-500 to-blue-600"
        />

        {/* Gallery Images Management */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Manage Gallery Images</h2>
          
          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-zinc-600 mt-4">Loading gallery images...</p>
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <ImageIcon className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
              <p className="text-zinc-600">No images in the gallery yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image) => (
                <div key={image.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative aspect-video">
                    <Image
                      src={image.image_url}
                      alt={image.alt_text}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-zinc-900 truncate">{image.title}</h3>
                        <p className="text-xs text-zinc-500 mt-1">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            {image.category}
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2 ml-2">
                        <button
                          onClick={() => setEditingImage(image)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit image"
                        >
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(image.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete image"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-600 truncate">{image.alt_text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-zinc-900">Edit Image</h3>
                <button
                  onClick={() => setEditingImage(null)}
                  className="p-2 hover:bg-zinc-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  handleUpdateImage(editingImage.id, {
                    title: formData.get('title') as string,
                    alt_text: formData.get('alt_text') as string,
                    category: formData.get('category') as string,
                  })
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editingImage.title}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      name="alt_text"
                      defaultValue={editingImage.alt_text}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      defaultValue={editingImage.category}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Competition">Competition</option>
                      <option value="Training">Training</option>
                      <option value="Moments">Moments</option>
                      <option value="Events">Events</option>
                      <option value="Team">Team</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingImage(null)}
                    className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg hover:bg-zinc-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Delete Image?</h3>
              <p className="text-zinc-600 mb-6">
                Are you sure you want to delete this image? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg hover:bg-zinc-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteImage(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        
        
      </div>
    </div>
  )
}
