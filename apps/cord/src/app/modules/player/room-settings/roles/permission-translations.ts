import { Permission } from '../../../../api';

export const permissions = [
  {
    name: 'manage_roles',
    flag: Permission.ManageRoles
  },
  {
    name: 'manage_emoji',
    flag: Permission.ManageEmoji
  },
  {
    name: 'manage_server',
    flag: Permission.ManageServer
  },

  {
    name: 'change_nickname',
    flag: Permission.ChangeNickname
  },
  {
    name: 'manage_nicknames',
    flag: Permission.ManageNicknames
  },
  {
    name: 'ban',
    flag: Permission.Ban
  },
  {
    name: 'kick',
    flag: Permission.Kick
  },
  {
    name: 'mute',
    flag: Permission.Mute
  },

  {
    name: 'send_messages',
    flag: Permission.SendMessages
  },
  {
    name: 'embed_links',
    flag: Permission.EmbedLinks
  },
  {
    name: 'add_reactions',
    flag: Permission.AddReactions
  },

  {
    name: 'use_external_emoji',
    flag: Permission.UseExternalEmoji
  },
  {
    name: 'use_external_stickers',
    flag: Permission.UseExternalStickers
  },
  {
    name: 'mention_everyone',
    flag: Permission.MentionEveryone
  },
  {
    name: 'manage_messages',
    flag: Permission.ManageMessages
  },
  {
    name: 'read_message_history',
    flag: Permission.ReadMessageHistory
  },
  {
    name: 'use_application_commands',
    flag: Permission.UseApplicationCommands
  },
  {
    name: 'manage_events',
    flag: Permission.ManageEvents
  },
  {
    name: 'force_skip',
    flag: Permission.ForceSkip
  },
  {
    name: 'manage_queue',
    flag: Permission.ManageQueue
  },
  {
    name: 'can_enqueue',
    flag: Permission.CanEnqueue
  },

  {
    name: 'administrator',
    flag: Permission.Administrator
  }
];
