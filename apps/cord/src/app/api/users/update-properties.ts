export enum UserProperties {
  None = 0,
  Staff = 1 << 0,
  Partner = 1 << 1,
  Moderator = 1 << 2,
  EarlySupporter = 1 << 3,
  BugHunter = 1 << 4,
  Verified = 1 << 5, // 2 auth
  Turbo = 1 << 6,
  Bot = 1 << 7,
  Guest = 1 << 8
}
