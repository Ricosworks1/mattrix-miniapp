"use client";

import { useState, useEffect } from 'react'
import { useSignIn } from "@/hooks/use-sign-in";
import Image from "next/image";

// Mock user ID for demo - in production, this would come from wallet/auth
const DEMO_USER_ID = 'demo-user-123'
const API_BASE = 'https://mattrix-production.up.railway.app/api' // Your Railway API

interface Contact {
  id: string
  name: string
  company?: string
  email?: string
  position?: string
  priority: 'high' | 'medium' | 'low'
  createdAt: string
}

interface Stats {
  totalContacts: number
  highPriority: number
  mediumPriority: number
  lowPriority: number
  withPhotos: number
  companies: number
  locations: number
}

export default function Home() {
  const { signIn, isLoading, isSignedIn, user } = useSignIn({
    autoSignIn: true,
  });
  
  // Check for demo mode
  const isDemoMode = typeof window !== 'undefined' && window.location.hash === '#demo-mode'
  
  const [contacts, setContacts] = useState<Contact[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'contacts' | 'add' | 'stats'>('contacts')
  const [newContactData, setNewContactData] = useState('')

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/contacts/${DEMO_USER_ID}`)
      const data = await response.json()
      if (data.success) {
        setContacts(data.data)
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/stats/${DEMO_USER_ID}`)
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  // Add contact
  const addContact = async () => {
    if (!newContactData.trim()) return

    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          contactData: newContactData
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setNewContactData('')
        fetchContacts()
        setActiveTab('contacts')
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error('Error adding contact:', error)
      alert('Failed to add contact')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isSignedIn || isDemoMode) {
      fetchContacts()
      fetchStats()
    }
  }, [isSignedIn, isDemoMode])

  const getPriorityEmoji = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥'
      case 'medium': return '⚡'
      case 'low': return '💤'
      default: return '⚡'
    }
  }

  // Show simple welcome screen with demo access
  if (!isSignedIn && !isDemoMode) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🌐</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Mattrix</h1>
          <p className="text-gray-600 mb-6">Decentralized Conference CRM</p>
          
          <div className="space-y-3">
            <button
              onClick={signIn}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? "Signing in..." : "🚀 Sign in with Farcaster"}
            </button>
            
            <button
              onClick={() => {
                // Skip auth for demo - simulate signed in state
                window.location.hash = '#demo-mode';
                window.location.reload();
              }}
              className="w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200"
            >
              🎯 Demo Mode (Skip Login)
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            Demo mode uses sample data for hackathon presentation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">🌐</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Mattrix</h1>
              <p className="text-blue-100 text-sm">Decentralized CRM</p>
            </div>
          </div>
          
          {/* User Info */}
          {user ? (
            <div className="mt-4 flex items-center gap-3 bg-white/20 rounded-lg p-3">
              <Image
                src={user.pfp_url}
                alt="Profile"
                className="w-8 h-8 rounded-full"
                width={32}
                height={32}
              />
              <div>
                <p className="font-medium text-sm">{user.display_name}</p>
                <p className="text-blue-200 text-xs">@{user.username}</p>
              </div>
            </div>
          ) : isDemoMode && (
            <div className="mt-4 flex items-center gap-3 bg-white/20 rounded-lg p-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🎯</span>
              </div>
              <div>
                <p className="font-medium text-sm">Demo User</p>
                <p className="text-blue-200 text-xs">Hackathon Mode</p>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-50 border-b">
          {[
            { key: 'contacts', label: '👥 Contacts' },
            { key: 'add', label: '➕ Add' },
            { key: 'stats', label: '📊 Stats' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-3 px-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Your Contacts</h2>
                <button 
                  onClick={fetchContacts}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  disabled={loading}
                >
                  {loading ? '⏳' : '🔄'} Refresh
                </button>
              </div>

              {contacts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">👤</div>
                  <p>No contacts yet</p>
                  <p className="text-sm">Add your first contact!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{contact.name}</span>
                            <span className="text-sm">{getPriorityEmoji(contact.priority)}</span>
                          </div>
                          {contact.company && (
                            <p className="text-gray-600 text-sm mt-1">🏢 {contact.company}</p>
                          )}
                          {contact.position && (
                            <p className="text-gray-600 text-sm">💼 {contact.position}</p>
                          )}
                          {contact.email && (
                            <p className="text-gray-600 text-sm">📧 {contact.email}</p>
                          )}
                          <p className="text-gray-400 text-xs mt-2">
                            Added: {new Date(contact.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Add Contact Tab */}
          {activeTab === 'add' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Add New Contact</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Contact Template</label>
                <textarea
                  value={newContactData}
                  onChange={(e) => setNewContactData(e.target.value)}
                  placeholder={`Name: John Doe
Company: Base Protocol
Position: Developer
Email: john@base.org
Priority: high`}
                  className="w-full h-40 p-3 border rounded-lg resize-none text-sm"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <button
                  onClick={addContact}
                  disabled={loading || !newContactData.trim()}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding Contact...' : 'Add Contact'}
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  Use the same format as your Telegram bot
                </p>
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Networking Stats</h2>
                <button 
                  onClick={fetchStats}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  🔄 Refresh
                </button>
              </div>

              {stats && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalContacts}</div>
                    <div className="text-sm text-blue-800">Total Contacts</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
                    <div className="text-sm text-red-800">High Priority</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.companies}</div>
                    <div className="text-sm text-green-800">Companies</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.withPhotos}</div>
                    <div className="text-sm text-purple-800">With Photos</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-500">
          Powered by your Telegram bot data • Built with Base MiniKit
        </div>
      </div>
    </div>
  );
}
