export type SocialChannel = 'TikTok' | 'X' | 'Instagram';

export type CrisisStatus =
  | 'monitoring'
  | 'high_crisis'
  | 'low_scale_cs'
  | 'resolved';

export type ScreenStep = 1 | 2 | 3;

export interface ChannelMetric {
  channel: SocialChannel;
  negativePercentage: number;
  mentionsCount: number;
  velocityPerHour: string;
  trendingTag: string;
  radarAngleDeg: number;
  radarDistanceRatio: number; // 0.2 (center/high urgency) to 0.85 (outer)
  sampleAuthor: string;
  samplePost: string;
  sampleTime: string;
  reachEstimate: string;
}

export interface CrisisTeamMember {
  id: string;
  name: string;
  role: string;
  unit: string;
  acknowledged: boolean;
}

export interface ScheduledPost {
  id: string;
  channel: SocialChannel;
  title: string;
  scheduledAt: string;
}

export interface StatementTemplate {
  id: string;
  label: string;
  content: string;
}

export interface SentimentDataPoint {
  timeLabel: string;
  positiveScore: number; // 0 - 100
  negativeScore: number; // 0 - 100
  phase: 'baseline' | 'crisis' | 'clarification' | 'recovery';
}

export interface CrisisScenario {
  id: string;
  title: string;
  category: string;
  detectedAt: string;
  overallNegativePct: number;
  totalMentions: number;
  summary: string;
  channels: ChannelMetric[];
  teamMembers: CrisisTeamMember[];
  scheduledPosts: ScheduledPost[];
  templates: StatementTemplate[];
  recoveryTimeline: {
    beforePublish: SentimentDataPoint[];
    afterPublish: SentimentDataPoint[];
  };
}

export interface PublishChannelState {
  id: 'TikTok' | 'X' | 'Instagram' | 'Portal Pers';
  label: string;
  accountHandle: string;
  selected: boolean;
  published: boolean;
  publishedAt?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  step: ScreenStep;
  action: string;
  tone: 'neutral' | 'danger' | 'warning' | 'success';
}
