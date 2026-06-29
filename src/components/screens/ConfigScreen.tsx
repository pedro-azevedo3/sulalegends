'use client'

import { FORMATIONS } from '@/lib/game'
import type { Formation, Style, Difficulty } from '@/lib/game'
import type { GameState } from '@/lib/game'
import Pitch from '@/components/Pitch'
import type { SlotView } from '@/hooks/useGame'

interface Props {
  state: GameState
  previewSlots: SlotView[]
  onFormation: (f: Formation) => void
  onStyle: (s: Style) => void
  onDiff: (d: Difficulty) => void
  onStart: () => void
}

const STYLES: Style[] = ['Defensivo', 'Equilibrado', 'Ofensivo']
const DIFFS: Difficulty[] = ['Normal', 'Difícil']

function OptionBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 16,
        letterSpacing: .5, padding: '11px 18px', borderRadius: 11, cursor: 'pointer',
        transition: 'all .12s',
        border: `1.5px solid ${active ? '#2ee37a' : 'rgba(255,255,255,.14)'}`,
        background: active ? 'linear-gradient(135deg,rgba(46,227,122,.9),rgba(22,163,74,.9))' : 'rgba(255,255,255,.04)',
        color: active ? '#04140d' : '#cfe6d8',
        boxShadow: active ? '0 4px 14px rgba(46,227,122,.3)' : 'none',
      }}
    >
      {label}
    </button>
  )
}

export default function ConfigScreen({ state, previewSlots, onFormation, onStyle, onDiff, onStart }: Props) {
  const { formation, style, diff } = state

  const hint = `${style} + ${formation}: ${
    style === 'Ofensivo' ? 'mais força no ataque, defesa exposta.' :
    style === 'Defensivo' ? 'defesa sólida, ataque mais tímido.' :
    'equilíbrio entre os setores.'
  } Dificuldade ${diff}${diff === 'Difícil' ? ' deixa a CPU bem mais forte.' : ' mantém a CPU equilibrada.'}`

  return (
    <>
      <div style={{
        flex: 1, padding: '22px 16px 110px', maxWidth: 1000, margin: '0 auto',
        width: '100%', display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start',
      }}>
        {/* Left: options */}
        <div style={{ flex: '1 1 340px', minWidth: 300, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div>
            <SectionLabel>Formação</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
              {(Object.keys(FORMATIONS) as Formation[]).map(f => (
                <OptionBtn key={f} label={f} active={formation === f} onClick={() => onFormation(f)} />
              ))}
            </div>
          </div>
          <div>
            <SectionLabel>Estilo de Jogo</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
              {STYLES.map(s => <OptionBtn key={s} label={s} active={style === s} onClick={() => onStyle(s)} />)}
            </div>
          </div>
          <div>
            <SectionLabel>Dificuldade</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
              {DIFFS.map(d => <OptionBtn key={d} label={d} active={diff === d} onClick={() => onDiff(d)} />)}
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#8fb5a0', lineHeight: 1.5, background: 'rgba(255,255,255,.03)', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(255,255,255,.06)' }}>
            {hint}
          </div>
        </div>

        {/* Right: pitch preview */}
        <div style={{ flex: '1 1 320px', minWidth: 280 }}>
          <div style={{ textAlign: 'center', fontFamily: "'Barlow Condensed',sans-serif", textTransform: 'uppercase', letterSpacing: 2, color: '#9fd9b6', fontWeight: 600, fontSize: 14, marginBottom: 10 }}>
            {formation} — Pré-visualização
          </div>
          <Pitch slots={previewSlots} size="lg" />
        </div>
      </div>

      {/* Fixed CTA */}
      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, padding: '14px 16px', background: 'linear-gradient(0deg,#060c09 60%,rgba(6,12,9,0))', display: 'flex', justifyContent: 'center', zIndex: 15 }}>
        <PrimaryBtn onClick={onStart}>INICIAR SORTEIO →</PrimaryBtn>
      </div>
    </>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, color: '#f5c84b', fontSize: 14, marginBottom: 10 }}>
      {children}
    </div>
  )
}

function PrimaryBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'linear-gradient(135deg,#2ee37a,#16a34a)', color: '#04140d',
        fontFamily: "'Anton',sans-serif", letterSpacing: 1.5, fontSize: 20,
        padding: '15px 48px', border: 'none', borderRadius: 12, cursor: 'pointer',
        boxShadow: '0 5px 0 #0d7a36, 0 10px 24px rgba(46,227,122,.3)',
        transition: 'transform .12s',
      }}
      onMouseDown={e => (e.currentTarget.style.transform = 'translateY(3px)')}
      onMouseUp={e => (e.currentTarget.style.transform = '')}
      onMouseLeave={e => (e.currentTarget.style.transform = '')}
    >
      {children}
    </button>
  )
}
