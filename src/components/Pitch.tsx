'use client'

import type { SlotView } from '@/hooks/useGame'
import { cleanName } from '@/lib/game'

interface Props {
  slots: SlotView[]
  onSlotClick?: (idx: number) => void
  onPlayerClick?: (idx: number) => void  // tap placed player to reposition
  size?: 'sm' | 'lg'
}

export default function Pitch({ slots, onSlotClick, onPlayerClick, size = 'lg' }: Props) {
  const maxW = size === 'lg' ? 360 : 320

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: maxW,
      aspectRatio: '68 / 100',
      margin: '0 auto',
      borderRadius: 14,
      background: 'repeating-linear-gradient(0deg,#1c8043 0 9%,#197539 9% 18%)',
      border: '2px solid rgba(255,255,255,.22)',
      overflow: 'hidden',
      boxShadow: 'inset 0 0 50px rgba(0,0,0,.4), 0 14px 30px rgba(0,0,0,.4)',
    }}>
      {/* Field lines SVG */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        viewBox="0 0 68 100"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="50" x2="68" y2="50" stroke="rgba(255,255,255,.3)" strokeWidth=".5" />
        <circle cx="34" cy="50" r="9" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth=".5" />
        <circle cx="34" cy="50" r=".8" fill="rgba(255,255,255,.3)" />
        {/* Top box */}
        <rect x="16.2" y="0" width="35.6" height="12" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth=".45" />
        <rect x="23.8" y="0" width="20.4" height="4.5" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth=".4" />
        {/* Bottom box */}
        <rect x="16.2" y="88" width="35.6" height="12" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth=".45" />
        <rect x="23.8" y="95.5" width="20.4" height="4.5" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth=".4" />
      </svg>

      {/* Slots */}
      {slots.map((s, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            transform: 'translate(-50%,-50%)',
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          {s.filled && s.player ? (
            <button
              onClick={() => onPlayerClick && onPlayerClick(idx)}
              disabled={!onPlayerClick}
              style={{ background: 'none', border: 'none', padding: 0, cursor: onPlayerClick ? 'pointer' : 'default', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: 'linear-gradient(135deg,#1f3a2b,#142318)',
                color: '#f5c84b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 15,
                border: s.preview ? '1.5px solid #f5c84b' : '1.5px solid rgba(245,200,75,.45)',
                boxShadow: onPlayerClick ? '0 3px 12px rgba(245,200,75,.25),0 3px 8px rgba(0,0,0,.4)' : '0 3px 8px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.08)',
                outline: s.preview ? '3px solid #f5c84b' : 'none',
                outlineOffset: s.preview ? 2 : 0,
                animation: s.preview ? 'pulse 1.05s infinite' : 'none',
                transition: 'box-shadow .15s',
              }}>
                {s.player.o}
              </div>
              <div style={{
                fontSize: 10, lineHeight: 1.05, fontWeight: s.preview ? 800 : 700,
                color: s.preview ? '#1a1000' : '#eafff0',
                background: s.preview ? 'rgba(245,200,75,.92)' : 'rgba(4,18,11,.78)',
                padding: '2px 6px', borderRadius: 5,
                maxWidth: 82, textAlign: 'center',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {cleanName(s.player.n)}
              </div>
            </button>
          ) : (
            <button
              data-testid={s.selectable ? 'slot-sel' : undefined}
              onClick={() => s.onSelect !== null && onSlotClick && onSlotClick(s.onSelect)}
              disabled={!s.selectable}
              style={{
                width: s.selectable ? 44 : s.dimmed ? 30 : 34,
                height: s.selectable ? 44 : s.dimmed ? 30 : 34,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: s.selectable ? 12 : 10,
                fontWeight: 800, fontFamily: "'Barlow Condensed',sans-serif",
                color: s.selectable ? '#0a140d' : s.dimmed ? '#7c948a' : '#bfe9cf',
                background: s.selectable ? 'rgba(245,200,75,.97)' : s.dimmed ? 'rgba(255,255,255,.03)' : 'rgba(255,255,255,.06)',
                border: `2px ${s.selectable ? 'solid #fff' : 'dashed'} ${s.selectable ? '#fff' : s.dimmed ? 'rgba(255,255,255,.16)' : 'rgba(255,255,255,.32)'}`,
                cursor: s.selectable ? 'pointer' : 'default',
                opacity: s.dimmed ? 0.5 : 1,
                boxShadow: s.selectable ? '0 0 0 4px rgba(245,200,75,.28)' : 'none',
                animation: s.selectable ? 'pulse 1.05s infinite' : 'none',
                transition: 'all .15s',
              }}
            >
              {s.pos}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
