import React from 'react';
import {
  Send,
  Check,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  Edit3,
} from 'lucide-react';
import {
  CrisisScenario,
  CrisisStatus,
  PublishChannelState,
} from '../../types/crisis';
import { RecoveryChart } from '../RecoveryChart';

interface Screen3PublishEvaluateProps {
  scenario: CrisisScenario;
  status: CrisisStatus;
  holdStatement: string;
  publishChannels: PublishChannelState[];
  isPublished: boolean;
  onTogglePublishChannel: (
    channelId: PublishChannelState['id']
  ) => void;
  onPublishAll: () => void;
  onEditStatement: () => void;
  onResolveCrisis: () => void;
  onResetSimulation: () => void;
}

export const Screen3PublishEvaluate: React.FC<Screen3PublishEvaluateProps> = ({
  scenario,
  status,
  holdStatement,
  publishChannels,
  isPublished,
  onTogglePublishChannel,
  onPublishAll,
  onEditStatement,
  onResolveCrisis,
  onResetSimulation,
}) => {
  const selectedCount = publishChannels.filter((c) => c.selected).length;
  const isResolved = status === 'resolved';

  return (
    <div className="space-y-3.5">
      {/* Card 1: Simultaneous Multi-Channel Publishing */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div>
            <h2 className="text-[15px] font-bold text-slate-900">
              Distribusi Serentak Lintas Kanal
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Publikasikan Hold Statement ke kanal terpilih sekaligus
            </p>
          </div>
          <button
            type="button"
            onClick={onEditStatement}
            className="min-h-[34px] px-2 text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1 whitespace-nowrap shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Ubah Teks
          </button>
        </div>

        {/* Statement preview block */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 mb-3">
          <p className="text-[11px] font-semibold text-slate-500 mb-1">
            Pratinjau Klarifikasi Resmi
          </p>
          <p className="text-xs text-slate-800 leading-relaxed line-clamp-3">
            {holdStatement || 'Belum ada teks Hold Statement yang disusun.'}
          </p>
        </div>

        {/* Channel checklist */}
        <div className="divide-y divide-slate-100 mb-3">
          {publishChannels.map((ch) => (
            <button
              key={ch.id}
              type="button"
              disabled={isPublished}
              onClick={() => onTogglePublishChannel(ch.id)}
              className="w-full py-2.5 flex items-center justify-between gap-2 text-left min-h-[44px] disabled:cursor-default"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-colors ${
                    ch.published
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : ch.selected
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-white border-slate-300'
                  }`}
                >
                  {(ch.selected || ch.published) && (
                    <Check className="w-3.5 h-3.5" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {ch.label}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {ch.accountHandle}
                  </p>
                </div>
              </div>

              <span
                className={`text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                  ch.published
                    ? 'text-emerald-700'
                    : ch.selected
                      ? 'text-slate-700'
                      : 'text-slate-400'
                }`}
              >
                {ch.published
                  ? `Terbit · ${ch.publishedAt}`
                  : ch.selected
                    ? 'Siap Terbit'
                    : 'Dilewati'}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onPublishAll}
          disabled={isPublished || selectedCount === 0 || !holdStatement.trim()}
          className={`w-full min-h-[46px] px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            isPublished
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white'
          }`}
        >
          {isPublished ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Klarifikasi Terdistribusi Serentak</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 shrink-0" />
              <span>Publikasikan Serentak ({selectedCount} Kanal)</span>
            </>
          )}
        </button>
      </section>

      {/* Card 2: Post-Clarification Sentiment Recovery Graph */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-slate-700 shrink-0" />
            <h2 className="text-[15px] font-bold text-slate-900">
              Grafik Pemulihan Sentimen
            </h2>
          </div>
          <span
            className={`text-[11px] font-semibold whitespace-nowrap ${
              isPublished ? 'text-emerald-700' : 'text-slate-500'
            }`}
          >
            {isPublished ? 'Pasca-Klarifikasi' : 'Pratinjau Krisis'}
          </span>
        </div>

        <RecoveryChart
          beforePublish={scenario.recoveryTimeline.beforePublish}
          afterPublish={scenario.recoveryTimeline.afterPublish}
          isPublished={isPublished}
          isResolved={isResolved}
        />

        {/* Quantitative reputation recovery summary */}
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[11px] text-slate-500">Sentimen Awal</p>
            <p className="text-sm font-bold font-mono tabular-nums text-red-600 mt-0.5">
              {scenario.recoveryTimeline.beforePublish[
                scenario.recoveryTimeline.beforePublish.length - 1
              ].positiveScore}
              %
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500">Saat Ini</p>
            <p
              className={`text-sm font-bold font-mono tabular-nums mt-0.5 ${
                isPublished ? 'text-emerald-700' : 'text-slate-900'
              }`}
            >
              {isPublished
                ? `${
                    scenario.recoveryTimeline.afterPublish[
                      scenario.recoveryTimeline.afterPublish.length - 1
                    ].positiveScore
                  }%`
                : `${
                    scenario.recoveryTimeline.beforePublish[
                      scenario.recoveryTimeline.beforePublish.length - 1
                    ].positiveScore
                  }%`}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500">Perubahan</p>
            <p
              className={`text-sm font-bold font-mono tabular-nums mt-0.5 ${
                isPublished ? 'text-emerald-700' : 'text-slate-400'
              }`}
            >
              {isPublished
                ? `+${
                    scenario.recoveryTimeline.afterPublish[
                      scenario.recoveryTimeline.afterPublish.length - 1
                    ].positiveScore -
                    scenario.recoveryTimeline.beforePublish[
                      scenario.recoveryTimeline.beforePublish.length - 1
                    ].positiveScore
                  } pt`
                : '0 pt'}
            </p>
          </div>
        </div>
      </section>

      {/* Card 3: Crisis Resolution Confirmation */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-[15px] font-bold text-slate-900">
          Evaluasi & Penutupan Krisis
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed mb-3">
          {isResolved
            ? 'Reputasi merek telah pulih dan jadwal konten reguler siap diaktifkan kembali.'
            : 'Konfirmasi penyelesaian jika sentimen publik telah kembali stabil pasca-klarifikasi.'}
        </p>

        {isResolved ? (
          <div className="space-y-2.5">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-900">
                  Status: Selesai (Krisis Teratasi)
                </p>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Laporan evaluasi reputasi tersimpan ke arsip Humas.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onResetSimulation}
              className="w-full min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Mulai Simulasi Krisis Baru</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onResolveCrisis}
            className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Selesai (Krisis Teratasi)</span>
          </button>
        )}
      </section>
    </div>
  );
};
