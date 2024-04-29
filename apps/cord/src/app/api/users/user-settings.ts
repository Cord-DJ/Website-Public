import { UserStatus } from './user-status';

export interface UserSettings {
  locale: string;
  notifications: boolean;
  theme: string;
  volume: number;
  videoVisible: boolean;
  status: UserStatus;
}
