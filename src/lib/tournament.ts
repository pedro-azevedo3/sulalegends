import { DB } from '@/data/db'
import type { GameState, PlacedPlayer } from '@/lib/game'

// ── Types ─────────────────────────────────────────────────────────────────────

export type TPhase = 'groups' | 'r16' | 'qf' | 'sf' | 'final' | 'ended'
export type KOPhase = 'r16' | 'qf' | 'sf' | 'final'

export interface TMatch {
  id: string
  phase: TPhase
  groupId?: string    // 'A'–'H' for group stage
  tieId?: string      // knockout tie id
  leg: 1 | 2
  matchday: number    // 1-6 group; 1-2 knockout
  home: string        // club name or 'SULALEGENDS'
  away: string
  homeGoals: number | null
  awayGoals: number | null
  played: boolean
}

export interface TGroup {
  id: string          // 'A'–'H'
  clubs: string[]     // exactly 4
}

export interface TStanding {
  club: string
  pts: number
  w: number
  d: number
  l: number
  gf: number
  ga: number
  gd: number
  played: number
}

export interface TTie {
  id: string
  phase: KOPhase
  clubA: string       // home leg 1 / away leg 2
  clubB: string       // away leg 1 / home leg 2
  leg1Id: string
  leg2Id: string
  aggA: number        // aggregate goals for clubA
  aggB: number
  winner: string | null
  needsPenalties?: boolean   // tied on aggregate + away goals — must go to a shootout
  penalties?: { a: number; b: number }
}

export interface LibertadoresTournament {
  phase: TPhase
  userClub: string
  groups: TGroup[]
  ties: TTie[]
  matches: Record<string, TMatch>
  champion: string | null
  nextUserMatchId: string | null
  // Stores "1º Gr.A", "2º Gr.B" for each qualified club
  seedings: Record<string, string>
  // Set when the user's own tie needs a penalty shootout — UI must show it
  // before the tournament can advance any further.
  pendingPenaltyTieId: string | null
}

// ── Helpers ───────────────────────────────────────────────────────────────────

let _mc = 0, _tc = 0
const mid  = () => `m${++_mc}`
const tid  = () => `t${++_tc}`

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function poisson(λ: number): number {
  const L = Math.exp(-λ); let k = 0, p = 1
  do { k++; p *= Math.random() } while (p > L)
  return k - 1
}

function clubOvr(name: string, userStr = 82): number {
  if (name === 'SULALEGENDS') return userStr
  const pl = DB[name]
  if (!pl?.length) return 77
  return pl.reduce((s, p) => s + p[2], 0) / pl.length
}

// ── AI vs AI simulation ───────────────────────────────────────────────────────

export function simAI(home: string, away: string, userStr = 82): { hg: number; ag: number } {
  const h = clubOvr(home, userStr)
  const a = clubOvr(away, userStr)
  // Tight coefficients → realistic 0-3 goal range, blowouts very rare
  const xgH = Math.max(0.35, Math.min(2.5, 1.15 + (h - a) * 0.05 + 0.1))
  const xgA = Math.max(0.35, Math.min(2.5, 0.9  + (a - h) * 0.05))
  return { hg: Math.min(poisson(xgH), 5), ag: Math.min(poisson(xgA), 5) }
}

// ── Group match schedule generation ──────────────────────────────────────────
// 4 teams: round-robin home + away = 12 matches, 6 matchdays

const ROUND_PAIRS: [number, number][][] = [
  [[0,1],[2,3]],   // matchday 1 / 4
  [[0,2],[1,3]],   // matchday 2 / 5
  [[0,3],[1,2]],   // matchday 3 / 6
]

function makeGroupMatch(groupId: string, home: string, away: string, md: number, leg: 1|2): TMatch {
  return { id: mid(), phase: 'groups', groupId, leg, matchday: md, home, away, homeGoals: null, awayGoals: null, played: false }
}

function createGroupMatches(groupId: string, clubs: string[]): TMatch[] {
  const all: TMatch[] = []
  ROUND_PAIRS.forEach((pairs, ri) => {
    pairs.forEach(([hi, ai]) => {
      // Leg 1 (ida): matchday 1-3
      all.push(makeGroupMatch(groupId, clubs[hi], clubs[ai], ri + 1, 1))
      // Leg 2 (volta): matchday 4-6 — home/away swapped
      all.push(makeGroupMatch(groupId, clubs[ai], clubs[hi], ri + 4, 2))
    })
  })
  return all
}

// ── Standings ─────────────────────────────────────────────────────────────────

