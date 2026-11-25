import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Headphones,
  Radio,
  RotateCcw,
  ArrowRight,
  Columns3,
  Smartphone,
} from 'lucide-react';
import { CRISIS_SCENARIOS } from './data/crisisScenarios';
import {
  AuditEntry,
  CrisisStatus,
  CrisisTeamMember,
  PublishChannelState,
  ScreenStep,
  SocialChannel,
} from './types/crisis';
import { CrisisAppStateProps, MobileAppShell } from './components/MobileAppShell';

type DesktopViewMode = 'interactive' | 'three-screen';

function formatNowWIB(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${hh}:${mm} WIB`;
}

function createInitialPublishChannels(): PublishChannelState[] {
  return [
    {
      id: 'TikTok',
      label: 'TikTok Resmi',
      accountHandle: '@brand.official',
      selected: true,
      published: false,
    },
    {
      id: 'X',
      label: 'X (Twitter)',
      accountHandle: '@BrandCare_ID',
      selected: true,
      published: false,
    },
    {
      id: 'Instagram',
      label: 'Instagram',
      accountHandle: '@brand.indonesia',
      selected: true,
      published: false,
    },
    {
      id: 'Portal Pers',
      label: 'Ruang Pers & Media',
      accountHandle: 'press.brand.co.id',
      selected: false,
      published: false,
    },
  ];
}

export default function App() {
  const [desktopView, setDesktopView] =
    useState<DesktopViewMode>('interactive');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const scenario = CRISIS_SCENARIOS[scenarioIndex];

  const [status, setStatus] = useState<CrisisStatus>('monitoring');
  const [activeScreen, setActiveScreen] = useState<ScreenStep>(1);
  const [selectedChannel, setSelectedChannel] = useState<SocialChannel | 'ALL'>(
    'ALL'
  );
  const [teamActivated, setTeamActivated] = useState(false);
  const [teamMembers, setTeamMembers] = useState<CrisisTeamMember[]>(
    () => scenario.teamMembers
  );
  const [contentPaused, setContentPaused] = useState(false);
  const [holdStatement, setHoldStatement] = useState(
    () => scenario.templates[0].content
  );
  const [legalApproved, setLegalApproved] = useState(false);
  const [publishChannels, setPublishChannels] = useState<PublishChannelState[]>(
    createInitialPublishChannels
  );
  const [isPublished, setIsPublished] = useState(false);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([
    {
      id: 'init-1',
      timestamp: scenario.detectedAt,
      step: 1,
      action: `Radar mendeteksi lonjakan sentimen negatif (${scenario.overallNegativePct}%) pada ${scenario.title}.`,
      tone: 'danger',
    },
  ]);

  const appendAudit = (
    step: ScreenStep,
    action: string,
    tone: AuditEntry['tone'] = 'neutral'
  ) => {
    setAuditLog((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: formatNowWIB(),
        step,
        action,
        tone,
      },
      ...prev,
    ]);
  };

  const resetForScenario = (idx: number) => {
    const nextScenario = CRISIS_SCENARIOS[idx];
    setScenarioIndex(idx);
    setStatus('monitoring');
    setActiveScreen(1);
    setSelectedChannel('ALL');
    setTeamActivated(false);
    setTeamMembers(nextScenario.teamMembers.map((m) => ({ ...m })));
    setContentPaused(false);
    setHoldStatement(nextScenario.templates[0].content);
    setLegalApproved(false);
    setPublishChannels(createInitialPublishChannels());
    setIsPublished(false);
    setAuditLog([
      {
        id: `reset-${Date.now()}`,
        timestamp: nextScenario.detectedAt,
        step: 1,
        action: `Simulasi dimulai untuk skenario: ${nextScenario.title}.`,
        tone: 'danger',
      },
    ]);
  };

  const handleClassifyHighCrisis = () => {
    setStatus('high_crisis');
    setActiveScreen(2);
    appendAudit(
      1,
      'Keputusan klasifikasi: Krisis Tinggi (Ya) — dieskalasi ke Tahap 2.',
      'danger'
    );
  };

  const handleClassifyLowScale = () => {
    setStatus('low_scale_cs');
    appendAudit(
      1,
      'Keputusan klasifikasi: Skala Rendah (Tidak) — dialihkan ke antrean Customer Service.',
      'warning'
    );
  };

  const handleActivateTeam = () => {
    const nextActivated = !teamActivated;
    setTeamActivated(nextActivated);
    if (nextActivated) {
      setStatus((prev) => (prev === 'resolved' ? prev : 'high_crisis'));
      setContentPaused(true);
      setTeamMembers((prev) =>
        prev.map((m, idx) => (idx < 3 ? { ...m, acknowledged: true } : m))
      );
      appendAudit(
        2,
        'Tombol darurat ditekan: Crisis Team diaktifkan & jadwal konten reguler otomatis dijeda.',
        'danger'
      );
    } else {
      appendAudit(2, 'Status siaga Crisis Team dinonaktifkan.', 'neutral');
    }
  };

  const handleToggleMemberAck = (memberId: string) => {
    setTeamMembers((prev) =>
      prev.map((m) =>
        m.id === memberId ? { ...m, acknowledged: !m.acknowledged } : m
      )
    );
  };

  const handleTogglePauseContent = () => {
    const nextPaused = !contentPaused;
    setContentPaused(nextPaused);
    appendAudit(
      2,
      nextPaused
        ? `Pause Content diaktifkan (${scenario.scheduledPosts.length} konten reguler ditangguhkan).`
        : 'Penjadwalan konten reguler dilanjutkan kembali.',
      nextPaused ? 'warning' : 'neutral'
    );
  };

  const handleSelectTemplate = (content: string, label: string) => {
    setHoldStatement(content);
    appendAudit(2, `Templat Hold Statement diterapkan: ${label}.`, 'neutral');
  };

  const handleTogglePublishChannel = (
    channelId: PublishChannelState['id']
  ) => {
    setPublishChannels((prev) =>
      prev.map((ch) =>
        ch.id === channelId ? { ...ch, selected: !ch.selected } : ch
      )
    );
  };

  const handlePublishAll = () => {
    const timeStr = formatNowWIB();
    const targetNames = publishChannels
      .filter((c) => c.selected)
      .map((c) => c.id)
      .join(', ');

    setPublishChannels((prev) =>
      prev.map((ch) =>
        ch.selected ? { ...ch, published: true, publishedAt: timeStr } : ch
      )
    );
    setIsPublished(true);
    appendAudit(
      3,
      `Klarifikasi resmi dipublikasikan serentak ke: ${targetNames}.`,
      'success'
    );
  };

  const handleResolveCrisis = () => {
    setStatus('resolved');
    appendAudit(
      3,
      'Konfirmasi Selesai (Krisis Teratasi) — sentimen publik kembali pulih.',
      'success'
    );
  };

  const sharedAppProps: CrisisAppStateProps = {
    scenario,
    status,
    activeScreen,
    selectedChannel,
    teamActivated,
    teamMembers,
    contentPaused,
    holdStatement,
    legalApproved,
    publishChannels,
    isPublished,
    onChangeScreen: setActiveScreen,
    onSelectChannel: setSelectedChannel,
    onClassifyHighCrisis: handleClassifyHighCrisis,
    onClassifyLowScale: handleClassifyLowScale,
    onActivateTeam: handleActivateTeam,
    onToggleMemberAck: handleToggleMemberAck,
    onTogglePauseContent: handleTogglePauseContent,
    onChangeStatement: setHoldStatement,
    onSelectTemplate: handleSelectTemplate,
    onToggleLegalApproved: () => setLegalApproved((v) => !v),
    onTogglePublishChannel: handleTogglePublishChannel,
    onPublishAll: handlePublishAll,
    onResolveCrisis: handleResolveCrisis,
    onResetSimulation: () => resetForScenario(scenarioIndex),
  };

  const statusSummary = (() => {
    switch (status) {
      case 'high_crisis':
        return {
          label: 'Krisis Tinggi (Aktif)',
          description:
            'Eskalasi prioritas tinggi aktif. Koordinasikan Crisis Team, jeda konten promo, dan terbitkan Hold Statement.',
          badgeClass: 'bg-red-50 text-red-700 border-red-200',
          Icon: AlertTriangle,
        };
      case 'resolved':
        return {
          label: 'Selesai (Krisis Teratasi)',
          description:
            'Klarifikasi terdistribusi dan sentimen publik berangsur pulih menuju garis dasar normal.',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          Icon: CheckCircle2,
        };
      case 'low_scale_cs':
        return {
          label: 'Skala Rendah (Ditangani CS)',
          description:
            'Isu ditangani secara langsung oleh tim Layanan Pelanggan tanpa aktivasi darurat.',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
          Icon: Headphones,
        };
      default:
        return {
          label: 'Deteksi Dini & Pemantauan',
          description:
            'Radar mendeteksi lonjakan sebutan negatif lintas media sosial. Menunggu keputusan klasifikasi Humas.',
          badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
          Icon: Radio,
        };
    }
  })();

  const StatusSummaryIcon = statusSummary.Icon;

  const stages: Array<{
    step: ScreenStep;
    title: string;
    subtitle: string;
  }> = [
    {
      step: 1,
      title: '1. Deteksi Dini & Klasifikasi',
      subtitle: 'Radar sentimen real-time, TikTok/X/IG, keputusan eskalasi',
    },
    {
      step: 2,
      title: '2. Aktivasi Tim & Formulasi Pesan',
      subtitle: 'Tombol darurat Crisis Team, Pause Content, Hold Statement',
    },
    {
      step: 3,
      title: '3. Publikasi & Evaluasi Reputasi',
      subtitle: 'Distribusi serentak, grafik pemulihan, konfirmasi selesai',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900">
      {/* Native Full-Screen Mobile View (< lg) */}
      <div className="lg:hidden">
        <MobileAppShell {...sharedAppProps} isFramed={false} />
      </div>

      {/* Desktop Prototype Studio View (lg+) */}
      <div className="hidden lg:block">
        {/* 3-Zone Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between gap-8">
            {/* Zone 1: Single-element wordmark */}
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                setDesktopView('interactive');
              }}
              className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
            >
              CrisisGuard PR
            </a>

            {/* Zone 2: Clean single-line navigation links */}
            <nav
              aria-label="Navigasi Prototipe"
              className="flex items-center gap-7 text-sm font-medium"
            >
              <button
                type="button"
                onClick={() => setDesktopView('interactive')}
                className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                  desktopView === 'interactive'
                    ? 'border-slate-900 text-slate-900 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Prototipe Interaktif
              </button>
              <button
                type="button"
                onClick={() => setDesktopView('three-screen')}
                className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                  desktopView === 'three-screen'
                    ? 'border-slate-900 text-slate-900 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Papan 3 Layar
              </button>
              <button
                type="button"
                onClick={() => {
                  setDesktopView('interactive');
                  setActiveScreen(1);
                }}
                className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                  desktopView === 'interactive' && activeScreen === 1
                    ? 'border-slate-400 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Tahap Deteksi
              </button>
              <button
                type="button"
                onClick={() => {
                  setDesktopView('interactive');
                  setActiveScreen(2);
                }}
                className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                  desktopView === 'interactive' && activeScreen === 2
                    ? 'border-slate-400 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Tahap Aktivasi
              </button>
              <button
                type="button"
                onClick={() => {
                  setDesktopView('interactive');
                  setActiveScreen(3);
                }}
                className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                  desktopView === 'interactive' && activeScreen === 3
                    ? 'border-slate-400 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Tahap Evaluasi
              </button>
            </nav>

            {/* Zone 3: Single primary action */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => resetForScenario(scenarioIndex)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset Simulasi</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-8 py-8">
          {/* Workspace Intro & Mode Switcher Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <p className="text-xs font-medium text-slate-500">
                Prototipe UI/UX Aplikasi Mobile Humas · 3 Tahap Alur Kerja
              </p>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 text-balance">
                Digitalisasi Manajemen Krisis Media Sosial
              </h1>
            </div>

            <div className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setDesktopView('interactive')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  desktopView === 'interactive'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mode Perangkat</span>
              </button>
              <button
                type="button"
                onClick={() => setDesktopView('three-screen')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  desktopView === 'three-screen'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Columns3 className="w-3.5 h-3.5" />
                <span>Tampilkan 3 Layar</span>
              </button>
            </div>
          </div>

          {desktopView === 'interactive' ? (
            <div className="grid grid-cols-12 gap-8 items-start">
              {/* Left Column: Interactive Mobile Wireframe */}
              <div className="col-span-5">
                <MobileAppShell {...sharedAppProps} isFramed />
              </div>

              {/* Right Column: Workflow Status & Scenario Controls */}
              <div className="col-span-7 space-y-6">
                {/* Status Indicator Card */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        Status Penanganan Saat Ini
                      </p>
                      <h2 className="text-lg font-bold text-slate-900 mt-1">
                        {scenario.title}
                      </h2>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap shrink-0 ${statusSummary.badgeClass}`}
                    >
                      <StatusSummaryIcon
                        className="w-4 h-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{statusSummary.label}</span>
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {statusSummary.description}
                  </p>

                  {/* 3-Stage Interactive Stepper */}
                  <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-3 gap-3">
                    {stages.map((st) => {
                      const isCurrent = activeScreen === st.step;
                      return (
                        <button
                          key={st.step}
                          type="button"
                          onClick={() => setActiveScreen(st.step)}
                          className={`text-left p-3.5 rounded-xl border transition-colors ${
                            isCurrent
                              ? 'border-slate-900 bg-slate-50'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <p className="text-xs font-bold text-slate-900">
                            {st.title}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            {st.subtitle}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Scenario Selector Card */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="text-base font-bold text-slate-900">
                    Skenario Simulasi Krisis
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 mb-4">
                    Pilih studi kasus untuk menguji radar sentimen, tim darurat,
                    dan templat klarifikasi di perangkat mobile.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {CRISIS_SCENARIOS.map((sc, idx) => {
                      const active = idx === scenarioIndex;
                      return (
                        <button
                          key={sc.id}
                          type="button"
                          onClick={() => resetForScenario(idx)}
                          className={`text-left p-4 rounded-xl border transition-colors ${
                            active
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-900'
                          }`}
                        >
                          <p
                            className={`text-[11px] font-medium ${
                              active ? 'text-slate-300' : 'text-slate-500'
                            }`}
                          >
                            {sc.category} · {sc.detectedAt}
                          </p>
                          <p className="text-sm font-bold mt-1">{sc.title}</p>
                          <p
                            className={`text-xs mt-1.5 font-mono tabular-nums ${
                              active ? 'text-red-300' : 'text-red-600'
                            }`}
                          >
                            {sc.overallNegativePct}% sentimen negatif ·{' '}
                            {sc.totalMentions.toLocaleString('id-ID')} sebutan
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Audit Trail Card */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h2 className="text-base font-bold text-slate-900">
                      Riwayat Keputusan & Aktivitas
                    </h2>
                    <span className="text-xs text-slate-500 font-mono tabular-nums">
                      {auditLog.length} catatan
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-[240px] overflow-y-auto pr-1">
                    {auditLog.map((entry) => {
                      const toneText =
                        entry.tone === 'danger'
                          ? 'text-red-600'
                          : entry.tone === 'success'
                            ? 'text-emerald-700'
                            : entry.tone === 'warning'
                              ? 'text-amber-700'
                              : 'text-slate-600';

                      return (
                        <div
                          key={entry.id}
                          className="py-2.5 flex items-start justify-between gap-4 text-xs"
                        >
                          <div className="min-w-0">
                            <span
                              className={`font-semibold mr-2 ${toneText}`}
                            >
                              Tahap {entry.step}
                            </span>
                            <span className="text-slate-800">
                              {entry.action}
                            </span>
                          </div>
                          <span className="font-mono tabular-nums text-[11px] text-slate-400 whitespace-nowrap shrink-0">
                            {entry.timestamp}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            </div>
          ) : (
            /* 3-Screen Side-by-Side Wireframe Flow View */
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${statusSummary.badgeClass}`}
                  >
                    <StatusSummaryIcon className="w-4 h-4" />
                    <span>{statusSummary.label}</span>
                  </span>
                  <span className="text-xs text-slate-600">
                    Seluruh tombol dan formulir pada ketiga layar tetap sinkron
                    secara langsung.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {CRISIS_SCENARIOS.map((sc, idx) => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => resetForScenario(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                        idx === scenarioIndex
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {sc.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 items-start">
                {stages.map((st, idx) => (
                  <div key={st.step} className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <div>
                        <h2 className="text-sm font-bold text-slate-900">
                          {st.title}
                        </h2>
                        <p className="text-xs text-slate-500">{st.subtitle}</p>
                      </div>
                      {idx < 2 && (
                        <ArrowRight
                          className="w-4 h-4 text-slate-400 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    <MobileAppShell
                      {...sharedAppProps}
                      forcedScreen={st.step}
                      isFramed
                      onChangeScreen={(target) => {
                        setActiveScreen(target);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
