'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Contact } from '@/types/contact'
import { EditContactModal } from './EditContactModal'
import {
  MuteIcon,
  CallIcon,
  MoreIcon,
  SettingsIcon,
  HeartIcon,
  DeleteIcon
} from './icons'

// Animation variants
const listItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
  exit: { opacity: 0, x: -20, transition: { duration: 0.18 } },
}

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.88, y: -6 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.16, ease: [0.34, 1.56, 0.64, 1] } },
  exit: { opacity: 0, scale: 0.9, y: -4, transition: { duration: 0.12 } },
}

// Avatar
function Avatar({ name, picture }: { name: string; picture: string | null }) {
  if (picture) return <img src={picture} alt={name} className="avatar" />
  return <img src="/images/no-image.png" alt={name} className="avatar" />
}

// Icon toggle button
interface IconToggleProps {
  active: boolean
  activeClass: string
  title: string
  onClick: () => void
  children: React.ReactNode
}

function IconToggle({ active, activeClass, title, onClick, children }: IconToggleProps) {
  return (
    <button 
      className={`btn${active ? ` ${activeClass}` : ''} btn-icon`}
      title={title}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// Context menu
interface MenuProps {
  contact: Contact
  onEdit: () => void
  onToggleFavorite: (id: number) => void
  onDelete: () => void
}

function ContextMenu({ contact, onEdit, onToggleFavorite, onDelete }: MenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="context-menu-wrap" ref={ref}>

      <button
        className="btn btn-icon"
        title="More options"
        aria-label="More options"
        onClick={() => setOpen(v => !v)}
      >
        <MoreIcon/>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="context-dropdown"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >

            <button
              className="context-item"
              onClick={() => { setOpen(false); onEdit() }}
            >
              <SettingsIcon />
              Edit
            </button>

            <button
              className={`context-item ${contact.is_favorite ? 'active-fav' : ''}`}
              onClick={() => onToggleFavorite(contact.id)}
            >
              <HeartIcon />
              {contact.is_favorite ? 'Unfavourite' : 'Favourite'}
            </button>

            <button
              className="context-item"
              onClick={() => {
                setOpen(false)
                if (confirm(`Delete "${contact.name}"?`)) onDelete()
              }}
            >
              <DeleteIcon />
              Remove
            </button>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Props
interface Props {
  contacts: Contact[]
  onToggleFavorite: (id: number) => void
  onToggleMute: (id: number) => void
  onToggleCallHandling: (id: number) => void
  onEdit: (id: number, data: Omit<Contact, 'id'>) => void
  onDelete: (id: number) => void
}

// Main
export function ContactList({
  contacts,
  onToggleFavorite,
  onToggleMute,
  onToggleCallHandling,
  onEdit,
  onDelete,
}: Props) {
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  if (contacts.length === 0) {
    return (
      <motion.div
        className="empty-state"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h2">No contacts yet</div>
        <p>Add your first contact using the button above.</p>
      </motion.div>
    )
  }

  let globalIndex = 0

  return (
    <>
      <div className="contact-list">
        <AnimatePresence>
          {contacts.map(contact => {
            const idx = globalIndex++
            return (
              <motion.div
                className="contact-card"
                key={contact.id}
                custom={idx}
                variants={listItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                transition={{ layout: { duration: 0.2 } }}
              >
                <Avatar name={contact.name} picture={contact.picture} />

                <div className="contact-info">
                  <h3 className="contact-name">{contact.name}</h3>
                  <div className="contact-sub">{contact.phone || contact.email || '—'}</div>
                </div>

                <div className="contact-actions">

                  <IconToggle
                    active={contact.is_muted}
                    activeClass="inactive"
                    title={contact.is_muted ? 'Unmute' : 'Mute'}
                    onClick={() => onToggleMute(contact.id)}
                  >
                    <MuteIcon />
                  </IconToggle>

                  <IconToggle
                    active={contact.call_handling_enabled}
                    activeClass="inactive"
                    title={contact.call_handling_enabled ? 'Enable call handling' : 'Disable call handling'}
                    onClick={() => onToggleCallHandling(contact.id)}
                  >
                    <CallIcon />
                  </IconToggle>

                  <ContextMenu
                    contact={contact}
                    onEdit={() => setEditingContact(contact)}
                    onToggleFavorite={() => onToggleFavorite(contact.id)}
                    onDelete={() => onDelete(contact.id)}
                  />

                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {editingContact && (
          <EditContactModal
            contact={editingContact}
            onClose={() => setEditingContact(null)}
            onSave={(id, data) => {
              onEdit(id, data)
              setEditingContact(null)
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}