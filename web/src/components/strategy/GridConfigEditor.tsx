import { Grid, DollarSign, TrendingUp, Shield, Compass } from 'lucide-react'
import type { GridStrategyConfig } from '../../types'
import { gridConfig } from '../../i18n/strategy-translations'

const defaultGridConfig: GridStrategyConfig = {
  symbol: 'BTCUSDT', grid_count: 10, total_investment: 1000, leverage: 5,
  upper_price: 0, lower_price: 0, use_atr_bounds: true, atr_multiplier: 2.0,
  distribution: 'gaussian', max_drawdown_pct: 15, stop_loss_pct: 5,
  daily_loss_limit_pct: 10, use_maker_only: true, enable_direction_adjust: false, direction_bias_ratio: 0.7,
}

const t = (key: keyof typeof gridConfig, language: string): string => {
  const entry = gridConfig[key]
  if (!entry) return key
  return entry[language as keyof typeof entry] || entry.en || key
}

export function GridConfigEditor({ config, onChange, disabled, language }: {
  config: GridStrategyConfig
  onChange: (config: GridStrategyConfig) => void
  disabled?: boolean
  language: string
}) {
  const updateField = <K extends keyof GridStrategyConfig>(key: K, value: GridStrategyConfig[K]) => {
    if (!disabled) onChange({ ...config, [key]: value })
  }

  const inputStyle = { background: '#1E2329', border: '1px solid #2B3139', color: '#EAECEF' }
  const sectionStyle = { background: '#0B0E11', border: '1px solid #2B3139' }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5" style={{ color: '#F0B90B' }} />
          <h3 className="font-medium" style={{ color: '#EAECEF' }}>{t('tradingPair', language)}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg" style={sectionStyle}>
            <label className="block text-sm mb-1" style={{ color: '#EAECEF' }}>{t('symbol', language)}</label>
            <p className="text-xs mb-2" style={{ color: '#848E9C' }}>{t('symbolDesc', language)}</p>
            <select value={config.symbol} onChange={(e) => updateField('symbol', e.target.value)} disabled={disabled} className="w-full px-3 py-2 rounded" style={inputStyle}>
              <option value="BTCUSDT">BTC/USDT</option><option value="ETHUSDT">ETH/USDT</option><option value="SOLUSDT">SOL/USDT</option>
              <option value="BNBUSDT">BNB/USDT</option><option value="XRPUSDT">XRP/USDT</option><option value="DOGEUSDT">DOGE/USDT</option>
            </select>
          </div>
          <div className="p-4 rounded-lg" style={sectionStyle}>
            <label className="block text-sm mb-1" style={{ color: '#EAECEF' }}>{t('totalInvestment', language)}</label>
            <p className="text-xs mb-2" style={{ color: '#848E9C' }}>{t('totalInvestmentDesc', language)}</p>
            <input type="number" value={config.total_investment} onChange={(e) => updateField('total_investment', parseFloat(e.target.value) || 1000)} disabled={disabled} min={100} step={100} className="w-full px-3 py-2 rounded" style={inputStyle} />
          </div>
          <div className="p-4 rounded-lg" style={sectionStyle}>
            <label className="block text-sm mb-1" style={{ color: '#EAECEF' }}>{t('leverage', language)}</label>
            <p className="text-xs mb-2" style={{ color: '#848E9C' }}>{t('leverageDesc', language)}</p>
            <input type="number" value={config.leverage} onChange={(e) => updateField('leverage', parseInt(e.target.value) || 5)} disabled={disabled} min={1} max={5} className="w-full px-3 py-2 rounded" style={inputStyle} />
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Grid className="w-5 h-5" style={{ color: '#F0B90B' }} />
          <h3 className="font-medium" style={{ color: '#EAECEF' }}>{t('gridParameters', language)}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg" style={sectionStyle}>
            <label className="block text-sm mb-1" style={{ color: '#EAECEF' }}>{t('gridCount', language)}</label>
            <p className="text-xs mb-2" style={{ color: '#848E9C' }}>{t('gridCountDesc', language)}</p>
            <input type="number" value={config.grid_count} onChange={(e) => updateField('grid_count', parseInt(e.target.value) || 10)} disabled={disabled} min={5} max={50} className="w-full px-3 py-2 rounded" style={inputStyle} />
          </div>
          <div className="p-4 rounded-lg" style={sectionStyle}>
            <label className="block text-sm mb-1" style={{ color: '#EAECEF' }}>{t('distribution', language)}</label>
            <p className="text-xs mb-2" style={{ color: '#848E9C' }}>{t('distributionDesc', language)}</p>
            <select value={config.distribution} onChange={(e) => updateField('distribution', e.target.value as 'uniform' | 'gaussian' | 'pyramid')} disabled={disabled} className="w-full px-3 py-2 rounded" style={inputStyle}>
              <option value="uniform">{t('uniform', language)}</option><option value="gaussian">{t('gaussian', language)}</option><option value="pyramid">{t('pyramid', language)}</option>
            </select>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5" style={{ color: '#F0B90B' }} />
          <h3 className="font-medium" style={{ color: '#EAECEF' }}>{t('priceBounds', language)}</h3>
        </div>
        <div className="p-4 rounded-lg mb-4" style={sectionStyle}>
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm" style={{ color: '#EAECEF' }}>{t('useAtrBounds', language)}</label>
              <p className="text-xs" style={{ color: '#848E9C' }}>{t('useAtrBoundsDesc', language)}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={config.use_atr_bounds} onChange={(e) => updateField('use_atr_bounds', e.target.checked)} disabled={disabled} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F0B90B]"></div>
            </label>
          </div>
        </div>
        {config.use_atr_bounds ? (
          <div className="p-4 rounded-lg" style={sectionStyle}>
            <label className="block text-sm mb-1" style={{ color: '#EAECEF' }}>{t('atrMultiplier', language)}</label>
            <p className="text-xs mb-2" style={{ color: '#848E9C' }}>{t('atrMultiplierDesc', language)}</p>
            <input type="number" value={config.atr_multiplier} onChange={(e) => updateField('atr_multiplier', parseFloat(e.target.value) || 2.0)} disabled={disabled} min={1} max={5} step={0.5} className="w-32 px-3 py-2 rounded" style={inputStyle} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg" style={sectionStyle}>
              <label className="block text-sm mb-1" style={{ color: '#EAECEF' }}>{t('upperPrice', language)}</label>
              <p className="text-xs mb-2" style={{ color: '#848E9C' }}>{t('upperPriceDesc', language)}</p>
              <input type="number" value={config.upper_price} onChange={(e) => updateField('upper_price', parseFloat(e.target.value) || 0)} disabled={disabled} min={0} step={0.01} className="w-full px-3 py-2 rounded" style={inputStyle} />
            </div>
            <div className="p-4 rounded-lg" style={sectionStyle}>
              <label className="block text-sm mb-1" style={{ color: '#EAECEF' }}>{t('lowerPrice', language)}</label>
              <p className="text-xs mb-2" style={{ color: '#848E9C' }}>{t('lowerPriceDesc', language)}</p>
              <input type="number" value={config.lower_price} onChange={(e) => updateField('lower_price', parseFloat(e.target.value) || 0)} disabled={disabled} min={0} step={0.01} className="w-full px-3 py-2 rounded" style={inputStyle} />
            </div>
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5" style={{ color: '#F0B90B' }} />
          <h3 className="font-medium" style={{ color: '#EAECEF' }}>{t('riskControl', language)}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-4 rounded-lg" style={sectionStyle}>
            <label className="block text-sm mb-1" style={{ color: '#EAECEF' }}>{t('maxDrawdown', language)}</label>
            <p className="text-xs mb-2" style={{ color: '#848E9C' }}>{t('maxDrawdownDesc', language)}</p>
            <input type="number" value={config.max_drawdown_pct} onChange={(e) => updateField('max_drawdown_pct', parseFloat(e.target.value) || 15)} disabled={disabled} min={5} max={50} className="w-full px-3 py-2 rounded" style={inputStyle} />
          </div>
          <div className="p-4 rounded-lg" style={sectionStyle}>
            <label className="block text-sm mb-1" style={{ color: '#EAECEF' }}>{t('stopLoss', language)}</label>
            <p className="text-xs mb-2" style={{ color: '#848E9C' }}>{t('stopLossDesc', language)}</p>
            <input type="number" value={config.stop_loss_pct} onChange={(e) => updateField('stop_loss_pct', parseFloat(e.target.value) || 5)} disabled={disabled} min={1} max={20} className="w-full px-3 py-2 rounded" style={inputStyle} />
          </div>
          <div className="p-4 rounded-lg" style={sectionStyle}>
            <label className="block text-sm mb-1" style={{ color: '#EAECEF' }}>{t('dailyLossLimit', language)}</label>
            <p className="text-xs mb-2" style={{ color: '#848E9C' }}>{t('dailyLossLimitDesc', language)}</p>
            <input type="number" value={config.daily_loss_limit_pct} onChange={(e) => updateField('daily_loss_limit_pct', parseFloat(e.target.value) || 10)} disabled={disabled} min={1} max={30} className="w-full px-3 py-2 rounded" style={inputStyle} />
          </div>
        </div>
        <div className="p-4 rounded-lg" style={sectionStyle}>
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm" style={{ color: '#EAECEF' }}>{t('useMakerOnly', language)}</label>
              <p className="text-xs" style={{ color: '#848E9C' }}>{t('useMakerOnlyDesc', language)}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={config.use_maker_only} onChange={(e) => updateField('use_maker_only', e.target.checked)} disabled={disabled} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F0B90B]"></div>
            </label>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Compass className="w-5 h-5" style={{ color: '#F0B90B' }} />
          <h3 className="font-medium" style={{ color: '#EAECEF' }}>{t('directionAdjust', language)}</h3>
        </div>
        <div className="p-4 rounded-lg mb-4" style={sectionStyle}>
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm" style={{ color: '#EAECEF' }}>{t('enableDirectionAdjust', language)}</label>
              <p className="text-xs" style={{ color: '#848E9C' }}>{t('enableDirectionAdjustDesc', language)}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={config.enable_direction_adjust ?? false} onChange={(e) => updateField('enable_direction_adjust', e.target.checked)} disabled={disabled} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F0B90B]"></div>
            </label>
          </div>
        </div>
        {config.enable_direction_adjust && (
          <>
            <div className="p-4 rounded-lg mb-4" style={{ background: '#1E2329', border: '1px solid #F0B90B33' }}>
              <p className="text-xs font-medium mb-2" style={{ color: '#F0B90B' }}>📊 {t('directionModes', language)}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs" style={{ color: '#848E9C' }}>
                <div>• {t('modeNeutral', language)}</div>
                <div>• <span style={{ color: '#0ECB81' }}>{t('modeLongBias', language)}</span></div>
                <div>• <span style={{ color: '#0ECB81' }}>{t('modeLong', language)}</span></div>
                <div>• <span style={{ color: '#F6465D' }}>{t('modeShortBias', language)}</span></div>
                <div>• <span style={{ color: '#F6465D' }}>{t('modeShort', language)}</span></div>
              </div>
              <p className="text-xs mt-3 pt-2 border-t border-zinc-700" style={{ color: '#848E9C' }}>💡 {t('directionExplain', language)}</p>
            </div>
            <div className="p-4 rounded-lg" style={sectionStyle}>
              <label className="block text-sm mb-1" style={{ color: '#EAECEF' }}>{t('directionBiasRatio', language)} (X)</label>
              <p className="text-xs mb-1" style={{ color: '#848E9C' }}>{t('directionBiasRatioDesc', language)}</p>
              <p className="text-xs mb-3" style={{ color: '#F0B90B' }}>{t('directionBiasExplain', language)}</p>
              <div className="flex items-center gap-3">
                <input type="range" value={(config.direction_bias_ratio ?? 0.7) * 100} onChange={(e) => updateField('direction_bias_ratio', parseInt(e.target.value) / 100)} disabled={disabled} min={55} max={90} step={5} className="flex-1 h-2 rounded-lg appearance-none cursor-pointer" style={{ background: '#2B3139' }} />
                <span className="text-sm font-mono w-20 text-right" style={{ color: '#F0B90B' }}>X = {Math.round((config.direction_bias_ratio ?? 0.7) * 100)}%</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
