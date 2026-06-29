'use client'

import type { GameState } from '@/lib/game'
import { ratings } from '@/lib/game'
import type { SlotView } from '@/hooks/useGame'
import Pitch from '@/components/Pitch'

interface Props {
  state: GameState
  slots: SlotView[]
  onPlay: () => void
}

export default function SquadScreen({ state, slots, onPlay }: Props) {
  const r = state.slots ? ratings(state.slots) : { overall: 0, atk: 0, def: 0, naturalCount: 0 }

  return (
    <>
      <div style={{ flex: 1, padding: '22px 16px 120px', maxWidth: 1000, margin: '0 auto', width: '100%', display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
        {/* Pitch */}
        <div style={{ flex: '1 1 320px', minWidth: 290 }}>
          <div style={{ textAlign: 'center', fontFamily: "'Barlow Condensed',sans-serif", textTransform: 'uppercase', letterSpacing: 2, color: '#9fd9b6', fontWeight: 600, fontSize: 14, marginBottom: 10 }}>
            Sua Escalação — {state.formation}
          </div>
          <Pitch slots={slots} size="lg" />
        </div>

        {/* Stats panel */}
        <div style={{ flex: '1 1 280px', minWidth: 260, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ textAlign: 'center', background: 'linear-gradient(135deg,rgba(245,200,75,.18),rgba(245,200,75,.03))', border: '1px solid rgba(245,200,75,.3)', borderRadius: 16, padding: 20 }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", textTransform: 'uppercase', letterSpacing: 2, color: '#f5c84b', fontWeight: 600, fontSize: 13 }}>Overall do Time</div>
            <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 72, lineHeight: 1, color: '#fff', textShadow: '0 6px 20px rgba(245,200,75,.3)' }}>{r.overall}</div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <StatCard label="Ataque"  val={r.atk}  color="#2ee37a" bg="rgba(46,227,122,.1)"  br="rgba(46,227,122,.25)" />
            <StatCard label="Defesa"  val={r.def}  color="#7fb2ff" bg="rgba(90,160,255,.1)"  br="rgba(90,160,255,.25)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: 14, color: '#cfeeda', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 12, padding: 14 }}>
            {[
              ['Estilo',    state.style],
              ['Formação',  state.formation],
              ['Dificuldade', state.diff],
              ['Jogadores na posição', `${r.naturalCount}/11`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#8fb5a0' }}>{k}</span>
                <b>{v}</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed CTA */}
      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, padding: '14px 16px', background: 'linear-gradient(0deg,#060c09 60%,rgba(6,12,9,0))', display: 'flex', justifyContent: 'center', zIndex: 15 }}>
            <button
            onClick={onPlay}
            style={{
              background: 'linear-gradient(135deg,#f5c84b,#e0a040)', color: '#1a1000',
              fontFamily: "'Anton',sans-serif", letterSpacing: 1.5, fontSize: 21,
              padding: '16px 52px', border: 'none', borderRadius: 13, cursor: 'pointer',
              boxShadow: '0 5px 0 #a87320, 0 12px 26px rgba(245,200,75,.3)',
              transition: 'transform .12s',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'translateY(3px)')}
            onMouseUp={e => (e.currentTarget.style.transform = '')}
            onMouseLeave={e => (e.currentTarget.style.transform = '')}
          >
            ENTRAR NA LIBERTADORES 🏆
          </button>
      </div>
    </>
  )
}

function StatCard({ label, val, color, bg, br }: { label: string; val: number; color: string; bg: string; br: string }) {
  return (
    <div style={{ flex: 1, textAlign: 'center', background: bg, border: `1px solid ${br}`, borderRadius: 12, padding: 14 }}>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", textTransform: 'uppercase', letterSpacing: 1, color: '#9fd9b6', fontSize: 12, fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 34, color }}>{val}</div>
    </div>
  )
}