export function computeStandings(clubs: string[], groupMatches: TMatch[]): TStanding[] {
  const s: Record<string, TStanding> = {}
  clubs.forEach(c => { s[c] = { club: c, pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, played: 0 } })

  for (const m of groupMatches) {
    if (!m.played || m.homeGoals == null || m.awayGoals == null) continue
    const h = s[m.home], a = s[m.away]
    if (!h || !a) continue
    h.gf += m.homeGoals; h.ga += m.awayGoals; h.played++
    a.gf += m.awayGoals; a.ga += m.homeGoals; a.played++
    if (m.homeGoals > m.awayGoals)      { h.w++; h.pts += 3; a.l++ }
    else if (m.homeGoals < m.awayGoals) { a.w++; a.pts += 3; h.l++ }
    else { h.d++; h.pts++; a.d++; a.pts++ }
  }

  return Object.values(s)
    .map(t => ({ ...t, gd: t.gf - t.ga }))
    .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)
}

// ── Knockout tie helpers ──────────────────────────────────────────────────────

function makeTie(phase: KOPhase, clubA: string, clubB: string, md1: number, md2: number): { tie: TTie; matches: TMatch[] } {
  const l1 = mid(), l2 = mid()
  const id = tid()
  const tie: TTie = { id, phase, clubA, clubB, leg1Id: l1, leg2Id: l2, aggA: 0, aggB: 0, winner: null }
  const matches: TMatch[] = [
    { id: l1, phase, tieId: id, leg: 1, matchday: md1, home: clubA, away: clubB, homeGoals: null, awayGoals: null, played: false },
    { id: l2, phase, tieId: id, leg: 2, matchday: md2, home: clubB, away: clubA, homeGoals: null, awayGoals: null, played: false },
  ]
  return { tie, matches }
}

/**
 * Resolve a tie from regulation result only (aggregate + away-goals).
 * If still level, marks `needsPenalties: true` and leaves winner null —
 * the caller decides whether to simulate instantly (AI) or show a shootout (user).
 *
 * NOTE: the away-goals rule does NOT apply to the Final, which is a single
 * match (leg2 is an artificial 0-0 placeholder) — a drawn final goes
 * straight to penalties.
 */
export function resolveTieRegulation(tie: TTie, m1: TMatch, m2: TMatch): TTie {
  const aggA = (m1.homeGoals ?? 0) + (m2.awayGoals ?? 0)   // clubA: home in leg1, away in leg2
  const aggB = (m1.awayGoals ?? 0) + (m2.homeGoals ?? 0)   // clubB: away in leg1, home in leg2

  if (aggA > aggB) return { ...tie, aggA, aggB, winner: tie.clubA, needsPenalties: false }
  if (aggB > aggA) return { ...tie, aggA, aggB, winner: tie.clubB, needsPenalties: false }

  if (tie.phase !== 'final') {
    const awayA = m2.awayGoals ?? 0   // clubA's goals scored away (in leg2)
    const awayB = m1.awayGoals ?? 0   // clubB's goals scored away (in leg1)
    if (awayA > awayB) return { ...tie, aggA, aggB, winner: tie.clubA, needsPenalties: false }
    if (awayB > awayA) return { ...tie, aggA, aggB, winner: tie.clubB, needsPenalties: false }
  }

  return { ...tie, aggA, aggB, winner: null, needsPenalties: true }
}

// ── Penalty shootout ──────────────────────────────────────────────────────────

export interface PenaltyKick {
  side: 'A' | 'B'
  scored: boolean
  index: number       // 1-based overall order
  scorer: string
}

export interface PenaltyShootoutResult {
  clubA: string
  clubB: string
  kicks: PenaltyKick[]
  winner: 'A' | 'B'
  scoreA: number
  scoreB: number
}

const CONVERSION_RATE = 0.78   // ~realistic pro conversion

/** Alternating-kick shootout: 5 rounds each, sudden death if still level,
 *  with early termination once a side can no longer be caught. */
