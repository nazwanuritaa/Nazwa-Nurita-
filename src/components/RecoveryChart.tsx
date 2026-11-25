import React, { useState } from 'react';
import { SentimentDataPoint } from '../types/crisis';

interface RecoveryChartProps {
  beforePublish: SentimentDataPoint[];
  afterPublish: SentimentDataPoint[];
  isPublished: boolean;
  isResolved: boolean;
}

export const RecoveryChart: React.FC<RecoveryChartProps> = ({
  beforePublish,
  afterPublish,
  isPublished,
  isResolved,
}) => {
  const activePoints = isPublished
    ? [...beforePublish, ...afterPublish]
    : beforePublish;

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const width = 320;
  const height = 148;
  const padLeft = 28;
  const padRight = 14;
  const padTop = 18;
  const padBottom = 26;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const totalSlots = beforePublish.length + afterPublish.length;
  const getX = (index: number) =>
    padLeft + (index / Math.max(1, totalSlots - 1)) * chartW;
  const getY = (score: number) =>
    padTop + chartH - (score / 100) * chartH;

  // Build positive sentiment path
  const pointsCoords = activePoints.map((pt, i) => ({
    x: getX(i),
    y: getY(pt.positiveScore),
    negY: getY(pt.negativeScore),
    pt,
    idx: i,
  }));

  const positiveLinePath = pointsCoords
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const areaPath =
    pointsCoords.length > 1
      ? `${positiveLinePath} L ${pointsCoords[pointsCoords.length - 1].x.toFixed(1)} ${(
          padTop + chartH
        ).toFixed(1)} L ${pointsCoords[0].x.toFixed(1)} ${(padTop + chartH).toFixed(1)} Z`
      : '';

  // Projected dashed path when not published yet
  const lastBefore = pointsCoords[beforePublish.length - 1];
  const projectedCoords = [
    lastBefore,
    ...afterPublish.map((pt, idx) => ({
      x: getX(beforePublish.length + idx),
      y: getY(pt.positiveScore),
    })),
  ];
  const projectedPath = projectedCoords
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const publishX = getX(beforePublish.length - 1);
  const inspectedIndex =
    hoveredIdx !== null && hoveredIdx < pointsCoords.length
      ? hoveredIdx
      : pointsCoords.length - 1;
  const inspected = pointsCoords[inspectedIndex];

  const strokeColor = isResolved
    ? '#16A34A'
    : isPublished
      ? '#059669'
      : '#DC2626';

  return (
    <div className="space-y-2">
      {/* Top interactive readout */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <span className="font-mono tabular-nums font-semibold text-slate-900">
            {inspected.pt.timeLabel} WIB
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Positif{' '}
            <strong className="font-mono tabular-nums text-emerald-700">
              {inspected.pt.positiveScore}%
            </strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Negatif{' '}
            <strong className="font-mono tabular-nums text-red-600">
              {inspected.pt.negativeScore}%
            </strong>
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible select-none"
        role="img"
        aria-label="Grafik pemulihan sentimen pasca-klarifikasi"
      >
        <defs>
          <linearGradient id="recoveryFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.22" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Horizontal gridlines */}
        {[0, 50, 100].map((val) => {
          const y = getY(val);
          return (
            <g key={val}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              <text
                x={padLeft - 6}
                y={y + 3}
                textAnchor="end"
                className="text-[9px] fill-slate-400 font-mono"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Projected curve before publish */}
        {!isPublished && (
          <path
            d={projectedPath}
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        )}

        {/* Area fill */}
        {areaPath && <path d={areaPath} fill="url(#recoveryFill)" />}

        {/* Clarification marker line */}
        <line
          x1={publishX}
          y1={padTop}
          x2={publishX}
          y2={padTop + chartH}
          stroke={isPublished ? '#0F172A' : '#CBD5E1'}
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text
          x={publishX}
          y={padTop - 5}
          textAnchor="middle"
          className={`text-[9px] font-medium ${
            isPublished ? 'fill-slate-900' : 'fill-slate-400'
          }`}
        >
          {isPublished ? 'Klarifikasi Terbit' : 'Titik Klarifikasi'}
        </text>

        {/* Positive recovery curve */}
        <path
          d={positiveLinePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interactive nodes */}
        {pointsCoords.map((p) => {
          const isActive = p.idx === inspectedIndex;
          return (
            <g
              key={p.pt.timeLabel}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(p.idx)}
              onClick={() => setHoveredIdx(p.idx)}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={isActive ? 5 : 3.2}
                fill="#FFFFFF"
                stroke={strokeColor}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <circle cx={p.x} cy={p.y} r="12" fill="transparent" />
            </g>
          );
        })}

        {/* X-axis labels (first, middle, last) */}
        {[...beforePublish, ...afterPublish].map((pt, idx, arr) => {
          if (idx !== 0 && idx !== beforePublish.length - 1 && idx !== arr.length - 1) {
            return null;
          }
          return (
            <text
              key={pt.timeLabel}
              x={getX(idx)}
              y={height - 6}
              textAnchor="middle"
              className="text-[9px] fill-slate-500 font-mono"
            >
              {pt.timeLabel}
            </text>
          );
        })}
      </svg>

      {/* Legend / Context */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
        <span>Kurva Sentimen Positif (%)</span>
        <span>
          {isPublished
            ? isResolved
              ? 'Pemulihan +64 poin tercapai'
              : 'Tren pemulihan sedang berlangsung'
            : 'Menunggu distribusi klarifikasi'}
        </span>
      </div>
    </div>
  );
};
