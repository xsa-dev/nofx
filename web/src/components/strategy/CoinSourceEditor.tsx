import { useState } from 'react'
import { Plus, X, Database, TrendingUp, TrendingDown, List, Ban, Zap, Shuffle } from 'lucide-react'
import type { CoinSourceConfig } from '../../types'
import { coinSource } from '../../i18n/strategy-translations'

interface CoinSourceEditorProps {
  config: CoinSourceConfig
  onChange: (config: CoinSourceConfig) => void
  disabled?: boolean
  language: string
}

// Helper function to get translation from centralized file
const t = (key: keyof typeof coinSource, language: string): string => {
  const entry = coinSource[key]
  if (!entry) return key
  return entry[language as keyof typeof entry] || entry.en || key
}

export function CoinSourceEditor({
  config,
  onChange,
  disabled,
  language,
}: CoinSourceEditorProps) {
  const [newCoin, setNewCoin] = useState('')
  const [newExcludedCoin, setNewExcludedCoin] = useState('')

  const sourceTypes = [
    { value: 'static', icon: List, color: '#848E9C' },
    { value: 'ai500', icon: Database, color: '#F0B90B' },
    { value: 'oi_top', icon: TrendingUp, color: '#0ECB81' },
    { value: 'oi_low', icon: TrendingDown, color: '#F6465D' },
    { value: 'mixed', icon: Shuffle, color: '#60a5fa' },
  ] as const

  // Calculate mixed mode summary
  const getMixedSummary = () => {
    const sources: string[] = []
    let totalLimit = 0

    if (config.use_ai500) {
      sources.push(`AI500(${config.ai500_limit || 10})`)
      totalLimit += config.ai500_limit || 10
    }
    if (config.use_oi_top) {
      sources.push(`${language === 'zh' ? 'OI增' : 'OI↑'}(${config.oi_top_limit || 10})`)
      totalLimit += config.oi_top_limit || 10
    }
    if (config.use_oi_low) {
      sources.push(`${language === 'zh' ? 'OI减' : 'OI↓'}(${config.oi_low_limit || 10})`)
      totalLimit += config.oi_low_limit || 10
    }
    if ((config.static_coins || []).length > 0) {
      sources.push(`${language === 'zh' ? '自定义' : 'Custom'}(${config.static_coins?.length || 0})`)
      totalLimit += config.static_coins?.length || 0
    }

    return { sources, totalLimit }
  }

  // xyz dex assets
  const xyzDexAssets = new Set([
    'TSLA', 'NVDA', 'AAPL', 'MSFT', 'META', 'AMZN', 'GOOGL', 'AMD', 'COIN', 'NFLX',
    'PLTR', 'HOOD', 'INTC', 'MSTR', 'TSM', 'ORCL', 'MU', 'RIVN', 'COST', 'LLY',
    'CRCL', 'SKHX', 'SNDK', 'EUR', 'JPY', 'GOLD', 'SILVER', 'XYZ100',
  ])

  const isXyzDexAsset = (symbol: string): boolean => {
    const base = symbol.toUpperCase().replace(/^XYZ:/, '').replace(/USDT$|USD$|-USDC$/, '')
    return xyzDexAssets.has(base)
  }

  const handleAddCoin = () => {
    if (!newCoin.trim()) return
    const symbol = newCoin.toUpperCase().trim()
    let formattedSymbol: string
    if (isXyzDexAsset(symbol)) {
      const base = symbol.replace(/^xyz:/i, '').replace(/USDT$|USD$|-USDC$/i, '')
      formattedSymbol = `xyz:${base}`
    } else {
      formattedSymbol = symbol.endsWith('USDT') ? symbol : `${symbol}USDT`
    }

    const currentCoins = config.static_coins || []
    if (!currentCoins.includes(formattedSymbol)) {
      onChange({ ...config, static_coins: [...currentCoins, formattedSymbol] })
    }
    setNewCoin('')
  }

  const handleRemoveCoin = (coin: string) => {
    onChange({ ...config, static_coins: (config.static_coins || []).filter((c) => c !== coin) })
  }

  const handleAddExcludedCoin = () => {
    if (!newExcludedCoin.trim()) return
    const symbol = newExcludedCoin.toUpperCase().trim()
    let formattedSymbol: string
    if (isXyzDexAsset(symbol)) {
      const base = symbol.replace(/^xyz:/i, '').replace(/USDT$|USD$|-USDC$/i, '')
      formattedSymbol = `xyz:${base}`
    } else {
      formattedSymbol = symbol.endsWith('USDT') ? symbol : `${symbol}USDT`
    }

    const currentExcluded = config.excluded_coins || []
    if (!currentExcluded.includes(formattedSymbol)) {
      onChange({ ...config, excluded_coins: [...currentExcluded, formattedSymbol] })
    }
    setNewExcludedCoin('')
  }

  const handleRemoveExcludedCoin = (coin: string) => {
    onChange({ ...config, excluded_coins: (config.excluded_coins || []).filter((c) => c !== coin) })
  }

  const NofxOSBadge = () => (
    <span className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
      NofxOS
    </span>
  )

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-3 text-nofx-text">
          {t('sourceType', language)}
        </label>
        <div className="grid grid-cols-5 gap-2">
          {sourceTypes.map(({ value, icon: Icon, color }) => (
            <button
              key={value}
              onClick={() => !disabled && onChange({ ...config, source_type: value as CoinSourceConfig['source_type'] })}
              disabled={disabled}
              className={`p-4 rounded-lg border transition-all ${config.source_type === value
                ? 'ring-2 ring-nofx-gold bg-nofx-gold/10'
                : 'hover:bg-white/5 bg-nofx-bg'
                } border-nofx-gold/20`}
            >
              <Icon className="w-6 h-6 mx-auto mb-2" style={{ color }} />
              <div className="text-sm font-medium text-nofx-text">
                {t(value as keyof typeof coinSource, language)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {config.source_type === 'static' && (
        <div>
          <label className="block text-sm font-medium mb-3 text-nofx-text">
            {t('staticCoins', language)}
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {(config.static_coins || []).map((coin) => (
              <span key={coin} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-nofx-bg-lighter text-nofx-text">
                {coin}
                {!disabled && (
                  <button onClick={() => handleRemoveCoin(coin)} className="ml-1 hover:text-red-400 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
          {!disabled && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newCoin}
                onChange={(e) => setNewCoin(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCoin()}
                placeholder="BTC, ETH, SOL..."
                className="flex-1 px-4 py-2 rounded-lg bg-nofx-bg border border-nofx-gold/20 text-nofx-text"
              />
              <button
                onClick={handleAddCoin}
                className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors bg-nofx-gold text-black hover:bg-yellow-500"
              >
                <Plus className="w-4 h-4" />
                {t('addCoin', language)}
              </button>
            </div>
          )}
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Ban className="w-4 h-4 text-nofx-danger" />
          <label className="text-sm font-medium text-nofx-text">{t('excludedCoins', language)}</label>
        </div>
        <p className="text-xs mb-3 text-nofx-text-muted">{t('excludedCoinsDesc', language)}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {(config.excluded_coins || []).map((coin) => (
            <span key={coin} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-nofx-danger/15 text-nofx-danger">
              {coin}
              {!disabled && (
                <button onClick={() => handleRemoveExcludedCoin(coin)} className="ml-1 hover:text-white transition-colors">
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
          {(config.excluded_coins || []).length === 0 && (
            <span className="text-xs italic text-nofx-text-muted">{language === 'zh' ? '无' : 'None'}</span>
          )}
        </div>
        {!disabled && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newExcludedCoin}
              onChange={(e) => setNewExcludedCoin(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddExcludedCoin()}
              placeholder="BTC, ETH, DOGE..."
              className="flex-1 px-4 py-2 rounded-lg text-sm bg-nofx-bg border border-nofx-gold/20 text-nofx-text"
            />
            <button
              onClick={handleAddExcludedCoin}
              className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm bg-nofx-danger text-white hover:bg-red-600"
            >
              <Ban className="w-4 h-4" />
              {t('addExcludedCoin', language)}
            </button>
          </div>
        )}
      </div>

      {config.source_type === 'ai500' && (
        <div className="p-4 rounded-lg bg-nofx-gold/5 border border-nofx-gold/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-nofx-gold" />
              <span className="text-sm font-medium text-nofx-text">AI500 {t('dataSourceConfig', language)}</span>
              <NofxOSBadge />
            </div>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.use_ai500}
                onChange={(e) => !disabled && onChange({ ...config, use_ai500: e.target.checked })}
                disabled={disabled}
                className="w-5 h-5 rounded accent-nofx-gold"
              />
              <span className="text-nofx-text">{t('useAI500', language)}</span>
            </label>
            {config.use_ai500 && (
              <div className="flex items-center gap-3 pl-8">
                <span className="text-sm text-nofx-text-muted">{t('ai500Limit', language)}:</span>
                <select
                  value={config.ai500_limit || 10}
                  onChange={(e) => !disabled && onChange({ ...config, ai500_limit: parseInt(e.target.value) || 10 })}
                  disabled={disabled}
                  className="px-3 py-1.5 rounded bg-nofx-bg border border-nofx-gold/20 text-nofx-text"
                >
                  {[5, 10, 15, 20, 30, 50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            )}
            <p className="text-xs pl-8 text-nofx-text-muted">{t('nofxosNote', language)}</p>
          </div>
        </div>
      )}

      {config.source_type === 'oi_top' && (
        <div className="p-4 rounded-lg bg-nofx-success/5 border border-nofx-success/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-nofx-success" />
              <span className="text-sm font-medium text-nofx-text">
                OI {language === 'zh' ? '持仓增加榜' : 'Increase'} {t('dataSourceConfig', language)}
              </span>
              <NofxOSBadge />
            </div>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.use_oi_top}
                onChange={(e) => !disabled && onChange({ ...config, use_oi_top: e.target.checked })}
                disabled={disabled}
                className="w-5 h-5 rounded accent-nofx-success"
              />
              <span className="text-nofx-text">{t('useOITop', language)}</span>
            </label>
            {config.use_oi_top && (
              <div className="flex items-center gap-3 pl-8">
                <span className="text-sm text-nofx-text-muted">{t('oiTopLimit', language)}:</span>
                <select
                  value={config.oi_top_limit || 10}
                  onChange={(e) => !disabled && onChange({ ...config, oi_top_limit: parseInt(e.target.value) || 10 })}
                  disabled={disabled}
                  className="px-3 py-1.5 rounded bg-nofx-bg border border-nofx-gold/20 text-nofx-text"
                >
                  {[5, 10, 15, 20, 30, 50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            )}
            <p className="text-xs pl-8 text-nofx-text-muted">{t('nofxosNote', language)}</p>
          </div>
        </div>
      )}

      {config.source_type === 'oi_low' && (
        <div className="p-4 rounded-lg bg-nofx-danger/5 border border-nofx-danger/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-nofx-danger" />
              <span className="text-sm font-medium text-nofx-text">
                OI {language === 'zh' ? '持仓减少榜' : 'Decrease'} {t('dataSourceConfig', language)}
              </span>
              <NofxOSBadge />
            </div>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.use_oi_low}
                onChange={(e) => !disabled && onChange({ ...config, use_oi_low: e.target.checked })}
                disabled={disabled}
                className="w-5 h-5 rounded accent-red-500"
              />
              <span className="text-nofx-text">{t('useOILow', language)}</span>
            </label>
            {config.use_oi_low && (
              <div className="flex items-center gap-3 pl-8">
                <span className="text-sm text-nofx-text-muted">{t('oiLowLimit', language)}:</span>
                <select
                  value={config.oi_low_limit || 10}
                  onChange={(e) => !disabled && onChange({ ...config, oi_low_limit: parseInt(e.target.value) || 10 })}
                  disabled={disabled}
                  className="px-3 py-1.5 rounded bg-nofx-bg border border-nofx-gold/20 text-nofx-text"
                >
                  {[5, 10, 15, 20, 30, 50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            )}
            <p className="text-xs pl-8 text-nofx-text-muted">{t('nofxosNote', language)}</p>
          </div>
        </div>
      )}

      {config.source_type === 'mixed' && (
        <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-4">
            <Shuffle className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-nofx-text">{t('mixedConfig', language)}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className={`p-3 rounded-lg border transition-all cursor-pointer ${config.use_ai500 ? 'bg-nofx-gold/10 border-nofx-gold/50' : 'bg-nofx-bg border-nofx-border hover:border-nofx-gold/30'}`} onClick={() => !disabled && onChange({ ...config, use_ai500: !config.use_ai500 })}>
              <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" checked={config.use_ai500} onChange={(e) => { e.stopPropagation(); !disabled && onChange({ ...config, use_ai500: e.target.checked }) }} disabled={disabled} className="w-4 h-4 rounded accent-nofx-gold" onClick={(e) => e.stopPropagation()} />
                <Database className="w-4 h-4 text-nofx-gold" />
                <span className="text-sm font-medium text-nofx-text">AI500</span>
                <NofxOSBadge />
              </div>
            </div>
            <div className={`p-3 rounded-lg border transition-all cursor-pointer ${config.use_oi_top ? 'bg-nofx-success/10 border-nofx-success/50' : 'bg-nofx-bg border-nofx-border hover:border-nofx-success/30'}`} onClick={() => !disabled && onChange({ ...config, use_oi_top: !config.use_oi_top })}>
              <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" checked={config.use_oi_top} onChange={(e) => { e.stopPropagation(); !disabled && onChange({ ...config, use_oi_top: e.target.checked }) }} disabled={disabled} className="w-4 h-4 rounded accent-nofx-success" onClick={(e) => e.stopPropagation()} />
                <TrendingUp className="w-4 h-4 text-nofx-success" />
                <span className="text-sm font-medium text-nofx-text">{language === 'zh' ? 'OI 增加' : 'OI Increase'}</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border transition-all cursor-pointer ${config.use_oi_low ? 'bg-nofx-danger/10 border-nofx-danger/50' : 'bg-nofx-bg border-nofx-border hover:border-nofx-danger/30'}`} onClick={() => !disabled && onChange({ ...config, use_oi_low: !config.use_oi_low })}>
              <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" checked={config.use_oi_low} onChange={(e) => { e.stopPropagation(); !disabled && onChange({ ...config, use_oi_low: e.target.checked }) }} disabled={disabled} className="w-4 h-4 rounded accent-red-500" onClick={(e) => e.stopPropagation()} />
                <TrendingDown className="w-4 h-4 text-nofx-danger" />
                <span className="text-sm font-medium text-nofx-text">{language === 'zh' ? 'OI 减少' : 'OI Decrease'}</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${(config.static_coins || []).length > 0 ? 'bg-gray-500/10 border-gray-500/50' : 'bg-nofx-bg border-nofx-border'}`}>
              <div className="flex items-center gap-2 mb-2">
                <List className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-nofx-text">{language === 'zh' ? '自定义' : 'Custom'}</span>
                {(config.static_coins || []).length > 0 && <span className="text-xs px-1.5 py-0.5 rounded bg-gray-500/20 text-gray-400">{config.static_coins?.length}</span>}
              </div>
            </div>
          </div>
          {(() => {
            const { sources, totalLimit } = getMixedSummary()
            if (sources.length === 0) return null
            return (
              <div className="p-2 rounded bg-nofx-bg border border-nofx-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-nofx-text-muted">{t('mixedSummary', language)}:</span>
                  <span className="text-nofx-text font-medium">{sources.join(' + ')}</span>
                </div>
                <div className="text-xs text-nofx-text-muted mt-1">{t('maxCoins', language)} {totalLimit} {t('coins', language)}</div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
