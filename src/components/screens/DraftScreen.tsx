'use client'

import { useState, useEffect, useRef } from 'react'
import { DB, JERSEY } from '@/data/db'
import type { PlayerTuple } from '@/data/db'
import type { GameState } from '@/lib/game'
import { openPosFor, eligibleOpenSlots, POS_LABEL, ratings } from '@/lib/game'
import type { SlotView } from '@/hooks/useGame'
import Pitch from '@/components/Pitch'

// ── Slot-machine timing: fast → slow → stop ──────────────────
const ALL_CLUBS = Object.keys(DB)
const SPIN_PROFILE = [50, 50, 55, 60, 65, 75, 95, 125, 165, 220, 310]

const POS_ORDER: Record<string, number> = {
  GOL: 0, ZAG: 1, LD: 2, LE: 3, VOL: 4, MC: 5, MD: 6, ME: 7, MEI: 8, PD: 9, PE: 10, ATA: 11,
}

// ── Sector → color used for the position label ─────────────────
const POS_COLOR: Record<string, string> = {
  GOL: '#3b82f6', ZAG: '#22c55e', LD: '#22c55e', LE: '#22c55e',
  VOL: '#eab308', MC: '#eab308', MD: '#eab308', ME: '#eab308', MEI: '#eab308',
  PD: '#ef4444', PE: '#ef4444', ATA: '#ef4444',
}

interface Props {
  state: GameState
  slots: SlotView[]
  onSlotClick: (idx: number) => void
  onTapPlayer: (pl: PlayerTuple) => void
  onCancel: () => void
  onAdvanceTeam: () => void
}

