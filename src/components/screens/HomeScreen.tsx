'use client'

import Pitch from '@/components/Pitch'
import type { SlotView } from '@/hooks/useGame'

// Dream team preview: 4-3-3 with legends
const PREVIEW: SlotView[] = [
  { pos:'GOL', x:50, y:92, filled:true, empty:false, preview:false, selectable:false, dimmed:false, onSelect:null,
    player:{ n:'Chilavert',      p:'GOL', o:89, fit:1, club:'Vélez Sársfield 1994' } },
  { pos:'LD',  x:85, y:74, filled:true, empty:false, preview:false, selectable:false, dimmed:false, onSelect:null,
    player:{ n:'Cafu',           p:'LD',  o:88, fit:1, club:'São Paulo 1993' } },
  { pos:'ZAG', x:64, y:78, filled:true, empty:false, preview:false, selectable:false, dimmed:false, onSelect:null,
    player:{ n:'Ruggeri',        p:'ZAG', o:86, fit:1, club:'River Plate 1986' } },
  { pos:'ZAG', x:36, y:78, filled:true, empty:false, preview:false, selectable:false, dimmed:false, onSelect:null,
    player:{ n:'W. Samuel',      p:'ZAG', o:87, fit:1, club:'Boca Juniors 2000' } },
  { pos:'LE',  x:15, y:74, filled:true, empty:false, preview:false, selectable:false, dimmed:false, onSelect:null,
    player:{ n:'Júnior',         p:'LE',  o:89, fit:1, club:'Flamengo 1981' } },
  { pos:'VOL', x:50, y:55, filled:true, empty:false, preview:false, selectable:false, dimmed:false, onSelect:null,
    player:{ n:'L. Álvarez',     p:'VOL', o:83, fit:1, club:'Atlético Nacional 1989' } },
  { pos:'MC',  x:72, y:46, filled:true, empty:false, preview:false, selectable:false, dimmed:false, onSelect:null,
    player:{ n:'Zico',           p:'MEI', o:94, fit:1, club:'Flamengo 1981' } },
  { pos:'MC',  x:28, y:46, filled:true, empty:false, preview:false, selectable:false, dimmed:false, onSelect:null,
    player:{ n:'Riquelme',       p:'MEI', o:92, fit:1, club:'Boca Juniors 2000' } },
  { pos:'PD',  x:82, y:22, filled:true, empty:false, preview:false, selectable:false, dimmed:false, onSelect:null,
    player:{ n:'Ronaldinho',     p:'MEI', o:93, fit:1, club:'Atlético-MG 2013' } },
  { pos:'ATA', x:50, y:16, filled:true, empty:false, preview:false, selectable:false, dimmed:false, onSelect:null,
    player:{ n:'Pelé',           p:'ATA', o:99, fit:1, club:'Santos 1963' } },
  { pos:'PE',  x:18, y:22, filled:true, empty:false, preview:false, selectable:false, dimmed:false, onSelect:null,
    player:{ n:'Neymar',         p:'PE',  o:94, fit:1, club:'Santos 2011' } },
]

const STEPS = [
  { n: '01', title: 'ROLE',     desc: 'Sorteia um elenco finalista da Libertadores' },
  { n: '02', title: 'MONTE',    desc: 'Escale um craque que jogou nesse clube' },
  { n: '03', title: 'DISPUTE',  desc: 'Enfrente os 31 rivais na Copa SULALEGENDS' },
]

interface Props { onPlay: () => void }

