export interface Contact {
  id: number
  name: string
  phone: string
  email: string
  picture: string | null
  is_favorite: boolean
  is_muted: boolean
  call_handling_enabled: boolean
}

export interface MediaImage {
  id: number
  name: string
  url: string
  created_at: number
}
