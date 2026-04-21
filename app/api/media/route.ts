import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

// Get All Images
export async function GET() {
  try {
    const db = getDb()
    const images = db.prepare('SELECT * FROM media_library ORDER BY created_at DESC').all()
    return NextResponse.json(images)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

// Add Image
export async function POST(req: Request) {
  try {
    const db = getDb()
    const body = await req.json()
    const { name, url } = body

    if (!url) {
      return NextResponse.json({ error: 'No image url' }, { status: 400 })
    }

    const result = db.prepare(`
      INSERT INTO media_library (name, url, created_at) VALUES (?, ?, ?)
    `).run(name ?? 'image', url, Date.now())

    const image = db.prepare('SELECT * FROM media_library WHERE id = ?').get(result.lastInsertRowid)
    return NextResponse.json(image, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
