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
      
      // Reset after 3 seconds
      setTimeout(() => setSuccesses({ ...successes, [section]: '' }), 3000)
    } catch (err: any) {
      setErrors({ ...errors, [section]: err.message || 'Failed to upload image' })
    } finally {
      setUploadingSection(null)
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

        
        
      </div>
    </div>
  )
}
