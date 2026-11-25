import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Headphones,
  ArrowUpRight,
  Radio,
} from 'lucide-react';
import {
  CrisisScenario,
  CrisisStatus,
  SocialChannel,
} from '../../types/crisis';
import { RadarMonitor } from '../RadarMonitor';

interface Screen1DetectionProps {
  scenario: CrisisScenario;
  status: CrisisStatus;
  selectedChannel: SocialChannel | 'ALL';
  onSelectChannel: (channel: SocialChannel | 'ALL') => void;
  onClassifyHighCrisis: () => void;
  onClassifyLowScale: () => void;
  onGoToScreen2: () => void;
}

export const Screen1Detection: React.FC<Screen1DetectionProps> = ({
  scenario,
  status,
  selectedChannel,
  onSelectChannel,
  onClassifyHighCrisis,
  onClassifyLowScale,
  onGoToScreen2,
}) => {
  const visibleChannels =
    selectedChannel === 'ALL'
      ? scenario.channels
      : scenario.channels.filter((c) => c.channel === selectedChannel);

  const filterOptions: Array<{ key: SocialChannel | 'ALL'; label: string }> = [
    { key: 'ALL', label: 'Semua Kanal' },
    { key: 'TikTok', label: 'TikTok' },
    { key: 'X', label: 'X' },
    { key: 'Instagram', label: 'Instagram' },
  ];

  return (
    <div className="space-y-3.5">
      {/* Card 1: Real-time Negative Sentiment Radar */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h2 className="text-[15px] font-bold text-slate-900 leading-snug">
              Radar Sentimen Negatif Real-Time
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Terdeteksi {scenario.detectedAt} ·{' '}
              <span className="font-mono tabular-nums">
                {scenario.totalMentions.toLocaleString('id-ID')}
              </span>{' '}
              sebutan
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold whitespace-nowrap shrink-0 ${
              status === 'resolved'
                ? 'text-emerald-700'
                : status === 'low_scale_cs'
                  ? 'text-amber-700'
                  : 'text-red-600'
            }`}
          >
            <Radio className="w-3.5 h-3.5" aria-hidden="true" />
            {status === 'resolved' ? 'Terkendali' : 'Pantau Aktif'}
          </span>
        </div>

        <RadarMonitor
          channels={scenario.channels}
          selectedChannel={selectedChannel}
          onSelectChannel={onSelectChannel}
          status={status}
          overallNegativePct={scenario.overallNegativePct}
        />

        <div className="mt-3.5 pt-3 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-900">
            {scenario.title}
          </p>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {scenario.summary}
          </p>
        </div>
      </section>

      {/* Card 2: Social Channel Sources (TikTok, X, Instagram) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-[15px] font-bold text-slate-900">
            Sumber Kanal Media Sosial
          </h2>
          <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
            {visibleChannels.length} kanal aktif
          </span>
        </div>

        {/* Interactive filter bar */}
        <div
          className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl mb-3"
          role="tablist"
          aria-label="Filter kanal media sosial"
        >
          {filterOptions.map((opt) => {
            const active = selectedChannel === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelectChannel(opt.key)}
                className={`min-h-[36px] px-2 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap truncate ${
                  active
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Channel metrics & live excerpt rows */}
        <div className="divide-y divide-slate-100">
          {visibleChannels.map((item) => (
            <div key={item.channel} className="py-3 first:pt-1 last:pb-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-slate-900 whitespace-nowrap">
                    {item.channel}
                  </span>
                  <span className="text-slate-300" aria-hidden="true">
                    ·
                  </span>
                  <span className="text-xs text-slate-500 truncate">
                    {item.trendingTag}
                  </span>
                </div>
                <span
                  className={`text-xs font-mono tabular-nums font-bold whitespace-nowrap shrink-0 ${
                    status === 'resolved'
                      ? 'text-emerald-700'
                      : item.negativePercentage >= 80
                        ? 'text-red-600'
                        : 'text-amber-700'
                  }`}
                >
                  {status === 'resolved' ? '14%' : `${item.negativePercentage}%`}{' '}
                  negatif
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                “{item.samplePost}”
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                <span className="truncate">
                  {item.sampleAuthor} · {item.sampleTime}
                </span>
                <span className="font-mono tabular-nums whitespace-nowrap shrink-0">
                  {item.velocityPerHour} · {item.reachEstimate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Card 3: Classification Decision */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-3">
          <h2 className="text-[15px] font-bold text-slate-900">
            Keputusan Klasifikasi Krisis
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Tentukan eskalasi berdasarkan lonjakan sentimen dan potensi dampak
            reputasi perusahaan.
          </p>
        </div>

        {status === 'low_scale_cs' && (
          <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900">
            <div className="flex items-center gap-2 font-semibold">
              <Headphones className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Dialihkan ke Antrean Layanan Pelanggan (CS)</span>
            </div>
            <p className="mt-1 text-amber-800 leading-relaxed">
              Tiket keluhan dikirim ke tim Customer Care untuk respons 1-on-1.
              Anda dapat menaikkan status kapan saja jika volume membesar.
            </p>
          </div>
        )}

        {status === 'high_crisis' && (
          <div className="mb-3 rounded-xl border border-red-200 bg-red-50/80 p-3 text-xs text-red-900">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                Status: Krisis Tinggi Aktif
              </span>
              <button
                type="button"
                onClick={onGoToScreen2}
                className="inline-flex items-center gap-1 font-semibold text-red-700 underline underline-offset-2 whitespace-nowrap"
              >
                Buka Tahap 2
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {status === 'resolved' && (
          <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-900">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Krisis Telah Teratasi — Pemantauan Normal</span>
            </div>
          </div>
        )}

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={onClassifyHighCrisis}
            className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Krisis Tinggi (Ya)</span>
          </button>

          <button
            type="button"
            onClick={onClassifyLowScale}
            className={`w-full min-h-[46px] px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              status === 'low_scale_cs'
                ? 'border-amber-400 bg-amber-50 text-amber-900'
                : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800'
            }`}
          >
            <Headphones className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Skala Rendah (Tidak - Tangani via CS)</span>
          </button>
        </div>
      </section>
    </div>
  );
};
