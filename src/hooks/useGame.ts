'use client'

import { useState, useRef, useCallback } from 'react'
import { DB } from '@/data/db'
import type { PlayerTuple } from '@/data/db'
import {
  type GameState, type Formation, type Style, type Difficulty, type Slot,
  fresh, buildSlots, randClub, eligibleOpenSlots, openPosFor, fit, simulate,
  POS_LABEL,
} from '@/lib/game'
import {
  createLibertadores, applyMatchResult, userTeamStrength,
  type LibertadoresTournament,
} from '@/lib/tournament'

export function useGame() {
  const [state, setState] = useState<GameState>(fresh)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }, [])

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
    setState(prev => {
      if (!prev.libertadores) return prev
      const match = prev.libertadores.matches[matchId]
      if (!match) return prev

      const opponentClub = match.home === 'SULALEGENDS' ? match.away : match.home
      const isUserHome   = match.home === 'SULALEGENDS'

      const sim = simulate(prev, { cpuClub: opponentClub })

      clearTimer()
      const initSt: GameState = {
        ...prev,
        screen: 'match',
        sim,
        revealIdx: 0,
        scoreP: 0,
        scoreC: 0,
        simDone: sim.events.length === 0,
        tournamentCtx: { matchId, opponentClub, isUserHome },
      }

      if (sim.events.length > 0) {
        setTimeout(() => {
          timerRef.current = setInterval(() => {
            setState(st => {
              if (!st.sim) return st
              const i = st.revealIdx
              if (i >= st.sim.events.length) { clearTimer(); return { ...st, simDone: true } }
              const e = st.sim.events[i]
              const done = i + 1 >= st.sim.events.length
              if (done) clearTimer()
              return {
                ...st, revealIdx: i + 1,
                scoreP: st.scoreP + (e.team === 'p' ? 1 : 0),
                scoreC: st.scoreC + (e.team === 'c' ? 1 : 0),
                simDone: done,
              }
            })
          }, 1150)
        }, 0)
      }
      return initSt
    })
  }, [clearTimer])

  // ── Finish tournament match → apply result → back to bracket ──
  const finishTournamentMatch = useCallback(() => {
    setState(prev => {
      if (!prev.tournamentCtx || !prev.libertadores) return { ...prev, screen: 'result' }
      const { matchId, isUserHome } = prev.tournamentCtx
      const homeGoals = isUserHome ? prev.scoreP : prev.scoreC
      const awayGoals = isUserHome ? prev.scoreC : prev.scoreP
      const updated = applyMatchResult(prev.libertadores, matchId, homeGoals, awayGoals, userTeamStrength(prev.slots))
      return { ...prev, screen: 'libertadores', libertadores: updated, tournamentCtx: null }
    })
  }, [])

  // ── "Próximo Jogo" — apply result then immediately start next match ──
  const continueToNextMatch = useCallback(() => {
    clearTimer()
    setState(prev => {
      if (!prev.tournamentCtx || !prev.libertadores) return { ...prev, screen: 'libertadores' }

      const { matchId, isUserHome } = prev.tournamentCtx
      const homeGoals = isUserHome ? prev.scoreP : prev.scoreC
      const awayGoals = isUserHome ? prev.scoreC : prev.scoreP
      const updated = applyMatchResult(prev.libertadores, matchId, homeGoals, awayGoals, userTeamStrength(prev.slots))

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

      // Start timer after React commits
      if (sim.events.length > 0) {
        setTimeout(() => {
          timerRef.current = setInterval(() => {
            setState(st => {
              if (!st.sim) return st
              const i = st.revealIdx
              if (i >= st.sim.events.length) { clearTimer(); return { ...st, simDone: true } }
              const e = st.sim.events[i]
              const done = i + 1 >= st.sim.events.length
              if (done) clearTimer()
              return {
                ...st, revealIdx: i + 1,
                scoreP: st.scoreP + (e.team === 'p' ? 1 : 0),
                scoreC: st.scoreC + (e.team === 'c' ? 1 : 0),
                simDone: done,
              }
            })
          }, 1150)
        }, 0)
      }

      return {
        ...prev,
        libertadores: updated,
        screen: 'match',
        sim,
        revealIdx: 0, scoreP: 0, scoreC: 0,
        simDone: sim.events.length === 0,
        tournamentCtx: { matchId: nextId, opponentClub: opponent, isUserHome: nextIsHome },
      }
    })
  }, [clearTimer])

  // ── Standalone match flow (non-tournament) ─────────────────────
  const playMatch = useCallback(() => {
    setState(prev => {
      const sim = simulate(prev)
      clearTimer()
      const initSt: GameState = { ...prev, screen: 'match', sim, revealIdx: 0, scoreP: 0, scoreC: 0, simDone: sim.events.length === 0, tournamentCtx: null }
      if (sim.events.length > 0) {
        setTimeout(() => {
          timerRef.current = setInterval(() => {
            setState(st => {
              if (!st.sim) return st
              const i = st.revealIdx
              if (i >= st.sim.events.length) { clearTimer(); return { ...st, simDone: true } }
              const e = st.sim.events[i]
              const done = i + 1 >= st.sim.events.length
              if (done) clearTimer()
              return { ...st, revealIdx: i + 1, scoreP: st.scoreP + (e.team === 'p' ? 1 : 0), scoreC: st.scoreC + (e.team === 'c' ? 1 : 0), simDone: done }
            })
          }, 1150)
        }, 0)
      }
      return initSt
    })
  }, [clearTimer])

  const skipReveal    = useCallback(() => { clearTimer(); setState(prev => !prev.sim ? prev : ({ ...prev, revealIdx: prev.sim.events.length, scoreP: prev.sim.goalsP, scoreC: prev.sim.goalsC, simDone: true })) }, [clearTimer])
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
      playMatch, skipReveal, finishMatch,
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
