'use client'

import { useRef, useState } from 'react'
import { computeStandings, type LibertadoresTournament, type TPhase, type TTie, type TMatch, type KOPhase } from '@/lib/tournament'
import type { Slot } from '@/lib/game'
import { cleanName } from '@/lib/game'
import { JERSEY } from '@/data/db'

// ── Club → country meta ───────────────────────────────────────
function clubMeta(club: string): { flag: string; code: string; year: string } {
  const year = club.match(/\d{4}/)?.[0] ?? ''
  if (/Atlético Nacional/i.test(club))            return { flag: '🇨🇴', code: 'COL', year }
  if (/Santos|Flamengo|São Paulo|Palmeiras|Grêmio|Corinthians|Internacional|Cruzeiro|Vasco|Atlético-MG|Fluminense|Athletico/i.test(club))
                                                   return { flag: '🇧🇷', code: 'BRA', year }
  if (/Boca Juniors|River Plate|Independiente|Estudiantes|Vélez|San Lorenzo|Racing Club|Newell/i.test(club))
                                                   return { flag: '🇦🇷', code: 'ARG', year }
  if (/Nacional|Peñarol/i.test(club))             return { flag: '🇺🇾', code: 'URY', year }
  if (/Olimpia|Cerro Porteño/i.test(club))        return { flag: '🇵🇾', code: 'PAR', year }
  if (/América de Cali/i.test(club))              return { flag: '🇨🇴', code: 'COL', year }
  if (/Colo-Colo/i.test(club))                    return { flag: '🇨🇱', code: 'CHL', year }
  if (/LDU Quito|Barcelona SC/i.test(club))       return { flag: '🇪🇨', code: 'ECU', year }
  if (/Cruz Azul|Tigres/i.test(club))             return { flag: '🇲🇽', code: 'MEX', year }
  return { flag: '🌍', code: '?', year }
}

const PHASE_LABEL: Record<TPhase, string> = {
  groups: 'Fase de Grupos', r16: 'Oitavas de Final',
  qf: 'Quartas de Final', sf: 'Semifinais', final: 'Final', ended: 'Encerrada',
}
const KO_PHASE_ORDER: TPhase[] = ['r16', 'qf', 'sf', 'final']

interface Props {
  tournament: LibertadoresTournament
  squad: Slot[]
  onPlayMatch: (matchId: string) => void
  onPlayAgain: () => void
  onHome: () => void
}

// ── Elimination detection ─────────────────────────────────────

function isUserEliminated(t: LibertadoresTournament): boolean {
  const user = t.userClub
  if (t.champion === user) return false   // still winning
  if (t.phase === 'ended') return true    // fully over

  // Lost a knockout tie (both legs played, winner decided, not us)
  if (t.ties.some(tie =>
    (tie.clubA === user || tie.clubB === user) &&
    tie.winner !== null && tie.winner !== user
  )) return true

  // Phase moved past groups but user isn't in any KO tie → eliminated in groups
  if (t.phase !== 'groups' && !t.ties.some(tie => tie.clubA === user || tie.clubB === user))
    return true

  return false
}

// ── Campaign stats helpers ─────────────────────────────────────

function campaignStats(t: LibertadoresTournament) {
  const user = t.userClub
  const ms = Object.values(t.matches).filter(m => m.played && (m.home === user || m.away === user))
  let w = 0, d = 0, l = 0, gf = 0, ga = 0
  ms.forEach(m => {
    const isH = m.home === user
    const ug = isH ? (m.homeGoals ?? 0) : (m.awayGoals ?? 0)
    const og = isH ? (m.awayGoals ?? 0) : (m.homeGoals ?? 0)
    gf += ug; ga += og
    if (ug > og) w++; else if (ug === og) d++; else l++
  })
  return { played: ms.length, w, d, l, gf, ga }
}

