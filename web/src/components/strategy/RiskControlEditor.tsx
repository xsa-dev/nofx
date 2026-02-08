import { Shield, AlertTriangle } from 'lucide-react'
import type { RiskControlConfig } from '../../types'
import { riskControl } from '../../i18n/strategy-translations'

interface RiskControlEditorProps {
  config: RiskControlConfig
  onChange: (config: RiskControlConfig) => void
  disabled?: boolean
  language: string
}

const t = (key: keyof typeof riskControl, language: string): string => {
  const entry = riskControl[key]
  if (!entry) return key
  return entry[language as keyof typeof entry] || entry.en || key
}

export function RiskControlEditor({ config, onChange, disabled, language }: RiskControlEditorProps) {
  const updateField = <K extends keyof RiskControlConfig>(key: K, value: RiskControlConfig[K]) => {
    if (!disabled) onChange({ ...config, [key]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5" style={{ color: '#F0B90B' }} />
          <h3 className="font-medium" style={{ color: '#EAECEF' }}>{t('positionLimits', language)}</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="p-4 rounded-lg" style={{ background: '#0B0E11', border: '1px solid #2B3139' }}>
            <label className="block text-sm mb-1" style={{ color: '#EAECEF' }}>{t('maxPositions', language)}</label>
            <p className="text-xs mb-2" style={{ color: '#848E9C' }}>{t('maxPositionsDesc', language)}</p>
            <input
              type="number"
              value={config.max_positions ?? 3}
              onChange={(e) => updateField('max_positions', parseInt(e.target.value) || 3)}
              disabled={disabled}
              min={1}
              max={10}
              className="w-32 px-3 py-2 rounded"
              style={{ background: '#1E2329', border: '1px solid #2B3139', color: '#EAECEF' }}
            />
          </div>
        </div>
        <div className="mb-2">
          <p className="text-xs font-medium mb-2" style={{ color: '#F0B90B' }}>{t('tradingLeverage', language)}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-lg" style={{ background: '#0B0E11', border: '1px solid #2B3139' }}>
            <label className="block text-sm mb-1" style={{ color: '#EAECEF' }}>{t('btcEthLeverage', language)}</label>
            <p className="text-xs mb-2" style={{ color: '#848E9C' }}>{t('btcEthLeverageDesc', language)}</p>
            <div className="flex items-center gap-2">
              <input
                type="range"
                value={config.btc_eth_max_leverage ?? 5}
                onChange={(e) => updateField('btc_eth_max_leverage', parseInt(e.target.value))}
                disabled={disabled}
                min={1}
                max={20}
                className="flex-1 accent-yellow-500"
              />
              <span className="w-12 text-center font-mono" style={{ color: '#F0B90B' }}>{config.btc_eth_max_leverage ?? 5}x</span>
            </div>
          </div>
          <div className="p-4 rounded-lg" style={{ background: '#0B0E11', border: '1px solid #2B3139' }}>
            <label className="block text-sm mb-1" style={{ color: '#EAECEF' }}>{t('altcoinLeverage', language)}</label>
            <p className="text-xs mb-2" style={{ color: '#848E9C' }}>{t('altcoinLeverageDesc', language)}</p>
            <div className="flex items-center gap-2">
              <input
                type="range"
                value={config.altcoin_max_leverage ?? 5}
                onChange={(e) => updateField('altcoin_max_leverage', parseInt(e.target.value))}
                disabled={disabled}
                min={1}
                max={20}
                className="flex-1 accent-yellow-500"
              />
              <span className="w-12 text-center font-mono" style={{ color: '#F0B90B' }}>{config.altcoin_max_leverage ?? 5}x</span>
            </div>
          </div>
        </div>
        <div className="mb-2">
          <p className="text-xs font-medium" style={{ color: '#0ECB81' }}>{t('positionValueRatio', language)}</p>
          <p className="text-xs mt-1" style={{ color: '#848E9C' }}>{t('positionValueRatioDesc', language)}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg" style={{ background: '#0B0E11', border: '1px solid #0ECB81' }}>
            <label className="block text-sm mb-1" style={{ color: '#EAECEF' }}>{t('btcEthPositionValueRatio', language)}</label>
            <p className="text-xs mb-2" style={{ color: '#848E9C' }}>{t('btcEthPositionValueRatioDesc', language)}</p>
            <div className="flex items-center gap-2">
              <input type="range" value={config.btc_eth_max_position_value_ratio ?? 5} onChange={(e) => updateField('btc_eth_max_position_value_ratio', parseFloat(e.target.value))} disabled={disabled} min={0.5} max={10} step={0.5} className="flex-1 accent-green-500" />
              <span className="w-12 text-center font-mono" style={{ color: '#0ECB81' }}>{config.btc_eth_max_position_value_ratio ?? 5}x</span>
            </div>
          </div>
          <div className="p-4 rounded-lg" style={{ background: '#0B0E11', border: '1px solid #0ECB81' }}>
            <label className="block text-sm mb-1" style={{ color: '#EAECEF' }}>{t('altcoinPositionValueRatio', language)}</label>
            <p className="text-xs mb-2" style={{ color: '#848E9C' }}>{t('altcoinPositionValueRatioDesc', language)}</p>
            <div className="flex items-center gap-2">
              <input type="range" value={config.altcoin_max_position_value_ratio ?? 1} onChange={(e) => updateField('altcoin_max_position_value_ratio', parseFloat(e.target.value))} disabled={disabled} min={0.5} max={10} step={0.5} className="flex-1 accent-green-500" />
              <span className="w-12 text-center font-mono" style={{ color: '#0ECB81' }}>{config.altcoin_max_position_value_ratio ?? 1}x</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5" style={{ color: '#F6465D' }} />
          <h3 className="font-medium" style={{ color: '#EAECEF' }}>{t('riskParameters', language)}</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg" style={{ background: '#0B0E11', border: '1px solid #2B3139' }}>
            <label className="block text-sm mb-1" style={{ color: '#EAECEF' }}>{t('minRiskReward', language)}</label>
            <p className="text-xs mb-2" style={{ color: '#848E9C' }}>{t('minRiskRewardDesc', language)}</p>
            <div className="flex items-center">
              <span style={{ color: '#848E9C' }}>1:</span>
              <input
                type="number"
                value={config.min_risk_reward_ratio ?? 3}
                onChange={(e) => updateField('min_risk_reward_ratio', parseFloat(e.target.value) || 3)}
                disabled={disabled}
                min={1}
                max={10}
                step={0.5}
                className="w-20 px-3 py-2 rounded ml-2"
                style={{ background: '#1E2329', border: '1px solid #2B3139', color: '#EAECEF' }}
              />
            </div>
          </div>
          <div className="p-4 rounded-lg" style={{ background: '#0B0E11', border: '1px solid #0ECB81' }}>
            <label className="block text-sm mb-1" style={{ color: '#EAECEF' }}>{t('maxMarginUsage', language)}</label>
            <p className="text-xs mb-2" style={{ color: '#848E9C' }}>{t('maxMarginUsageDesc', language)}</p>
            <div className="flex items-center gap-2">
              <input type="range" value={(config.max_margin_usage ?? 0.9) * 100} onChange={(e) => updateField('max_margin_usage', parseInt(e.target.value) / 100)} disabled={disabled} min={10} max={100} className="flex-1 accent-green-500" />
              <span className="w-12 text-center font-mono" style={{ color: '#0ECB81' }}>{Math.round((config.max_margin_usage ?? 0.9) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5" style={{ color: '#0ECB81' }} />
          <h3 className="font-medium" style={{ color: '#EAECEF' }}>{t('entryRequirements', language)}</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg" style={{ background: '#0B0E11', border: '1px solid #2B3139' }}>
            <label className="block text-sm mb-1" style={{ color: '#EAECEF' }}>{t('minPositionSize', language)}</label>
            <p className="text-xs mb-2" style={{ color: '#848E9C' }}>{t('minPositionSizeDesc', language)}</p>
            <div className="flex items-center">
              <input
                type="number"
                value={config.min_position_size ?? 12}
                onChange={(e) => updateField('min_position_size', parseFloat(e.target.value) || 12)}
                disabled={disabled}
                min={10}
                max={1000}
                className="w-24 px-3 py-2 rounded"
                style={{ background: '#1E2329', border: '1px solid #2B3139', color: '#EAECEF' }}
              />
              <span className="ml-2" style={{ color: '#848E9C' }}>USDT</span>
            </div>
          </div>
          <div className="p-4 rounded-lg" style={{ background: '#0B0E11', border: '1px solid #2B3139' }}>
            <label className="block text-sm mb-1" style={{ color: '#EAECEF' }}>{t('minConfidence', language)}</label>
            <p className="text-xs mb-2" style={{ color: '#848E9C' }}>{t('minConfidenceDesc', language)}</p>
            <div className="flex items-center gap-2">
              <input type="range" value={config.min_confidence ?? 75} onChange={(e) => updateField('min_confidence', parseInt(e.target.value))} disabled={disabled} min={50} max={100} className="flex-1 accent-green-500" />
              <span className="w-12 text-center font-mono" style={{ color: '#0ECB81' }}>{config.min_confidence ?? 75}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
