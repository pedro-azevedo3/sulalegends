'use client'

import { useEffect } from 'react'

interface Props {
  title: string
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ title, onClose, children }: Props) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0 0 env(safe-area-inset-bottom)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 640,
          background: '#0b1a0f',
          border: '1px solid rgba(255,255,255,.1)',
          borderRadius: '20px 20px 0 0',
          maxHeight: '85vh',
          display: 'flex', flexDirection: 'column',
          animation: 'fadeUp .25s ease both',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,.15)' }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px 12px',
          borderBottom: '1px solid rgba(255,255,255,.07)',
        }}>
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700, fontSize: 16, letterSpacing: 2,
            textTransform: 'uppercase', color: '#9fd9b6',
          }}>
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,.08)', border: 'none',
              color: '#9fb8aa', width: 30, height: 30, borderRadius: '50%',
              cursor: 'pointer', fontSize: 16, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{
          overflowY: 'auto', padding: '20px',
          fontSize: 14, color: '#cfe6d8', lineHeight: 1.65,
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}
