'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '@/lib/api'
import { useAuth } from './AuthContext'

interface WishlistItem {
  id: string
  product_id: string
  created_at: string
  products: {
    id: string
    name: string
    slug: string
    price: number
    compare_price?: number
    image: string
    category: string
    in_stock: boolean
  }
}

interface WishlistContextType {
  items: WishlistItem[]
  loading: boolean
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  refreshWishlist: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()

  const fetchWishlist = async () => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }

    try {
      // Client-side only
      if (typeof window === 'undefined') {
        setItems([])
        setLoading(false)
        return
      }
      
      const token = localStorage.getItem('token')
      if (!token) {
        setItems([])
        return
      }

      const response = await api.get('/wishlist')
      setItems(response.data)
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      fetchWishlist()
    }
  }, [user])

  const addToWishlist = async (productId: string) => {
    if (!user) {
      alert('Please log in to add items to your wishlist')
      return
    }

    try {
      await api.post('/wishlist', { productId })
      await fetchWishlist()
    } catch (error: any) {
      console.error('Error adding to wishlist:', error)
      if (error.response?.data?.message) {
        alert(error.response.data.message)
      }
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      await api.delete(`/wishlist/${productId}`)
      await fetchWishlist()
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
  }

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.product_id === productId)
  }

  const refreshWishlist = async () => {
    await fetchWishlist()
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
