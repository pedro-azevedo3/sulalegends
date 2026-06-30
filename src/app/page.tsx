'use client'

import { useMemo } from 'react'
import { useGame } from '@/hooks/useGame'
import { buildSlots } from '@/lib/game'
import HomeScreen        from '@/components/screens/HomeScreen'
import ConfigScreen      from '@/components/screens/ConfigScreen'
import DraftScreen       from '@/components/screens/DraftScreen'
import SquadScreen       from '@/components/screens/SquadScreen'
import MatchScreen       from '@/components/screens/MatchScreen'
import ResultScreen      from '@/components/screens/ResultScreen'
import TournamentScreen  from '@/components/screens/TournamentScreen'
import PenaltiesScreen   from '@/components/screens/PenaltiesScreen'
import type { SlotView } from '@/hooks/useGame'

const STEP_LABEL: Record<string, string> = {
  config: 'Montar Time', draft: 'Sorteio', squad: 'Escalação',
  match: 'Partida', result: 'Resultado', libertadores: 'Libertadores', penalties: 'Pênaltis',
}

export default function GamePage() {
  const { state, actions, slotViews } = useGame()
  const { screen } = state

  const slots: SlotView[] = useMemo(() => {
    if (screen === 'config') {
      return buildSlots(state.formation).map(s => ({
        pos: s.pos, x: s.x, y: s.y, filled: false, empty: true,
        player: null, preview: false, selectable: false, dimmed: false, onSelect: null,
      }))
    }
    if (state.slots) return slotViews(state)
    return []
  }, [state, screen, slotViews])

  // Finish match handler — routes differently based on context
  function handleFinishMatch() {
    if (state.tournamentCtx) actions.finishTournamentMatch()
    else actions.finishMatch()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(120% 90% at 50% -10%, #11301f 0%, #0a1711 45%, #060c09 100%)',
      fontFamily: "'Barlow',sans-serif", color: '#eafff0',
      display: 'flex', flexDirection: 'column', alignItems: 'stretch',
    }}>
      {/* Top bar */}
      {screen !== 'home' && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
          padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,.07)',
          background: 'rgba(6,12,9,.6)', backdropFilter: 'blur(8px)',
          position: 'sticky', top: 0, zIndex: 20,
        }}>
          <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 22, letterSpacing: 1, background: 'linear-gradient(135deg,#fbe08a,#e0b54a)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            SULALEGENDS
          </div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600, fontSize: 13, color: '#9fd9b6', textTransform: 'uppercase', letterSpacing: 1, background: 'rgba(46,227,122,.1)', padding: '5px 12px', borderRadius: 999, border: '1px solid rgba(46,227,122,.25)' }}>
            {STEP_LABEL[screen] || ''}
          </div>
          <button onClick={actions.restart} style={{ background: 'rgba(255,255,255,.06)', color: '#eafff0', border: '1px solid rgba(255,255,255,.14)', padding: '8px 14px', borderRadius: 9, fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            Reiniciar
          </button>
        </div>
      )}

      {/* Screens */}
      {screen === 'home'         && <HomeScreen onPlay={actions.goToConfig} />}
      {screen === 'config'       && (
        <ConfigScreen state={state} previewSlots={slots}
          onFormation={actions.selectFormation} onStyle={actions.setStyle}
          onDiff={actions.setDiff} onStart={actions.goToDraft} />
      )}
      {screen === 'draft'        && (
        <DraftScreen state={state} slots={slots}
          onSlotClick={actions.chooseSlot}
          onTapPlayer={actions.tapPlayer}
          onCancel={actions.cancelPlacement}
          onAdvanceTeam={actions.advanceToNextTeam} />
      )}
      {screen === 'squad'        && <SquadScreen state={state} slots={slots} onPlay={actions.enterLibertadores} />}
      {screen === 'match'        && (
        <MatchScreen
          state={state}
          onSkip={actions.skipReveal}
          onFinish={handleFinishMatch}
          onNextMatch={state.tournamentCtx ? actions.continueToNextMatch : undefined}
          onSetSpeed={actions.setSimSpeed}
        />
      )}
      {screen === 'result'       && <ResultScreen state={state} onPlayAgain={actions.goToConfig} onHome={actions.home} />}
      {screen === 'penalties'    && (
        <PenaltiesScreen
          state={state}
          onSkip={actions.skipPenaltiesReveal}
          onFinish={actions.finishPenalties}
          onNextMatch={actions.continuePenaltiesNextMatch}
        />
      )}
      {screen === 'libertadores' && state.libertadores && (
        <TournamentScreen
          tournament={state.libertadores}
          squad={state.slots ?? []}
          onPlayMatch={actions.startTournamentMatch}
          onPlayAgain={actions.goToConfig}
          onHome={actions.home}
        />
      )}
    </div>
  )
}
