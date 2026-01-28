'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  onUpload: (url: string) => void
  currentImage?: string
  label?: string
  maxSize?: number // in MB
  acceptedFormats?: string[]
}

export default function ImageUpload({
  onUpload,
  currentImage,
  label = 'Upload Image',
  maxSize = 5,
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError(null)

    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      setError(`Please upload a valid image file (${acceptedFormats.join(', ')})`)
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to server
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const token = localStorage.getItem('authToken')
      const response = await fetch('http://localhost:5000/api/uploads', {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      onUpload(data.url)
    } catch (err) {
      setError('Failed to upload image. Please try again.')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleRemove = () => {
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-zinc-700 mb-2">
        {label}
      </label>

      {preview ? (
        <div className="relative w-full aspect-video rounded-[12px] overflow-hidden border border-zinc-200 bg-zinc-100">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
          >
            <X className="w-4 h-4 text-zinc-700" />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-sm font-medium">Uploading...</div>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative w-full aspect-video rounded-[12px] border-2 border-dashed transition-all cursor-pointer ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-zinc-300 bg-zinc-50 hover:border-zinc-400 hover:bg-zinc-100'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(',')}
            onChange={handleChange}
            className="hidden"
          />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-200 border-t-indigo-600 mb-4" />
                <p className="text-sm text-zinc-600">Uploading...</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center mb-4">
                  {dragActive ? (
                    <Upload className="w-6 h-6 text-indigo-600" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-zinc-400" />
                  )}
                </div>
                <p className="text-sm font-medium text-zinc-700 mb-1">
                  {dragActive ? 'Drop image here' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-zinc-500">
                  PNG, JPG, WEBP up to {maxSize}MB
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-blue-600">{error}</p>
      )}
    </div>
  )
}
