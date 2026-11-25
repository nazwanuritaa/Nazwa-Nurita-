import React from 'react';
import { ChannelMetric, CrisisStatus, SocialChannel } from '../types/crisis';

interface RadarMonitorProps {
  channels: ChannelMetric[];
  selectedChannel: SocialChannel | 'ALL';
  onSelectChannel: (channel: SocialChannel | 'ALL') => void;
  status: CrisisStatus;
  overallNegativePct: number;
}

export const RadarMonitor: React.FC<RadarMonitorProps> = ({
  channels,
  selectedChannel,
  onSelectChannel,
  status,
  overallNegativePct,
}) => {
  const isResolved = status === 'resolved';
  const isHighCrisis = status === 'high_crisis';
  const isLowScale = status === 'low_scale_cs';

  const center = 110;
  const maxRadius = 86;

  // Semantic palette for radar rings and sweep
  const primaryStroke = isResolved
    ? '#16A34A'
    : isLowScale
      ? '#D97706'
      : '#DC2626';

  const sweepFill = isResolved
    ? 'rgba(22, 163, 74, 0.14)'
    : isLowScale
      ? 'rgba(217, 119, 6, 0.14)'
      : 'rgba(220, 38, 38, 0.16)';

  const displayedPct = isResolved ? 14 : isLowScale ? 26 : overallNegativePct;

  return (
    <div className="flex items-center gap-3">
      {/* Interactive SVG Radar */}
      <div className="relative shrink-0">
        <svg
          viewBox="0 0 220 220"
          className="w-[152px] h-[152px] select-none"
          role="img"
          aria-label="Radar monitoring sentimen negatif real-time"
        >
          <defs>
            <radialGradient id="radarBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={primaryStroke} stopOpacity="0.09" />
              <stop offset="70%" stopColor={primaryStroke} stopOpacity="0.03" />
              <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer radar background */}
          <circle cx={center} cy={center} r={maxRadius} fill="url(#radarBg)" />

          {/* Concentric rings */}
          {[0.33, 0.66, 1].map((ratio, idx) => (
            <circle
              key={idx}
              cx={center}
              cy={center}
              r={maxRadius * ratio}
              fill="none"
              stroke={idx === 0 ? primaryStroke : '#CBD5E1'}
              strokeOpacity={idx === 0 ? 0.45 : 0.7}
              strokeWidth={idx === 0 ? 1.25 : 1}
              strokeDasharray={idx === 1 ? '3 3' : undefined}
            />
          ))}

          {/* Crosshair axes */}
          <line
            x1={center - maxRadius}
            y1={center}
            x2={center + maxRadius}
            y2={center}
            stroke="#CBD5E1"
            strokeWidth="0.8"
          />
          <line
            x1={center}
            y1={center - maxRadius}
            x2={center}
            y2={center + maxRadius}
            stroke="#CBD5E1"
            strokeWidth="0.8"
          />

          {/* Radar sweep sector (subtle rotation when active) */}
          <g
            className="radar-sweep-group"
            style={{
              transformOrigin: `${center}px ${center}px`,
              animation: isResolved ? 'none' : 'spin 6s linear infinite',
            }}
          >
            <path
              d={`M ${center} ${center} L ${center} ${center - maxRadius} A ${maxRadius} ${maxRadius} 0 0 1 ${
                center + maxRadius * 0.72
              } ${center - maxRadius * 0.69} Z`}
              fill={sweepFill}
            />
            <line
              x1={center}
              y1={center}
              x2={center}
              y2={center - maxRadius}
              stroke={primaryStroke}
              strokeOpacity="0.55"
              strokeWidth="1.5"
            />
          </g>

          {/* Center hub */}
          <circle cx={center} cy={center} r="4" fill={primaryStroke} />

          {/* Channel blips */}
          {channels.map((item) => {
            const angleRad = (item.radarAngleDeg * Math.PI) / 180;
            const distance = isResolved
              ? maxRadius * 0.78
              : maxRadius * item.radarDistanceRatio;
            const x = center + Math.cos(angleRad) * distance;
            const y = center + Math.sin(angleRad) * distance;
            const isSelected = selectedChannel === item.channel;

            const blipColor = isResolved
              ? '#16A34A'
              : item.negativePercentage >= 80
                ? '#DC2626'
                : '#D97706';

            const shortLabel = item.channel === 'Instagram' ? 'IG' : item.channel;

            return (
              <g
                key={item.channel}
                onClick={() =>
                  onSelectChannel(isSelected ? 'ALL' : item.channel)
                }
                className="cursor-pointer"
              >
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="13"
                    fill={blipColor}
                    fillOpacity="0.16"
                    stroke={blipColor}
                    strokeWidth="1.2"
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 6.5 : 5.5}
                  fill={blipColor}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  className="text-[10px] font-semibold fill-slate-800"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {shortLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Right telemetry summary */}
      <div className="flex-1 min-w-0 space-y-2.5">
        <div>
          <p className="text-[11px] font-medium text-slate-500">
            Indeks Sentimen Negatif
          </p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span
              className={`text-3xl font-bold tracking-tight tabular-nums font-mono ${
                isResolved
                  ? 'text-emerald-700'
                  : isLowScale
                    ? 'text-amber-700'
                    : isHighCrisis
                      ? 'text-red-700'
                      : 'text-red-600'
              }`}
            >
              {displayedPct}%
            </span>
            <span className="text-xs text-slate-500">
              {isResolved ? 'stabil' : 'lonjakan'}
            </span>
          </div>
        </div>

        {/* Mini channel quick-select rows */}
        <div className="space-y-1.5">
          {channels.map((ch) => {
            const active = selectedChannel === ch.channel;
            const pct = isResolved
              ? Math.max(10, Math.round(ch.negativePercentage * 0.18))
              : ch.negativePercentage;

            return (
              <button
                key={ch.channel}
                type="button"
                onClick={() => onSelectChannel(active ? 'ALL' : ch.channel)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors min-h-[34px] ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <span className="font-medium truncate">{ch.channel}</span>
                <span
                  className={`font-mono tabular-nums font-semibold ${
                    active
                      ? 'text-white'
                      : isResolved
                        ? 'text-emerald-700'
                        : pct >= 80
                          ? 'text-red-600'
                          : 'text-amber-700'
                  }`}
                >
                  {pct}%
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