export function simulatePenaltyShootout(
  clubA: string, clubB: string,
  namesA?: string[], namesB?: string[]
): PenaltyShootoutResult {
  const listA = namesA?.length ? namesA : (DB[clubA]?.map(p => p[0]) ?? ['Jogador'])
  const listB = namesB?.length ? namesB : (DB[clubB]?.map(p => p[0]) ?? ['Jogador'])

  const kicks: PenaltyKick[] = []
  let scoreA = 0, scoreB = 0, idx = 0
  let takenA = 0, takenB = 0

  function takeKick(side: 'A' | 'B') {
    idx++
    const scored = Math.random() < CONVERSION_RATE
    const pool = side === 'A' ? listA : listB
    const taken = side === 'A' ? takenA : takenB
    const scorer = pool[taken % pool.length]
    kicks.push({ side, scored, index: idx, scorer })
    if (side === 'A') { takenA++; if (scored) scoreA++ }
    else              { takenB++; if (scored) scoreB++ }
  }

  function decided(): boolean {
    const remA = 5 - takenA
    const remB = 5 - takenB
    return scoreA > scoreB + remB || scoreB > scoreA + remA
  }

  // Regulation: alternate A,B up to 5 kicks each, stop early once mathematically decided
  while (takenA < 5 || takenB < 5) {
    if (takenA <= takenB && takenA < 5) takeKick('A')
    else if (takenB < 5) takeKick('B')
    if (takenA >= 1 && takenB >= 1 && decided()) break
    if (takenA >= 5 && takenB >= 5) break
  }

  // Sudden death — pairs of kicks until one side is ahead after both have taken theirs
  let suddenRounds = 0
  while (scoreA === scoreB && suddenRounds < 20) {
    takeKick('A')
    takeKick('B')
    suddenRounds++
  }
  if (scoreA === scoreB) scoreA++ // safety: force a winner if RNG never breaks the tie

  const winner: 'A' | 'B' = scoreA > scoreB ? 'A' : 'B'
  return { clubA, clubB, kicks, winner, scoreA, scoreB }
}

// ── Tournament creation ───────────────────────────────────────────────────────

export function createLibertadores(): LibertadoresTournament {
  _mc = 0; _tc = 0

  const allClubs = Object.keys(DB)
  const shuffled = shuffle(allClubs).slice(0, 31)
  const all32   = shuffle(['SULALEGENDS', ...shuffled])

  const groups: TGroup[] = []
  const allMatches: Record<string, TMatch> = {}

  for (let g = 0; g < 8; g++) {
    const clubs = all32.slice(g * 4, (g + 1) * 4)
    const id = String.fromCharCode(65 + g)   // 'A'–'H'
    groups.push({ id, clubs })
    const gMatches = createGroupMatches(id, clubs)
    gMatches.forEach(m => { allMatches[m.id] = m })
  }

  const nextUserMatchId = findNextUserMatch(groups, allMatches, 'SULALEGENDS')

  return {
    phase: 'groups',
    userClub: 'SULALEGENDS',
    groups,
    ties: [],
    matches: allMatches,
    champion: null,
    nextUserMatchId,
    seedings: {},
    pendingPenaltyTieId: null,
  }
}

function findNextUserMatch(
  groups: TGroup[],
  matches: Record<string, TMatch>,
  user: string,
  ties?: TTie[]
): string | null {
  // Search group matches first, ordered by matchday
  const gms = Object.values(matches)
    .filter(m => m.phase === 'groups' && !m.played && (m.home === user || m.away === user))
    .sort((a, b) => a.matchday - b.matchday)
  if (gms.length) return gms[0].id

  // Then knockout
  if (!ties) return null
  for (const phase of ['r16','qf','sf','final'] as KOPhase[]) {
    const kms = (ties ?? [])
      .filter(t => t.phase === phase && !t.winner)
      .flatMap(t => [t.leg1Id, t.leg2Id])
      .map(id => matches[id])
      .filter(m => m && !m.played && (m.home === user || m.away === user))
      .sort((a, b) => a.matchday - b.matchday)
    if (kms.length) return kms[0].id
  }
  return null
}

// ── Shared phase-advancement loop ──────────────────────────────────────────────
// Used both right after a match result is applied, and after the user finishes
// watching a penalty shootout. Mutates local copies of matches/ties as it goes.

