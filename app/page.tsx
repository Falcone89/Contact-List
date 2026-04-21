'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ContactList } from '@/components/ContactList'
import { AddContactModal } from '@/components/AddContactModal'
import { useContactsDB } from '@/hooks/useContactsDB'
import {
  BackArrowIcon,
  LightMode,
  SettingsIcon,
  AddIcon
} from '@/components/icons'

export default function Home() {
  const {
    contacts,
    addContact,
    editContact,
    deleteContact,
    toggleFavorite,
    toggleMute,
    toggleCallHandling,
    loading,
  } = useContactsDB()

  const [showAddModal, setShowAddModal] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
  }

  return (
    <main className="app-root">

      <div className="app-container">
        <div className="topline-header app-topline">
          <div className="topline-left">
            <a 
              href="https://www.linkedin.com/in/adam-solymosi/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-icon"
            >
              <BackArrowIcon />
            </a>
          </div>
          <div className="topline-right">
            <button className="btn btn-icon" onClick={toggleTheme}>
              <LightMode />
            </button>
          </div>
        </div>
      </div>

      <div className="app-divider"></div>

      <div className="app-container">
        <header className="app-header app-topline">

          <div className="header-left">
            <h1>Contacts</h1>
          </div>

          <div className="header-right">

            <SettingsIcon />

            <div className="profile-nav">
              <img className="profile-portrait" src="/images/profile-portrait.jpg" alt="Profile Portrait" />
            </div>

            <button
              className="btn btn-special"
              onClick={() => setShowAddModal(true)}
            >
              <AddIcon />
              <span className="hide-on-mobile">Add new</span>
            </button>

          </div>

        </header>
      </div>

      <div className="app-divider"></div>

      <div className="app-container app-container-full">

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
          </div>
        ) : (
          <ContactList
            contacts={contacts}
            onToggleFavorite={toggleFavorite}
            onToggleMute={toggleMute}
            onToggleCallHandling={toggleCallHandling}
            onEdit={editContact}
            onDelete={deleteContact}
          />
        )}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddContactModal
            onClose={() => setShowAddModal(false)}
            onAdd={addContact}
          />
        )}
      </AnimatePresence>
      
    </main>
  )
}
