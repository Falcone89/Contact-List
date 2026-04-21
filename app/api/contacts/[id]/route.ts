import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

// Edit Contact
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb()
    const id = parseInt(params.id)
    const body = await req.json()

    if (body.toggle === 'favorite') {
      db.prepare('UPDATE contacts SET is_favorite = CASE WHEN is_favorite = 0 THEN 1 ELSE 0 END WHERE id = ?').run(id)
    } else if (body.toggle === 'mute') {
      db.prepare('UPDATE contacts SET is_muted = CASE WHEN is_muted = 0 THEN 1 ELSE 0 END WHERE id = ?').run(id)
    } else if (body.toggle === 'call_handling') {
      db.prepare('UPDATE contacts SET call_handling_enabled = CASE WHEN call_handling_enabled = 0 THEN 1 ELSE 0 END WHERE id = ?').run(id)
    } else {
      const { name, phone, email, picture, is_favorite, is_muted, call_handling_enabled } = body
      db.prepare(`
        UPDATE contacts
        SET name = ?, phone = ?, email = ?, picture = ?, is_favorite = ?, is_muted = ?, call_handling_enabled = ?
        WHERE id = ?
      `).run(
        name,
        phone ?? '',
        email ?? '',
        picture ?? null,
        is_favorite ? 1 : 0,
        is_muted ? 1 : 0,
        call_handling_enabled !== false ? 1 : 0,
        id
      )
    }

    const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(id)
    return NextResponse.json(contact)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

// Delete Contact
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb()
    const id = parseInt(params.id)
    db.prepare('DELETE FROM contacts WHERE id = ?').run(id)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