export default function HomeScreen({ onPlay }: Props) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── Main two-column layout ── */}
      <div style={{
        flex: 1,
        maxWidth: 1120,
        margin: '0 auto',
        width: '100%',
        padding: 'clamp(24px,4vw,56px) 24px',
        display: 'flex',
        gap: 'clamp(24px,5vw,64px)',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>

        {/* ── LEFT: copy ── */}
        <div style={{ flex: '1 1 360px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Label */}
          <div style={{
            fontFamily: "'Barlow Condensed',sans-serif",
            fontSize: 13, letterSpacing: 4, color: '#2ee37a',
            fontWeight: 600, textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2ee37a', display: 'inline-block', animation: 'pulse 1.4s infinite' }} />
            Copa dos Sonhos · Libertadores 1963 — 2023
          </div>

          {/* Brand */}
          <div style={{ lineHeight: .88, letterSpacing: 2 }}>
            <div style={{
              fontFamily: "'Anton',sans-serif",
              fontSize: 'clamp(58px,12vw,108px)',
              background: 'linear-gradient(135deg,#fbe08a 0%,#f5c84b 50%,#e0a040 100%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            }}>
              SULA
            </div>
            <div style={{
              fontFamily: "'Anton',sans-serif",
              fontSize: 'clamp(58px,12vw,108px)',
              color: '#eafff0',
            }}>
              LEGENDS
            </div>
          </div>

          {/* Tagline */}
          <div style={{
            fontFamily: "'Barlow',sans-serif",
            fontSize: 'clamp(20px,3.5vw,28px)',
            fontWeight: 800,
            color: '#eafff0',
            lineHeight: 1.25,
          }}>
            Role o dado.<br />Monte seu time<br />das lendas.
          </div>

          {/* Description */}
          <p style={{
            fontSize: 15, color: '#7fb5a0', lineHeight: 1.65,
            maxWidth: 400, margin: 0,
          }}>
            Sai um elenco finalista da Libertadores.
            Escale um craque que esteve lá, complete os 11
            e dispute o torneio — seu time conquista a glória?
          </p>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={onPlay}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'linear-gradient(135deg,#f5c84b,#e0a040)',
                color: '#1a1000',
                fontFamily: "'Anton',sans-serif", letterSpacing: 2, fontSize: 20,
                padding: '16px 32px',
                border: 'none', borderRadius: 12, cursor: 'pointer',
                boxShadow: '0 5px 0 #a87320, 0 12px 30px rgba(245,200,75,.28)',
                transition: 'transform .12s',
                whiteSpace: 'nowrap',
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'translateY(3px)')}
              onMouseUp={e => (e.currentTarget.style.transform = '')}
              onMouseLeave={e => (e.currentTarget.style.transform = '')}
            >
              JOGAR AGORA →
            </button>

            <div style={{
              fontFamily: "'Barlow Condensed',sans-serif",
              fontSize: 12, color: '#4a7a60', letterSpacing: 1, lineHeight: 1.4,
            }}>
              54 clubes históricos<br />400+ lendas do futebol sul-americano
            </div>
          </div>

          {/* 01 / 02 / 03 steps */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 10,
            marginTop: 4,
          }}>
            {STEPS.map(({ n, title, desc }) => (
              <div
                key={n}
                style={{
                  background: 'rgba(255,255,255,.04)',
                  border: '1px solid rgba(255,255,255,.08)',
                  borderRadius: 10,
                  padding: '12px 14px',
                  transition: 'border-color .2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,200,75,.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.08)')}
              >
                <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 22, color: '#f5c84b', lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, color: '#2ee37a', letterSpacing: 1, textTransform: 'uppercase', marginTop: 5 }}>{title}</div>
                <div style={{ fontSize: 11.5, color: '#5a8a72', marginTop: 4, lineHeight: 1.45 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: pitch preview ── */}
        <div style={{ flex: '1 1 300px', maxWidth: 420, alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            fontFamily: "'Barlow Condensed',sans-serif",
            textAlign: 'center', letterSpacing: 3, fontSize: 11,
            color: '#3a6650', textTransform: 'uppercase', fontWeight: 700,
          }}>
            ⭐ Time dos Sonhos · Monte o seu
          </div>
          <Pitch slots={PREVIEW} size="lg" />
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            {[
              { label: 'OVR médio', val: '91' },
              { label: 'Países', val: '5' },
              { label: 'Décadas', val: '6' },
            ].map(({ label, val }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 22, color: '#f5c84b', lineHeight: 1 }}>{val}</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, color: '#4a7a60', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom stats bar ── */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,.07)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        flexWrap: 'wrap',
      }}>
        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, color: '#3a6650', letterSpacing: 1 }}>
          54 clubes
        </span>
        <span style={{ color: '#1e3a26', fontSize: 14 }}>·</span>
        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, color: '#3a6650', letterSpacing: 1 }}>
          400+ jogadores históricos
        </span>
        <span style={{ color: '#1e3a26', fontSize: 14 }}>·</span>
        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, color: '#3a6650', letterSpacing: 1 }}>
          6 décadas de Libertadores
        </span>
        <span style={{ color: '#1e3a26', fontSize: 14 }}>·</span>
        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, color: '#3a6650', letterSpacing: 1 }}>
          32 times no torneio
        </span>
      </div>
    </div>
  )
}