function advanceTournament(
  t: LibertadoresTournament,
  matches: Record<string, TMatch>,
  ties: TTie[],
  phase: TPhase,
  champion: string | null,
  groups: TGroup[],
  seedings: Record<string, string>,
  userStrength: number
): LibertadoresTournament {
  const user = t.userClub
  let safetyBreak = 0

  while (phase !== 'groups' && phase !== 'ended') {
    if (++safetyBreak > 20) break

    // Resolve any fully-played ties via regulation (aggregate + away goals)
    ties = ties.map(tie => {
      if (tie.winner || tie.needsPenalties) return tie
      const m1 = matches[tie.leg1Id], m2 = matches[tie.leg2Id]
      if (m1?.played && m2?.played) return resolveTieRegulation(tie, m1, m2)
      return tie
    })

    // Any tie level after regulation needs a shootout
    const pendingPK = ties.find(tt => tt.needsPenalties && !tt.winner)
    if (pendingPK) {
      if (pendingPK.clubA === user || pendingPK.clubB === user) {
        // User's own tie — pause here, UI must show the shootout
        return { ...t, matches, groups, ties, phase, champion, seedings, nextUserMatchId: null, pendingPenaltyTieId: pendingPK.id }
      }
      // AI vs AI — resolve instantly, nobody needs to watch it
      const shootout = simulatePenaltyShootout(pendingPK.clubA, pendingPK.clubB)
      const winner = shootout.winner === 'A' ? pendingPK.clubA : pendingPK.clubB
      ties = ties.map(tt => tt.id === pendingPK.id
        ? { ...tt, winner, penalties: { a: shootout.scoreA, b: shootout.scoreB }, needsPenalties: false }
        : tt)
      continue
    }

    // If current phase has unresolved ties, stop — user or AI still needs to play
    const currentTies = ties.filter(tt => tt.phase === phase)
    if (!currentTies.length || !currentTies.every(tt => tt.winner)) {
      const userHasMatch = Object.values(matches).some(
        m => m.phase === phase && !m.played && (m.home === user || m.away === user)
      )
      if (userHasMatch) break  // wait for user to play

      const toAuto = Object.values(matches).filter(
        m => m.phase === phase && !m.played && m.home !== user && m.away !== user
      )
      if (!toAuto.length) break
      for (const ai of toAuto) {
        const { hg, ag } = simAI(ai.home, ai.away, userStrength)
        matches[ai.id] = { ...ai, homeGoals: hg, awayGoals: ag, played: true }
      }
      continue
    }

    // All current-phase ties resolved → build next phase
    const nextResult = buildNextKOPhase(phase as KOPhase, ties, matches)
    if (!nextResult) break
    nextResult.matches.forEach(m => { matches[m.id] = m })
    ties = [...ties, ...nextResult.ties]
    phase = nextResult.phase
    if (phase === 'ended') {
      champion = ties.find(tt => tt.phase === 'final')?.winner ?? null
      break
    }

    const userInNewPhase = Object.values(matches).some(
      m => m.phase === phase && !m.played && (m.home === user || m.away === user)
    )
    if (userInNewPhase) break
  }

  const nextUserMatchId = findNextUserMatch(groups, matches, user, ties)
  return { ...t, matches, groups, ties, phase, champion, seedings, nextUserMatchId, pendingPenaltyTieId: null }
}

// ── Apply a match result ──────────────────────────────────────────────────────

export function applyMatchResult(
  t: LibertadoresTournament,
  matchId: string,
  homeGoals: number,
  awayGoals: number,
  userStrength: number
): LibertadoresTournament {
  if (!t.matches[matchId]) return t

  const matches = {
    ...t.matches,
    [matchId]: { ...t.matches[matchId], homeGoals, awayGoals, played: true },
  }

  let { groups, ties, phase, champion, seedings } = t

  const currentMatch = t.matches[matchId]
  const matchPhase   = currentMatch.phase
  const currentLeg   = currentMatch.leg

  // Auto-simulate AI matches:
  // • Groups: same matchday (all teams play the same round simultaneously)
  // • Knockout: same leg number across all ties (leg1 or leg2 of that phase)
  const toSim = Object.values(matches).filter(m => {
    if (m.played || m.home === 'SULALEGENDS' || m.away === 'SULALEGENDS') return false
    if (matchPhase === 'groups') return m.matchday === currentMatch.matchday && m.phase === 'groups'
    return m.phase === matchPhase && m.leg === currentLeg
  })
  for (const ai of toSim) {
    const { hg, ag } = simAI(ai.home, ai.away, userStrength)
    matches[ai.id] = { ...ai, homeGoals: hg, awayGoals: ag, played: true }
  }

  // Check if group stage is complete → unlock R16
  if (phase === 'groups') {
    const allGroupsPlayed = Object.values(matches).filter(m => m.phase === 'groups').every(m => m.played)
    if (allGroupsPlayed) {
      const r16 = buildR16(groups, matches)
      ties = r16.newTies
      r16.newMatches.forEach(m => { matches[m.id] = m })
      seedings = r16.seedings
      phase = 'r16'
    }
  }

  return advanceTournament(t, matches, ties, phase, champion, groups, seedings, userStrength)
}

/** Apply the result of a penalty shootout the user just watched, then resume
 *  advancing the tournament (may immediately surface another pending shootout
 *  in a rare back-to-back scenario, or continue building further rounds). */
