import { useRef, useEffect } from 'react'

type AudioCtx = ReturnType<typeof AudioContext | typeof (window as any).webkitAudioContext>

export function useAudioEngine() {
  const ctxRef = useRef<AudioCtx | null>(null)
  useEffect(() => () => ctxRef.current?.close(), [])

  const play = (target: string) => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    const ctx = ctxRef.current
    if (ctx.state === 'suspended') ctx.resume()
    const now = ctx.currentTime

    const note = (f: number, type: OscillatorType, start: number, dur: number, g = 0.3) => {
      const o = ctx.createOscillator(), gn = ctx.createGain()
      o.type = type; o.frequency.setValueAtTime(f, now + start)
      gn.gain.setValueAtTime(g, now + start); gn.gain.exponentialRampToValueAtTime(0.01, now + start + dur)
      o.connect(gn).connect(ctx.destination); o.start(now + start); o.stop(now + start + dur + 0.05)
    }

    switch(target) {
      case 'cat': [0, 0.1, 0.2].forEach((t,i) => note(1200 + i*300, 'triangle', t, 0.08)); break
      case 'dog': note(110, 'square', 0, 0.15, 0.4); note(160, 'sawtooth', 0, 0.12, 0.2); note(220, 'square', 0.18, 0.12, 0.3); break
      case 'person': [659.25, 523.25].forEach((f, i) => { note(f, 'sine', i*0.3, 0.25, 0.4); note(f*1.5, 'sine', i*0.3, 0.15, 0.1) }); break
      case 'bicycle': [0, 0.25].forEach(t => { note(2000, 'sine', t, 0.08, 0.3); note(3200, 'sine', t, 0.06, 0.15); note(4400, 'sine', t, 0.05, 0.1) }); break
      case 'car': note(330, 'sawtooth', 0, 0.3, 0.35); note(415, 'sawtooth', 0.35, 0.3, 0.35); break
      case 'motorcycle': for(let i=0;i<5;i++) note(150+i*20, 'sawtooth', i*0.08, 0.08, 0.3); for(let i=0;i<3;i++) note(180+i*15, 'square', i*0.08, 0.06, 0.15); break
      default: [0, 0.25, 0.5].forEach(t => { note(880, 'square', t, 0.06, 0.2); note(1318.51, 'square', t, 0.06, 0.2); note(440, 'sine', t, 0.08, 0.25) })
    }
  }
  return { play, ctxRef }
}