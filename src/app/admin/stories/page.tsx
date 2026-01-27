'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaUpload, FaTimes, FaImage } from 'react-icons/fa'

export default function AdminStories() {
  const { user } = useAuth()
  const router = useRouter()
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingStory, setEditingStory] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    coverImage: '',
    image: '',
    category: 'Athlete Stories',
    categoryColor: 'bg-brand-primary',
    tags: [] as string[],
    readTime: '5 min read',
    featured: false,
    videoId: '',
  })
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/admin/stories')
      return
    }
    loadStories()
  }, [user])

  const loadStories = async () => {
    try {
      const res = await api.get('/stories')
      setStories(res.data)
      setLoading(false)
    } catch (err) {
      console.error('Failed to load stories', err)
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await api.post('/uploads', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data.url) {
        setFormData({ 
          ...formData, 
          coverImage: response.data.url,
          image: response.data.url 
        })
        alert('Image uploaded successfully!')
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        videoId: formData.videoId || undefined,
      }

      if (editingStory) {
        await api.put(`/stories/${editingStory._id}`, payload)
      } else {
        await api.post('/stories', payload)
      }

      setShowForm(false)
      setEditingStory(null)
      resetForm()
      loadStories()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save story')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return
    try {
      await api.delete(`/stories/${id}`)
      loadStories()
    } catch (err) {
      alert('Failed to delete story')
    }
  }

  const handleEdit = (story: any) => {
    setEditingStory(story)
    setFormData({
      title: story.title,
      slug: story.slug,
      excerpt: story.excerpt,
      content: story.content || '',
      author: story.author || '',
      coverImage: story.coverImage || '',
      image: story.image || story.coverImage || '',
      category: story.category || 'Athlete Stories',
      categoryColor: story.categoryColor || 'bg-brand-primary',
      tags: story.tags || [],
      readTime: story.readTime || '5 min read',
      featured: story.featured || false,
      videoId: story.videoId || '',
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: '',
      coverImage: '',
      image: '',
      category: 'Athlete Stories',
      categoryColor: 'bg-brand-primary',
      tags: [],
      readTime: '5 min read',
      featured: false,
      videoId: '',
    })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              <FaArrowLeft className="text-2xl" />
            </Link>
            <div>
              <h1 className="text-4xl font-display font-bold text-gray-900">Stories</h1>
              <p className="text-gray-600">Manage blog posts and articles</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingStory(null)
              resetForm()
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Story</span>
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingStory ? 'Edit Story' : 'Add New Story'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="Athlete Stories">Athlete Stories</option>
                    <option value="Training Tips">Training Tips</option>
                    <option value="Events">Events</option>
                    <option value="News">News</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="input-field"
                    placeholder="5 min read"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Video ID (YouTube)</label>
                  <input
                    type="text"
                    value={formData.videoId}
                    onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
                    className="input-field"
                    placeholder="dQw4w9WgXcQ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Category Color</label>
                  <select
                    value={formData.categoryColor}
                    onChange={(e) => setFormData({ ...formData, categoryColor: e.target.value })}
                    className="input-field"
                  >
                    <option value="bg-brand-primary">Primary (Blue)</option>
                    <option value="bg-brand-secondary">Secondary (Gold)</option>
                    <option value="bg-brand-accent">Accent (Orange)</option>
                    <option value="bg-purple-600">Purple</option>
                    <option value="bg-green-600">Green</option>
                    <option value="bg-red-600">Red</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Tags</label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
                            setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] })
                            setNewTag('')
                          }
                        }
                      }}
                      className="input-field flex-1"
                      placeholder="Add a tag and press Enter"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
                          setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] })
                          setNewTag('')
                        }
                      }}
                      className="btn-outline px-4"
                    >
                      Add
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-brand-secondary/20 rounded-full text-sm flex items-center space-x-2"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== idx) })}
                            className="text-red-500 hover:text-red-400"
                          >
                            <FaTimes />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Cover Image Upload */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold mb-2">Cover Image</label>
                
                {/* Upload Button */}
                <div>
                  <input
                    type="file"
                    id="story-image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="story-image-upload"
                    className={`btn-outline flex items-center justify-center space-x-2 cursor-pointer w-full ${
                      uploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-brand-accent border-t-transparent" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <FaUpload />
                        <span>Upload Cover Image</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Image Preview */}
                {formData.coverImage && (
                  <div className="relative group">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img
                        src={formData.coverImage}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, coverImage: '' })}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}

                {/* Or use URL */}
                <div>
                  <label className="block text-sm text-brand-light/70 mb-2">Or paste image URL</label>
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Excerpt *</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="input-field"
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="input-field"
                  rows={8}
                />
              </div>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span>Featured</span>
                </label>
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary">
                  {editingStory ? 'Update Story' : 'Create Story'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingStory(null)
                    resetForm()
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stories List */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">All Stories ({stories.length})</h2>
          {loading ? (
            <p className="text-center py-8 text-brand-light/70">Loading...</p>
          ) : stories.length === 0 ? (
            <p className="text-center py-8 text-brand-light/70">No stories yet. Add your first one!</p>
          ) : (
            <div className="space-y-4">
              {stories.map((story) => (
                <div
                  key={story._id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-lg">{story.title}</h3>
                      {story.featured && <span className="text-yellow-400">⭐</span>}
                    </div>
                    <p className="text-sm text-brand-light/70 mb-2">{story.excerpt}</p>
                    <div className="flex items-center space-x-4 text-xs text-brand-light/50">
                      <span>{story.category}</span>
                      <span>{story.author}</span>
                      <span>{story.readTime}</span>
                      <span>{story.views || 0} views</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(story)}
                      className="text-brand-accent hover:text-brand-primary p-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(story._id)}
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