export default function DraftScreen({
  state, slots, onSlotClick, onTapPlayer, onCancel, onAdvanceTeam,
}: Props) {
  const { draftClub, chosen, pending, pendingSlot, slots: rawSlots, roundPicked } = state

  // ── Slot machine state ──────────────────────────────────────
  const [spinClub, setSpinClub] = useState<string | null>(draftClub)
  const [spinning, setSpinning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!draftClub) { setSpinClub(null); return }
    if (timerRef.current) clearTimeout(timerRef.current)
    setSpinning(true)

    function step(i: number) {
      if (i < SPIN_PROFILE.length) {
        setSpinClub(ALL_CLUBS[Math.floor(Math.random() * ALL_CLUBS.length)])
        timerRef.current = setTimeout(() => step(i + 1), SPIN_PROFILE[i])
      } else {
        setSpinClub(draftClub)
        setSpinning(false)
      }
    }
    step(0)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [draftClub])

  // ── Derived data ────────────────────────────────────────────
  const r     = rawSlots ? ratings(rawSlots) : null
  const filled = rawSlots ? rawSlots.filter(s => s.player).length : 0

  const roster: PlayerTuple[] = (spinClub && !spinning && DB[spinClub])
    ? DB[spinClub]
        .filter(pl => !chosen.includes(pl[0]))
        .slice()
        .sort((a, b) => (POS_ORDER[a[1]] - POS_ORDER[b[1]]) || (b[2] - a[2]))
    : []

  const pendingName = pending?.[0] ?? ''
  const choosingPos = !!pending

  return (
    <div style={{ flex: 1, padding: '18px 16px 40px', maxWidth: 1000, margin: '0 auto', width: '100%', display: 'flex', flexWrap: 'wrap', gap: 22, alignItems: 'flex-start' }}>

      {/* ── LEFT: progress + banners + mini pitch ── */}
      <div style={{ flex: '1 1 300px', minWidth: 280, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Progress */}
        <div style={{ background: 'linear-gradient(135deg,rgba(245,200,75,.16),rgba(245,200,75,.04))', border: '1px solid rgba(245,200,75,.3)', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", textTransform: 'uppercase', letterSpacing: 2, color: '#f5c84b', fontWeight: 600, fontSize: 13 }}>Montando seu time</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
            <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 46, color: '#fff', letterSpacing: 1 }}>{filled}</div>
            <div style={{ fontSize: 14, color: '#cfe6d8' }}>de 11 escalados</div>
          </div>
          <div style={{ height: 7, background: 'rgba(0,0,0,.35)', borderRadius: 99, marginTop: 10, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.round(filled / 11 * 100)}%`, background: 'linear-gradient(90deg,#2ee37a,#f5c84b)', borderRadius: 99, transition: 'width .4s' }} />
          </div>
          <div style={{ fontSize: 12, color: '#9fb8aa', marginTop: 9 }}>Toque num jogador e clique na posição destacada no campo.</div>
        </div>

        {/* Live stats */}
        <div style={{ display: 'flex', gap: 9 }}>
          {[
            { label: 'Overall', val: filled && r ? r.overall : '—', color: '#f5c84b', bg: 'rgba(245,200,75,.08)', br: 'rgba(245,200,75,.22)' },
            { label: 'Ataque',  val: r?.atkN ? r.atk : '—', color: '#2ee37a', bg: 'rgba(46,227,122,.08)', br: 'rgba(46,227,122,.22)' },
            { label: 'Defesa',  val: r?.defN ? r.def : '—', color: '#7fb2ff', bg: 'rgba(127,178,255,.08)', br: 'rgba(127,178,255,.22)' },
          ].map(({ label, val, color, bg, br }) => (
            <div key={label} style={{ flex: 1, textAlign: 'center', background: bg, border: `1px solid ${br}`, borderRadius: 11, padding: '9px 4px' }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", textTransform: 'uppercase', letterSpacing: 1, color: '#9fb8aa', fontSize: 11, fontWeight: 600 }}>{label}</div>
              <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 28, color, lineHeight: 1 }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Banner: escolher posição no campo */}
        {choosingPos && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: 'rgba(245,200,75,.14)', border: '1px solid rgba(245,200,75,.45)', borderRadius: 12, padding: '10px 14px', animation: 'fadeUp .2s ease both' }}>
            <div style={{ fontSize: 13, color: '#f7e3a8', lineHeight: 1.3 }}>
              Toque na posição destacada para escalar <b style={{ color: '#fff' }}>{pendingName}</b>
            </div>
            <button onClick={onCancel} style={{ background: 'transparent', color: '#f5c84b', border: 'none', padding: '4px 8px', borderRadius: 6, fontWeight: 800, fontSize: 16, cursor: 'pointer', lineHeight: 1, flexShrink: 0 }}>✕</button>
          </div>
        )}

        <Pitch slots={slots} onSlotClick={onSlotClick} size="sm" />
      </div>

      {/* ── RIGHT: slot machine header + roster ── */}
      <div style={{ flex: '1.4 1 360px', minWidth: 300, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Club header — oculto após escalar */}
        {!roundPicked && <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
          background: spinning ? 'rgba(245,200,75,.06)' : 'rgba(255,255,255,.04)',
          border: `1px solid ${spinning ? 'rgba(245,200,75,.35)' : 'rgba(255,255,255,.08)'}`,
          borderRadius: 14, padding: '14px 16px',
          transition: 'background .2s, border-color .2s',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'Barlow Condensed',sans-serif",
              textTransform: 'uppercase', letterSpacing: 2,
              color: spinning ? '#f5c84b' : '#9fd9b6',
              fontWeight: 600, fontSize: 12,
              transition: 'color .2s',
            }}>
              {spinning ? '🎰 Sorteando elenco…' : 'Elenco finalista sorteado'}
            </div>
            <div style={{
              fontFamily: "'Anton',sans-serif",
              fontSize: 26, letterSpacing: .5,
              color: spinning ? 'rgba(245,200,75,.85)' : '#fff',
              animation: spinning ? 'slotFlicker .18s ease infinite' : 'clubTitle .45s cubic-bezier(.22,1,.36,1) both',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              transition: 'color .15s',
            }}>
              {spinClub || '—'}
            </div>
          </div>

          {/* Contagem de posições preenchidas */}
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, color: '#4a7a60', textAlign: 'right' }}>
            {filled}/11 escalados
          </div>
        </div>}

        {/* ── Skeleton: só aparece enquanto sorteia E não escolheu ainda ── */}
        {!roundPicked && spinning && (
          <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, overflow: 'hidden' }}>
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: i < 8 ? '1px solid rgba(255,255,255,.05)' : 'none', animation: 'skeletonPulse 1s ease infinite', animationDelay: `${i * 0.07}s` }}>
                <div style={{ width: 26, height: 12, borderRadius: 4, background: 'rgba(245,200,75,.12)' }} />
                <div style={{ flex: 1, height: 14, borderRadius: 4, background: 'rgba(255,255,255,.08)' }} />
                <div style={{ width: 56, height: 11, borderRadius: 4, background: 'rgba(255,255,255,.05)' }} />
                <div style={{ width: 30, height: 26, borderRadius: 4, background: 'rgba(255,255,255,.10)' }} />
              </div>
            ))}
          </div>
        )}

        {/* ── Roster: só aparece quando landed E não escolheu ainda ── */}
        {!roundPicked && !spinning && (
          <div key={spinClub} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, overflow: 'hidden', animation: 'rollIn .3s cubic-bezier(.22,1,.36,1) both' }}>
            {roster.map((pl, idx) => {
              const opos       = rawSlots ? openPosFor(rawSlots, pl) : []
              const disabled   = opos.length === 0
              const posLabel   = opos.length > 0 ? opos.join('/') : pl[1]
              const jerseyNum  = spinClub ? (JERSEY[spinClub]?.[pl[0]] ?? null) : null
              const posColor   = POS_COLOR[pl[1]] ?? '#9fb8aa'
              const DIM        = '#1d2e21'
              const nameColor  = disabled ? DIM       : '#eafff0'
              const posLblColor= disabled ? DIM       : posColor
              const ovrColor   = disabled ? DIM       : '#eafff0'
              const numColor   = disabled ? '#1a2a1e' : '#3a6650'
              return (
                <button data-testid="roster-item" key={pl[0]}
                  onClick={() => !disabled && onTapPlayer(pl)} disabled={disabled}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', background: 'transparent', border: 'none', borderBottom: idx < roster.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none', cursor: disabled ? 'default' : 'pointer', textAlign: 'left', transition: 'background .12s', animation: 'rowIn .28s ease both', animationDelay: `${idx * 32}ms` }}
                  onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'rgba(46,227,122,.07)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                  onMouseDown={e => { if (!disabled) e.currentTarget.style.background = 'rgba(46,227,122,.12)' }}
                  onMouseUp={e => { if (!disabled) e.currentTarget.style.background = 'rgba(46,227,122,.07)' }}
                >
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, color: numColor, minWidth: 28, textAlign: 'right', transition: 'color .15s' }}>
                    {jerseyNum != null ? `#${jerseyNum}` : `#${idx + 1}`}
                  </span>
                  <span style={{ flex: 1, fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 15, color: nameColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transition: 'color .15s' }}>
                    {pl[0]}
                  </span>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600, fontSize: 11, color: posLblColor, letterSpacing: .5, minWidth: 52, textAlign: 'right', transition: 'color .15s' }}>
                    {posLabel}
                  </span>
                  <span style={{ fontFamily: "'Anton',sans-serif", fontSize: 26, color: ovrColor, lineHeight: 1, minWidth: 36, textAlign: 'right', transition: 'color .15s' }}>
                    {pl[2]}
                  </span>
                </button>
              )
            })}
            {roster.length === 0 && (
              <div style={{ padding: '20px 16px', textAlign: 'center', color: '#4a7a60', fontSize: 14 }}>Nenhum jogador disponível</div>
            )}
          </div>
        )}

        {/* ── Próximo Time ── sempre visível (oculto durante o spin) ── */}
        {!spinning && (
          <button
            onClick={onAdvanceTeam}
            style={{
              width: '100%', padding: '14px 16px',
              background: 'rgba(46,227,122,.1)',
              border: '1px solid rgba(46,227,122,.28)',
              borderRadius: 12,
              color: '#2ee37a',
              fontFamily: "'Anton',sans-serif",
              letterSpacing: 1.5, fontSize: 16,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'background .15s, border-color .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(46,227,122,.18)'; e.currentTarget.style.borderColor = 'rgba(46,227,122,.5)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(46,227,122,.1)'; e.currentTarget.style.borderColor = 'rgba(46,227,122,.28)' }}
          >
            🎲 Próximo Time
            <span style={{ fontSize: 18, opacity: .7 }}>→</span>
          </button>
        )}
      </div>
    </div>
  )
}