function campaignPhase(t: LibertadoresTournament): string {
  if (t.champion === t.userClub) return 'CAMPEÃO'
  const order: KOPhase[] = ['final', 'sf', 'qf', 'r16']
  for (const ph of order) {
    const tie = t.ties.find(ti =>
      ti.phase === ph && (ti.clubA === t.userClub || ti.clubB === t.userClub) && ti.winner
    )
    if (tie && tie.winner !== t.userClub) {
      const labels: Record<KOPhase, string> = {
        final: 'Eliminado na Final',
        sf:    'Eliminado nas Semis',
        qf:    'Eliminado nas Quartas',
        r16:   'Eliminado nas Oitavas',
      }
      return labels[ph]
    }
  }
  return 'Eliminado na Fase de Grupos'
}

// ── Main Component ─────────────────────────────────────────────

export default function TournamentScreen({ tournament, squad, onPlayMatch, onPlayAgain, onHome }: Props) {
  const { phase, groups, ties, matches, champion, nextUserMatchId, userClub } = tournament
  const userGroup = groups.find(g => g.clubs.includes(userClub))
  const userDone  = isUserEliminated(tournament) || phase === 'ended'

  const nextMatch = nextUserMatchId ? matches[nextUserMatchId] : null
  const opponentClub = nextMatch ? (nextMatch.home === userClub ? nextMatch.away : nextMatch.home) : null
  const isUserHome = nextMatch?.home === userClub

  return (
    <div style={{ flex: 1, padding: '18px 16px 40px', maxWidth: 960, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, letterSpacing: 3, color: '#9fd9b6', textTransform: 'uppercase', fontWeight: 600 }}>Copa SULALEGENDS</div>
          <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 26, color: '#f5c84b', letterSpacing: 1 }}>{PHASE_LABEL[phase]}</div>
        </div>
      </div>

      {/* ── CAMPAIGN CARD: shows on elimination OR full tournament end ── */}
      {userDone && (
        <CampaignCard
          tournament={tournament}
          squad={squad}
          onPlayAgain={onPlayAgain}
          onHome={onHome}
        />
      )}

      {/* ── NEXT MATCH CTA ── */}
      {!userDone && nextMatch && opponentClub && (
        <div style={{ background: 'linear-gradient(135deg,rgba(245,200,75,.2),rgba(245,200,75,.05))', border: '1px solid rgba(245,200,75,.4)', borderRadius: 16, padding: '16px 20px' }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", textTransform: 'uppercase', letterSpacing: 2, color: '#9fd9b6', fontWeight: 600, fontSize: 12, marginBottom: 10 }}>
            Próximo Jogo —{' '}
            {nextMatch.phase === 'groups'
              ? `Grupo ${nextMatch.groupId} · Rodada ${nextMatch.matchday} · ${nextMatch.leg === 1 ? 'Ida' : 'Volta'}`
              : `${PHASE_LABEL[nextMatch.phase]} · ${nextMatch.leg === 1 ? 'Ida' : 'Volta'}`}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Anton',sans-serif", fontSize: 20, color: isUserHome ? '#f5c84b' : '#fff' }}>
              {isUserHome ? 'SULALEGENDS' : opponentClub}
            </span>
            <span style={{ color: '#6a8a78', fontFamily: "'Anton',sans-serif", fontSize: 16 }}>vs</span>
            <span style={{ fontFamily: "'Anton',sans-serif", fontSize: 20, color: !isUserHome ? '#f5c84b' : '#fff' }}>
              {!isUserHome ? 'SULALEGENDS' : opponentClub}
            </span>
          </div>
          <button
            onClick={() => onPlayMatch(nextMatch.id)}
            style={{ background: 'linear-gradient(135deg,#f5c84b,#e0a040)', color: '#1a1000', fontFamily: "'Anton',sans-serif", letterSpacing: 1.5, fontSize: 18, padding: '13px 36px', border: 'none', borderRadius: 12, cursor: 'pointer', boxShadow: '0 4px 0 #a87320, 0 10px 24px rgba(245,200,75,.25)', transition: 'transform .12s' }}
            onMouseDown={e => (e.currentTarget.style.transform = 'translateY(3px)')}
            onMouseUp={e => (e.currentTarget.style.transform = '')}
            onMouseLeave={e => (e.currentTarget.style.transform = '')}
          >
            ⚽ JOGAR AGORA
          </button>
        </div>
      )}

      {/* ── GROUPS ── */}
      {(phase === 'groups' || ties.length === 0) && (
        <div>
          <SectionTitle>Fase de Grupos</SectionTitle>
          {userGroup && <div style={{ marginBottom: 16 }}><GroupTable group={userGroup} matches={matches} userClub={userClub} highlight /></div>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
            {groups.filter(g => g.id !== userGroup?.id).map(g => (
              <GroupTable key={g.id} group={g} matches={matches} userClub={userClub} />
            ))}
          </div>
        </div>
      )}

      {/* ── KNOCKOUT BRACKET ── */}
      {ties.length > 0 && (
        <div>
          <SectionTitle>Chaveamento</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {KO_PHASE_ORDER.filter(p => ties.some(t => t.phase === p)).map(koPhase => (
              <div key={koPhase}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", textTransform: 'uppercase', letterSpacing: 2, color: '#f5c84b', fontWeight: 600, fontSize: 13, marginBottom: 8 }}>
                  {PHASE_LABEL[koPhase as TPhase]}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 10 }}>
                  {ties.filter(t => t.phase === koPhase).map(tie => (
                    <TieCard key={tie.id} tie={tie} matches={matches} userClub={userClub} seedings={tournament.seedings} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User's match schedule */}
      {userGroup && !userDone && (
        <div>
          <SectionTitle>Seus Jogos — Grupo {userGroup.id}</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Object.values(matches)
              .filter(m => m.groupId === userGroup.id && (m.home === userClub || m.away === userClub))
              .sort((a, b) => a.matchday - b.matchday)
              .map(m => <UserMatchRow key={m.id} match={m} userClub={userClub} />)}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Campaign End Card — estilo 7a0 ────────────────────────────

function CampaignCard({ tournament, squad, onPlayAgain, onHome }: {
  tournament: LibertadoresTournament
  squad: Slot[]
  onPlayAgain: () => void
  onHome: () => void
}) {
  const isChampion = tournament.champion === tournament.userClub
  const phase      = campaignPhase(tournament)
  const stats      = campaignStats(tournament)
  const players    = squad.map(s => s.player).filter(Boolean) as NonNullable<Slot['player']>[]
  const avgOvr     = players.length ? Math.round(players.reduce((s, p) => s + p.o, 0) / players.length) : 0

  const resultColor = isChampion ? '#2ee37a' : '#ff5e3a'
  const resultLabel = isChampion ? 'CAMPEÃO!' : phase.toUpperCase()

  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    if (downloading) return
    setDownloading(true)
    try {
      await document.fonts.ready

      // ── 7a0-style card ────────────────────────────────────────────
      const SCALE    = 3.5          // ~1120px output — crisp on any screen
      const W        = 320          // narrow portrait, phone-friendly
      const FRAME    = 3            // gold side frame width
      const PAD      = 18
      const TOP_H    = 38
      const RESULT_H = 52
      const SCORE_H  = 90
      const STATS_H  = 76
      const ROW_H    = 38
      const FOOTER_H = 32
      const PLAYERS_H = players.length * ROW_H + 8
      const totalH   = TOP_H + RESULT_H + SCORE_H + STATS_H + PLAYERS_H + FOOTER_H

      const canvas  = document.createElement('canvas')
      canvas.width  = W * SCALE
      canvas.height = totalH * SCALE
      const ctx     = canvas.getContext('2d')!
      ctx.scale(SCALE, SCALE)
      ctx.textBaseline = 'middle'

      // ── Background ──────────────────────────────────────────────
      ctx.fillStyle = '#081408'
      ctx.fillRect(0, 0, W, totalH)

      // ── Gold side frames ─────────────────────────────────────────
      const goldGrad = (x0: number, x1: number) => {
        const g = ctx.createLinearGradient(x0, 0, x1, 0)
        g.addColorStop(0,   '#8B6B14')
        g.addColorStop(0.5, '#f0c040')
        g.addColorStop(1,   '#8B6B14')
        return g
      }
      ctx.fillStyle = goldGrad(0, FRAME)
      ctx.fillRect(0, 0, FRAME, totalH)
      ctx.fillStyle = goldGrad(W - FRAME, W)
      ctx.fillRect(W - FRAME, 0, FRAME, totalH)

      // helpers
      const hline = (y: number, a = 0.12) => {
        ctx.fillStyle = `rgba(255,255,255,${a})`
        ctx.fillRect(FRAME, y, W - FRAME * 2, 1)
      }

      // ── Top bar ──────────────────────────────────────────────────
      // Logo
      ctx.fillStyle = '#f5c84b'
      ctx.font = `400 15px "Anton", "Arial Black", sans-serif`
      ctx.textAlign = 'left'
      ctx.fillText('SULA', PAD, TOP_H / 2)
      ctx.fillStyle = '#eafff0'
      ctx.fillText('LEGENDS', PAD + 44, TOP_H / 2)
      // Seed code
      const seed = '#' + players.map(p => p.o).reduce((a, b) => a ^ b, 0).toString(16).toUpperCase().padStart(6, '0').slice(0, 6)
      ctx.fillStyle = '#2a5a3a'
      ctx.font = `500 9px "Barlow Condensed", "Arial Narrow", sans-serif`
      ctx.letterSpacing = '1px'
      ctx.textAlign = 'right'
      ctx.fillText(`seed ${seed}`, W - PAD, TOP_H / 2)
      ctx.letterSpacing = '0px'
      hline(TOP_H)

      // ── Result label ─────────────────────────────────────────────
      ctx.fillStyle = '#f5c84b'
      ctx.font = `400 28px "Anton", "Arial Black", Impact, sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText(resultLabel, W / 2, TOP_H + RESULT_H / 2)

      // ── Big score (Vitórias — Derrotas) ──────────────────────────
      ctx.fillStyle = '#f5c84b'
      ctx.font = `400 62px "Anton", "Arial Black", sans-serif`
      ctx.fillText(`${stats.w} — ${stats.l}`, W / 2, TOP_H + RESULT_H + SCORE_H * 0.52)
      hline(TOP_H + RESULT_H + SCORE_H, 0.08)

      // ── Stats grid: 4 green-bordered boxes ──────────────────────
      const sY    = TOP_H + RESULT_H + SCORE_H + 8
      const sH    = STATS_H - 16
      const nCols = 4
      const bW    = (W - FRAME * 2 - PAD * 2 - (nCols - 1) * 6) / nCols
      ;[
        { label: 'GOLS PRÓ', val: stats.gf, color: '#2ee37a' },
        { label: 'SOFRIDOS', val: stats.ga, color: '#ff8f6a' },
        { label: 'OVERALL',  val: avgOvr,   color: '#f5c84b' },
        { label: 'VITÓRIAS', val: stats.w,  color: '#2ee37a' },
      ].forEach(({ label, val, color }, i) => {
        const bx = FRAME + PAD + i * (bW + 6)
        // box bg + border
        ctx.fillStyle = 'rgba(46,200,90,0.07)'
        ctx.fillRect(bx, sY, bW, sH)
        ctx.strokeStyle = '#1a5a2a'
        ctx.lineWidth = 1
        ctx.strokeRect(bx + 0.5, sY + 0.5, bW - 1, sH - 1)
        // value
        const cx = bx + bW / 2
        ctx.fillStyle = color
        ctx.font = `400 20px "Anton", "Arial Black", sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText(String(val), cx, sY + sH * 0.46)
        // label
        ctx.fillStyle = '#3a6a48'
        ctx.font = `700 7px "Barlow Condensed", "Arial Narrow", sans-serif`
        ctx.letterSpacing = '0.5px'
        ctx.fillText(label, cx, sY + sH * 0.78)
        ctx.letterSpacing = '0px'
      })

      // ── Player rows ──────────────────────────────────────────────
      const pY = TOP_H + RESULT_H + SCORE_H + STATS_H + 4
      players.forEach((p, i) => {
        const meta  = clubMeta(p.club || '')
        const num   = p.club ? (JERSEY[p.club]?.[p.n] ?? i + 1) : i + 1
        const midY  = pY + i * ROW_H + ROW_H / 2

        // separator
        hline(pY + i * ROW_H, 0.06)

        // Jersey #
        ctx.fillStyle = '#2a5a3a'
        ctx.font = `600 11px "Barlow Condensed", "Arial Narrow", sans-serif`
        ctx.textAlign = 'left'
        ctx.fillText(String(num), PAD, midY)

        // Player name — amber like 7a0
        ctx.fillStyle = '#f0d080'
        ctx.font = `700 14px "Barlow", Arial, sans-serif`
        ctx.textAlign = 'left'
        ctx.fillText(cleanName(p.n), PAD + 20, midY, W - PAD * 2 - 80)

        // Flag emoji + country code + year
        ctx.font = `14px serif`
        ctx.textAlign = 'right'
        ctx.fillText(meta.flag, W - PAD - 58, midY)

        ctx.fillStyle = '#4a8060'
        ctx.font = `600 10px "Barlow Condensed", "Arial Narrow", sans-serif`
        ctx.fillText(`${meta.code} ${meta.year}`, W - PAD, midY)
      })

      // ── Footer ───────────────────────────────────────────────────
      const fY = pY + players.length * ROW_H + 8
      hline(fY, 0.06)
      ctx.fillStyle = '#2a4a30'
      ctx.font = `400 9px "Barlow Condensed", "Arial Narrow", sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText('sulalegends.com.br · monte o seu', W / 2, fY + FOOTER_H / 2)

      // ── Top & bottom gold bars ────────────────────────────────────
      const tbGrad = ctx.createLinearGradient(0, 0, W, 0)
      tbGrad.addColorStop(0,   'rgba(139,107,20,0)')
      tbGrad.addColorStop(0.2, '#f0c040')
      tbGrad.addColorStop(0.8, '#f0c040')
      tbGrad.addColorStop(1,   'rgba(139,107,20,0)')
      ctx.fillStyle = tbGrad
      ctx.fillRect(0, 0, W, 2)
      ctx.fillRect(0, totalH - 2, W, 2)

      const a = document.createElement('a')
      a.download = `sulalegends-${isChampion ? 'campeao' : 'campanha'}.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div style={{ animation: 'campaignPop .5s cubic-bezier(.22,1,.36,1) both', display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* ── Main card (dark panel like 7a0) ── */}
      <div ref={cardRef} style={{
        background: '#0b1a0f',
        border: '1px solid rgba(255,255,255,.1)',
        borderRadius: 16,
        overflow: 'hidden',
      }}>
        {/* Top: header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: '1px solid rgba(255,255,255,.07)',
          background: 'rgba(255,255,255,.03)',
        }}>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, color: '#4a7a60', textTransform: 'uppercase', letterSpacing: 2 }}>
            Copa SULALEGENDS
          </span>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, color: '#3a5a3a', letterSpacing: 1 }}>
            SULALEGENDS
          </span>
        </div>

        {/* Result */}
        <div style={{ textAlign: 'center', padding: '24px 16px 16px' }}>
          <div style={{
            fontFamily: "'Anton',sans-serif",
            fontSize: 'clamp(40px,12vw,68px)',
            letterSpacing: 2, lineHeight: 1,
            color: resultColor,
          }}>
            {isChampion ? '🏆' : ''} {resultLabel}
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          borderTop: '1px solid rgba(255,255,255,.07)',
          borderBottom: '1px solid rgba(255,255,255,.07)',
        }}>
          {[
            { label: 'GOLS PRÓ',  val: stats.gf,    color: '#2ee37a' },
            { label: 'SOFRIDOS',  val: stats.ga,    color: '#ff8f6a' },
            { label: 'OVERALL',   val: avgOvr,      color: '#f5c84b' },
            { label: 'VITÓRIAS',  val: stats.w,     color: '#fff'    },
          ].map(({ label, val, color }, i) => (
            <div key={label} style={{
              textAlign: 'center', padding: '14px 4px',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,.07)' : 'none',
            }}>
              <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 32, color, lineHeight: 1 }}>{val}</div>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, color: '#4a7a60', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Player list */}
        <div>
          {players.map((p, i) => {
            const meta = clubMeta(p.club || '')
            const num  = p.club ? (JERSEY[p.club]?.[p.n] ?? i + 1) : i + 1
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 16px',
                borderBottom: i < players.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none',
              }}>
                {/* Jersey # */}
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, color: '#3a6650', minWidth: 22, textAlign: 'right' }}>
                  {num}
                </span>
                {/* Name */}
                <span style={{ flex: 1, fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 15, color: '#eafff0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {cleanName(p.n)}
                </span>
                {/* Flag */}
                <span style={{ fontSize: 16 }}>{meta.flag}</span>
                {/* Country + Year */}
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, color: '#4a7a60', fontWeight: 600, letterSpacing: .5, minWidth: 62, textAlign: 'right' }}>
                  {meta.code} {meta.year}
                </span>
              </div>
            )
          })}
        </div>

        {/* Footer credit */}
        <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,.06)', textAlign: 'center' }}>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, color: '#3a5a3a', letterSpacing: 1 }}>
            sulalegends.com.br · monte o seu
          </span>
        </div>
      </div>

      {/* Download */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        style={{
          width: '100%', padding: '11px 16px',
          background: 'rgba(255,255,255,.05)',
          border: '1px solid rgba(255,255,255,.14)',
          borderRadius: 12,
          color: downloading ? '#4a7a60' : '#9fd9b6',
          fontFamily: "'Barlow Condensed',sans-serif",
          fontWeight: 700, fontSize: 14, letterSpacing: 1,
          cursor: downloading ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'background .15s, color .15s',
        }}
        onMouseEnter={e => { if (!downloading) e.currentTarget.style.background = 'rgba(255,255,255,.1)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.05)' }}
      >
        {downloading ? '⏳ Gerando imagem…' : '📲 Baixar card para redes sociais'}
      </button>

      {/* Action buttons — fora do card */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          onClick={onPlayAgain}
          style={{ flex: 1, minWidth: 160, background: 'linear-gradient(135deg,#2ee37a,#16a34a)', color: '#04140d', fontFamily: "'Anton',sans-serif", letterSpacing: 1, fontSize: 18, padding: '14px 24px', border: 'none', borderRadius: 12, cursor: 'pointer', boxShadow: '0 5px 0 #0d7a36', transition: 'transform .12s' }}
          onMouseDown={e => (e.currentTarget.style.transform = 'translateY(3px)')}
          onMouseUp={e => (e.currentTarget.style.transform = '')}
          onMouseLeave={e => (e.currentTarget.style.transform = '')}
        >
          JOGAR NOVAMENTE
        </button>
        <button
          onClick={onHome}
          style={{ background: 'rgba(255,255,255,.06)', color: '#eafff0', border: '1px solid rgba(255,255,255,.16)', fontFamily: "'Anton',sans-serif", letterSpacing: 1, fontSize: 18, padding: '14px 24px', borderRadius: 12, cursor: 'pointer', transition: 'transform .12s' }}
          onMouseDown={e => (e.currentTarget.style.transform = 'translateY(3px)')}
          onMouseUp={e => (e.currentTarget.style.transform = '')}
          onMouseLeave={e => (e.currentTarget.style.transform = '')}
        >
          INÍCIO
        </button>
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", textTransform: 'uppercase', letterSpacing: 2, color: '#9fd9b6', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
      {children}
    </div>
  )
}

function GroupTable({ group, matches, userClub, highlight }: { group: { id: string; clubs: string[] }; matches: Record<string, TMatch>; userClub: string; highlight?: boolean }) {
  const gMs = Object.values(matches).filter(m => m.groupId === group.id)
  const standings = computeStandings(group.clubs, gMs)
  return (
    <div style={{ background: highlight ? 'rgba(245,200,75,.07)' : 'rgba(255,255,255,.03)', border: `1px solid ${highlight ? 'rgba(245,200,75,.3)' : 'rgba(255,255,255,.07)'}`, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,.07)', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, color: '#f5c84b', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' }}>
        Grupo {group.id}
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ color: '#4a7a60' }}>
            <th style={{ textAlign: 'left', padding: '5px 14px', fontWeight: 600 }}>Time</th>
            <th style={{ padding: '5px 8px' }}>PTS</th>
            <th style={{ padding: '5px 8px' }}>J</th>
            <th style={{ padding: '5px 8px' }}>V</th>
            <th style={{ padding: '5px 8px' }}>E</th>
            <th style={{ padding: '5px 8px' }}>D</th>
            <th style={{ padding: '5px 8px' }}>SG</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, idx) => {
            const isUser = s.club === userClub
            return (
              <tr key={s.club} style={{ borderTop: '1px solid rgba(255,255,255,.05)', background: isUser ? 'rgba(245,200,75,.08)' : 'transparent' }}>
                <td style={{ padding: '7px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ color: idx < 2 ? '#2ee37a' : '#4a7a60', fontWeight: 700, fontSize: 11, minWidth: 14 }}>{idx + 1}º</span>
                    <span style={{ color: isUser ? '#f5c84b' : '#eafff0', fontWeight: isUser ? 700 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>
                      {isUser ? 'SULALEGENDS' : s.club}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '7px 8px', textAlign: 'center', fontFamily: "'Anton',sans-serif", color: '#fff', fontSize: 14 }}>{s.pts}</td>
                <td style={{ padding: '7px 8px', textAlign: 'center', color: '#6a8a78' }}>{s.played}</td>
                <td style={{ padding: '7px 8px', textAlign: 'center', color: '#2ee37a' }}>{s.w}</td>
                <td style={{ padding: '7px 8px', textAlign: 'center', color: '#6a8a78' }}>{s.d}</td>
                <td style={{ padding: '7px 8px', textAlign: 'center', color: '#ff8f6a' }}>{s.l}</td>
                <td style={{ padding: '7px 8px', textAlign: 'center', color: s.gd > 0 ? '#2ee37a' : s.gd < 0 ? '#ff8f6a' : '#6a8a78', fontWeight: 600 }}>
                  {s.gd > 0 ? `+${s.gd}` : s.gd}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function TieCard({ tie, matches, userClub, seedings }: {
  tie: TTie; matches: Record<string, TMatch>; userClub: string
  seedings: Record<string, string>
}) {
  const m1 = matches[tie.leg1Id], m2 = matches[tie.leg2Id]
  const userInvolved = tie.clubA === userClub || tie.clubB === userClub
  const nameA = tie.clubA === userClub ? 'SULALEGENDS' : tie.clubA
  const nameB = tie.clubB === userClub ? 'SULALEGENDS' : tie.clubB
  const seedA = seedings[tie.clubA]
  const seedB = seedings[tie.clubB]
  return (
    <div style={{ background: userInvolved ? 'rgba(245,200,75,.07)' : 'rgba(255,255,255,.03)', border: `1px solid ${userInvolved ? 'rgba(245,200,75,.25)' : 'rgba(255,255,255,.07)'}`, borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px 8px', borderBottom: '1px solid rgba(255,255,255,.07)', gap: 8 }}>
        {/* Team A */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {seedA && <div style={{ fontSize: 10, color: '#4a7a60', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600, letterSpacing: 1 }}>{seedA}</div>}
          <span style={{ color: tie.clubA === userClub ? '#f5c84b' : '#eafff0', fontWeight: 700, fontSize: 13, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nameA}</span>
        </div>
        {/* Score / VS */}
        {tie.winner ? (
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: "'Anton',sans-serif", fontSize: 18, color: '#fff' }}>
              {tie.aggA} – {tie.aggB}
            </span>
            {tie.penalties && <div style={{ fontSize: 10, color: '#9fb8aa' }}>({tie.penalties.a}-{tie.penalties.b} pên)</div>}
          </div>
        ) : <span style={{ color: '#4a7a60', padding: '0 8px', fontSize: 12, flexShrink: 0 }}>vs</span>}
        {/* Team B */}
        <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
          {seedB && <div style={{ fontSize: 10, color: '#4a7a60', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600, letterSpacing: 1 }}>{seedB}</div>}
          <span style={{ color: tie.clubB === userClub ? '#f5c84b' : '#eafff0', fontWeight: 700, fontSize: 13, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nameB}</span>
        </div>
      </div>
      <div style={{ display: 'flex', fontSize: 11, color: '#6a8a78' }}>
        <LegCell match={m1} label="Ida"   userClub={userClub} />
        <div style={{ width: 1, background: 'rgba(255,255,255,.07)' }} />
        <LegCell match={m2} label="Volta" userClub={userClub} />
      </div>
      {tie.winner && (
        <div style={{ padding: '6px 14px', borderTop: '1px solid rgba(255,255,255,.07)', fontSize: 11, color: '#2ee37a', fontWeight: 700 }}>
          ✓ {tie.winner === userClub ? 'SULALEGENDS avança' : `${tie.winner} avança`}
        </div>
      )}
    </div>
  )
}

function LegCell({ match, label, userClub }: { match: TMatch; label: string; userClub: string }) {
  const hUser = match.home === userClub, aUser = match.away === userClub
  return (
    <div style={{ flex: 1, padding: '6px 10px' }}>
      <div style={{ color: '#4a7a60', marginBottom: 3 }}>{label}</div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <span style={{ color: hUser ? '#f5c84b' : '#9fb8aa', fontWeight: hUser ? 700 : 400 }}>
          {hUser ? 'SUL' : match.home.split(' ')[0].slice(0, 4)}
        </span>
        {match.played
          ? <span style={{ fontFamily: "'Anton',sans-serif", color: '#fff', fontSize: 12 }}>{match.homeGoals}-{match.awayGoals}</span>
          : <span style={{ color: '#334a3a' }}>–</span>}
        <span style={{ color: aUser ? '#f5c84b' : '#9fb8aa', fontWeight: aUser ? 700 : 400 }}>
          {aUser ? 'SUL' : match.away.split(' ')[0].slice(0, 4)}
        </span>
      </div>
    </div>
  )
}

function UserMatchRow({ match, userClub }: { match: TMatch; userClub: string }) {
  const isHome = match.home === userClub
  const opponent = isHome ? match.away : match.home
  const played = match.played
  const ug = isHome ? match.homeGoals : match.awayGoals
  const og = isHome ? match.awayGoals : match.homeGoals
  const won = played && ug != null && og != null && ug > og
  const drew = played && ug != null && og != null && ug === og
  const lost = played && ug != null && og != null && ug < og
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 14px', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', borderLeft: `3px solid ${won ? '#2ee37a' : lost ? '#ff8f6a' : drew ? '#f5c84b' : 'rgba(255,255,255,.15)'}`, borderRadius: 8, fontSize: 13 }}>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: '#4a7a60', minWidth: 60, fontSize: 11 }}>Rd {match.matchday} · {match.leg === 1 ? 'Ida' : 'Volta'}</div>
      <div style={{ color: '#9fd9b6', fontSize: 11, minWidth: 40 }}>{isHome ? 'Casa' : 'Fora'}</div>
      <div style={{ flex: 1, fontWeight: 600, color: '#eafff0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{opponent}</div>
      {played
        ? <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 16, color: won ? '#2ee37a' : lost ? '#ff8f6a' : '#f5c84b', minWidth: 40, textAlign: 'right' }}>{ug}-{og}</div>
        : <div style={{ color: '#334a3a', fontSize: 12 }}>Aguardando</div>}
    </div>
  )
}
