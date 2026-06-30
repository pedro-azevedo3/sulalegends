import { DB, CPU_TEAMS } from '@/data/db'
import type { PlayerTuple, CpuTeam } from '@/data/db'

// ── Types ─────────────────────────────────────────────────────

export type Formation = '4-4-2' | '4-3-3' | '4-2-3-1' | '4-2-4' | '5-3-2' | '4-5-1' | '3-4-3'
export type Style = 'Defensivo' | 'Equilibrado' | 'Ofensivo'
export type Difficulty = 'Normal' | 'Difícil'
export type Screen = 'home' | 'config' | 'draft' | 'squad' | 'match' | 'result' | 'libertadores' | 'penalties'

export interface SlotDef {
  pos: string
  x: number  // left %
  y: number  // top %
}

export interface PlacedPlayer {
  n: string
  p: string    // natural position
  o: number    // overall
  fit: number
  club?: string // historical club e.g. "Santos 1963"
}

export interface Slot extends SlotDef {
  player: PlacedPlayer | null
}

export interface MatchEvent {
  team: 'p' | 'c'
  scorer: string
  teamName: string
  min: number
}

export interface Simulation {
  goalsP: number
  goalsC: number
  cpuName: string
  events: MatchEvent[]
}

export interface TournamentMatchCtx {
  matchId: string
  opponentClub: string
  isUserHome: boolean
  phaseLabel: string   // e.g. "Fase de Grupos · Jogo de Ida 1/3"
}

export interface PenaltyShootoutState {
  tieId: string
  clubA: string
  clubB: string
  isUserA: boolean   // is SULALEGENDS clubA in this tie?
  kicks: import('@/lib/tournament').PenaltyKick[]
  winnerSide: 'A' | 'B'
  finalScoreA: number
  finalScoreB: number
  revealedCount: number   // how many kicks have been revealed so far
  phaseLabel: string
}

export interface GameState {
  screen: Screen
  formation: Formation
  style: Style
  diff: Difficulty
  slots: Slot[] | null
  draftClub: string | null
  clubQueue: string[]   // pre-shuffled queue — never repeats
  rerolls: number
  chosen: string[]
  pending: PlayerTuple | null
  pendingSlot: number | null
  sim: Simulation | null
  currentMinute: number   // match clock — 0 to 90, goals only count when reached
  scoreP: number
  scoreC: number
  simDone: boolean
  // Libertadores
  libertadores: import('@/lib/tournament').LibertadoresTournament | null
  tournamentCtx: TournamentMatchCtx | null
  penaltyShootout: PenaltyShootoutState | null
  // Draft round state
  roundPicked: boolean
  // Match simulation speed (multiplier: 0.5, 1, 2, 4)
  simSpeed: number
}

// ── Formations [pos, x%, y%] ──────────────────────────────────

export const FORMATIONS: Record<Formation, [string, number, number][]> = {
  '4-4-2': [
    ['GOL',50,92],['LD',85,74],['ZAG',62,78],['ZAG',38,78],['LE',15,74],
    ['MD',85,48],['MC',62,50],['MC',38,50],['ME',15,48],['ATA',62,20],['ATA',38,20],
  ],
  '4-3-3': [
    ['GOL',50,92],['LD',85,74],['ZAG',64,78],['ZAG',36,78],['LE',15,74],
    ['VOL',50,55],['MC',72,46],['MC',28,46],['PD',82,22],['ATA',50,16],['PE',18,22],
  ],
  '4-2-3-1': [
    ['GOL',50,92],['LD',85,74],['ZAG',64,78],['ZAG',36,78],['LE',15,74],
    ['VOL',64,57],['VOL',36,57],['MD',82,38],['MEI',50,38],['ME',18,38],['ATA',50,15],
  ],
  '4-2-4': [
    ['GOL',50,92],['LD',85,74],['ZAG',64,78],['ZAG',36,78],['LE',15,74],
    ['MC',64,52],['MC',36,52],['PD',84,22],['ATA',60,17],['ATA',40,17],['PE',16,22],
  ],
  '5-3-2': [
    ['GOL',50,92],['LD',88,68],['ZAG',68,80],['ZAG',50,82],['ZAG',32,80],['LE',12,68],
    ['MC',70,50],['MC',50,52],['MC',30,50],['ATA',60,20],['ATA',40,20],
  ],
  '4-5-1': [
    ['GOL',50,92],['LD',85,74],['ZAG',64,78],['ZAG',36,78],['LE',15,74],
    ['MD',86,49],['MC',62,51],['MC',38,51],['ME',14,49],['MEI',50,33],['ATA',50,15],
  ],
  '3-4-3': [
    ['GOL',50,92],['ZAG',68,80],['ZAG',50,82],['ZAG',32,80],
    ['MD',86,53],['MC',62,53],['MC',38,53],['ME',14,53],['PD',82,22],['ATA',50,16],['PE',18,22],
  ],
}

