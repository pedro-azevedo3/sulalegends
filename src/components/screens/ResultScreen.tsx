'use client'

import type { GameState } from '@/lib/game'

interface Props {
  state: GameState
  onPlayAgain: () => void
  onHome: () => void
}

export default function ResultScreen({ state, onPlayAgain, onHome }: Props) {
  const { sim, scoreP, scoreC } = state
  if (!sim) return null

  const diff = scoreP - scoreC
  const resultLabel = diff > 0 ? 'VITÓRIA!' : diff < 0 ? 'DERROTA' : 'EMPATE'
  const resultColor = diff > 0 ? '#2ee37a' : diff < 0 ? '#ff8f6a' : '#f5c84b'

  const rowStyle = (team: 'p' | 'c') =>
    team === 'p'
      ? 'rgba(46,227,122,.14)'
      : 'rgba(255,143,106,.12)'
  const rowBorder = (team: 'p' | 'c') =>
    team === 'p' ? 'rgba(46,227,122,.25)' : 'rgba(255,143,106,.22)'

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px', gap: 24 }}>
      <div style={{ animation: 'pop .5s ease both' }}>
        <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 'clamp(48px,12vw,88px)', letterSpacing: 2, color: resultColor, lineHeight: 1, textShadow: '0 8px 30px rgba(0,0,0,.4)' }}>
          {resultLabel}
        </div>
        <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 'clamp(44px,11vw,72px)', color: '#fff', marginTop: 8 }}>
          {scoreP} <span style={{ color: '#6a8a78' }}>×</span> {scoreC}
        </div>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", textTransform: 'uppercase', letterSpacing: 2, color: '#9fd9b6', fontWeight: 600, fontSize: 14, marginTop: 6 }}>
          SULALEGENDS  vs  {sim.cpuName}
        </div>
      </div>

      {/* Goal list */}
      {sim.events.length > 0 && (
        <div style={{ width: '100%', maxWidth: 460, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", textTransform: 'uppercase', letterSpacing: 2, color: '#f5c84b', fontWeight: 700, fontSize: 13, marginBottom: 2 }}>
            Gols da partida
          </div>
          {sim.events.map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 14px', borderRadius: 10, textAlign: 'left', background: rowStyle(e.team), border: `1px solid ${rowBorder(e.team)}` }}>
              <div style={{ fontFamily: "'Anton',sans-serif", color: '#f5c84b', minWidth: 36 }}>{e.min}'</div>
              <div>⚽</div>
              <div style={{ flex: 1 }}>
                <b style={{ color: '#fff' }}>{e.scorer}</b>{' '}
                <span style={{ fontSize: 12, color: '#9fb8aa' }}>· {e.teamName}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 4 }}>
        <ActionBtn
          onClick={onPlayAgain}
          style={{ background: 'linear-gradient(135deg,#2ee37a,#16a34a)', color: '#04140d', boxShadow: '0 5px 0 #0d7a36' }}
        >
          JOGAR DE NOVO
        </ActionBtn>
        <ActionBtn
          onClick={onHome}
          style={{ background: 'rgba(255,255,255,.06)', color: '#eafff0', border: '1px solid rgba(255,255,255,.16)' }}
        >
          VOLTAR AO INÍCIO
        </ActionBtn>
      </div>
    </div>
  )
}

function ActionBtn({ children, onClick, style }: { children: React.ReactNode; onClick: () => void; style: React.CSSProperties }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'Anton',sans-serif", letterSpacing: 1, fontSize: 19,
        padding: '14px 36px', border: 'none', borderRadius: 12, cursor: 'pointer',
        transition: 'transform .12s', ...style,
      }}
      onMouseDown={e => (e.currentTarget.style.transform = 'translateY(3px)')}
      onMouseUp={e => (e.currentTarget.style.transform = '')}
      onMouseLeave={e => (e.currentTarget.style.transform = '')}
    >
      {children}
    </button>
  )
}
