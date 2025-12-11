export type ViewState = 'onboarding' | 'dashboard' | 'panic';

export type UserPlan = 'basic' | 'general';

export interface Tasks {
  water: number;
  fasting: boolean;
  workout: boolean;
}

export interface UserState {
  uid: string;
  email: string | null;
  tipo_plano: UserPlan; // 'basic' ou 'general'
  streak: number;
  lastActiveDate: string;
  hasSeenTutorial: boolean;
  hasChristmasAddon: boolean;
  requiresNewPassword?: boolean;
}