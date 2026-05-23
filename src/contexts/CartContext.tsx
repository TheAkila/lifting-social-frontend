'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  size: string
  color?: string
  image: string
  shippingType?: 'free' | 'paid'
  shippingAmount?: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string, size: string, color?: string) => void
  updateQuantity: (id: string, size: string, quantity: number, color?: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  totalShipping: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// A cart line is uniquely identified by product + size + color, so the same
// product in two colours/sizes stays as separate lines.
const sameLine = (a: { id: string; size: string; color?: string }, b: { id: string; size: string; color?: string }) =>
  a.id === b.id && a.size === b.size && (a.color || '') === (b.color || '')

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes (client-side only)
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items, mounted])

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => sameLine(i, item))

      if (existingItem) {
        return prevItems.map((i) =>
          sameLine(i, item)
            ? {
                ...i,
                quantity: i.quantity + item.quantity,
                shippingType: item.shippingType || i.shippingType,
                shippingAmount: item.shippingAmount ?? i.shippingAmount,
              }
            : i
        )
      }

      return [...prevItems, item]
    })
  }

  const removeItem = (id: string, size: string, color?: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => !sameLine(item, { id, size, color }))
    )
  }

  const updateQuantity = (id: string, size: string, quantity: number, color?: string) => {
    if (quantity <= 0) {
      removeItem(id, size, color)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        sameLine(item, { id, size, color }) ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const totalShipping = items.reduce(
    (sum, item) => {
      // Only add shipping if explicitly marked as paid
      const shipping = item.shippingType === 'paid' && item.shippingAmount ? item.shippingAmount : 0
      return sum + shipping
    },
    0
  )

  // Debug: log cart state
  useEffect(() => {
    if (items.length > 0) {
      console.log('Cart items:', items)
      console.log('Total shipping:', totalShipping)
    }
  }, [items, totalShipping])

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        totalShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
