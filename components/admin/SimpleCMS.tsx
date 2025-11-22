'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Category, MenuItem as PrismaMenuItem, SiteSettings, HomeFeature } from '@prisma/client'

type MenuItemWithCategory = PrismaMenuItem & {
  category: Category
}

interface SimpleCMSProps {
  initialCategories: Category[]
  initialMenuItems: MenuItemWithCategory[]
  initialSettings: SiteSettings
  initialFeatures: HomeFeature[]
  user: { name?: string | null; email?: string | null }
}

export default function SimpleCMS({
  initialCategories,
  initialMenuItems,
  initialSettings,
  initialFeatures,
  user,
}: SimpleCMSProps) {
  const [activeTab, setActiveTab] = useState<'menu' | 'categories' | 'settings' | 'features'>('menu')
  const [categories, setCategories] = useState(initialCategories)
  const [menuItems, setMenuItems] = useState(initialMenuItems)
  const [settings, setSettings] = useState(initialSettings)
  const [features, setFeatures] = useState(initialFeatures)
  const [filterCategory, setFilterCategory] = useState<string>('all')

  // Edit states
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', description: '', imageUrl: '' })
  const [uploadingImage, setUploadingImage] = useState(false)

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [categoryEditForm, setCategoryEditForm] = useState({ name: '', description: '' })

  // Settings edit state
  const [settingsForm, setSettingsForm] = useState({
    phone: initialSettings.phone || '',
    email: initialSettings.email || '',
    address: initialSettings.address || '',
    hours: initialSettings.hours || '',
    instagram: initialSettings.instagram || '',
    facebook: initialSettings.facebook || '',
  })

  // New item/category states
  const [showNewItemForm, setShowNewItemForm] = useState(false)
  const [newItemForm, setNewItemForm] = useState({ name: '', description: '', imageUrl: '', categoryId: '' })

  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false)
  const [newCategoryForm, setNewCategoryForm] = useState({ name: '', description: '' })

  // Feature states
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null)
  const [featureEditForm, setFeatureEditForm] = useState({ title: '', description: '', imageUrl: '' })
  const [showNewFeatureForm, setShowNewFeatureForm] = useState(false)
  const [newFeatureForm, setNewFeatureForm] = useState({ title: '', description: '', imageUrl: '' })

  const filteredItems = filterCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.categoryId === filterCategory)

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  // Image Upload Function
  const handleImageUpload = async (file: File): Promise<string | null> => {
    if (!file) return null

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        return data.imageUrl
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to upload image')
        return null
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  // Menu Item Functions
  const handleEditItem = (item: MenuItemWithCategory) => {
    setEditingItemId(item.id)
    setEditForm({ name: item.name, description: item.description || '', imageUrl: item.imageUrl || '' })
  }

  const handleSaveItem = async (itemId: string) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, ...editForm }),
      })

      if (res.ok) {
        const updated = await res.json()
        setMenuItems(menuItems.map(item =>
          item.id === itemId ? { ...item, ...updated } : item
        ))
        setEditingItemId(null)
      }
    } catch (error) {
      console.error('Error saving item:', error)
      alert('Failed to save item')
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return

    try {
      const res = await fetch(`/api/menu?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMenuItems(menuItems.filter(item => item.id !== id))
      }
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const handleCreateItem = async () => {
    if (!newItemForm.name || !newItemForm.categoryId) {
      alert('Please fill in the item name and select a category')
      return
    }

    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItemForm),
      })

      if (res.ok) {
        const newItem = await res.json()
        const category = categories.find(c => c.id === newItemForm.categoryId)!
        setMenuItems([...menuItems, { ...newItem, category }])
        setShowNewItemForm(false)
        setNewItemForm({ name: '', description: '', imageUrl: '', categoryId: '' })
      }
    } catch (error) {
      console.error('Error creating item:', error)
    }
  }

  // Category Functions
  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id)
    setCategoryEditForm({ name: category.name, description: category.description || '' })
  }

  const handleSaveCategory = async (categoryId: string) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: categoryId, ...categoryEditForm }),
      })

      if (res.ok) {
        const updated = await res.json()
        setCategories(categories.map(cat =>
          cat.id === categoryId ? updated : cat
        ))
        setEditingCategoryId(null)
      }
    } catch (error) {
      console.error('Error saving category:', error)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    const itemCount = menuItems.filter(item => item.categoryId === id).length
    if (itemCount > 0) {
      if (!confirm(`This category has ${itemCount} items. Deleting it will also delete all these items. Are you sure?`)) return
    } else {
      if (!confirm('Are you sure you want to delete this category?')) return
    }

    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setCategories(categories.filter(cat => cat.id !== id))
        setMenuItems(menuItems.filter(item => item.categoryId !== id))
      }
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategoryForm.name) {
      alert('Please enter a category name')
      return
    }

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCategoryForm, order: categories.length + 1 }),
      })

      if (res.ok) {
        const newCategory = await res.json()
        setCategories([...categories, newCategory])
        setShowNewCategoryForm(false)
        setNewCategoryForm({ name: '', description: '' })
      }
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  // Settings Functions
  const handleSaveSettings = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      })

      if (res.ok) {
        const updated = await res.json()
        setSettings(updated)
        alert('Settings saved successfully!')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    }
  }

  // Feature Functions
  const handleEditFeature = (feature: HomeFeature) => {
    setEditingFeatureId(feature.id)
    setFeatureEditForm({ title: feature.title, description: feature.description, imageUrl: feature.imageUrl || '' })
  }

  const handleSaveFeature = async (featureId: string) => {
    try {
      const res = await fetch('/api/features', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: featureId, ...featureEditForm }),
      })

      if (res.ok) {
        const updated = await res.json()
        setFeatures(features.map(f => f.id === featureId ? updated : f))
        setEditingFeatureId(null)
      }
    } catch (error) {
      console.error('Error updating feature:', error)
      alert('Failed to update feature')
    }
  }

  const handleDeleteFeature = async (featureId: string) => {
    if (!confirm('Are you sure you want to delete this feature?')) return

    try {
      const res = await fetch(`/api/features?id=${featureId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setFeatures(features.filter(f => f.id !== featureId))
      }
    } catch (error) {
      console.error('Error deleting feature:', error)
      alert('Failed to delete feature')
    }
  }

  const handleAddFeature = async () => {
    if (!newFeatureForm.title || !newFeatureForm.description) {
      alert('Please fill in title and description')
      return
    }

    try {
      const res = await fetch('/api/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFeatureForm),
      })

      if (res.ok) {
        const created = await res.json()
        setFeatures([...features, created])
        setNewFeatureForm({ title: '', description: '', imageUrl: '' })
        setShowNewFeatureForm(false)
      }
    } catch (error) {
      console.error('Error creating feature:', error)
      alert('Failed to create feature')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="w-full sm:w-auto">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Content Manager</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 truncate">Welcome, {user.name || user.email}</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Link href="/menu">View Menu</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Link href="/">Home</Link>
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm" className="flex-1 sm:flex-none">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 min-w-max">
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'menu'
                  ? 'border-egyptian-gold text-egyptian-gold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="hidden sm:inline">Menu Items ({menuItems.length})</span>
              <span className="sm:hidden">Menu ({menuItems.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'categories'
                  ? 'border-egyptian-gold text-egyptian-gold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="hidden sm:inline">Categories ({categories.length})</span>
              <span className="sm:hidden">Cat. ({categories.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-egyptian-gold text-egyptian-gold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'features'
                  ? 'border-egyptian-gold text-egyptian-gold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="hidden sm:inline">Home Features ({features.length})</span>
              <span className="sm:hidden">Features ({features.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'menu' && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center">
                <label className="text-sm font-medium text-gray-700">Filter by category:</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <Button onClick={() => setShowNewItemForm(!showNewItemForm)} className="w-full sm:w-auto">
                {showNewItemForm ? 'Cancel' : '+ Add Menu Item'}
              </Button>
            </div>

            {/* New Item Form */}
            {showNewItemForm && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold mb-4">Add New Menu Item</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <Input
                      value={newItemForm.name}
                      onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
                      placeholder="e.g., Cold Kunafa with Cream Cup"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Input
                      value={newItemForm.description}
                      onChange={(e) => setNewItemForm({ ...newItemForm, description: e.target.value })}
                      placeholder="Optional description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const imageUrl = await handleImageUpload(file)
                          if (imageUrl) {
                            setNewItemForm({ ...newItemForm, imageUrl })
                          }
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                      disabled={uploadingImage}
                    />
                    {uploadingImage && <p className="text-sm text-gray-600 mt-1">Uploading...</p>}
                    {newItemForm.imageUrl && (
                      <div className="mt-2 flex items-start gap-3">
                        <img src={newItemForm.imageUrl} alt="Preview" className="h-32 w-32 object-cover rounded border" />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setNewItemForm({ ...newItemForm, imageUrl: '' })}
                        >
                          Remove Image
                        </Button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      value={newItemForm.categoryId}
                      onChange={(e) => setNewItemForm({ ...newItemForm, categoryId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateItem}>Create Item</Button>
                    <Button variant="outline" onClick={() => setShowNewItemForm(false)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items List */}
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  {editingItemId === item.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Item name"
                      />
                      <Input
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        placeholder="Description (optional)"
                      />
                      <div>
                        <label className="block text-sm font-medium mb-2">Change Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const imageUrl = await handleImageUpload(file)
                              if (imageUrl) {
                                setEditForm({ ...editForm, imageUrl })
                              }
                            }
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                          disabled={uploadingImage}
                        />
                        {uploadingImage && <p className="text-sm text-gray-600 mt-1">Uploading...</p>}
                        {editForm.imageUrl && (
                          <div className="mt-2 flex items-start gap-3">
                            <img src={editForm.imageUrl} alt="Preview" className="h-32 w-32 object-cover rounded border" />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditForm({ ...editForm, imageUrl: '' })}
                            >
                              Remove Image
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSaveItem(item.id)}>Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingItemId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start gap-4">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.name} className="h-16 w-16 object-cover rounded border flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-gray-900">{item.name}</h3>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                            {item.category.name}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button size="sm" variant="outline" onClick={() => handleEditItem(item)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteItem(item.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600">No menu items found. Add your first one!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={() => setShowNewCategoryForm(!showNewCategoryForm)} className="w-full sm:w-auto">
                {showNewCategoryForm ? 'Cancel' : '+ Add Category'}
              </Button>
            </div>

            {/* New Category Form */}
            {showNewCategoryForm && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold mb-4">Add New Category</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <Input
                      value={newCategoryForm.name}
                      onChange={(e) => setNewCategoryForm({ ...newCategoryForm, name: e.target.value })}
                      placeholder="e.g., Dessert Cups"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Input
                      value={newCategoryForm.description}
                      onChange={(e) => setNewCategoryForm({ ...newCategoryForm, description: e.target.value })}
                      placeholder="Optional description"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateCategory}>Create Category</Button>
                    <Button variant="outline" onClick={() => setShowNewCategoryForm(false)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Categories List */}
            <div className="space-y-3">
              {categories.map((category) => {
                const itemCount = menuItems.filter(item => item.categoryId === category.id).length
                return (
                  <div key={category.id} className="bg-white p-4 rounded-lg border border-gray-200">
                    {editingCategoryId === category.id ? (
                      <div className="space-y-3">
                        <Input
                          value={categoryEditForm.name}
                          onChange={(e) => setCategoryEditForm({ ...categoryEditForm, name: e.target.value })}
                          placeholder="Category name"
                        />
                        <Input
                          value={categoryEditForm.description}
                          onChange={(e) => setCategoryEditForm({ ...categoryEditForm, description: e.target.value })}
                          placeholder="Description (optional)"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSaveCategory(category.id)}>Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingCategoryId(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-gray-900">{category.name}</h3>
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                              {itemCount} items
                            </span>
                          </div>
                          {category.description && (
                            <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditCategory(category)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteCategory(category.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-2xl font-bold mb-6">Site Settings</h3>
              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <Input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    placeholder="info@gegesweets.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Physical Address</label>
                  <Input
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    placeholder="123 Sweet Street, Dessert City, CA 90210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Business Hours</label>
                  <Input
                    value={settingsForm.hours}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hours: e.target.value })}
                    placeholder="Mon-Sat: 9AM-8PM, Sun: 10AM-6PM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Instagram URL</label>
                  <Input
                    value={settingsForm.instagram}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                    placeholder="https://instagram.com/gegesweets"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Facebook URL</label>
                  <Input
                    value={settingsForm.facebook}
                    onChange={(e) => setSettingsForm({ ...settingsForm, facebook: e.target.value })}
                    placeholder="https://facebook.com/gegesweets"
                  />
                </div>
                <div className="pt-4">
                  <Button onClick={handleSaveSettings}>Save Settings</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-6">
            {/* Add New Feature Button */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold">Home Page Features</h2>
              <Button onClick={() => setShowNewFeatureForm(!showNewFeatureForm)} className="w-full sm:w-auto">
                {showNewFeatureForm ? 'Cancel' : '+ Add Feature'}
              </Button>
            </div>

            {/* New Feature Form */}
            {showNewFeatureForm && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-4">Add New Feature</h3>
                <div className="space-y-4 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <Input
                      value={newFeatureForm.title}
                      onChange={(e) => setNewFeatureForm({ ...newFeatureForm, title: e.target.value })}
                      placeholder="Feature title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <Input
                      value={newFeatureForm.description}
                      onChange={(e) => setNewFeatureForm({ ...newFeatureForm, description: e.target.value })}
                      placeholder="Feature description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Icon/Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const imageUrl = await handleImageUpload(file)
                          if (imageUrl) {
                            setNewFeatureForm({ ...newFeatureForm, imageUrl })
                          }
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                      disabled={uploadingImage}
                    />
                    {uploadingImage && <p className="text-sm text-gray-600 mt-1">Uploading...</p>}
                    {newFeatureForm.imageUrl && (
                      <div className="mt-2 flex items-start gap-3">
                        <img src={newFeatureForm.imageUrl} alt="Preview" className="h-20 w-20 object-cover rounded border" />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setNewFeatureForm({ ...newFeatureForm, imageUrl: '' })}
                        >
                          Remove Image
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddFeature}>Add Feature</Button>
                    <Button variant="outline" onClick={() => {
                      setShowNewFeatureForm(false)
                      setNewFeatureForm({ title: '', description: '', imageUrl: '' })
                    }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Features List */}
            <div className="space-y-3">
              {features.map((feature) => (
                <div key={feature.id} className="bg-white p-6 rounded-lg border border-gray-200">
                  {editingFeatureId === feature.id ? (
                    <div className="space-y-4">
                      <Input
                        value={featureEditForm.title}
                        onChange={(e) => setFeatureEditForm({ ...featureEditForm, title: e.target.value })}
                        placeholder="Feature title"
                      />
                      <Input
                        value={featureEditForm.description}
                        onChange={(e) => setFeatureEditForm({ ...featureEditForm, description: e.target.value })}
                        placeholder="Feature description"
                      />
                      <div>
                        <label className="block text-sm font-medium mb-2">Change Icon/Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const imageUrl = await handleImageUpload(file)
                              if (imageUrl) {
                                setFeatureEditForm({ ...featureEditForm, imageUrl })
                              }
                            }
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                          disabled={uploadingImage}
                        />
                        {uploadingImage && <p className="text-sm text-gray-600 mt-1">Uploading...</p>}
                        {featureEditForm.imageUrl && (
                          <div className="mt-2 flex items-start gap-3">
                            <img src={featureEditForm.imageUrl} alt="Preview" className="h-20 w-20 object-cover rounded border" />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setFeatureEditForm({ ...featureEditForm, imageUrl: '' })}
                            >
                              Remove Image
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSaveFeature(feature.id)}>Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingFeatureId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start gap-4">
                      {feature.imageUrl && (
                        <img src={feature.imageUrl} alt={feature.title} className="h-16 w-16 object-cover rounded border flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">{feature.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button size="sm" variant="outline" onClick={() => handleEditFeature(feature)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteFeature(feature.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {features.length === 0 && !showNewFeatureForm && (
              <div className="bg-white p-12 rounded-lg border border-gray-200 text-center text-gray-500">
                <p className="mb-4">No features added yet. Click &ldquo;Add Feature&rdquo; to create your first one.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