export const POS_LABEL: Record<string, string> = {
  GOL:'Goleiro', ZAG:'Zagueiro', LD:'Lateral Direito', LE:'Lateral Esquerdo',
  VOL:'Volante', MC:'Meio-Campo', MD:'Meia Direita', ME:'Meia Esquerda',
  MEI:'Meia Atacante', PD:'Ponta Direita', PE:'Ponta Esquerda', ATA:'Atacante',
}

// Which slot positions each player position can fill
export const ELIGIBLE: Record<string, string[]> = {
  GOL:['GOL'], ZAG:['ZAG'], LD:['LD','MD'], LE:['LE','ME'],
  VOL:['VOL','MC','ZAG'], MC:['MC','VOL','MEI'],
  MEI:['MEI','MC','VOL'], MD:['MD','PD','LD'], ME:['ME','PE','LE'],
  PD:['PD','MD','ATA'], PE:['PE','ME','ATA'], ATA:['ATA','PD','PE'],
}

// Sector assignment
export const SECTOR: Record<string, 'def' | 'mid' | 'atk'> = {
  GOL:'def', ZAG:'def', LD:'def', LE:'def',
  VOL:'mid', MC:'mid', MD:'mid', ME:'mid',
  MEI:'atk', PD:'atk', PE:'atk', ATA:'atk',
}

const GROUP: Record<string, string> = {
  GOL:'g', ZAG:'d', LD:'fb', LE:'fb', VOL:'dm', MC:'cm',
  MEI:'cm', MD:'wm', ME:'wm', PD:'w', PE:'w', ATA:'a',
}
const ZONE: Record<string, string> = {
  g:'G', d:'D', fb:'D', dm:'M', cm:'M', wm:'M', w:'A', a:'A',
}

export function groupOf(pos: string) { return GROUP[pos] || 'x' }
export function zoneOf(pos: string)  { const g = groupOf(pos); return ZONE[g] || 'M' }

export function fit(playerPos: string, slotPos: string): number {
  if (playerPos === slotPos) return 1
  if (groupOf(playerPos) === groupOf(slotPos)) return 0.75
  if (zoneOf(playerPos) === zoneOf(slotPos)) return 0.5
  return 0.2
}

// ── State helpers ─────────────────────────────────────────────

export function buildSlots(formation: Formation): Slot[] {
  return FORMATIONS[formation].map(([pos, x, y]) => ({ pos, x, y, player: null }))
}

// ── Display name: strip disambiguation suffixes ───────────────
// e.g. "Pedro Flamengo" → "Pedro", "Bochini 72" → "Bochini"
export function cleanName(n: string): string {
  return n
    // single/double uppercase + optional digits: ' V', ' AP', ' BC', ' P87'
    .replace(/ [A-Z]{1,2}\d{0,2}$/, '')
    // standalone 2-digit year: ' 72', ' 97', ' 80'
    .replace(/ \d{2}$/, '')
    // known club/country suffixes
    .replace(/ (Flu|Atl|Grêmio|Flamengo|Cruzeiro|Caldas|Cruz|Vasco|Ceará|J\.S\.)$/, '')
    .trim()
}

export function fresh(): GameState {
  return {
    screen: 'home', formation: '4-3-3', style: 'Equilibrado', diff: 'Normal',
    slots: null, draftClub: null, clubQueue: [], rerolls: 2,
    chosen: [], pending: null, pendingSlot: null,
    sim: null, currentMinute: 0, scoreP: 0, scoreC: 0, simDone: false,
    libertadores: null, tournamentCtx: null, penaltyShootout: null,
    roundPicked: false,
    simSpeed: 1,
  }
}

export function randClub(except?: string | null): string {
  const keys = Object.keys(DB).filter(k => k !== except)
  return keys[Math.floor(Math.random() * keys.length)]
}

export function eligPos(playerPos: string): string[] {
  return ELIGIBLE[playerPos] || [playerPos]
}

export function eligibleOpenSlots(slots: Slot[], pl: PlayerTuple): number[] {
  const e = eligPos(pl[1])
  return slots.map((s, i) => (!s.player && e.includes(s.pos) ? i : -1)).filter(i => i >= 0)
}

export function openPosFor(slots: Slot[], pl: PlayerTuple): string[] {
  const e = eligPos(pl[1])
  const out: string[] = []
  slots.forEach(s => {
    if (!s.player && e.includes(s.pos) && !out.includes(s.pos)) out.push(s.pos)
  })
  return out
}

// ── Ratings ───────────────────────────────────────────────────

export interface Ratings {
  overall: number
  atk: number
  def: number
  atkRaw: number
  defRaw: number
  atkN: number
  defN: number
  naturalCount: number
}

