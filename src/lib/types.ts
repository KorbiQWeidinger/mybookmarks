export type ViewType = "domain" | "tag"

export interface Bookmark {
  id: string
  title: string
  url: string
  description: string
  domain: string
  favicon?: string
  tags: string[]
  createdAt: Date
  personaId: string // Added personaId to associate bookmarks with personas
}

export interface Tag {
  id: string
  name: string
  count: number
}

export interface Persona {
  id: string
  name: string
  email: string
  avatar?: string
}

