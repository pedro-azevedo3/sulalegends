'use client'

import { useState } from 'react'
import Pitch from '@/components/Pitch'
import Modal from '@/components/ui/Modal'
import type { SlotView } from '@/hooks/useGame'
import { DB } from '@/data/db'

// Dream team preview: 4-3-3 with legends
const PREVIEW: SlotView[] = [
  { pos:'GOL', x:50, y:92, filled:true, empty:false, preview:false, selectable:false, dimmed:false, onSelect:null, player:{ n:'Chilavert',      p:'GOL', o:89, fit:1, club:'Vélez Sársfield 1994' } },
  { pos:'LD',  x:85, y:74, filled:true, empty:false, preview:false, selectable:false, dimmed:false, onSelect:null, player:{ n:'Cafu',           p:'LD',  o:88, fit:1, club:'São Paulo 1993' } },
  { pos:'ZAG', x:64, y:78, filled:true, empty:false, preview:false, selectable:false, dimmed:false, onSelect:null, player:{ n:'Ruggeri',        p:'ZAG', o:86, fit:1, club:'River Plate 1986' } },
  { pos:'ZAG', x:36, y:78, filled:true, empty:false, preview:false, selectable:false, dimmed:false, onSelect:null, player:{ n:'W. Samuel',      p:'ZAG', o:87, fit:1, club:'Boca Juniors 2000' } },
  { pos:'LE',  x:15, y:74, filled:true, empty:false, preview:false, selectable:false, dimmed:false, onSelect:null, player:{ n:'Júnior',         p:'LE',  o:89, fit:1, club:'Flamengo 1981' } },
  { pos:'VOL', x:50, y:55, filled:true, empty:false, preview:false, selectable:false, dimmed:false, onSelect:null, player:{ n:'L. Álvarez',     p:'VOL', o:83, fit:1, club:'Atlético Nacional 1989' } },
  { pos:'MC',  x:72, y:46, filled:true, empty:false, preview:false, selectable:false, dimmed:false, onSelect:null, player:{ n:'Zico',           p:'MEI', o:94, fit:1, club:'Flamengo 1981' } },
  { pos:'MC',  x:28, y:46, filled:true, empty:false, preview:false, selectable:false, dimmed:false, onSelect:null, player:{ n:'Riquelme',       p:'MEI', o:92, fit:1, club:'Boca Juniors 2000' } },
  { pos:'PD',  x:82, y:22, filled:true, empty:false, preview:false, selectable:false, dimmed:false, onSelect:null, player:{ n:'Ronaldinho',     p:'MEI', o:93, fit:1, club:'Atlético-MG 2013' } },
  { pos:'ATA', x:50, y:16, filled:true, empty:false, preview:false, selectable:false, dimmed:false, onSelect:null, player:{ n:'Pelé',           p:'ATA', o:99, fit:1, club:'Santos 1963' } },
  { pos:'PE',  x:18, y:22, filled:true, empty:false, preview:false, selectable:false, dimmed:false, onSelect:null, player:{ n:'Neymar',         p:'PE',  o:94, fit:1, club:'Santos 2011' } },
]

const STEPS = [
  { n: '01', title: 'ROLE',     desc: 'Sorteia um elenco finalista da Libertadores' },
  { n: '02', title: 'MONTE',    desc: 'Escale um craque que jogou nesse clube' },
  { n: '03', title: 'DISPUTE',  desc: 'Enfrente os 31 rivais na Copa SULALEGENDS' },
]

type Section = 'copas' | 'selecoes' | 'como-jogar' | 'sobre' | 'faq' | 'termos' | 'privacidade' | null

interface Props { onPlay: () => void }

