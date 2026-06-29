'use client'

import type { GameState } from '@/lib/game'
import { cleanName } from '@/lib/game'

interface Props {
  state: GameState
  onSkip: () => void
  onFinish: () => void           // "Ver Tabela" / standalone result
  onNextMatch?: () => void       // "Próximo Jogo" (tournament only)
}

export default function MatchScreen({ state, onSkip, onFinish, onNextMatch }: Props) {
  const { sim, scoreP, scoreC, simDone, tournamentCtx } = state
  if (!sim) return null

  const inTournament = !!tournamentCtx
  const cpuDisplayName = inTournament ? (tournamentCtx!.opponentClub) : sim.cpuName
  const cpuSubLabel    = inTournament ? (tournamentCtx!.isUserHome ? 'Visitante' : 'Mandante') : 'CPU'
  const userSubLabel   = inTournament ? (tournamentCtx!.isUserHome ? 'Mandante' : 'Visitante') : 'Seu Time'

  const isUserHome = !inTournament || tournamentCtx!.isUserHome
  const displayScoreLeft  = isUserHome ? scoreP : scoreC
  const displayScoreRight = isUserHome ? scoreC : scoreP
  const leftName  = isUserHome ? 'SULALEGENDS' : cpuDisplayName
  const rightName = isUserHome ? cpuDisplayName : 'SULALEGENDS'
  const leftSub   = isUserHome ? userSubLabel : cpuSubLabel
  const rightSub  = isUserHome ? cpuSubLabel : userSubLabel
  const leftColor = isUserHome ? '#2ee37a' : '#ff8f6a'
  const rightColor= isUserHome ? '#ff8f6a' : '#2ee37a'

  const revealed = sim.events.slice(0, state.revealIdx)
  const noGoals  = simDone && sim.events.length === 0

  return (
    <div style={{ flex: 1, padding: '24px 16px 40px', maxWidth: 640, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Scoreboard */}
      <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center', gap: 10, background: 'linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, padding: '18px 14px' }}>
        <TeamLabel color={leftColor} name={leftName} sub={leftSub} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Anton',sans-serif", fontSize: 46, color: '#fff' }}>
          <span>{displayScoreLeft}</span>
          <span style={{ color: '#6a8a78', fontSize: 30 }}>×</span>
          <span>{displayScoreRight}</span>
        </div>
        <TeamLabel color={rightColor} name={rightName} sub={rightSub} />
      </div>

      {/* Status */}
      <div style={{ textAlign: 'center', fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 2, textTransform: 'uppercase', color: '#9fd9b6', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        {!simDone && <><span style={{ display: 'inline-block', animation: 'ballspin 1s linear infinite' }}>⚽</span> Narração ao vivo…</>}
        {simDone  && <>🏁 Fim de jogo</>}
      </div>

      {/* Events */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, minHeight: 120 }}>
        {revealed.map((e, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 11, animation: 'fadeUp .35s ease both',
            background: e.team === 'p' ? 'linear-gradient(90deg,rgba(46,227,122,.14),rgba(46,227,122,.03))' : 'linear-gradient(90deg,rgba(255,143,106,.12),rgba(255,143,106,.03))',
            border: `1px solid ${e.team === 'p' ? 'rgba(46,227,122,.25)' : 'rgba(255,143,106,.22)'}`,
          }}>
            <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 17, color: '#f5c84b', minWidth: 38 }}>{e.min}'</div>
            <div style={{ fontSize: 20 }}>⚽</div>
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
          <button onClick={onSkip} style={{ background: 'rgba(255,255,255,.06)', color: '#eafff0', border: '1px solid rgba(255,255,255,.16)', padding: '12px 26px', borderRadius: 11, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            Pular ⏩
          </button>
        )}
        {simDone && inTournament && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Próximo Jogo */}
            {onNextMatch && (
              <button
                onClick={onNextMatch}
                style={{
                  background: 'linear-gradient(135deg,#2ee37a,#16a34a)', color: '#04140d',
                  fontFamily: "'Anton',sans-serif", letterSpacing: 1, fontSize: 17,
                  padding: '14px 28px', border: 'none', borderRadius: 12, cursor: 'pointer',
                  boxShadow: '0 5px 0 #0d7a36', transition: 'transform .12s', whiteSpace: 'nowrap',
                }}
                onMouseDown={e => (e.currentTarget.style.transform = 'translateY(3px)')}
                onMouseUp={e => (e.currentTarget.style.transform = '')}
                onMouseLeave={e => (e.currentTarget.style.transform = '')}
              >
                ⚡ Próximo Jogo
              </button>
            )}
            {/* Ver Tabela */}
            <button
              onClick={onFinish}
              style={{
                background: 'rgba(255,255,255,.08)', color: '#eafff0',
                fontFamily: "'Anton',sans-serif", letterSpacing: 1, fontSize: 17,
                padding: '14px 28px', border: '1px solid rgba(255,255,255,.2)',
                borderRadius: 12, cursor: 'pointer', transition: 'transform .12s', whiteSpace: 'nowrap',
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'translateY(3px)')}
              onMouseUp={e => (e.currentTarget.style.transform = '')}
              onMouseLeave={e => (e.currentTarget.style.transform = '')}
            >
              📊 Ver Tabela
            </button>
          </div>
        )}

        {simDone && !inTournament && (
          <button
            onClick={onFinish}
            style={{
              background: 'linear-gradient(135deg,#2ee37a,#16a34a)', color: '#04140d',
              fontFamily: "'Anton',sans-serif", letterSpacing: 1, fontSize: 19,
              padding: '14px 40px', border: 'none', borderRadius: 12, cursor: 'pointer',
              boxShadow: '0 5px 0 #0d7a36', transition: 'transform .12s',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'translateY(3px)')}
            onMouseUp={e => (e.currentTarget.style.transform = '')}
            onMouseLeave={e => (e.currentTarget.style.transform = '')}
          >
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
