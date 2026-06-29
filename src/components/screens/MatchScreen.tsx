'use client'

import type { GameState } from '@/lib/game'
import { cleanName } from '@/lib/game'

const SPEEDS = [
  { value: 0.5, label: '½×' },
  { value: 1,   label: '1×' },
  { value: 2,   label: '2×' },
  { value: 4,   label: '4×' },
]

interface Props {
  state: GameState
  onSkip: () => void
  onFinish: () => void
  onNextMatch?: () => void
  onSetSpeed: (speed: number) => void
}

export default function MatchScreen({ state, onSkip, onFinish, onNextMatch, onSetSpeed }: Props) {
  const { sim, scoreP, scoreC, simDone, tournamentCtx, simSpeed } = state
  if (!sim) return null

  const inTournament  = !!tournamentCtx
  const phaseLabel    = tournamentCtx?.phaseLabel ?? ''
  const opponentName  = inTournament ? tournamentCtx!.opponentClub : sim.cpuName
  const isUserHome    = !inTournament || tournamentCtx!.isUserHome

  const displayLeft   = isUserHome ? scoreP : scoreC
  const displayRight  = isUserHome ? scoreC : scoreP
  const leftName      = isUserHome ? 'SULALEGENDS' : opponentName
  const rightName     = isUserHome ? opponentName   : 'SULALEGENDS'
  const leftSub       = isUserHome ? (inTournament ? 'Mandante' : 'Seu Time') : (inTournament ? 'Visitante' : 'CPU')
  const rightSub      = isUserHome ? (inTournament ? 'Visitante' : 'CPU')     : (inTournament ? 'Mandante'  : 'Seu Time')
  const leftColor     = isUserHome ? '#2ee37a' : '#ff8f6a'
  const rightColor    = isUserHome ? '#ff8f6a' : '#2ee37a'

  const revealed = sim.events.slice(0, state.revealIdx)
  const noGoals  = simDone && sim.events.length === 0

  return (
    <div style={{ flex: 1, padding: '20px 16px 40px', maxWidth: 640, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Phase label */}
      {phaseLabel && (
        <div style={{ textAlign: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: '#4a7a60', fontWeight: 600 }}>
          {phaseLabel}
        </div>
      )}

      {/* Scoreboard */}
      <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center', gap: 10, background: 'linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, padding: '16px 14px' }}>
        <TeamLabel color={leftColor}  name={leftName}  sub={leftSub} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Anton',sans-serif", fontSize: 46, color: '#fff' }}>
          <span>{displayLeft}</span>
          <span style={{ color: '#6a8a78', fontSize: 30 }}>×</span>
          <span>{displayRight}</span>
        </div>
        <TeamLabel color={rightColor} name={rightName} sub={rightSub} />
      </div>

      {/* Status + Speed controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 2, textTransform: 'uppercase', color: '#9fd9b6', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          {!simDone && <><span style={{ display: 'inline-block', animation: 'ballspin 1s linear infinite' }}>⚽</span> Narração ao vivo…</>}
          {simDone && <>🏁 Fim de jogo</>}
        </div>

        {/* Speed selector */}
        {!simDone && (
          <div style={{ display: 'flex', gap: 4 }}>
            {SPEEDS.map(s => (
              <button
                key={s.value}
                onClick={() => onSetSpeed(s.value)}
                style={{
                  padding: '4px 10px', borderRadius: 7, fontSize: 12,
                  fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, letterSpacing: .5,
                  border: `1px solid ${simSpeed === s.value ? 'rgba(245,200,75,.6)' : 'rgba(255,255,255,.15)'}`,
                  background: simSpeed === s.value ? 'rgba(245,200,75,.18)' : 'rgba(255,255,255,.04)',
                  color: simSpeed === s.value ? '#f5c84b' : '#6a8a78',
                  cursor: 'pointer', transition: 'all .12s',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Events */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, minHeight: 100, flex: 1 }}>
        {revealed.map((e, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 11,
            animation: 'fadeUp .25s ease both',
            background: e.team === 'p' ? 'linear-gradient(90deg,rgba(46,227,122,.14),rgba(46,227,122,.03))' : 'linear-gradient(90deg,rgba(255,143,106,.12),rgba(255,143,106,.03))',
            border: `1px solid ${e.team === 'p' ? 'rgba(46,227,122,.25)' : 'rgba(255,143,106,.22)'}`,
          }}>
            <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 16, color: '#f5c84b', minWidth: 36 }}>{e.min}'</div>
            <div style={{ fontSize: 18 }}>⚽</div>
            <div style={{ flex: 1 }}>
              <b style={{ color: '#fff', fontSize: 15 }}>{cleanName(e.scorer)}</b>
              <div style={{ fontSize: 12, color: '#9fb8aa' }}>{e.teamName}</div>
            </div>
          </div>
        ))}
        {noGoals && <div style={{ textAlign: 'center', color: '#8fb5a0', fontSize: 14, padding: 20 }}>Sem gols…</div>}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
        {!simDone && (
          <button onClick={onSkip} style={{ background: 'rgba(255,255,255,.06)', color: '#eafff0', border: '1px solid rgba(255,255,255,.16)', padding: '12px 24px', borderRadius: 11, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            Pular ⏩
          </button>
        )}

        {simDone && inTournament && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {onNextMatch && (
              <button onClick={onNextMatch} style={{ background: 'linear-gradient(135deg,#2ee37a,#16a34a)', color: '#04140d', fontFamily: "'Anton',sans-serif", letterSpacing: 1, fontSize: 17, padding: '14px 28px', border: 'none', borderRadius: 12, cursor: 'pointer', boxShadow: '0 5px 0 #0d7a36', transition: 'transform .12s', whiteSpace: 'nowrap' }} onMouseDown={e => (e.currentTarget.style.transform = 'translateY(3px)')} onMouseUp={e => (e.currentTarget.style.transform = '')} onMouseLeave={e => (e.currentTarget.style.transform = '')}>
                ⚡ Próximo Jogo
              </button>
            )}
            <button onClick={onFinish} style={{ background: 'rgba(255,255,255,.08)', color: '#eafff0', fontFamily: "'Anton',sans-serif", letterSpacing: 1, fontSize: 17, padding: '14px 28px', border: '1px solid rgba(255,255,255,.2)', borderRadius: 12, cursor: 'pointer', transition: 'transform .12s', whiteSpace: 'nowrap' }} onMouseDown={e => (e.currentTarget.style.transform = 'translateY(3px)')} onMouseUp={e => (e.currentTarget.style.transform = '')} onMouseLeave={e => (e.currentTarget.style.transform = '')}>
              📊 Ver Tabela
            </button>
          </div>
        )}

        {simDone && !inTournament && (
          <button onClick={onFinish} style={{ background: 'linear-gradient(135deg,#2ee37a,#16a34a)', color: '#04140d', fontFamily: "'Anton',sans-serif", letterSpacing: 1, fontSize: 19, padding: '14px 40px', border: 'none', borderRadius: 12, cursor: 'pointer', boxShadow: '0 5px 0 #0d7a36', transition: 'transform .12s' }} onMouseDown={e => (e.currentTarget.style.transform = 'translateY(3px)')} onMouseUp={e => (e.currentTarget.style.transform = '')} onMouseLeave={e => (e.currentTarget.style.transform = '')}>
            VER RESULTADO →
          </button>
        )}
      </div>
    </div>
  )
}

function TeamLabel({ color, name, sub }: { color: string; name: string; sub: string }) {
  return (
    <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", textTransform: 'uppercase', letterSpacing: 1, color, fontWeight: 700, fontSize: 13 }}>{sub}</div>
      <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 16, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
    </div>
  )
}