export function resolvePenaltyShootoutForTie(
  t: LibertadoresTournament,
  tieId: string,
  winnerSide: 'A' | 'B',
  scoreA: number,
  scoreB: number,
  userStrength: number
): LibertadoresTournament {
  const tie = t.ties.find(tt => tt.id === tieId)
  if (!tie) return t

  const winner = winnerSide === 'A' ? tie.clubA : tie.clubB
  const ties = t.ties.map(tt => tt.id === tieId
    ? { ...tt, winner, penalties: { a: scoreA, b: scoreB }, needsPenalties: false }
    : tt)
  const matches = { ...t.matches }

  return advanceTournament(t, matches, ties, t.phase, t.champion, t.groups, t.seedings, userStrength)
}

// ── Build R16 from group results ──────────────────────────────────────────────

function buildR16(
  groups: TGroup[],
  matches: Record<string, TMatch>
): { newTies: TTie[]; newMatches: TMatch[]; seedings: Record<string, string> } {
  // 1st of each group faces 2nd of the paired group (never 1st vs 1st in R16)
  const qualifiers: Record<string, string> = {}
  const seedings: Record<string, string> = {}

  for (const g of groups) {
    const gMs = Object.values(matches).filter(m => m.groupId === g.id)
    const standings = computeStandings(g.clubs, gMs)
    const c1 = standings[0].club, c2 = standings[1].club
    qualifiers[`${g.id}1`] = c1
    qualifiers[`${g.id}2`] = c2
    seedings[c1] = `1º Gr.${g.id}`
    seedings[c2] = `2º Gr.${g.id}`
  }

  // Bracket: A1×B2, C1×D2, E1×F2, G1×H2, B1×A2, D1×C2, F1×E2, H1×G2
  const BRACKET: [string, string][] = [
    ['A1','B2'],['C1','D2'],['E1','F2'],['G1','H2'],
    ['B1','A2'],['D1','C2'],['F1','E2'],['H1','G2'],
  ]

  const newTies: TTie[] = []
  const newMatches: TMatch[] = []
  let md = 1
  for (const [kA, kB] of BRACKET) {
    const { tie, matches: tms } = makeTie('r16', qualifiers[kA], qualifiers[kB], md, md + 1)
    newTies.push(tie)
    newMatches.push(...tms)
    md += 2
  }
  return { newTies, newMatches, seedings }
}

// ── Build QF / SF / Final ─────────────────────────────────────────────────────

function buildNextKOPhase(
  current: KOPhase,
  allTies: TTie[],
  matches: Record<string, TMatch>
): { ties: TTie[]; matches: TMatch[]; phase: TPhase } | null {
  const next: KOPhase | 'ended' =
    current === 'r16' ? 'qf' : current === 'qf' ? 'sf' : current === 'sf' ? 'final' : 'ended'

  if (next === 'ended') return { ties: [], matches: [], phase: 'ended' }

  const winners = allTies.filter(t => t.phase === current && t.winner).map(t => t.winner!)

  const newTies: TTie[] = []
  const newMatches: TMatch[] = []
  let md = 1
  for (let i = 0; i < winners.length; i += 2) {
    const { tie, matches: tms } = makeTie(next as KOPhase, winners[i], winners[i + 1], md, md + 1)

    // Final is single-leg: pre-mark leg2 as 0-0 played so the tie resolves after leg1
    if (next === 'final') {
      const leg2 = tms.find(m => m.leg === 2)!
      leg2.homeGoals = 0
      leg2.awayGoals = 0
      leg2.played = true
    }

    newTies.push(tie)
    newMatches.push(...tms)
    md += 2
  }

  return { ties: newTies, matches: newMatches, phase: next as TPhase }
}

// ── Scorers from a club for match simulation ──────────────────────────────────

export function clubScorers(name: string): string[] {
  const pl = DB[name]
  if (!pl?.length) return ['Jogador']
  return pl
    .filter(p => ['ATA','PE','PD','MEI','MC'].includes(p[1]))
    .sort((a, b) => b[2] - a[2])
    .slice(0, 4)
    .map(p => p[0])
}

export function userTeamStrength(slots: GameState['slots']): number {
  if (!slots) return 80
  const ps = slots.map(s => s.player).filter(Boolean) as PlacedPlayer[]
  if (!ps.length) return 80
  return ps.reduce((s, p) => s + p.o, 0) / ps.length
}

export function userSquadNames(slots: GameState['slots']): string[] {
  if (!slots) return []
  const ps = slots.map(s => s.player).filter(Boolean) as PlacedPlayer[]
  return ps.map(p => p.n)
}
