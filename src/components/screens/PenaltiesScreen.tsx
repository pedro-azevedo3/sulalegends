'use client'

import type { GameState } from '@/lib/game'
import { cleanName } from '@/lib/game'

interface Props {
  state: GameState
  onSkip: () => void
  onFinish: () => void        // "Ver Tabela"
  onNextMatch?: () => void    // "Próximo Jogo"
}

export default function PenaltiesScreen({ state, onSkip, onFinish, onNextMatch }: Props) {
  const { penaltyShootout: pk } = state
  if (!pk) return null

  const revealedKicks = pk.kicks.slice(0, pk.revealedCount)
  const done = pk.revealedCount >= pk.kicks.length

  // Running score from revealed kicks only — never the final score before it's earned
  const scoreA = revealedKicks.filter(k => k.side === 'A' && k.scored).length
  const scoreB = revealedKicks.filter(k => k.side === 'B' && k.scored).length

  const nameA = pk.isUserA ? 'SULALEGENDS' : pk.clubA
  const nameB = !pk.isUserA ? 'SULALEGENDS' : pk.clubB
  const colorA = pk.isUserA ? '#2ee37a' : '#ff8f6a'
  const colorB = !pk.isUserA ? '#2ee37a' : '#ff8f6a'

  const winnerName = pk.winnerSide === 'A' ? nameA : nameB
  const userWon = (pk.winnerSide === 'A') === pk.isUserA

  // Marker rows: up to 5 regulation slots shown, extra sudden-death markers appended live
  const kicksA = pk.kicks.filter(k => k.side === 'A')
  const kicksB = pk.kicks.filter(k => k.side === 'B')
  const markerCount = Math.max(5, kicksA.length, kicksB.length)

  return (
    <div style={{ flex: 1, padding: '20px 16px 40px', maxWidth: 560, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Phase label */}
      <div style={{ textAlign: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: '#f5c84b', fontWeight: 700 }}>
        🥅 {pk.phaseLabel}
      </div>

      {/* Scoreboard */}
      <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center', gap: 10, background: 'linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, padding: '16px 14px' }}>
        <TeamLabel color={colorA} name={nameA} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Anton',sans-serif", fontSize: 46, color: '#fff' }}>
          <span>{scoreA}</span>
          <span style={{ color: '#6a8a78', fontSize: 30 }}>×</span>
          <span>{scoreB}</span>
        </div>
        <TeamLabel color={colorB} name={nameB} />
      </div>

      {/* Marker rows: filled circle per kick, green=gol, red=perdeu, empty=pendente */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <MarkerRow label={nameA} color={colorA} kicks={kicksA} revealedCount={pk.revealedCount} allKicks={pk.kicks} slots={markerCount} />
        <MarkerRow label={nameB} color={colorB} kicks={kicksB} revealedCount={pk.revealedCount} allKicks={pk.kicks} slots={markerCount} />
      </div>

      {/* Status */}
      <div style={{ textAlign: 'center', fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 2, textTransform: 'uppercase', color: '#9fd9b6', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {!done && <><span style={{ display: 'inline-block', animation: 'ballspin 1s linear infinite' }}>⚽</span> Disputa de pênaltis…</>}
        {done && <>🏁 Disputa encerrada</>}
      </div>

      {/* Kick-by-kick log, most recent first */}
      <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 7, minHeight: 80 }}>
        {revealedKicks.map((k, i) => {
          const isUserSide = (k.side === 'A') === pk.isUserA
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '9px 14px', borderRadius: 11,
              animation: 'fadeUp .25s ease both',
              background: k.scored
                ? (isUserSide ? 'linear-gradient(90deg,rgba(46,227,122,.14),rgba(46,227,122,.03))' : 'linear-gradient(90deg,rgba(255,143,106,.12),rgba(255,143,106,.03))')
                : 'rgba(255,255,255,.03)',
              border: `1px solid ${k.scored ? (isUserSide ? 'rgba(46,227,122,.25)' : 'rgba(255,143,106,.22)') : 'rgba(255,255,255,.08)'}`,
            }}>
              <div style={{ fontSize: 18, width: 22, textAlign: 'center' }}>{k.scored ? '⚽' : '❌'}</div>
              <div style={{ flex: 1 }}>
                <b style={{ color: '#fff', fontSize: 14 }}>{cleanName(k.scorer)}</b>
                <div style={{ fontSize: 11, color: '#9fb8aa' }}>{k.side === 'A' ? nameA : nameB}</div>
              </div>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, color: k.scored ? '#2ee37a' : '#ff6b50', fontWeight: 700, textTransform: 'uppercase' }}>
                {k.scored ? 'Gol' : 'Perdeu'}
              </div>
            </div>
          )
        })}
      </div>

      {/* Winner banner */}
      {done && (
        <div style={{
          textAlign: 'center', padding: '16px', borderRadius: 14,
          background: userWon ? 'linear-gradient(135deg,rgba(46,227,122,.22),rgba(46,227,122,.05))' : 'linear-gradient(135deg,rgba(255,94,58,.18),rgba(255,94,58,.04))',
          border: `1px solid ${userWon ? 'rgba(46,227,122,.4)' : 'rgba(255,94,58,.3)'}`,
        }}>
          <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 22, color: userWon ? '#2ee37a' : '#ff6b50' }}>
            {winnerName} VENCE NOS PÊNALTIS
          </div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, color: '#9fb8aa', marginTop: 2 }}>
            {pk.finalScoreA} × {pk.finalScoreB}
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
        {!done && (
          <button onClick={onSkip} style={{ background: 'rgba(255,255,255,.06)', color: '#eafff0', border: '1px solid rgba(255,255,255,.16)', padding: '12px 24px', borderRadius: 11, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            Pular ⏩
          </button>
        )}

        {done && (
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
      </div>
    </div>
  )
}

function TeamLabel({ color, name }: { color: string; name: string }) {
  return (
    <div style={{ flex: 1, textAlign: 'center', minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 15, color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
    </div>
  )
}

function MarkerRow({
  label, color, kicks, revealedCount, allKicks, slots,
}: {
  label: string
  color: string
  kicks: { side: 'A' | 'B'; scored: boolean; index: number }[]
  revealedCount: number
  allKicks: { side: 'A' | 'B'; scored: boolean; index: number }[]
  slots: number
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 90, fontSize: 11, color, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {label}
      </div>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {Array.from({ length: slots }, (_, i) => {
          const kick = kicks[i]
          const isRevealed = kick && allKicks.indexOf(kick) < revealedCount
          let bg = 'rgba(255,255,255,.06)'
          let border = 'rgba(255,255,255,.18)'
          let content = ''
          if (kick && isRevealed) {
            if (kick.scored) { bg = '#2ee37a'; border = '#2ee37a'; content = '⚽' }
            else { bg = 'rgba(255,94,58,.85)'; border = '#ff5e3a'; content = '✕' }
          }
          return (
            <div key={i} style={{
              width: 22, height: 22, borderRadius: '50%',
              background: bg, border: `1.5px solid ${border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: '#04140d', transition: 'background .15s, border-color .15s',
            }}>
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
