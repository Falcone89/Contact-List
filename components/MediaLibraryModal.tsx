'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMediaLibrary } from '@/hooks/useContactsDB'
import { MediaImage } from '@/types/contact'
import {
  SearchIcon,
  BackArrowIcon,
  AddIcon
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

const gridItemVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.03, duration: 0.2, ease: 'easeOut' },
  }),
}

interface Props {
  onSelect: (image: MediaImage) => void
  onClose: () => void
}

export function MediaLibraryModal({ onSelect, onClose }: Props) {
  const { images, uploadImage } = useMediaLibrary(null)
  const [selected, setSelected] = useState<MediaImage | null>(null)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const filtered = images.filter(img =>
    img.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.')
      return
    }
    setUploading(true)
    const newImg = await uploadImage(file)
    if (newImg) setSelected(newImg)
    setUploading(false)
    e.target.value = ''
  }

  const handleConfirm = () => {
    if (selected) onSelect(selected)
  }

  const shortName = (name: string) =>
    name.length > 14 ? name.slice(0, 11) + '…' + name.slice(name.lastIndexOf('.')) : name

  return (
    <motion.div
      className="modal-overlay media-overlay"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        className="modal media-modal"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >

        <div className="modal-header">
          <h3 className="modal-title">Media Library</h3>
        </div>

        <div className="modal-body">

          <div className="media-toolbar">
            <div className="media-search-wrap">
              <SearchIcon className="media-search-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    className="media-search-clear"
                    onClick={() => setSearch('')}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <BackArrowIcon />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className="spinner" style={{ width: 13, height: 13, borderWidth: 1.5 }} />
                  Uploading...
                </>
              ) : (
                <>
                  <AddIcon />
                  Upload
                </>
              )}
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleUpload}
            />
          </div>

          <div className="media-result-count">
            {search
              ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${search}"`
              : `${images.length} image${images.length !== 1 ? 's' : ''}`
            }
          </div>

          <div className="media-grid">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  className="media-empty"
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span>{search ? 'No images match your search.' : 'No images yet. Upload one to get started.'}</span>
                </motion.div>
              ) : (
                filtered.map((img, i) => (
                  <motion.div
                    key={img.id}
                    className={`media-item${selected?.id === img.id ? ' selected' : ''}`}
                    onClick={() => setSelected(img)}
                    title={img.name}
                    custom={i}
                    variants={gridItemVariants}
                    initial="hidden"
                    layout
                  >
                    <img src={img.url} alt={img.name} />

                    <div className="media-item-name">{shortName(img.name)}</div>

                  </motion.div>
                ))
              )}
            </AnimatePresence>
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
              onClick={handleConfirm}
              disabled={!selected}
            >
              Select
            </button>
          </div>

        </div>

      </motion.div>
    </motion.div>
  )
}
