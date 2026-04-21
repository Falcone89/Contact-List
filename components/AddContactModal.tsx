'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Contact, MediaImage } from '@/types/contact'
import { MediaLibraryModal } from './MediaLibraryModal'
import {
  DeleteIcon,
  AddIcon,
  ChangeIcon
} from './icons'

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.93, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: [0.34, 1.56, 0.64, 1] } },
  exit: { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.15 } },
}

interface Props {
  onClose: () => void
  onAdd: (data: Omit<Contact, 'id'>) => void
}

export function AddContactModal({ onClose, onAdd }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [picture, setPicture] = useState<string | null>(null)
  const [showMedia, setShowMedia] = useState(false)

  const handleSubmit = () => {
    if (!name.trim()) return
    onAdd({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      picture,
      is_favorite: false,
      is_muted: false,
      call_handling_enabled: false
    })
    onClose()
  }

  const handleSelectImage = (img: MediaImage) => {
    setPicture(img.url)
    setShowMedia(false)
  }

  return (
    <>
      <motion.div
        className="modal-overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          className="modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="modal-header">
            <h2 className="modal-title">Add Contact</h2>
          </div>

          <div className="modal-body">

            <div className="picture-section">

              {picture ? (
                <img src={picture} alt="Contact" className="picture-frame" />
              ) : (
                <img src="/images/no-image.png" className="picture-frame" />
              )}

              <button
                className="btn btn-primary"
                onClick={() => setShowMedia(true)}
              >
                {picture ? (
                  <>
                    <ChangeIcon />
                    Change picture
                  </>
                ) : (
                  <>
                    <AddIcon />
                    Add picture
                  </>
                )}
              </button>

              {picture && (
                <button
                  className="btn btn-primary btn-icon"
                  onClick={() => setPicture(null)}
                >
                  <DeleteIcon />
                </button>
              )}

            </div>

            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" type="text" value={name} onChange={e => setName(e.target.value)} autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Phone number</label>
              <input className="form-input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div className="modal-footer">
              <button
                className="btn"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={!name.trim()}
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showMedia && (
          <MediaLibraryModal
            onSelect={handleSelectImage}
            onClose={() => setShowMedia(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
