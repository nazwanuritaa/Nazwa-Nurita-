import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Headphones,
  Radio,
  Shield,
  Users,
  Send,
} from 'lucide-react';
import {
  CrisisScenario,
  CrisisStatus,
  CrisisTeamMember,
  PublishChannelState,
  ScreenStep,
  SocialChannel,
} from '../types/crisis';
import { Screen1Detection } from './screens/Screen1Detection';
import { Screen2Activation } from './screens/Screen2Activation';
import { Screen3PublishEvaluate } from './screens/Screen3PublishEvaluate';

export interface CrisisAppStateProps {
  scenario: CrisisScenario;
  status: CrisisStatus;
  activeScreen: ScreenStep;
  selectedChannel: SocialChannel | 'ALL';
  teamActivated: boolean;
  teamMembers: CrisisTeamMember[];
  contentPaused: boolean;
  holdStatement: string;
  legalApproved: boolean;
  publishChannels: PublishChannelState[];
  isPublished: boolean;
  onChangeScreen: (screen: ScreenStep) => void;
  onSelectChannel: (channel: SocialChannel | 'ALL') => void;
  onClassifyHighCrisis: () => void;
  onClassifyLowScale: () => void;
  onActivateTeam: () => void;
  onToggleMemberAck: (memberId: string) => void;
  onTogglePauseContent: () => void;
  onChangeStatement: (text: string) => void;
  onSelectTemplate: (content: string, label: string) => void;
  onToggleLegalApproved: () => void;
  onTogglePublishChannel: (channelId: PublishChannelState['id']) => void;
  onPublishAll: () => void;
  onResolveCrisis: () => void;
  onResetSimulation: () => void;
}

interface MobileAppShellProps extends CrisisAppStateProps {
  forcedScreen?: ScreenStep;
  isFramed?: boolean;
  stageSubtitle?: string;
}

export const MobileAppShell: React.FC<MobileAppShellProps> = ({
  forcedScreen,
  isFramed = true,
  stageSubtitle,
  ...state
}) => {
  const currentScreen = forcedScreen ?? state.activeScreen;

  const statusMeta = (() => {
    switch (state.status) {
      case 'high_crisis':
        return {
          label: 'Krisis Tinggi',
          barClass: 'bg-red-600 text-white',
          Icon: AlertTriangle,
        };
      case 'resolved':
        return {
          label: 'Selesai · Krisis Teratasi',
          barClass: 'bg-emerald-600 text-white',
          Icon: CheckCircle2,
        };
      case 'low_scale_cs':
        return {
          label: 'Skala Rendah · Tangani via CS',
          barClass: 'bg-amber-600 text-white',
          Icon: Headphones,
        };
      default:
        return {
          label: 'Pemantauan Dini',
          barClass: 'bg-slate-900 text-white',
          Icon: Radio,
        };
    }
  })();

  const StatusIcon = statusMeta.Icon;

  const screenTitles: Record<ScreenStep, string> = {
    1: 'Deteksi & Klasifikasi',
    2: 'Crisis Team & Pesan',
    3: 'Publikasi & Evaluasi',
  };

  const navItems: Array<{
    step: ScreenStep;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
  }> = [
    { step: 1, label: '1. Deteksi', Icon: Radio },
    { step: 2, label: '2. Crisis Team', Icon: Users },
    { step: 3, label: '3. Publikasi', Icon: Send },
  ];

  return (
    <div
      className={
        isFramed
          ? 'w-full max-w-[390px] mx-auto rounded-[32px] border border-slate-300 bg-slate-50 shadow-xl shadow-slate-900/5 overflow-hidden flex flex-col h-[760px]'
          : 'w-full min-h-screen bg-slate-50 flex flex-col'
      }
    >
      {/* Mobile Top Bar + Semantic Status Strip */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shrink-0">
        <div className="h-[50px] px-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 leading-none truncate">
                CrisisGuard PR
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                {stageSubtitle ?? screenTitles[currentScreen]}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap shrink-0 ${statusMeta.barClass}`}
          >
            <StatusIcon className="w-3 h-3 shrink-0" aria-hidden="true" />
            <span>{statusMeta.label}</span>
          </span>
        </div>
      </header>

      {/* Scrollable Card Content Canvas */}
      <main
        className={`flex-1 p-3.5 ${
          isFramed ? 'overflow-y-auto mobile-scroll' : 'pb-20'
        }`}
      >
        {currentScreen === 1 && (
          <Screen1Detection
            scenario={state.scenario}
            status={state.status}
            selectedChannel={state.selectedChannel}
            onSelectChannel={state.onSelectChannel}
            onClassifyHighCrisis={state.onClassifyHighCrisis}
            onClassifyLowScale={state.onClassifyLowScale}
            onGoToScreen2={() => state.onChangeScreen(2)}
          />
        )}

        {currentScreen === 2 && (
          <Screen2Activation
            scenario={state.scenario}
            status={state.status}
            teamActivated={state.teamActivated}
            teamMembers={state.teamMembers}
            contentPaused={state.contentPaused}
            holdStatement={state.holdStatement}
            legalApproved={state.legalApproved}
            onActivateTeam={state.onActivateTeam}
            onToggleMemberAck={state.onToggleMemberAck}
            onTogglePauseContent={state.onTogglePauseContent}
            onChangeStatement={state.onChangeStatement}
            onSelectTemplate={state.onSelectTemplate}
            onToggleLegalApproved={state.onToggleLegalApproved}
            onProceedToPublish={() => state.onChangeScreen(3)}
          />
        )}

        {currentScreen === 3 && (
          <Screen3PublishEvaluate
            scenario={state.scenario}
            status={state.status}
            holdStatement={state.holdStatement}
            publishChannels={state.publishChannels}
            isPublished={state.isPublished}
            onTogglePublishChannel={state.onTogglePublishChannel}
            onPublishAll={state.onPublishAll}
            onEditStatement={() => state.onChangeScreen(2)}
            onResolveCrisis={state.onResolveCrisis}
            onResetSimulation={state.onResetSimulation}
          />
        )}
      </main>

      {/* Bottom 3-Screen Thumb Navigation Bar */}
      <nav
        aria-label="Tahapan Manajemen Krisis"
        className={`${
          isFramed ? 'shrink-0' : 'fixed bottom-0 left-0 right-0 z-30'
        } bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-3 h-[58px]`}
      >
        {navItems.map(({ step, label, Icon }) => {
          const isActive = currentScreen === step;
          return (
            <button
              key={step}
              type="button"
              onClick={() => state.onChangeScreen(step)}
              className={`relative flex flex-col items-center justify-center gap-1 min-h-[44px] transition-colors ${
                isActive
                  ? 'text-slate-900 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className={`absolute top-0 left-4 right-4 h-0.5 rounded-full ${
                    state.status === 'resolved'
                      ? 'bg-emerald-600'
                      : state.status === 'high_crisis'
                        ? 'bg-red-600'
                        : 'bg-slate-900'
                  }`}
                />
              )}
              <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
              <span className="text-[11px] leading-none whitespace-nowrap">
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
