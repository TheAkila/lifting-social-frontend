'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa'

export default function AdminStories() {
  const { user } = useAuth()
  const router = useRouter()
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingStory, setEditingStory] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    coverImage: '',
    category: 'Athlete Story',
    readTime: '5 min read',
    featured: false,
    videoId: '',
  })

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
      category: story.category || 'Athlete Story',
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
      category: 'Athlete Story',
      readTime: '5 min read',
      featured: false,
      videoId: '',
    })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-brand-dark py-12">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-brand-accent hover:text-brand-primary">
              <FaArrowLeft className="text-2xl" />
            </Link>
            <div>
              <h1 className="text-4xl font-display font-bold">Stories</h1>
              <p className="text-brand-light/70">Manage blog posts and articles</p>
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
                    <option value="Athlete Story">Athlete Story</option>
                    <option value="Training">Training</option>
                    <option value="Events">Events</option>
                    <option value="News">News</option>
                    <option value="Nutrition">Nutrition</option>
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
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Cover Image URL</label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="input-field"
                  placeholder="/images/stories/example.jpg"
                />
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
                  className="p-4 border border-brand-light/20 rounded-lg hover:bg-brand-light/5 flex items-center justify-between"
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
