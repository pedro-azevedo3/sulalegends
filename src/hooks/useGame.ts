'use client'

import { useState, useRef, useCallback } from 'react'
import { DB } from '@/data/db'
import type { PlayerTuple } from '@/data/db'
import {
  type GameState, type Formation, type Style, type Difficulty, type Slot,
  type PenaltyShootoutState,
  fresh, buildSlots, randClub, eligibleOpenSlots, openPosFor, fit, simulate, cleanName,
  POS_LABEL,
} from '@/lib/game'
import {
  createLibertadores, applyMatchResult, resolvePenaltyShootoutForTie,
  simulatePenaltyShootout, userTeamStrength, userSquadNames,
  type LibertadoresTournament, type TMatch, type KOPhase,
} from '@/lib/tournament'

// ── Phase label helpers ──────────────────────────────────────────
function getPhaseLabel(match: TMatch): string {
  if (match.phase === 'groups') {
    const round = match.leg === 1 ? match.matchday : match.matchday - 3
    const leg = match.leg === 1 ? 'Ida' : 'Volta'
    return `Fase de Grupos · Jogo de ${leg} ${round}/3`
  }
  if (match.phase === 'final') return 'Final'
  const names: Record<string, string> = {
    r16: 'Oitavas de Final', qf: 'Quartas de Final', sf: 'Semifinais',
  }
  const leg = match.leg === 1 ? 'Jogo de Ida' : 'Jogo de Volta'
  return `${names[match.phase] ?? match.phase} · ${leg}`
}

const KO_PHASE_NAMES: Record<KOPhase, string> = {
  r16: 'Oitavas de Final', qf: 'Quartas de Final', sf: 'Semifinais', final: 'Final',
}

/** Builds the full shootout (all kicks pre-simulated) for the user's tie,
 *  using the user's actual squad names on their side. */
function buildPenaltyShootoutState(
  tournament: LibertadoresTournament,
  tieId: string,
  userSlots: GameState['slots']
): PenaltyShootoutState {
  const tie = tournament.ties.find(t => t.id === tieId)!
  const isUserA = tie.clubA === 'SULALEGENDS'
  const userNames = userSquadNames(userSlots).map(cleanName)
  const result = simulatePenaltyShootout(
    tie.clubA, tie.clubB,
    isUserA ? userNames : undefined,
    !isUserA ? userNames : undefined,
  )
  return {
    tieId: tie.id, clubA: tie.clubA, clubB: tie.clubB, isUserA,
    kicks: result.kicks, winnerSide: result.winner,
    finalScoreA: result.scoreA, finalScoreB: result.scoreB,
    revealedCount: 0,
    phaseLabel: `Pênaltis · ${KO_PHASE_NAMES[tie.phase]}`,
  }
}

