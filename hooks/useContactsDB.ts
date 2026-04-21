'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Contact, MediaImage } from '@/types/contact'

// Contacts
export function useContactsDB() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/contacts')
      const data = await res.json()
      setContacts(data.map((c: any) => ({
        ...c,
        is_favorite: Boolean(c.is_favorite),
        is_muted: Boolean(c.is_muted),
        call_handling_enabled: Boolean(c.call_handling_enabled),
      })))
    } catch (e) {
      console.error('Failed to fetch contacts', e)
    }
  }, [])

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [refresh])

  const addContact = useCallback(async (data: Omit<Contact, 'id'>) => {
    await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    await refresh()
  }, [refresh])

  const editContact = useCallback(async (id: number, data: Omit<Contact, 'id'>) => {
    await fetch(`/api/contacts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    await refresh()
  }, [refresh])

  const deleteContact = useCallback(async (id: number) => {
    await fetch(`/api/contacts/${id}`, { method: 'DELETE' })
    await refresh()
  }, [refresh])

  const toggleFavorite = useCallback(async (id: number) => {
    await fetch(`/api/contacts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toggle: 'favorite' }),
    })
    await refresh()
  }, [refresh])

  const toggleMute = useCallback(async (id: number) => {
    await fetch(`/api/contacts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toggle: 'mute' }),
    })
    await refresh()
  }, [refresh])

  const toggleCallHandling = useCallback(async (id: number) => {
    await fetch(`/api/contacts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toggle: 'call_handling' }),
    })
    await refresh()
  }, [refresh])

  return { db: null, contacts, addContact, editContact, deleteContact, toggleFavorite, toggleMute, toggleCallHandling, loading }
}

// Media Library
export function useMediaLibrary(_db: null) {
  const [images, setImages] = useState<MediaImage[]>([])

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/media')
      const data = await res.json()
      setImages(data)
    } catch (e) {
      console.error('Failed to fetch media', e)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Upload Image
  const uploadImage = useCallback(async (file: File): Promise<MediaImage | null> => {
    try {
      // Upload to server
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) throw new Error('Upload failed')
      const { url, filename } = await uploadRes.json()

      // Save to media library table
      const mediaRes = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: file.name, url }),
      })
      const image = await mediaRes.json()
      await refresh()
      return image
    } catch (e) {
      console.error('Failed to upload image', e)
      return null
    }
  }, [refresh])

  return { images, uploadImage, refresh }
}
