import React from 'react';
import {
  ShieldAlert,
  PauseCircle,
  PlayCircle,
  Users,
  Check,
  FileEdit,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import {
  CrisisScenario,
  CrisisStatus,
  CrisisTeamMember,
} from '../../types/crisis';

interface Screen2ActivationProps {
  scenario: CrisisScenario;
  status: CrisisStatus;
  teamActivated: boolean;
  teamMembers: CrisisTeamMember[];
  contentPaused: boolean;
  holdStatement: string;
  legalApproved: boolean;
  onActivateTeam: () => void;
  onToggleMemberAck: (memberId: string) => void;
  onTogglePauseContent: () => void;
  onChangeStatement: (text: string) => void;
  onSelectTemplate: (content: string, label: string) => void;
  onToggleLegalApproved: () => void;
  onProceedToPublish: () => void;
}

export const Screen2Activation: React.FC<Screen2ActivationProps> = ({
  scenario,
  status,
  teamActivated,
  teamMembers,
  contentPaused,
  holdStatement,
  legalApproved,
  onActivateTeam,
  onToggleMemberAck,
  onTogglePauseContent,
  onChangeStatement,
  onSelectTemplate,
  onToggleLegalApproved,
  onProceedToPublish,
}) => {
  const acknowledgedCount = teamMembers.filter((m) => m.acknowledged).length;

  return (
    <div className="space-y-3.5">
      {/* Card 1: Emergency Crisis Team Activation */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h2 className="text-[15px] font-bold text-slate-900">
              Aktivasi Crisis Team
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kirim panggilan darurat ke lintas divisi inti
            </p>
          </div>
          {teamActivated && (
            <span className="text-xs font-mono tabular-nums font-semibold text-emerald-700 whitespace-nowrap">
              {acknowledgedCount}/{teamMembers.length} siap
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onActivateTeam}
          className={`w-full min-h-[48px] px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.99] ${
            teamActivated
              ? 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100/70'
              : 'bg-red-600 text-white hover:bg-red-700 shadow-xs'
          }`}
        >
          {teamActivated ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
              <span>Crisis Team Aktif (Siaga Darurat)</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Aktifkan Crisis Team Sekarang</span>
            </>
          )}
        </button>

        {/* Team roster list */}
        <div className="mt-3 pt-2 border-t border-slate-100 divide-y divide-slate-100">
          {teamMembers.map((member) => (
            <button
              key={member.id}
              type="button"
              onClick={() => onToggleMemberAck(member.id)}
              className="w-full py-2.5 flex items-center justify-between gap-2 text-left hover:bg-slate-50/80 rounded-lg px-1 transition-colors min-h-[44px]"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {member.name}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {member.role} · {member.unit}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                  member.acknowledged
                    ? 'text-emerald-700'
                    : teamActivated
                      ? 'text-amber-700'
                      : 'text-slate-400'
                }`}
              >
                {member.acknowledged ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Bergabung
                  </>
                ) : teamActivated ? (
                  'Menunggu'
                ) : (
                  'Siaga'
                )}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Card 2: Automatic Pause Content Control */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[15px] font-bold text-slate-900">
              Jeda Jadwal Konten Reguler
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {contentPaused
                ? `${scenario.scheduledPosts.length} konten promosi otomatis ditangguhkan`
                : 'Konten reguler masih berjalan sesuai jadwal'}
            </p>
          </div>

          <button
            type="button"
            onClick={onTogglePauseContent}
            aria-pressed={contentPaused}
            className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
              contentPaused
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
          >
            {contentPaused ? (
              <>
                <PauseCircle className="w-4 h-4 shrink-0" />
                <span>Pause Content: Aktif</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4 shrink-0" />
                <span>Jeda Konten</span>
              </>
            )}
          </button>
        </div>

        {/* Scheduled content queue */}
        <div className="mt-3 pt-2 border-t border-slate-100 divide-y divide-slate-100">
          {scenario.scheduledPosts.map((post) => (
            <div
              key={post.id}
              className="py-2 flex items-center justify-between gap-2 text-xs"
            >
              <div className="min-w-0">
                <p
                  className={`font-medium truncate ${
                    contentPaused
                      ? 'text-slate-400 line-through'
                      : 'text-slate-800'
                  }`}
                >
                  {post.title}
                </p>
                <p className="text-[11px] text-slate-500">
                  {post.channel} · {post.scheduledAt}
                </p>
              </div>
              <span
                className={`text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                  contentPaused ? 'text-amber-700' : 'text-slate-600'
                }`}
              >
                {contentPaused ? 'Dijeda' : 'Terjadwal'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Card 3: Hold Statement / Official Clarification Composer */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <FileEdit className="w-4 h-4 text-slate-700 shrink-0" />
            <h2 className="text-[15px] font-bold text-slate-900">
              Hold Statement / Klarifikasi Resmi
            </h2>
          </div>
          <span className="text-[11px] font-mono tabular-nums text-slate-500">
            {holdStatement.length} kar
          </span>
        </div>

        {/* Quick template buttons */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {scenario.templates.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelectTemplate(tpl.content, tpl.label)}
              className="min-h-[34px] px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 transition-colors"
            >
              Pakai: {tpl.label}
            </button>
          ))}
        </div>

        <label htmlFor="hold-statement-input" className="sr-only">
          Isi Hold Statement atau Klarifikasi Resmi
        </label>
        <textarea
          id="hold-statement-input"
          rows={5}
          value={holdStatement}
          onChange={(e) => onChangeStatement(e.target.value)}
          placeholder="Susun pernyataan resmi yang empatik, faktual, dan solutif..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-colors"
        />

        {/* Legal & PR Lead sign-off */}
        <button
          type="button"
          onClick={onToggleLegalApproved}
          className="mt-2.5 w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between gap-2 text-left transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Users className="w-4 h-4 text-slate-600 shrink-0" />
            <span className="text-xs font-medium text-slate-800 truncate">
              Verifikasi Legal & Kepala Humas
            </span>
          </div>
          <span
            className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-colors ${
              legalApproved
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'bg-white border-slate-300'
            }`}
          >
            {legalApproved && <Check className="w-3.5 h-3.5" />}
          </span>
        </button>

        {/* Proceed to Screen 3 CTA */}
        <button
          type="button"
          onClick={onProceedToPublish}
          disabled={!holdStatement.trim()}
          className="mt-3 w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <span>
            {status === 'resolved'
              ? 'Lihat Evaluasi Publikasi'
              : 'Lanjut ke Publikasi Respon'}
          </span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      </section>
    </div>
  );
};