export function useGame() {
  const [state, setState] = useState<GameState>(fresh)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const speedRef = useRef(1)

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }, [])

  // Shared sim tick — advances the match clock by 1 minute.
  // Goals only count once the clock reaches that exact minute.
  const simTick = useCallback(() => {
    setState(st => {
      if (!st.sim || st.simDone) return st
      const nextMinute = st.currentMinute + 1
      const eventsThisMinute = st.sim.events.filter(e => e.min === nextMinute)
      const scoreP = st.scoreP + eventsThisMinute.filter(e => e.team === 'p').length
      const scoreC = st.scoreC + eventsThisMinute.filter(e => e.team === 'c').length
      const done = nextMinute >= 90
      if (done) clearTimer()
      return { ...st, currentMinute: nextMinute, scoreP, scoreC, simDone: done }
    })
  }, [clearTimer])

  // Base 150ms per matchminute at 1x → full 90' match in ~13.5s
  const startSimTimer = useCallback((speed?: number) => {
    if (speed !== undefined) speedRef.current = speed
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(simTick, Math.round(150 / speedRef.current))
  }, [simTick])

  const setSimSpeed = useCallback((speed: number) => {
    speedRef.current = speed
    setState(prev => ({ ...prev, simSpeed: speed }))
    if (timerRef.current !== null) startSimTimer(speed)
  }, [startSimTimer])

  // Penalty shootout reveal — one kick at a time, alternating, fixed pace
  const penaltyTick = useCallback(() => {
    setState(st => {
      if (!st.penaltyShootout) { clearTimer(); return st }
      const total = st.penaltyShootout.kicks.length
      const next = st.penaltyShootout.revealedCount + 1
      const done = next >= total
      if (done) clearTimer()
      return { ...st, penaltyShootout: { ...st.penaltyShootout, revealedCount: next } }
    })
  }, [clearTimer])

  const startPenaltyTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(penaltyTick, 750)
  }, [penaltyTick])

  // ── Navigation ────────────────────────────────────────────────
  const home      = useCallback(() => { clearTimer(); setState(fresh()) }, [clearTimer])
  const restart   = useCallback(() => { clearTimer(); setState(fresh()) }, [clearTimer])

  const goToConfig = useCallback(() => {
    clearTimer()
    setState(prev => ({ ...fresh(), screen: 'config', formation: prev.formation, style: prev.style, diff: prev.diff }))
  }, [clearTimer])

  const goToDraft = useCallback(() => {
    // Shuffle ALL clubs once → strict queue, zero repeats
    const shuffled = Object.keys(DB).sort(() => Math.random() - 0.5)
    setState(prev => ({
      ...prev, screen: 'draft',
      slots: buildSlots(prev.formation), rerolls: 2,
      draftClub: shuffled[0],
      clubQueue: shuffled.slice(1),
      chosen: [], pending: null, pendingSlot: null,
    }))
  }, [])

  // ── Config ────────────────────────────────────────────────────
  const selectFormation = useCallback((f: Formation) => {
    setState(prev => ({ ...prev, formation: f, slots: prev.screen === 'config' ? buildSlots(f) : prev.slots }))
  }, [])
  const setStyle = useCallback((s: Style)     => setState(prev => ({ ...prev, style: s })), [])
  const setDiff  = useCallback((d: Difficulty) => setState(prev => ({ ...prev, diff: d })), [])

  // ── Draft ─────────────────────────────────────────────────────
  const reroll = useCallback(() => {
    setState(prev => {
      if (prev.rerolls <= 0 || !prev.clubQueue.length) return prev
      const [next, ...rest] = prev.clubQueue
      return { ...prev, draftClub: next, clubQueue: rest, rerolls: prev.rerolls - 1 }
    })
  }, [])

  // ── Place player in slot ───────────────────────────────────────
  function assignPlayer(prev: GameState, pl: PlayerTuple, idx: number, keepInChosen = false): GameState {
    if (!prev.slots) return prev
    const slots: Slot[] = prev.slots.map(s => ({ ...s }))
    if (slots[idx].player) return prev
    slots[idx].player = { n: pl[0], p: pl[1], o: pl[2], fit: fit(pl[1], slots[idx].pos), club: prev.draftClub ?? undefined }
    const chosen = keepInChosen ? prev.chosen : [...prev.chosen, pl[0]]
    const allFilled = slots.findIndex(s => !s.player) < 0
    if (allFilled) return { ...prev, slots, chosen, pending: null, pendingSlot: null, screen: 'squad', roundPicked: false }
    // Elenco some — só o "Próximo Time" avança
    return { ...prev, slots, chosen, pending: null, pendingSlot: null, roundPicked: true }
  }

  const tapPlayer = useCallback((pl: PlayerTuple) => {
    setState(prev => {
      if (!prev.slots) return prev
      const eligible = eligibleOpenSlots(prev.slots, pl)
      if (!eligible.length) return prev
      // Sempre destaca o campo — usuário clica na posição para escalar
      return { ...prev, pending: pl, pendingSlot: null }
    })
  }, [])

  const chooseSlot = useCallback((idx: number) => {
    setState(prev => {
      if (!prev.pending || !prev.slots) return prev
      if (prev.slots[idx].player || !eligibleOpenSlots(prev.slots, prev.pending).includes(idx)) return prev
      return assignPlayer(prev, prev.pending, idx)
    })
  }, [])

  const cancelPlacement = useCallback(() => setState(prev => ({ ...prev, pending: null, pendingSlot: null })), [])

  // ── "Próximo Time" / "Pular" ───────────────────────────────────
  // After placing (roundPicked=true): always allowed (mandatory advance, no cost)
  // Before placing  (roundPicked=false): costs 1 reroll — max 2 per game
  const advanceToNextTeam = useCallback(() => {
    setState(prev => {
      if (!prev.roundPicked && prev.rerolls <= 0) return prev   // no rerolls left
      const [nextClub, ...restQueue] = prev.clubQueue
      return {
        ...prev,
        draftClub: nextClub ?? randClub(),
        clubQueue: restQueue,
        pending: null, pendingSlot: null,
        roundPicked: false,
        rerolls: prev.roundPicked ? prev.rerolls : prev.rerolls - 1,
      }
    })
  }, [])

  // ── Libertadores launch ───────────────────────────────────────
  const enterLibertadores = useCallback(() => {
    setState(prev => ({
      ...prev,
      screen: 'libertadores',
      libertadores: createLibertadores(),
    }))
  }, [])

  // ── Start a tournament match (user clicks JOGAR) ──────────────
  const startTournamentMatch = useCallback((matchId: string) => {
    clearTimer()
    setState(prev => {
      if (!prev.libertadores) return prev
      const match = prev.libertadores.matches[matchId]
      if (!match) return prev
      const opponentClub = match.home === 'SULALEGENDS' ? match.away : match.home
      const isUserHome   = match.home === 'SULALEGENDS'
      const sim = simulate(prev, { cpuClub: opponentClub })
      setTimeout(() => startSimTimer(), 0)
      return {
        ...prev, screen: 'match', sim,
        currentMinute: 0, scoreP: 0, scoreC: 0, simDone: false,
        tournamentCtx: { matchId, opponentClub, isUserHome, phaseLabel: getPhaseLabel(match) },
      }
    })
  }, [clearTimer, startSimTimer])

  // ── Finish tournament match → apply result → bracket OR penalties ──
  const finishTournamentMatch = useCallback(() => {
    clearTimer()
    setState(prev => {
      if (!prev.tournamentCtx || !prev.libertadores) return { ...prev, screen: 'result' }
      const { matchId, isUserHome } = prev.tournamentCtx
      const homeGoals = isUserHome ? prev.scoreP : prev.scoreC
      const awayGoals = isUserHome ? prev.scoreC : prev.scoreP
      const updated = applyMatchResult(prev.libertadores, matchId, homeGoals, awayGoals, userTeamStrength(prev.slots))

      if (updated.pendingPenaltyTieId) {
        const shootout = buildPenaltyShootoutState(updated, updated.pendingPenaltyTieId, prev.slots)
        setTimeout(() => startPenaltyTimer(), 0)
        return { ...prev, libertadores: updated, screen: 'penalties', tournamentCtx: null, penaltyShootout: shootout }
      }

      return { ...prev, screen: 'libertadores', libertadores: updated, tournamentCtx: null }
    })
  }, [clearTimer, startPenaltyTimer])

  // ── "Próximo Jogo" — apply result then immediately start next match (or penalties) ──
  const continueToNextMatch = useCallback(() => {
    clearTimer()
    setState(prev => {
      if (!prev.tournamentCtx || !prev.libertadores) return { ...prev, screen: 'libertadores' }

      const { matchId, isUserHome } = prev.tournamentCtx
      const homeGoals = isUserHome ? prev.scoreP : prev.scoreC
      const awayGoals = isUserHome ? prev.scoreC : prev.scoreP
      const updated = applyMatchResult(prev.libertadores, matchId, homeGoals, awayGoals, userTeamStrength(prev.slots))

      if (updated.pendingPenaltyTieId) {
        const shootout = buildPenaltyShootoutState(updated, updated.pendingPenaltyTieId, prev.slots)
        setTimeout(() => startPenaltyTimer(), 0)
        return { ...prev, libertadores: updated, screen: 'penalties', tournamentCtx: null, penaltyShootout: shootout }
      }

      // No next user match → go to tournament screen
      const nextId = updated.nextUserMatchId
      if (!nextId || !updated.matches[nextId]) {
        return { ...prev, libertadores: updated, screen: 'libertadores', tournamentCtx: null }
      }

      // Set up next match immediately
      const nextMatch = updated.matches[nextId]
      const opponent   = nextMatch.home === 'SULALEGENDS' ? nextMatch.away : nextMatch.home
      const nextIsHome = nextMatch.home === 'SULALEGENDS'
      const sim = simulate(prev, { cpuClub: opponent })
      setTimeout(() => startSimTimer(), 0)

      return {
        ...prev,
        libertadores: updated, screen: 'match', sim,
        currentMinute: 0, scoreP: 0, scoreC: 0, simDone: false,
        tournamentCtx: { matchId: nextId, opponentClub: opponent, isUserHome: nextIsHome, phaseLabel: getPhaseLabel(nextMatch) },
      }
    })
  }, [clearTimer, startSimTimer, startPenaltyTimer])

  // ── Penalties: skip reveal → show all kicks instantly ──────────
  const skipPenaltiesReveal = useCallback(() => {
    clearTimer()
    setState(prev => !prev.penaltyShootout ? prev : ({
      ...prev,
      penaltyShootout: { ...prev.penaltyShootout, revealedCount: prev.penaltyShootout.kicks.length },
    }))
  }, [clearTimer])

  // ── Penalties: "Ver Tabela" — apply tie result → back to bracket ──
  const finishPenalties = useCallback(() => {
    clearTimer()
    setState(prev => {
      if (!prev.penaltyShootout || !prev.libertadores) return { ...prev, screen: 'libertadores', penaltyShootout: null }
      const { tieId, winnerSide, finalScoreA, finalScoreB } = prev.penaltyShootout
      const updated = resolvePenaltyShootoutForTie(prev.libertadores, tieId, winnerSide, finalScoreA, finalScoreB, userTeamStrength(prev.slots))
      return { ...prev, screen: 'libertadores', libertadores: updated, penaltyShootout: null }
    })
  }, [clearTimer])

  // ── Penalties: "Próximo Jogo" — apply tie result then continue ──
  const continuePenaltiesNextMatch = useCallback(() => {
    clearTimer()
    setState(prev => {
      if (!prev.penaltyShootout || !prev.libertadores) return { ...prev, screen: 'libertadores', penaltyShootout: null }
      const { tieId, winnerSide, finalScoreA, finalScoreB } = prev.penaltyShootout
      const updated = resolvePenaltyShootoutForTie(prev.libertadores, tieId, winnerSide, finalScoreA, finalScoreB, userTeamStrength(prev.slots))

      // Rare back-to-back shootout (e.g. user's next tie is also instantly level — won't
      // actually happen since legs must be played first, but handled defensively)
      if (updated.pendingPenaltyTieId) {
        const shootout = buildPenaltyShootoutState(updated, updated.pendingPenaltyTieId, prev.slots)
        setTimeout(() => startPenaltyTimer(), 0)
        return { ...prev, libertadores: updated, screen: 'penalties', penaltyShootout: shootout }
      }

      const nextId = updated.nextUserMatchId
      if (!nextId || !updated.matches[nextId]) {
        return { ...prev, libertadores: updated, screen: 'libertadores', penaltyShootout: null }
      }

      const nextMatch = updated.matches[nextId]
      const opponent   = nextMatch.home === 'SULALEGENDS' ? nextMatch.away : nextMatch.home
      const nextIsHome = nextMatch.home === 'SULALEGENDS'
      const sim = simulate(prev, { cpuClub: opponent })
      setTimeout(() => startSimTimer(), 0)

      return {
        ...prev,
        libertadores: updated, screen: 'match', sim, penaltyShootout: null,
        currentMinute: 0, scoreP: 0, scoreC: 0, simDone: false,
        tournamentCtx: { matchId: nextId, opponentClub: opponent, isUserHome: nextIsHome, phaseLabel: getPhaseLabel(nextMatch) },
      }
    })
  }, [clearTimer, startSimTimer, startPenaltyTimer])

  // ── Standalone match flow (non-tournament) ─────────────────────
  const playMatch = useCallback(() => {
    clearTimer()
    setState(prev => {
      const sim = simulate(prev)
      setTimeout(() => startSimTimer(), 0)
      return { ...prev, screen: 'match', sim, currentMinute: 0, scoreP: 0, scoreC: 0, simDone: false, tournamentCtx: null }
    })
  }, [clearTimer, startSimTimer])

  const skipReveal = useCallback(() => {
    clearTimer()
    setState(prev => !prev.sim ? prev : ({ ...prev, currentMinute: 90, scoreP: prev.sim.goalsP, scoreC: prev.sim.goalsC, simDone: true }))
  }, [clearTimer])
  const finishMatch   = useCallback(() => setState(prev => ({ ...prev, screen: 'result' })), [])

  home; restart // keep references live

  // ── Derived slot views ─────────────────────────────────────────
  function slotViews(s: GameState): SlotView[] {
    if (!s.slots) return []
    const { slots, pending, pendingSlot } = s
    const eligIdx = pending ? eligibleOpenSlots(slots, pending) : []
    return slots.map((slot, idx): SlotView => {
      if (slot.player) {
        return { pos: slot.pos, x: slot.x, y: slot.y, filled: true, empty: false, player: slot.player, preview: pending != null && idx === pendingSlot, selectable: false, dimmed: false, onSelect: null }
      }
      if (pending != null && idx === pendingSlot) {
        return { pos: slot.pos, x: slot.x, y: slot.y, filled: true, empty: false, player: { n: pending[0], p: pending[1], o: pending[2], fit: 1 }, preview: true, selectable: false, dimmed: false, onSelect: null }
      }
      const selectable = pending != null && eligIdx.includes(idx)
      return { pos: slot.pos, x: slot.x, y: slot.y, filled: false, empty: true, player: null, preview: false, selectable, dimmed: pending != null && !selectable, onSelect: selectable ? idx : null }
    })
  }

  return {
    state,
    actions: {
      home, restart, goToConfig, goToDraft,
      selectFormation, setStyle, setDiff,
      reroll, tapPlayer, chooseSlot, cancelPlacement, advanceToNextTeam,
      enterLibertadores,
      startTournamentMatch, finishTournamentMatch, continueToNextMatch,
      playMatch, skipReveal, finishMatch, setSimSpeed,
      skipPenaltiesReveal, finishPenalties, continuePenaltiesNextMatch,
    },
    slotViews,
  }
}

export interface SlotView {
  pos: string
  x: number
  y: number
  filled: boolean
  empty: boolean
  player: import('@/lib/game').PlacedPlayer | null
  preview: boolean
  selectable: boolean
  dimmed: boolean
  onSelect: number | null
}
