import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

// Get All Contacts
export async function GET() {
  try {
    const db = getDb()
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY id DESC').all()
    return NextResponse.json(contacts)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

// Add Contact
export async function POST(req: Request) {
  try {
    const db = getDb()
    const body = await req.json()
    const { name, phone, email, picture, is_favorite, is_muted, call_handling_enabled } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const result = db.prepare(`
      INSERT INTO contacts (name, phone, email, picture, is_favorite, is_muted, call_handling_enabled)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      name.trim(),
      phone ?? '',
      email ?? '',
      picture ?? null,
      is_favorite ? 1 : 0,
      is_muted ? 1 : 0,
      call_handling_enabled !== false ? 1 : 0
    )

    const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(result.lastInsertRowid)
    return NextResponse.json(contact, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