export function ratings(slots: Slot[]): Ratings {
  const ps = slots.map(s => s.player).filter(Boolean) as PlacedPlayer[]
  const avg = ps.length ? ps.reduce((a, p) => a + p.o, 0) / ps.length : 0
  const naturalCount = ps.filter(p => p.fit >= 1).length
  const secAvg = (kind: string) => {
    const a = slots.filter(s => s.player && SECTOR[s.pos] === kind).map(s => s.player!.o)
    return { avg: a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0, n: a.length }
  }
  const D = secAvg('def'), A = secAvg('atk')
  return {
    overall: Math.round(avg), atk: Math.round(A.avg), def: Math.round(D.avg),
    atkRaw: A.avg, defRaw: D.avg, atkN: A.n, defN: D.n, naturalCount,
  }
}

// ── Match simulation ──────────────────────────────────────────

function poisson(lambda: number): number {
  const L = Math.exp(-lambda)
  let k = 0, p = 1
  do { k++; p *= Math.random() } while (p > L)
  return k - 1
}

const ATT_WEIGHT: Record<string, number> = {
  ATA:5, PD:4, PE:4, MEI:3.5, MD:3, ME:3, MC:2, VOL:1, LD:1.2, LE:1.2, ZAG:.8, GOL:.1,
}

const FORMATION_MOD: Record<Formation, [number, number]> = {
  '4-4-2':[0,0], '4-3-3':[2,-1], '4-2-3-1':[1,0],
  '4-2-4':[4,-3], '5-3-2':[-2,4], '4-5-1':[-1,2], '3-4-3':[3,-2],
}
const STYLE_MOD: Record<Style, [number, number]> = {
  'Defensivo':[-3,4], 'Equilibrado':[0,0], 'Ofensivo':[4,-3],
}

export interface SimulateOpts {
  cpuClub?: string      // Historical club name → use its actual strength + scorers
  cpuStrength?: number  // Override CPU base strength
}

export function simulate(state: GameState, opts?: SimulateOpts): Simulation {
  const r = ratings(state.slots!)
  const fm = FORMATION_MOD[state.formation]
  const sm = STYLE_MOD[state.style]
  const atkForce = r.atkRaw + fm[0] + sm[0]
  const defForce = r.defRaw + fm[1] + sm[1]

  // CPU identity and scorers
  let cpuName: string
  let cpuScorers: string[]
  if (opts?.cpuClub && DB[opts.cpuClub]) {
    cpuName = opts.cpuClub
    cpuScorers = DB[opts.cpuClub]
      .filter(p => ['ATA','PE','PD','MEI','MC'].includes(p[1]))
      .sort((a, b) => b[2] - a[2])
      .slice(0, 4)
      .map(p => p[0])
    if (!cpuScorers.length) cpuScorers = DB[opts.cpuClub].slice(0, 3).map(p => p[0])
  } else {
    const cpu = CPU_TEAMS[Math.floor(Math.random() * CPU_TEAMS.length)]
    cpuName = cpu.n
    cpuScorers = cpu.s
  }

  // CPU strength: from club average OR explicit override OR difficulty setting
  let cpuBase: number
  if (opts?.cpuStrength != null) {
    cpuBase = opts.cpuStrength + (Math.random() * 4 - 2)
  } else if (opts?.cpuClub && DB[opts.cpuClub]) {
    const pl = DB[opts.cpuClub]
    cpuBase = pl.reduce((s, p) => s + p[2], 0) / pl.length + (Math.random() * 4 - 2)
  } else {
    cpuBase = (state.diff === 'Difícil' ? 88 : 81) + (Math.random() * 4 - 2)
  }

  // Tighter coefficients → max ~2.5 xg → realistic scorelines (rarely > 4 goals)
  const xgP = Math.max(0.35, Math.min(2.5, 1.1 + (atkForce - cpuBase) * 0.05))
  const xgC = Math.max(0.35, Math.min(2.5, 0.9 + (cpuBase - defForce) * 0.05))

  let gP = Math.min(poisson(xgP), 5)
  let gC = Math.min(poisson(xgC), 5)

  const ps = state.slots!.map(s => s.player).filter(Boolean) as PlacedPlayer[]
  const pickP = (): string => {
    const w = ps.map(p => (ATT_WEIGHT[p.p] || 1) * p.o)
    let rr = Math.random() * w.reduce((a, b) => a + b, 0)
    for (let i = 0; i < ps.length; i++) { rr -= w[i]; if (rr <= 0) return ps[i].n }
    return ps[ps.length - 1].n
  }

  const events: MatchEvent[] = []
  for (let i = 0; i < gP; i++) events.push({ team: 'p', scorer: pickP(), teamName: 'SULALEGENDS', min: 0 })
  for (let i = 0; i < gC; i++) events.push({ team: 'c', scorer: cpuScorers[Math.floor(Math.random() * cpuScorers.length)], teamName: cpuName, min: 0 })

  const used = new Set<number>()
  events.forEach(e => {
    let m: number
    do { m = 1 + Math.floor(Math.random() * 90) } while (used.has(m))
    used.add(m)
    e.min = m
  })
  events.sort((a, b) => a.min - b.min)

  return { goalsP: gP, goalsC: gC, cpuName, events }
}
