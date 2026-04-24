import { useRef, useEffect } from 'react'

export function useAudioEngine() {
  const ctxRef = useRef<AudioContext | null>(null)
  
  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        ctxRef.current.close()
      }
    }
  }, [])

  const play = (target: string) => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    const ctx = ctxRef.current
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    const now = ctx.currentTime

    const playNote = (freq: number, type: OscillatorType, start: number, dur: number, gainVal: number = 0.3) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, now + start)
      gain.gain.setValueAtTime(gainVal, now + start)
      gain.gain.exponentialRampToValueAtTime(0.01, now + start + dur)
      osc.connect(gain).connect(ctx.destination)
      osc.start(now + start)
      osc.stop(now + start + dur + 0.05)
    }

    switch(target) {
      case 'cat':
        [0, 0.1, 0.2].forEach((t, i) => playNote(1200 + i * 300, 'triangle', t, 0.08))
        break
      case 'dog':
        playNote(110, 'square', 0, 0.15, 0.4)
        playNote(160, 'sawtooth', 0, 0.12, 0.2)
        playNote(220, 'square', 0.18, 0.12, 0.3)
        break
      case 'person':
        [659.25, 523.25].forEach((f, i) => {
          playNote(f, 'sine', i * 0.3, 0.25, 0.4)
          playNote(f * 1.5, 'sine', i * 0.3, 0.15, 0.1)
        })
        break
      case 'bicycle':
        [0, 0.25].forEach(t => {
          playNote(2000, 'sine', t, 0.08, 0.3)
          playNote(3200, 'sine', t, 0.06, 0.15)
          playNote(4400, 'sine', t, 0.05, 0.1)
        })
        break
      case 'car':
        playNote(330, 'sawtooth', 0, 0.3, 0.35)
        playNote(415, 'sawtooth', 0.35, 0.3, 0.35)
        break
      case 'motorcycle':
        for (let i = 0; i < 5; i++) {
          playNote(150 + i * 20, 'sawtooth', i * 0.08, 0.08, 0.3)
        }
        for (let i = 0; i < 3; i++) {
          playNote(180 + i * 15, 'square', i * 0.08, 0.06, 0.15)
        }
        break
      default:
        [0, 0.25, 0.5].forEach(t => {
          playNote(880, 'square', t, 0.06, 0.2)
          playNote(1318.51, 'square', t, 0.06, 0.2)
          playNote(440, 'sine', t, 0.08, 0.25)
        })
    }
  }

  return { play, ctxRef }
}
