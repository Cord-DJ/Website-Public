export enum Permission {
  None = 0,

  // General Permissions
  ManageRoles = 1 << 0,
  ManageEmoji = 1 << 1,
  ManageServer = 1 << 2,

  // Membership Permissions
  ChangeNickname = 1 << 3,
  ManageNicknames = 1 << 4,
  Ban = 1 << 5,
  Kick = 1 << 6,
  Mute = 1 << 7,

  // Text permissions
  SendMessages = 1 << 8,
  EmbedLinks = 1 << 9,
  AddReactions = 1 << 10,
  UseExternalEmoji = 1 << 11,
  UseExternalStickers = 1 << 12,
  MentionEveryone = 1 << 13,
  ManageMessages = 1 << 14,
  ReadMessageHistory = 1 << 15,
  UseApplicationCommands = 1 << 16,
  ManageEvents = 1 << 17,

  // Cord specific
  ForceSkip = 1 << 18,
  ManageQueue = 1 << 19,

  CanEnqueue = 1 << 20,
  Administrator = 1 << 21
}