export default function HomeScreen({ onPlay }: Props) {
  const [modal, setModal] = useState<Section>(null)
  const allClubs = Object.keys(DB)

  return (
    <>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* ── Main two-column layout ── */}
        <div style={{
          flex: 1,
          maxWidth: 1120, margin: '0 auto', width: '100%',
          padding: 'clamp(24px,4vw,56px) 24px',
          display: 'flex', gap: 'clamp(24px,5vw,64px)',
          alignItems: 'center', flexWrap: 'wrap',
        }}>

          {/* ── LEFT: copy ── */}
          <div style={{ flex: '1 1 360px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, letterSpacing: 4, color: '#2ee37a', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2ee37a', display: 'inline-block', animation: 'pulse 1.4s infinite' }} />
              Copa dos Sonhos · Libertadores 1963 — 2023
            </div>

            <div style={{ lineHeight: .88, letterSpacing: 2 }}>
              <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 'clamp(58px,12vw,108px)', background: 'linear-gradient(135deg,#fbe08a 0%,#f5c84b 50%,#e0a040 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>SULA</div>
              <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 'clamp(58px,12vw,108px)', color: '#eafff0' }}>LEGENDS</div>
            </div>

            <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 800, color: '#eafff0', lineHeight: 1.25 }}>
              Role o dado.<br />Monte seu time<br />das lendas.
            </div>

            <p style={{ fontSize: 15, color: '#7fb5a0', lineHeight: 1.65, maxWidth: 400, margin: 0 }}>
              Sai um elenco finalista da Libertadores. Escale um craque que esteve lá, complete os 11 e dispute o torneio — seu time conquista a glória?
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={onPlay}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'linear-gradient(135deg,#f5c84b,#e0a040)', color: '#1a1000',
                  fontFamily: "'Anton',sans-serif", letterSpacing: 2, fontSize: 20,
                  padding: '16px 32px', border: 'none', borderRadius: 12, cursor: 'pointer',
                  boxShadow: '0 5px 0 #a87320, 0 12px 30px rgba(245,200,75,.28)',
                  transition: 'transform .12s', whiteSpace: 'nowrap',
                }}
                onMouseDown={e => (e.currentTarget.style.transform = 'translateY(3px)')}
                onMouseUp={e => (e.currentTarget.style.transform = '')}
                onMouseLeave={e => (e.currentTarget.style.transform = '')}
              >
                JOGAR AGORA →
              </button>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, color: '#4a7a60', letterSpacing: 1, lineHeight: 1.4 }}>
                {allClubs.length} clubes históricos<br />400+ lendas do futebol sul-americano
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 4 }}>
              {STEPS.map(({ n, title, desc }) => (
                <div key={n} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: '12px 14px', transition: 'border-color .2s' }}
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
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", textAlign: 'center', letterSpacing: 3, fontSize: 11, color: '#3a6650', textTransform: 'uppercase', fontWeight: 700 }}>
              ⭐ Time dos Sonhos · Monte o seu
            </div>
            <Pitch slots={PREVIEW} size="lg" />
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              {[{ label: 'OVR médio', val: '91' }, { label: 'Países', val: '5' }, { label: 'Décadas', val: '6' }].map(({ label, val }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 22, color: '#f5c84b', lineHeight: 1 }}>{val}</div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, color: '#4a7a60', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer nav (top row) ── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', background: 'rgba(0,0,0,.2)' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: '14px 24px 0', display: 'flex', justifyContent: 'center', gap: 32 }}>
            {([['copas','COPAS'], ['selecoes','SELEÇÕES']] as [Section, string][]).map(([id, label]) => (
              <button key={id} onClick={() => setModal(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 2, color: '#9fd9b6', textTransform: 'uppercase', padding: '4px 0', borderBottom: '1px solid rgba(157,217,182,.3)', transition: 'color .15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#2ee37a')}
                onMouseLeave={e => (e.currentTarget.style.color = '#9fd9b6')}
              >{label}</button>
            ))}
          </div>

          {/* ── Footer nav (bottom row) ── */}
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: '10px 24px 14px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 24px' }}>
            {([['como-jogar','COMO JOGAR'], ['sobre','SOBRE'], ['faq','FAQ'], ['termos','TERMOS'], ['privacidade','PRIVACIDADE']] as [Section, string][]).map(([id, label]) => (
              <button key={id} onClick={() => setModal(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: 1.5, color: '#4a7a60', textTransform: 'uppercase', padding: '2px 0', transition: 'color .15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#9fd9b6')}
                onMouseLeave={e => (e.currentTarget.style.color = '#4a7a60')}
              >{label}</button>
            ))}
          </div>

          {/* ── Bottom credit ── */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,.04)', padding: '10px 24px', textAlign: 'center' }}>
            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, color: '#2e4a3a', letterSpacing: 1 }}>
              SULALEGENDS · sulalegends.com.br · contato@sulalegends.com.br
            </span>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {modal === 'copas' && (
        <Modal title="Copas" onClose={() => setModal(null)}>
          <p style={{ color: '#f5c84b', fontFamily: "'Anton',sans-serif", fontSize: 20, margin: '0 0 12px' }}>Copa SULALEGENDS</p>
          <p>Dispute a <b style={{ color: '#fff' }}>Copa Libertadores da América</b> com o time que você montou no draft. O torneio replica o formato oficial com 32 clubes históricos.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
            {[
              ['🏆 Fase de Grupos','8 grupos de 4 — 3 jogos de ida e 3 de volta'],
              ['⚔ Oitavas de Final','Jogo de ida e jogo de volta · gols fora decidem'],
              ['⚔ Quartas de Final','Jogo de ida e jogo de volta · gols fora decidem'],
              ['⚔ Semifinais','Jogo de ida e jogo de volta · gols fora decidem'],
              ['🥅 Grande Final','Jogo único — pênaltis se empatar'],
            ].map(([title, desc]) => (
              <div key={title} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, color: '#2ee37a', marginBottom: 3 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#9fb8aa' }}>{desc}</div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {modal === 'selecoes' && (
        <Modal title={`Seleções · ${allClubs.length} elencos históricos`} onClose={() => setModal(null)}>
          <p style={{ color: '#9fb8aa', fontSize: 13, marginTop: 0 }}>Todos os elencos disponíveis para o sorteio. Cada partida você sorteado um diferente.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 12 }}>
            {allClubs.sort().map(club => (
              <div key={club} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,.03)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2ee37a', flexShrink: 0 }} />
                <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 13, color: '#eafff0' }}>{club}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {modal === 'como-jogar' && (
        <Modal title="Como Jogar" onClose={() => setModal(null)}>
          {[
            ['🎲 Role o dado', 'Um elenco finalista histórico da Libertadores é sorteado. Você vê a lista de jogadores disponíveis.'],
            ['👆 Escolha um jogador', 'Toque em um jogador da lista para selecioná-lo. As posições compatíveis no campo ficam destacadas em amarelo.'],
            ['📍 Posicione no campo', 'Toque na posição destacada no campo para escalar o jogador ali.'],
            ['⏭ Próximo Time', 'Avance para o próximo elenco sorteado. Você tem apenas 2 passes por partida — use com sabedoria.'],
            ['⚽ Dispute a Copa', 'Com os 11 escalados, entre na Copa SULALEGENDS. Fase de grupos, mata-mata, pênaltis — tudo isso te aguarda.'],
            ['📲 Compartilhe', 'Ao terminar, baixe o card da sua campanha e compartilhe com seus amigos.'],
          ].map(([title, desc], i) => (
            <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
              <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 22, color: '#f5c84b', minWidth: 28, lineHeight: 1.2 }}>{String(i+1).padStart(2,'0')}</div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#9fb8aa', lineHeight: 1.55 }}>{desc}</div>
              </div>
            </div>
          ))}
        </Modal>
      )}

      {modal === 'sobre' && (
        <Modal title="Sobre" onClose={() => setModal(null)}>
          <p style={{ color: '#f5c84b', fontFamily: "'Anton',sans-serif", fontSize: 18, margin: '0 0 14px' }}>O que é o SULALEGENDS?</p>
          <p>O <b style={{ color: '#fff' }}>SULALEGENDS</b> é um jogo de draft inspirado no 7a0. A missão é simples: monte o melhor time possível com as lendas da <b style={{ color: '#fff' }}>Copa Libertadores da América</b> e dispute um torneio completo.</p>
          <p>A cada rodada do draft, um elenco finalista histórico é sorteado. Você escolhe um jogador, posiciona no campo e passa para o próximo elenco. Ao completar os 11, o torneio começa.</p>
          <p>São <b style={{ color: '#2ee37a' }}>{allClubs.length}+ elencos históricos</b>, jogadores de 6 décadas de futebol sul-americano, e um torneio com fase de grupos, mata-mata e pênaltis.</p>
          <p style={{ color: '#4a7a60', fontSize: 12, marginTop: 20 }}>Desenvolvido com 💚 para os apaixonados pelo futebol sul-americano.</p>
        </Modal>
      )}

      {modal === 'faq' && (
        <Modal title="Perguntas Frequentes" onClose={() => setModal(null)}>
          {[
            ['Quantos times posso sortear por partida?', 'Você pode sortear quantos times quiser. No entanto, só tem 2 passes disponíveis para pular um time sem escalar ninguém. Use com estratégia.'],
            ['Posso escalar mais de um jogador do mesmo time?', 'Sim! Após escalar um jogador, o botão "Próximo Time" avança para o próximo elenco. Se quiser mais jogadores do mesmo clube, basta não clicar em "Próximo Time" imediatamente — mas lembre que a lista desaparece após escalar um jogador.'],
            ['Como os jogos são simulados?', 'A simulação usa um modelo estatístico baseado nos atributos de ataque e defesa dos jogadores. O relógio corre de 1\' a 90\' e os gols só entram quando o minuto chega. Você pode ajustar a velocidade.'],
            ['O que acontece em caso de empate no agregado?', 'Em confrontos de ida e volta, aplica-se a regra dos gols fora de casa. Se ainda empatado, há disputa de pênaltis — cobranças alternadas uma a uma.'],
            ['O jogo funciona no celular?', 'Sim! O SULALEGENDS foi otimizado para mobile. Funciona em qualquer navegador moderno, sem necessidade de download ou instalação.'],
            ['O jogo é gratuito?', 'Sim, totalmente gratuito e sem anúncios.'],
          ].map(([q, a], i) => (
            <div key={i} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: i < 5 ? '1px solid rgba(255,255,255,.06)' : 'none' }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 14, color: '#2ee37a', marginBottom: 6 }}>❓ {q}</div>
              <div style={{ fontSize: 13, color: '#9fb8aa', lineHeight: 1.6 }}>{a}</div>
            </div>
          ))}
        </Modal>
      )}

      {modal === 'termos' && (
        <Modal title="Termos de Uso" onClose={() => setModal(null)}>
          <p style={{ color: '#4a7a60', fontSize: 11, marginTop: 0 }}>Última atualização: Julho de 2026</p>
          {[
            ['1. Aceitação', 'Ao acessar e utilizar o SULALEGENDS, você concorda com estes Termos de Uso. Se não concordar, por favor, não utilize o serviço.'],
            ['2. Descrição do Serviço', 'O SULALEGENDS é um jogo de entretenimento gratuito disponível em sulalegends.com.br. O serviço permite ao usuário montar equipes fictícias com jogadores históricos e simular torneios.'],
            ['3. Propriedade Intelectual', 'Todo o conteúdo do SULALEGENDS — incluindo design, código, textos e funcionalidades — é de propriedade dos criadores e está protegido por lei. Os nomes e históricos dos jogadores são utilizados para fins informativos e de entretenimento.'],
            ['4. Uso Aceitável', 'O usuário concorda em não utilizar o serviço para fins ilegais, não tentar comprometer a segurança do sistema e não reproduzir o conteúdo sem autorização.'],
            ['5. Isenção de Responsabilidade', 'O SULALEGENDS é fornecido "como está", sem garantias de disponibilidade ininterrupta. Não nos responsabilizamos por eventuais perdas de dados de partidas.'],
            ['6. Alterações', 'Reservamo-nos o direito de alterar estes termos a qualquer momento. O uso continuado após as alterações implica na aceitação dos novos termos.'],
          ].map(([title, text], i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 13, color: '#9fb8aa', lineHeight: 1.6 }}>{text}</div>
            </div>
          ))}
        </Modal>
      )}

      {modal === 'privacidade' && (
        <Modal title="Política de Privacidade" onClose={() => setModal(null)}>
          <p style={{ color: '#4a7a60', fontSize: 11, marginTop: 0 }}>Última atualização: Julho de 2026</p>
          {[
            ['Dados que coletamos', 'O SULALEGENDS não coleta dados pessoais identificáveis. As partidas e progressos são armazenados localmente no seu dispositivo (localStorage) e não são enviados para nossos servidores.'],
            ['Cookies e armazenamento local', 'Utilizamos o localStorage do navegador exclusivamente para salvar o progresso da partida atual. Nenhuma informação é compartilhada com terceiros.'],
            ['Análise de uso', 'Podemos utilizar ferramentas de análise agregada (sem identificação pessoal) para entender como o jogo é utilizado e melhorá-lo continuamente.'],
            ['Crianças', 'O SULALEGENDS é destinado a maiores de 13 anos. Não coletamos intencionalmente dados de crianças.'],
            ['Contato', 'Para dúvidas sobre privacidade, entre em contato pelo e-mail: contato@sulalegends.com.br'],
          ].map(([title, text], i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 13, color: '#9fb8aa', lineHeight: 1.6 }}>{text}</div>
            </div>
          ))}
        </Modal>
      )}
    </>
  )
}
