'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api'
import Link from 'next/link'
import { FaMapMarkerAlt, FaLock, FaBell, FaSave } from 'react-icons/fa'

interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface Notifications {
  email: boolean
  orderUpdates: boolean
  programAlerts: boolean
  announcements: boolean
}

export default function SettingsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'shipping' | 'billing' | 'password' | 'notifications'>('shipping')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const [shippingAddress, setShippingAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Sri Lanka'
  })

  const [billingAddress, setBillingAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Sri Lanka'
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notifications, setNotifications] = useState<Notifications>({
    email: true,
    orderUpdates: true,
    programAlerts: true,
    announcements: true
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      loadSettings()
    }
  }, [user, authLoading, router])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const response = await api.get('/profile')
      
      if (response.data.shippingAddress) {
        setShippingAddress(response.data.shippingAddress)
      }
      
      if (response.data.billingAddress) {
        setBillingAddress(response.data.billingAddress)
      }
      
      if (response.data.notifications) {
        setNotifications(response.data.notifications)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveShipping = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      setMessage(null)
      await api.put('/profile/shipping', shippingAddress)
      setMessage({ type: 'success', text: 'Shipping address updated successfully!' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update shipping address' })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveBilling = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      setMessage(null)
      await api.put('/profile/billing', billingAddress)
      setMessage({ type: 'success', text: 'Billing address updated successfully!' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update billing address' })
    } finally {
      setSaving(false)
    }
  }

  const handleCopyShippingToBilling = () => {
    setBillingAddress({ ...shippingAddress })
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    try {
      setSaving(true)
      setMessage(null)
      await api.post('/profile/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      setMessage({ type: 'success', text: 'Password changed successfully!' })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      setMessage(null)
      await api.put('/profile/notifications', notifications)
      setMessage({ type: 'success', text: 'Notification preferences updated successfully!' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update notifications' })
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-20 sm:pt-28 pb-8 sm:pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 mb-4 inline-block text-sm sm:text-base">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">Manage your addresses, password, and notifications</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-300' 
              : 'bg-blue-100 text-blue-800 border border-blue-300'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => { setActiveTab('shipping'); setMessage(null) }}
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'shipping'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaMapMarkerAlt className="inline mr-1 sm:mr-2" />
                Shipping
              </button>
              <button
                onClick={() => { setActiveTab('billing'); setMessage(null) }}
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'billing'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaMapMarkerAlt className="inline mr-1 sm:mr-2" />
                Billing
              </button>
              <button
                onClick={() => { setActiveTab('password'); setMessage(null) }}
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'password'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaLock className="inline mr-1 sm:mr-2" />
                Password
              </button>
              <button
                onClick={() => { setActiveTab('notifications'); setMessage(null) }}
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'notifications'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaBell className="inline mr-1 sm:mr-2" />
                Notifications
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Shipping Address */}
            {activeTab === 'shipping' && (
              <form onSubmit={handleSaveShipping} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">State/Province</label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Zip Code</label>
                    <input
                      type="text"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold transition-colors ${
                    saving ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FaSave />
                  {saving ? 'Saving...' : 'Save Shipping Address'}
                </button>
              </form>
            )}

            {/* Billing Address */}
            {activeTab === 'billing' && (
              <form onSubmit={handleSaveBilling} className="space-y-4">
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={handleCopyShippingToBilling}
                    className="text-orange-600 hover:text-orange-700 font-semibold text-sm"
                  >
                    Copy from shipping address
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    value={billingAddress.street}
                    onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={billingAddress.city}
                      onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">State/Province</label>
                    <input
                      type="text"
                      value={billingAddress.state}
                      onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Zip Code</label>
                    <input
                      type="text"
                      value={billingAddress.zipCode}
                      onChange={(e) => setBillingAddress({ ...billingAddress, zipCode: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      value={billingAddress.country}
                      onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold transition-colors ${
                    saving ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FaSave />
                  {saving ? 'Saving...' : 'Save Billing Address'}
                </button>
              </form>
            )}

            {/* Password */}
            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold transition-colors ${
                    saving ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FaLock />
                  {saving ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <form onSubmit={handleSaveNotifications} className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.email}
                        onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">Order Updates</h4>
                      <p className="text-sm text-gray-600">Get notified about order status changes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.orderUpdates}
                        onChange={(e) => setNotifications({ ...notifications, orderUpdates: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">Program Alerts</h4>
                      <p className="text-sm text-gray-600">Updates about your enrolled programs</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.programAlerts}
                        onChange={(e) => setNotifications({ ...notifications, programAlerts: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">Announcements</h4>
                      <p className="text-sm text-gray-600">News and updates from Lifting Social</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.announcements}
                        onChange={(e) => setNotifications({ ...notifications, announcements: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold transition-colors ${
                    saving ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FaSave />
                  {saving ? 'Saving...' : 'Save Preferences'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
