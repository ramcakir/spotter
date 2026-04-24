import { Settings, Targets } from '../hooks/useSettings'

const TARGETS: { key: Targets; label: string }[] = [
  { key: 'cat', label: '🐈 Cat' }, { key: 'dog', label: '🐕 Dog' },
  { key: 'person', label: '🧑 Human' }, { key: 'bicycle', label: '🚲 Bicycle' },
  { key: 'car', label: '🚗 Car' }, { key: 'motorcycle', label: '🏍 Motorcycle' }
]

export function SettingsModal({ open, onClose, settings, onUpdate, onReset }: {
  open: boolean; onClose: () => void; settings: Settings;
  onUpdate: (k: keyof Settings, v: any) => void; onReset: () => void;
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#faf6f2] w-full md:w-[480px] rounded-t-3xl md:rounded-3xl p-5 shadow-2xl animate-slideUp" onClick={e=>e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <div className="mb-5">
          <p className="text-sm font-medium mb-2 text-slate-600">Targets to Detect</p>
          <div className="grid grid-cols-2 gap-2">
            {TARGETS.map(t => (
              <button key={t.key} onClick={() => onUpdate('targets', settings.targets.includes(t.key) ? settings.targets.filter(x=>x!==t.key) : [...settings.targets, t.key])}
                className={`p-3 rounded-xl text-sm font-medium border transition ${settings.targets.includes(t.key) ? 'bg-[#ec5b2c] text-white border-[#ec5b2c]' : 'bg-white border-slate-200 text-slate-700'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {[
          { k: 'interval' as keyof Settings, l: 'Detection Interval', unit: 'ms', step: 50, min: 100, max: 2000 },
          { k: 'cooldown' as keyof Settings, l: 'Ring Cooldown', unit: 'ms', step: 500, min: 0, max: 30000 },
          { k: 'confidence' as keyof Settings, l: 'Confidence Threshold', unit: '%', step: 0.05, min: 0.1, max: 0.95 }
        ].map(c => (
          <div key={c.k} className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{c.l}</span>
              <span className="font-mono">{c.k === 'confidence' ? Math.round((settings[c.k] as number) * 100) : settings[c.k]}{c.unit}</span>
            </div>
            <input type="range" min={c.min} max={c.max} step={c.step} value={settings[c.k] as number} onChange={e => onUpdate(c.k, parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#ec5b2c]" />
          </div>
        ))}

        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
          <button onClick={onReset} className="px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition">Reset Defaults</button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-[#ec5b2c] text-white font-semibold active:scale-[0.98] transition">Done</button>
        </div>
      </div>
    </div>
  )
}