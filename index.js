console.log('Bot file started');
require('dotenv').config();

const fs = require('fs');
const path = require('path');

const {
  Client,
  GatewayIntentBits,
  Events,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Routes,
  ChannelType,
  PermissionFlagsBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences
  ]
});

const PREFIX = '.';
const REQUIRED_VOTES = 5;
const STAFF_REQUIRED_VOTES = 5;
const IS_COMPONENTS_V2 = 32768;

const GUILD_ID = process.env.GUILD_ID;
const ERLC_SERVER_KEY = process.env.ERLC_SERVER_KEY;
const PERMANENT_INFO_CHANNEL_ID = process.env.PERMANENT_INFO_CHANNEL_ID;
const PERMANENT_INFO_MESSAGE_ID = process.env.PERMANENT_INFO_MESSAGE_ID;
const STAFF_ROLE_ID = process.env.STAFF_ROLE_ID;

const OWNER_ID = '1249047274852716557';
const FRIEND_ID = '1189544834608939040';
const SETUP_ALLOWED_USER_IDS = new Set([OWNER_ID, FRIEND_ID]);

const SESSION_MANAGER_ROLE_ID = '1496007778626572368';
const SESSION_NOTIFIER_ROLE_ID = '1496004269093158963';

const STAFF_SESSION_ROLE_ID = '1496648446604742656';
const STAFF_SESSION_VOTE_CHANNEL_ID = '1501630953297281227';

const INFRACTION_PERMISSION_ROLE_ID = '1497383043026124951';
const SAY_PERMISSION_ROLE_ID = '1496645982824300654';
const PROMOTION_PERMISSION_ROLE_ID = '1497391949827674213';

const GIVEAWAY_PERMISSION_ROLE_ID = '1500513433681137955';
const GIVEAWAY_ENTER_EMOJI_ID = '1500514395623522455';
const GIVEAWAY_ENTRIES_EMOJI_ID = '1500517105022537800';

const TRAINER_ROLE_ID = '1499515136015073341';
const TRAINEE_ROLE_ID = '1496644650763550874';
const TRAINING_HOST_CHANNEL_ID = '1499516734955196416';
const TRAINING_REQUEST_CHANNEL_ID = '1499516861887287366';

const WELCOME_CHANNEL_ID = '1496367869439639602';
const INFRACTION_CHANNEL_ID = '1496653433527079073';

const SUGGESTION_CHANNEL_ID = '1499583157664747711';
const SUGGESTION_YES_EMOJI_ID = '1499581956201906326';
const SUGGESTION_NO_EMOJI_ID = '1497029553158357074';

const STAFF_FEEDBACK_CHANNEL_ID = '1499785829235556555';

const RULES_CHANNEL_LINK =
  'https://discord.com/channels/1495947674107777064/1496353783717036173';

const INFRACTIONS_FILE = path.join(__dirname, 'infractions.json');
const TRAINING_FILE = path.join(__dirname, 'training.json');
const SUGGESTIONS_FILE = path.join(__dirname, 'suggestions.json');
const GIVEAWAYS_FILE = path.join(__dirname, 'giveaways.json');

const SHUTDOWN_BANNER_URL =
  'https://media.discordapp.net/attachments/1393378962364956783/1393379706010603561/minstate.png?ex=69e80df9&is=69e6bc79&hm=9a969d61bc57a226c34a59ebca0ccf4fe68a54253eeec72ce7b709aa2770df98&=&format=webp&quality=lossless&width=1860&height=94';

const STARTUP_BANNER_URL =
  'https://media.discordapp.net/attachments/1393378962364956783/1393379364783128596/59.png?ex=69e80da8&is=69e6bc28&hm=0e008d01c6ad6151e69cbe1d0c8ca39dfeedba8200e46403a8c6582cc4fe3efe&=&format=webp&quality=lossless&width=1860&height=440';

const STAFF_SESSION_VOTE_BANNER =
  'https://media.discordapp.net/attachments/1393378962364956783/1393379364783128596/59.png?ex=69fc7ce8&is=69fb2b68&hm=073ed133a1a7800535f7aba90001ac56fb936bb581e9723d9ec22d1a43d9f508&=&format=webp&quality=lossless&width=1428&height=338';

const INFO_TOP_IMAGE_URL = STARTUP_BANNER_URL;
const INFO_BOTTOM_IMAGE_URL = SHUTDOWN_BANNER_URL;
const VOTE_BANNER_URL = SHUTDOWN_BANNER_URL;
const BOOST_BANNER_URL = SHUTDOWN_BANNER_URL;
const BOOST_JOIN_URL = 'https://policeroleplay.community/join/msrpc';

const GIVEAWAY_BOTTOM_IMAGE =
  'https://media.discordapp.net/attachments/1393378962364956783/1393379706010603561/minstate.png?ex=69f888b9&is=69f73739&hm=795130abc0bc1ea1f5b79961837b010b24d0f9b97303496635aceb2021549eea&=&format=webp&quality=lossless';

const INFRACTION_TOP_IMAGE_URL =
  'https://media.discordapp.net/attachments/1393378962364956783/1393379651774316624/64.png?ex=69ecab2c&is=69eb59ac&hm=298834b284cc339dc57d7ece1f83e6eddaa72d4ea307c5a6659307ad7974a94f&=&format=webp&quality=lossless&width=1866&height=441';

const INFRACTION_BOTTOM_IMAGE_URL =
  'https://media.discordapp.net/attachments/1393378962364956783/1393379706010603561/minstate.png?ex=69ecab39&is=69eb59b9&hm=acc2bd6dfc45e558bbe099d017b666455024147d19efc5b184cfe171794c8ab3&=&format=webp&quality=lossless&width=1866&height=93';

const INFRACTION_ICON_URL =
  'https://media.discordapp.net/attachments/1393378962364956783/1393379747136012288/Untitled_design.png?ex=69ecab43&is=69eb59c3&hm=66936e943f7ecf113cf025889d3d59a35a6226c569d8b1baa52a1cdd7520a032&=&format=webp&quality=lossless&width=394&height=394';

const TICKET_BANNER_URL =
  'https://media.discordapp.net/attachments/1393378962364956783/1393379057441439914/57.png?ex=69eb591f&is=69ea079f&hm=5d84dc1a43bee7d7f104f2adb05c3990e4f278f71edd83f71b7c78c4e452cff6&=&format=webp&quality=lossless&width=1866&height=441';

const PROMOTION_TOP_IMAGE_URL =
  'https://media.discordapp.net/attachments/1393378962364956783/1393379624108691476/63.png?ex=69ed53e6&is=69ec0266&hm=ee5d8b4c543a5139a333f3b7ece6006e57078f82391e679413cd551d76c6c30b&=&format=webp&quality=lossless&width=1866&height=441';

const PROMOTION_BOTTOM_IMAGE_URL =
  'https://media.discordapp.net/attachments/1393378962364956783/1393379706010603561/minstate.png?ex=69ed53f9&is=69ec0279&hm=d6fe4bf4a131645d50c192a2fda556a5d9b2cb5f87359b41e750aeeb71fc6ce2&=&format=webp&quality=lossless&width=619&height=32';

const REACTION_ROLES_BOTTOM_IMAGE =
  'https://media.discordapp.net/attachments/1393378962364956783/1393379706010603561/minstate.png?ex=69f49439&is=69f342b9&hm=0f23ad8cf0649a984a22a5754ffee212e4788f9e17725449d82107ea980338bd&=&format=webp&quality=lossless';

const TRAINING_TOP_IMAGE =
  'https://media.discordapp.net/attachments/1393378962364956783/1393379516319142069/62.png?ex=69f4940c&is=69f3428c&hm=743329fcd35327ede5f67ba6bd32a40b7d14bde4b98f8fd0b47cbc92b97f2aad&=&format=webp&quality=lossless';

const TRAINING_BOTTOM_IMAGE = REACTION_ROLES_BOTTOM_IMAGE;

const SUGGESTION_BOTTOM_IMAGE =
  'https://media.discordapp.net/attachments/1393378962364956783/1393379706010603561/minstate.png?ex=69f53cf9&is=69f3eb79&hm=645bb10b5706279b13a312d13276b876019e1dbaa0c63d9ce6a4b8324f6c4889&=&format=webp&quality=lossless';

const SUGGESTION_ICON_URL =
  'https://media.discordapp.net/attachments/1393378962364956783/1393379747136012288/Untitled_design.png?ex=69f53d03&is=69f3eb83&hm=4b254b2daff32d6354240c9346c89972a015b150ca8220f0d48e933d1f072c88&=&format=webp&quality=lossless&width=840&height=840';

const STAFF_FEEDBACK_IMAGE =
  'https://media.discordapp.net/attachments/1393378962364956783/1393379706010603561/minstate.png?ex=69f5e5b9&is=69f49439&hm=04b6211490a7dabf5f1c576ad56c6cf5e54aae1984407449359f3318bfced257&=&format=webp&quality=lossless';

const STAFF_FEEDBACK_ICON =
  'https://media.discordapp.net/attachments/1393378962364956783/1393379747136012288/Untitled_design.png?ex=69f5e5c3&is=69f49443&hm=1243f6bf40ae74ac018c4fbe871cce96aebf18ed41c32c921177c524ef886ad8&=&format=webp&quality=lossless&width=840&height=840';

const TICKET_TYPES = {
  management: {
    label: 'Management Support',
    value: 'management',
    categoryId: '1497012866530807878',
    supportRoleId: '1497016268300226661'
  },
  general: {
    label: 'General Support',
    value: 'general',
    categoryId: '1497012918158491728',
    supportRoleId: '1497016357491970129'
  },
  community: {
    label: 'Community Support',
    value: 'community',
    categoryId: '1497012968364183562',
    supportRoleId: '1497016398353006592'
  }
};

const REACTION_ROLES = {
  sessions: {
    label: 'Sessions',
    roleId: '1496004269093158963',
    emoji: { name: 'Sessions', id: '1497417268676792481' }
  },
  departments: {
    label: 'Department Shouts',
    roleId: '1499495950413205774',
    emoji: { name: 'departments', id: '1499498894390722821' }
  },
  giveaways: {
    label: 'Giveaways',
    roleId: '1499496096219664574',
    emoji: { name: 'giveaways', id: '1499499025135829142' }
  },
  events: {
    label: 'Events',
    roleId: '1499496006809551039',
    emoji: { name: 'Events', id: '1499499166962024578' }
  },
  media: {
    label: 'Media Ping',
    roleId: '1499496178713235566',
    emoji: { name: 'MediaPing', id: '1499499807541035118' }
  }
};

const SUPPORT_ROLE_IDS = Object.values(TICKET_TYPES).map(t => t.supportRoleId);
const activeStartupVotes = new Map();
const activeStaffSessionVotes = new Map();

client.once(Events.ClientReady, async readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}`);

  await registerSlashCommands().catch(console.error);

  await updatePermanentInfoMessage().catch(console.error);
  setInterval(() => updatePermanentInfoMessage().catch(console.error), 60_000);

  await checkGiveawayEnds().catch(console.error);
  setInterval(() => checkGiveawayEnds().catch(console.error), 15_000);
});

async function registerSlashCommands() {
  if (!GUILD_ID) {
    console.log('Slash command registration skipped: missing GUILD_ID.');
    return;
  }

  const commands = [
    { name: 'startup', description: 'Start a roleplay session.' },
    { name: 'shutdown', description: 'Shutdown the current roleplay session.' },
    { name: 'startupvote', description: 'Start a community session vote.' },
    { name: 'boost', description: 'Send a session boost message.' },
    { name: 'staffsessionvote', description: 'Start a staff session vote.' },
    {
      name: 'infract',
      description: 'Issue an infraction to a user.',
      options: [
        { name: 'user', description: 'The user receiving the infraction.', type: 6, required: true },
        { name: 'type', description: 'The infraction type.', type: 3, required: true },
        { name: 'reason', description: 'The infraction reason.', type: 3, required: true },
        { name: 'notes', description: 'Extra notes for this infraction.', type: 3, required: true }
      ]
    },
    {
      name: 'logs',
      description: 'View moderation logs.',
      options: [
        {
          name: 'view',
          description: 'View a user’s infractions.',
          type: 1,
          options: [
            { name: 'user', description: 'The user whose logs you want to view.', type: 6, required: true }
          ]
        }
      ]
    },
    {
      name: 'infraction',
      description: 'Manage infractions.',
      options: [
        {
          name: 'edit',
          description: 'Edit an infraction by case ID.',
          type: 1,
          options: [
            { name: 'case_id', description: 'The case ID of the infraction.', type: 3, required: true },
            { name: 'type', description: 'New infraction type.', type: 3, required: false },
            { name: 'reason', description: 'New infraction reason.', type: 3, required: false },
            { name: 'notes', description: 'New infraction notes.', type: 3, required: false }
          ]
        }
      ]
    },
    {
      name: 'suggest',
      description: 'Submit a server suggestion.',
      options: [
        { name: 'suggestion', description: 'Your suggestion.', type: 3, required: true }
      ]
    },
    {
      name: 'giveaway',
      description: 'Giveaway commands.',
      options: [
        {
          name: 'host',
          description: 'Host a giveaway.',
          type: 1,
          options: [
            { name: 'prize', description: 'The giveaway prize.', type: 3, required: true },
            { name: 'winners', description: 'Amount of winners.', type: 4, required: true, min_value: 1, max_value: 25 },
            { name: 'end_date', description: 'End date. Example: 2026-05-10 7:00 PM, 1h, 30m, 2d', type: 3, required: true }
          ]
        }
      ]
    },
    {
      name: 'staff',
      description: 'Staff commands.',
      options: [
        {
          name: 'feedback',
          description: 'Leave feedback for a staff member.',
          type: 1,
          options: [
            { name: 'staff_member', description: 'The staff member.', type: 6, required: true },
            {
              name: 'rating',
              description: 'Star rating.',
              type: 3,
              required: true,
              choices: [
                { name: '⭐', value: '⭐' },
                { name: '⭐⭐', value: '⭐⭐' },
                { name: '⭐⭐⭐', value: '⭐⭐⭐' },
                { name: '⭐⭐⭐⭐', value: '⭐⭐⭐⭐' },
                { name: '⭐⭐⭐⭐⭐', value: '⭐⭐⭐⭐⭐' }
              ]
            },
            { name: 'feedback', description: 'Your feedback.', type: 3, required: true }
          ]
        }
      ]
    },
    { name: 'add', description: 'Add a user to the current ticket.', options: [{ name: 'user', description: 'User to add.', type: 6, required: true }] },
    { name: 'remove', description: 'Remove a user from the current ticket.', options: [{ name: 'user', description: 'User to remove.', type: 6, required: true }] },
    { name: 'rename', description: 'Rename the current ticket.', options: [{ name: 'name', description: 'New ticket name.', type: 3, required: true }] },
    { name: 'say', description: 'Send a message as the bot.', options: [{ name: 'message', description: 'Message to send.', type: 3, required: true }] },
    {
      name: 'promotion',
      description: 'Announce a staff promotion.',
      options: [
        { name: 'user', description: 'The user being promoted.', type: 6, required: true },
        { name: 'new_rank', description: 'The new rank role.', type: 8, required: true },
        { name: 'notes', description: 'Promotion notes.', type: 3, required: true }
      ]
    },
    {
      name: 'traininghost',
      description: 'Host a staff training.',
      options: [{ name: 'time', description: 'Training time.', type: 3, required: true }]
    },
    {
      name: 'trainingrequest',
      description: 'Request a staff training.',
      options: [
        {
          name: 'training_type',
          description: 'Training type.',
          type: 3,
          required: true,
          choices: [
            { name: 'Ride Along', value: 'Ride Along' },
            { name: 'Training', value: 'Training' }
          ]
        },
        { name: 'time', description: 'Time you want the training to happen.', type: 3, required: true }
      ]
    },
    {
      name: 'training',
      description: 'Training commands.',
      options: [
        {
          name: 'host',
          description: 'Host a staff training.',
          type: 1,
          options: [{ name: 'time', description: 'Training time.', type: 3, required: true }]
        },
        {
          name: 'request',
          description: 'Request a staff training.',
          type: 1,
          options: [
            {
              name: 'training_type',
              description: 'Training type.',
              type: 3,
              required: true,
              choices: [
                { name: 'Ride Along', value: 'Ride Along' },
                { name: 'Training', value: 'Training' }
              ]
            },
            { name: 'time', description: 'Time you want the training to happen.', type: 3, required: true }
          ]
        }
      ]
    }
  ];

  await client.application.commands.set(commands, GUILD_ID);
  console.log('Slash commands registered.');
}

function ensureJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function readInfractions() {
  return ensureJson(INFRACTIONS_FILE, []);
}

function writeInfractions(data) {
  writeJson(INFRACTIONS_FILE, data);
}

function readTrainingData() {
  const data = ensureJson(TRAINING_FILE, { hosts: {}, requests: {} });
  if (!data.hosts) data.hosts = {};
  if (!data.requests) data.requests = {};
  return data;
}

function writeTrainingData(data) {
  writeJson(TRAINING_FILE, data);
}

function readSuggestions() {
  return ensureJson(SUGGESTIONS_FILE, {});
}

function writeSuggestions(data) {
  writeJson(SUGGESTIONS_FILE, data);
}

function readGiveaways() {
  return ensureJson(GIVEAWAYS_FILE, {});
}

function writeGiveaways(data) {
  writeJson(GIVEAWAYS_FILE, data);
}

function createInfractionId() {
  return `${Date.now()}${Math.floor(Math.random() * 9999)}`;
}

function createTrainingId() {
  return `${Date.now()}${Math.floor(Math.random() * 9999)}`;
}

function createGiveawayId() {
  return `${Date.now()}${Math.floor(Math.random() * 9999)}`;
}

function cleanCodeBlockText(text) {
  return String(text || '').replace(/`/g, "'");
}

function hasRole(member, roleId) {
  return member?.roles?.cache?.has(roleId);
}

function hasInfractionPermission(member) {
  return hasRole(member, INFRACTION_PERMISSION_ROLE_ID);
}

function hasSayPermission(member, userId) {
  return SETUP_ALLOWED_USER_IDS.has(userId) || hasRole(member, SAY_PERMISSION_ROLE_ID);
}

function hasPromotionPermission(member) {
  return hasRole(member, PROMOTION_PERMISSION_ROLE_ID);
}

function hasGiveawayPermission(member) {
  return hasRole(member, GIVEAWAY_PERMISSION_ROLE_ID);
}

function hasSessionPermission(member) {
  return hasRole(member, SESSION_MANAGER_ROLE_ID);
}

function isTicketStaff(member) {
  return SUPPORT_ROLE_IDS.some(roleId => hasRole(member, roleId));
}

function parseGiveawayEndDate(input) {
  const trimmed = String(input || '').trim();
  const relative = trimmed.toLowerCase();

  const relativeMatch = relative.match(/^(\d+)\s*(m|min|mins|minute|minutes|h|hr|hrs|hour|hours|d|day|days)$/);
  if (relativeMatch) {
    const amount = Number(relativeMatch[1]);
    const unit = relativeMatch[2];

    if (unit.startsWith('m')) return Date.now() + amount * 60_000;
    if (unit.startsWith('h')) return Date.now() + amount * 60 * 60_000;
    if (unit.startsWith('d')) return Date.now() + amount * 24 * 60 * 60_000;
  }

  const timestamp = Date.parse(trimmed);
  if (!Number.isNaN(timestamp)) return timestamp;

  return null;
}

function formatDiscordTimestamp(ms) {
  return `<t:${Math.floor(ms / 1000)}:F> (<t:${Math.floor(ms / 1000)}:R>)`;
}

function pickRandomWinners(entries, count) {
  const shuffled = [...entries].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function buildGiveawayComponents(giveaway) {
  const ended = giveaway.ended || Date.now() >= giveaway.endsAt;
  const winnerText = ended
    ? giveaway.winnersSelected?.length
      ? `\n**Winner${giveaway.winnersSelected.length === 1 ? '' : 's'}:** ${giveaway.winnersSelected.map(id => `<@${id}>`).join(', ')}`
      : '\n**Winner:** No valid entries'
    : '';

  return [
    {
      type: 17,
      components: [
        {
          type: 10,
          content:
            `## <:Giveaway:1500514395623522455> ${giveaway.prize} Giveaway\n` +
            `**Host:** <@${giveaway.hostId}>\n` +
            `**Prize:** ${giveaway.prize}\n` +
            `**Winners:** ${giveaway.winnerCount}\n` +
            `**Entries:** ${giveaway.entries.length}\n` +
            `**Ends:** ${formatDiscordTimestamp(giveaway.endsAt)}` +
            winnerText
        },
        { type: 14, spacing: 2 },
        {
          type: 1,
          components: [
            {
              style: 2,
              type: 2,
              label: 'Enter',
              emoji: { id: GIVEAWAY_ENTER_EMOJI_ID, name: 'unknown', animated: false },
              custom_id: `giveaway_enter_${giveaway.id}`,
              disabled: ended
            },
            {
              style: 2,
              type: 2,
              label: 'Entries',
              emoji: { id: GIVEAWAY_ENTRIES_EMOJI_ID, name: 'unknown', animated: false },
              custom_id: `giveaway_entries_${giveaway.id}_0`
            }
          ]
        },
        { type: 14 },
        { type: 12, items: [{ media: { url: GIVEAWAY_BOTTOM_IMAGE } }] }
      ],
      spoiler: false,
      accent_color: 10889256
    }
  ];
}

async function editGiveawayMessage(giveaway) {
  const channel = await client.channels.fetch(giveaway.channelId).catch(() => null);
  if (!channel || !channel.isTextBased()) return;

  await client.rest.patch(Routes.channelMessage(giveaway.channelId, giveaway.messageId), {
    body: {
      flags: IS_COMPONENTS_V2,
      components: buildGiveawayComponents(giveaway)
    }
  }).catch(() => {});
}

async function handleGiveawayHostCommand(interaction) {
  if (!hasGiveawayPermission(interaction.member)) {
    await interaction.reply({ content: 'You do not have permission to host giveaways.', ephemeral: true });
    return;
  }

  const prize = interaction.options.getString('prize', true);
  const winnerCount = interaction.options.getInteger('winners', true);
  const endDateInput = interaction.options.getString('end_date', true);
  const endsAt = parseGiveawayEndDate(endDateInput);

  if (!endsAt || endsAt <= Date.now()) {
    await interaction.reply({
      content: 'Please enter a valid future end date. Example: `2026-05-10 7:00 PM`, `1h`, `30m`, or `2d`.',
      ephemeral: true
    });
    return;
  }

  const giveaway = {
    id: createGiveawayId(),
    channelId: interaction.channelId,
    messageId: null,
    hostId: interaction.user.id,
    prize,
    winnerCount,
    endsAt,
    entries: [],
    ended: false,
    winnersSelected: []
  };

  await interaction.reply({ content: 'Giveaway created.', ephemeral: true });

  const sent = await client.rest.post(Routes.channelMessages(interaction.channelId), {
    body: {
      flags: IS_COMPONENTS_V2,
      components: buildGiveawayComponents(giveaway)
    }
  });

  giveaway.messageId = sent.id;

  const giveaways = readGiveaways();
  giveaways[giveaway.id] = giveaway;
  writeGiveaways(giveaways);
}

async function handleGiveawayEnter(interaction) {
  const giveawayId = interaction.customId.replace('giveaway_enter_', '');
  const giveaways = readGiveaways();
  const giveaway = giveaways[giveawayId];

  if (!giveaway) {
    await interaction.reply({ content: 'Giveaway not found.', ephemeral: true });
    return;
  }

  if (giveaway.ended || Date.now() >= giveaway.endsAt) {
    await interaction.reply({ content: 'This giveaway has already ended.', ephemeral: true });
    return;
  }

  const userId = interaction.user.id;
  let responseText;

  if (giveaway.entries.includes(userId)) {
    giveaway.entries = giveaway.entries.filter(id => id !== userId);
    responseText = 'Your entry was removed.';
  } else {
    giveaway.entries.push(userId);
    responseText = 'You entered the giveaway.';
  }

  giveaways[giveawayId] = giveaway;
  writeGiveaways(giveaways);

  await interaction.update({
    components: buildGiveawayComponents(giveaway),
    flags: IS_COMPONENTS_V2
  });

  await interaction.followUp({ content: responseText, ephemeral: true }).catch(() => {});
}

function buildGiveawayEntriesEmbed(giveaway, page = 0) {
  const entries = giveaway.entries || [];
  const perPage = 7;
  const totalPages = Math.max(1, Math.ceil(entries.length / perPage));
  const safePage = Math.min(Math.max(page, 0), totalPages - 1);
  const start = safePage * perPage;
  const shown = entries.slice(start, start + perPage);

  const description = shown.length
    ? shown.map((id, index) => `**${start + index + 1}.** <@${id}>`).join('\n')
    : 'No entries yet.';

  return new EmbedBuilder()
    .setColor('#a62628')
    .setTitle(`${giveaway.prize} Entries`)
    .setDescription(description)
    .setFooter({ text: `Page ${safePage + 1}/${totalPages}` });
}

function buildGiveawayEntriesButtons(giveawayId, page, totalEntries) {
  const perPage = 7;
  const totalPages = Math.max(1, Math.ceil(totalEntries / perPage));

  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`giveaway_entries_page_${giveawayId}_${page - 1}`)
      .setLabel('Previous')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page <= 0),
    new ButtonBuilder()
      .setCustomId(`giveaway_entries_page_${giveawayId}_${page + 1}`)
      .setLabel('Next')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page >= totalPages - 1)
  );
}

async function handleGiveawayEntries(interaction) {
  const parts = interaction.customId.split('_');
  const giveawayId = parts[2];
  const page = Number(parts[3] || 0);

  const giveaways = readGiveaways();
  const giveaway = giveaways[giveawayId];

  if (!giveaway) {
    await interaction.reply({ content: 'Giveaway not found.', ephemeral: true });
    return;
  }

  await interaction.reply({
    embeds: [buildGiveawayEntriesEmbed(giveaway, page)],
    components: [buildGiveawayEntriesButtons(giveawayId, page, giveaway.entries.length)],
    ephemeral: true
  });
}

async function handleGiveawayEntriesPage(interaction) {
  const parts = interaction.customId.split('_');
  const giveawayId = parts[3];
  const page = Number(parts[4] || 0);

  const giveaways = readGiveaways();
  const giveaway = giveaways[giveawayId];

  if (!giveaway) {
    await interaction.reply({ content: 'Giveaway not found.', ephemeral: true });
    return;
  }

  await interaction.update({
    embeds: [buildGiveawayEntriesEmbed(giveaway, page)],
    components: [buildGiveawayEntriesButtons(giveawayId, page, giveaway.entries.length)]
  });
}

async function endGiveaway(giveaway) {
  if (giveaway.ended) return;

  giveaway.ended = true;
  giveaway.winnersSelected = pickRandomWinners(giveaway.entries, giveaway.winnerCount);

  const giveaways = readGiveaways();
  giveaways[giveaway.id] = giveaway;
  writeGiveaways(giveaways);

  await editGiveawayMessage(giveaway);

  const channel = await client.channels.fetch(giveaway.channelId).catch(() => null);
  if (!channel || !channel.isTextBased()) return;

  const winnerText = giveaway.winnersSelected.length
    ? giveaway.winnersSelected.map(id => `<@${id}>`).join(', ')
    : 'No valid entries';

  const resultEmbed = new EmbedBuilder()
    .setColor('#a62628')
    .setTitle('Giveaway Ended')
    .setDescription(
      `**Prize:** ${giveaway.prize}\n` +
      `**Winner${giveaway.winnersSelected.length === 1 ? '' : 's'}:** ${winnerText}\n` +
      `**Entries:** ${giveaway.entries.length}`
    )
    .setImage(GIVEAWAY_BOTTOM_IMAGE);

  await channel.send({
    content: giveaway.winnersSelected.length ? winnerText : '',
    embeds: [resultEmbed]
  });
}

async function checkGiveawayEnds() {
  const giveaways = readGiveaways();

  for (const giveaway of Object.values(giveaways)) {
    if (!giveaway.ended && Date.now() >= giveaway.endsAt) {
      await endGiveaway(giveaway);
    }
  }
}

function buildStaffSessionVoteComponents(voteCount = 0) {
  return [
    {
      type: 10,
      content: `<@&${STAFF_SESSION_ROLE_ID}>`
    },
    {
      type: 17,
      components: [
        {
          type: 12,
          items: [
            {
              media: {
                url: STAFF_SESSION_VOTE_BANNER
              }
            }
          ]
        },
        {
          type: 14,
          spacing: 2
        },
        {
          type: 10,
          content:
            '# Staff Session Vote\n' +
            'Staff members may vote below to decide if a roleplay session should begin.\n\n' +
            '<:redbulletpoint:1500566566335549580> This vote is for staff only and is available in this channel\n' +
            '<:redbulletpoint:1500566566335549580> If you vote here, you must also vote in the Community Session Vote\n' +
            '<:redbulletpoint:1500566566335549580> Vote based on staff availability and server readiness\n' +
            '<:redbulletpoint:1500566566335549580> Once enough votes are reached, a decision will be made\n' +
            '<:redbulletpoint:1500566566335549580> If passed, a session will begin shortly\n' +
            '_ _\n' +
            '-# Staff members use this vote to decide if a roleplay session should begin based on availability and server readiness. Cast your vote below, and once enough votes are reached, the result will determine if a session starts.'
        },
        {
          type: 14,
          spacing: 1
        },
        {
          type: 1,
          components: [
            {
              style: 2,
              type: 2,
              label: `Vote (${voteCount}/${STAFF_REQUIRED_VOTES})`,
              custom_id: 'staff_session_vote_toggle'
            },
            {
              style: 2,
              type: 2,
              label: 'View Voters',
              custom_id: 'staff_session_vote_view'
            }
          ]
        }
      ],
      accent_color: 11673118
    }
  ];
}

async function handleStaffSessionVoteCommand(interaction) {
  if (!hasSessionPermission(interaction.member)) {
    await interaction.reply({ content: 'You do not have permission to start staff session votes.', ephemeral: true });
    return;
  }

  const channel = await client.channels.fetch(STAFF_SESSION_VOTE_CHANNEL_ID).catch(() => null);

  if (!channel || !channel.isTextBased()) {
    await interaction.reply({ content: 'Staff session vote channel was not found.', ephemeral: true });
    return;
  }

  const existingVote = activeStaffSessionVotes.get(interaction.guild.id);
  if (existingVote && !existingVote.ended) {
    const oldChannel = await client.channels.fetch(existingVote.channelId).catch(() => null);
    const oldMessage = oldChannel?.isTextBased()
      ? await oldChannel.messages.fetch(existingVote.messageId).catch(() => null)
      : null;

    if (oldMessage) {
      await interaction.reply({ content: 'There is already an active staff session vote.', ephemeral: true });
      return;
    }

    activeStaffSessionVotes.delete(interaction.guild.id);
  }

  await interaction.reply({ content: `Staff session vote posted in ${channel}.`, ephemeral: true });

  const sent = await client.rest.post(Routes.channelMessages(channel.id), {
    body: {
      flags: IS_COMPONENTS_V2,
      components: buildStaffSessionVoteComponents(0),
      allowed_mentions: {
        parse: ['roles']
      }
    }
  });

  activeStaffSessionVotes.set(interaction.guild.id, {
    guildId: interaction.guild.id,
    channelId: channel.id,
    messageId: sent.id,
    voters: new Set(),
    ended: false
  });
}

async function handleStaffSessionVoteButton(interaction) {
  const voteState = activeStaffSessionVotes.get(interaction.guild.id);

  if (!voteState || voteState.messageId !== interaction.message.id || voteState.ended) {
    await interaction.reply({ content: 'This staff session vote is no longer active.', ephemeral: true });
    return;
  }

  if (interaction.customId === 'staff_session_vote_view') {
    const voterIds = [...voteState.voters];

    await interaction.reply({
      content: voterIds.length
        ? `Staff voters (${voterIds.length}/${STAFF_REQUIRED_VOTES}):\n${voterIds.map(id => `<@${id}>`).join('\n')}`
        : 'No staff members have voted yet.',
      ephemeral: true
    });

    return;
  }

  const userId = interaction.user.id;

  if (voteState.voters.has(userId)) {
    voteState.voters.delete(userId);
  } else {
    voteState.voters.add(userId);
  }

  const voteCount = voteState.voters.size;

  await interaction.update({
    flags: IS_COMPONENTS_V2,
    components: buildStaffSessionVoteComponents(voteCount)
  });
}

function buildInfractionEmbeds({ user, type, reason, issuer, notes, caseId, revoked = false, revokedBy = null }) {
  const topEmbed = new EmbedBuilder()
    .setColor(12332590)
    .setImage(INFRACTION_TOP_IMAGE_URL);

  const mainEmbed = new EmbedBuilder()
    .setColor(12332590)
    .setAuthor({ name: 'Minnesota State Roleplay Community', iconURL: INFRACTION_ICON_URL })
    .setDescription(
      revoked
        ? `Dear ${user}, this infraction has been revoked. Information about this case can be found below:`
        : `Dear ${user}, we regret to inform you that you have been infracted. Information about this case can be found below:`
    )
    .addFields(
      { name: 'User:', value: `${user}`, inline: true },
      { name: 'Type:', value: `\`${cleanCodeBlockText(type)}\``, inline: true },
      { name: 'Reason:', value: `\`${cleanCodeBlockText(reason)}\``, inline: true },
      { name: 'Issued by:', value: `${issuer}`, inline: true },
      { name: 'Notes:', value: `\`${cleanCodeBlockText(notes)}\``, inline: true }
    )
    .setFooter({ text: `Case ID: ${caseId || 'Unknown'}` })
    .setImage(INFRACTION_BOTTOM_IMAGE_URL);

  if (revoked) {
    mainEmbed.addFields({
      name: 'Status:',
      value: revokedBy ? `Revoked by ${revokedBy}` : 'Revoked',
      inline: true
    });
  }

  return [topEmbed, mainEmbed];
}

function buildPromotionEmbeds({ targetUser, newRankRole, notes, issuer }) {
  const topEmbed = new EmbedBuilder()
    .setColor(13703706)
    .setImage(PROMOTION_TOP_IMAGE_URL);

  const mainEmbed = new EmbedBuilder()
    .setColor(13703706)
    .setDescription(
      '## <:promotion:1497392558115131393> Staff Promotion\n' +
      'The Promotion Team has been noticing the effort and consistency you’ve been putting into Minnesota State Roleplay, and it hasn’t gone unnoticed. The way you contribute and carry yourself in the community really stands out.'
    )
    .addFields(
      { name: 'User:', value: `${targetUser}`, inline: true },
      { name: 'New Rank:', value: `${newRankRole}`, inline: true },
      { name: 'Notes:', value: notes, inline: true }
    )
    .setFooter({ text: `Issued by: ${issuer.username}`, iconURL: issuer.displayAvatarURL() })
    .setImage(PROMOTION_BOTTOM_IMAGE_URL);

  return [topEmbed, mainEmbed];
}

function buildInfractionDMButton() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('infraction_brand_disabled')
      .setLabel('Minnesota State Roleplay')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
  );
}

function buildInfractionRevokeButton(infractionId, disabled = false) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`revoke_infraction_${infractionId}`)
      .setLabel(disabled ? 'Infraction Revoked' : 'Revoke Infraction')
      .setEmoji({ name: 'revoke', id: '1497029469205168269' })
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled)
  );
}

function buildLogsEmbed(targetUser, infractions) {
  const embed = new EmbedBuilder()
    .setColor('#da242e')
    .setTitle(`${targetUser.username || 'User'}'s Infraction Logs`)
    .setDescription(infractions.length ? 'Use the dropdown below to revoke an active infraction.' : 'This user has no infractions.');

  if (infractions.length) {
    embed.addFields(
      infractions.slice(-10).reverse().map(infraction => ({
        name: `${infraction.voided ? 'REVOKED — ' : ''}${infraction.type}`,
        value:
          `**Reason:** \`${cleanCodeBlockText(infraction.reason)}\`\n` +
          `**Notes:** \`${cleanCodeBlockText(infraction.notes)}\`\n` +
          `**Issued by:** <@${infraction.issuerId}>\n` +
          `**Case ID:** \`${infraction.id}\``,
        inline: false
      }))
    );
  }

  return embed;
}

function buildLogsSelectMenu(infractions) {
  const activeInfractions = infractions.filter(infraction => !infraction.voided).slice(-25).reverse();
  if (!activeInfractions.length) return [];

  return [
    {
      type: 1,
      components: [
        {
          type: 3,
          custom_id: 'logs_revoke_select',
          placeholder: 'Select an active infraction to revoke',
          min_values: 1,
          max_values: 1,
          options: activeInfractions.map(infraction => ({
            label: `${infraction.type}`.slice(0, 100),
            description: `Case ID: ${infraction.id}`.slice(0, 100),
            value: infraction.id
          }))
        }
      ]
    }
  ];
}

function canRevokeInfraction(userId, infraction) {
  return SETUP_ALLOWED_USER_IDS.has(userId) || infraction.issuerId === userId;
}

async function dmInfractionRevoked(infraction, revokedByUser) {
  const targetUser = await client.users.fetch(infraction.userId).catch(() => null);
  const issuer = await client.users.fetch(infraction.issuerId).catch(() => null);
  if (!targetUser) return false;

  try {
    await targetUser.send({
      embeds: buildInfractionEmbeds({
        user: `<@${infraction.userId}>`,
        type: infraction.type,
        reason: infraction.reason,
        issuer: issuer ? `<@${issuer.id}>` : `<@${infraction.issuerId}>`,
        notes: infraction.notes,
        caseId: infraction.id,
        revoked: true,
        revokedBy: revokedByUser
      }),
      components: [buildInfractionDMButton()]
    });
    return true;
  } catch {
    return false;
  }
}

async function editInfractionChannelMessage(infraction, revokedByUser = null) {
  if (!infraction.channelMessageId) return;

  const channel = await client.channels.fetch(INFRACTION_CHANNEL_ID).catch(() => null);
  if (!channel || !channel.isTextBased()) return;

  const message = await channel.messages.fetch(infraction.channelMessageId).catch(() => null);
  if (!message) return;

  const targetUser = await client.users.fetch(infraction.userId).catch(() => null);
  const issuer = await client.users.fetch(infraction.issuerId).catch(() => null);

  await message.edit({
    content: targetUser ? `${targetUser}` : `<@${infraction.userId}>`,
    embeds: buildInfractionEmbeds({
      user: targetUser ? `<@${targetUser.id}>` : `<@${infraction.userId}>`,
      type: infraction.type,
      reason: infraction.reason,
      issuer: issuer ? `<@${issuer.id}>` : `<@${infraction.issuerId}>`,
      notes: infraction.notes,
      caseId: infraction.id,
      revoked: infraction.voided,
      revokedBy: revokedByUser || (infraction.voidedBy ? `<@${infraction.voidedBy}>` : null)
    }),
    components: [buildInfractionRevokeButton(infraction.id, infraction.voided)]
  }).catch(() => {});
}

async function handleInfractCommand(interaction) {
  if (!hasInfractionPermission(interaction.member)) {
    await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true }).catch(() => {});
    return;
  }

  const targetUser = interaction.options.getUser('user', true);
  const type = interaction.options.getString('type', true);
  const reason = interaction.options.getString('reason', true);
  const notes = interaction.options.getString('notes', true);

  const infraction = {
    id: createInfractionId(),
    userId: targetUser.id,
    type,
    reason,
    notes,
    issuerId: interaction.user.id,
    issuedAt: Date.now(),
    voided: false,
    voidedBy: null,
    voidedAt: null,
    channelMessageId: null,
    editedBy: null,
    editedAt: null
  };

  const embeds = buildInfractionEmbeds({
    user: targetUser,
    type,
    reason,
    issuer: interaction.user,
    notes,
    caseId: infraction.id
  });

  const infractionChannel = await client.channels.fetch(INFRACTION_CHANNEL_ID).catch(() => null);

  if (infractionChannel && infractionChannel.isTextBased()) {
    const sent = await infractionChannel.send({
      content: `${targetUser}`,
      embeds,
      components: [buildInfractionRevokeButton(infraction.id)]
    });

    infraction.channelMessageId = sent.id;
  }

  const infractions = readInfractions();
  infractions.push(infraction);
  writeInfractions(infractions);

  let dmSent = true;
  try {
    await targetUser.send({ embeds, components: [buildInfractionDMButton()] });
  } catch {
    dmSent = false;
  }

  await interaction.reply({
    content: dmSent
      ? `Infraction issued to ${targetUser} and sent to their DMs. Case ID: \`${infraction.id}\``
      : `Infraction issued to ${targetUser}, but I could not DM them. Case ID: \`${infraction.id}\``,
    ephemeral: true
  });
}

async function handleLogsViewCommand(interaction) {
  if (!hasInfractionPermission(interaction.member)) {
    await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true }).catch(() => {});
    return;
  }

  const targetUser = interaction.options.getUser('user', true);
  const infractions = readInfractions().filter(i => i.userId === targetUser.id);

  await interaction.reply({
    embeds: [buildLogsEmbed(targetUser, infractions)],
    components: buildLogsSelectMenu(infractions),
    ephemeral: true
  });
}

async function handleLogsRevokeSelect(interaction) {
  if (!hasInfractionPermission(interaction.member)) {
    await interaction.reply({ content: 'You do not have permission to revoke infractions.', ephemeral: true }).catch(() => {});
    return;
  }

  const infractionId = interaction.values[0];
  const infractions = readInfractions();
  const infraction = infractions.find(i => i.id === infractionId);

  if (!infraction) {
    await interaction.reply({ content: 'Infraction not found.', ephemeral: true });
    return;
  }

  if (infraction.voided) {
    await interaction.reply({ content: 'This infraction has already been revoked.', ephemeral: true });
    return;
  }

  infraction.voided = true;
  infraction.voidedBy = interaction.user.id;
  infraction.voidedAt = Date.now();

  writeInfractions(infractions);

  await editInfractionChannelMessage(infraction, interaction.user);
  await dmInfractionRevoked(infraction, interaction.user);

  const targetUser = await client.users.fetch(infraction.userId).catch(() => ({ username: 'User' }));
  const userInfractions = infractions.filter(i => i.userId === infraction.userId);

  await interaction.update({
    embeds: [buildLogsEmbed(targetUser, userInfractions)],
    components: buildLogsSelectMenu(userInfractions)
  });
}

async function handleRevokeInfraction(interaction) {
  const infractionId = interaction.customId.replace('revoke_infraction_', '');
  const infractions = readInfractions();
  const infraction = infractions.find(i => i.id === infractionId);

  if (!infraction) {
    await interaction.reply({ content: 'Infraction not found.', ephemeral: true });
    return;
  }

  if (!canRevokeInfraction(interaction.user.id, infraction)) {
    await interaction.reply({ content: 'Only the infraction issuer, or authorized users, can revoke this infraction.', ephemeral: true });
    return;
  }

  if (infraction.voided) {
    await interaction.reply({ content: 'This infraction has already been revoked.', ephemeral: true });
    return;
  }

  infraction.voided = true;
  infraction.voidedBy = interaction.user.id;
  infraction.voidedAt = Date.now();

  writeInfractions(infractions);

  await editInfractionChannelMessage(infraction, interaction.user);
  await dmInfractionRevoked(infraction, interaction.user);

  await interaction.reply({
    content: `Infraction case \`${infraction.id}\` has been revoked and the user has been notified.`,
    ephemeral: true
  });
}

async function handleInfractionEditCommand(interaction) {
  if (!hasInfractionPermission(interaction.member)) {
    await interaction.reply({ content: 'You do not have permission to edit infractions.', ephemeral: true }).catch(() => {});
    return;
  }

  const caseId = interaction.options.getString('case_id', true);
  const newType = interaction.options.getString('type', false);
  const newReason = interaction.options.getString('reason', false);
  const newNotes = interaction.options.getString('notes', false);

  if (!newType && !newReason && !newNotes) {
    await interaction.reply({ content: 'You must provide at least one field to edit.', ephemeral: true });
    return;
  }

  const infractions = readInfractions();
  const infraction = infractions.find(i => i.id === caseId);

  if (!infraction) {
    await interaction.reply({ content: 'No infraction was found with that case ID.', ephemeral: true });
    return;
  }

  if (newType) infraction.type = newType;
  if (newReason) infraction.reason = newReason;
  if (newNotes) infraction.notes = newNotes;

  infraction.editedBy = interaction.user.id;
  infraction.editedAt = Date.now();

  writeInfractions(infractions);

  await editInfractionChannelMessage(infraction, infraction.voided ? `<@${infraction.voidedBy}>` : null);

  await interaction.reply({ content: `Infraction case \`${caseId}\` has been edited.`, ephemeral: true });
}

async function handleSayCommand(interaction) {
  if (!hasSayPermission(interaction.member, interaction.user.id)) {
    await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true }).catch(() => {});
    return;
  }

  const messageText = interaction.options.getString('message', true);

  await interaction.reply({ content: 'Message sent.', ephemeral: true });

  await interaction.channel.send({
    content: messageText,
    allowedMentions: { parse: ['users', 'roles'] }
  });
}

async function handlePromotionCommand(interaction) {
  if (!hasPromotionPermission(interaction.member)) {
    await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true }).catch(() => {});
    return;
  }

  const targetUser = interaction.options.getUser('user', true);
  const newRankRole = interaction.options.getRole('new_rank', true);
  const notes = interaction.options.getString('notes', true);

  await interaction.reply({ content: 'Promotion posted.', ephemeral: true });

  await interaction.channel.send({
    content: `${targetUser}`,
    embeds: buildPromotionEmbeds({ targetUser, newRankRole, notes, issuer: interaction.user }),
    allowedMentions: { users: [targetUser.id], roles: [newRankRole.id] }
  });
}

function buildSuggestionEmbed({ userId, suggestion, user }) {
  return new EmbedBuilder()
    .setColor(13774639)
    .setAuthor({
      name: user ? user.username : 'Minnesota State Roleplay Suggestions',
      iconURL: user ? user.displayAvatarURL({ dynamic: true }) : SUGGESTION_ICON_URL
    })
    .setDescription(
      `**Suggester: **\n<@${userId}> \n\n` +
      `**Suggestion:**\n${suggestion}\n\n` +
      '-# If you like this suggestion feel free to vote below.'
    )
    .setImage(SUGGESTION_BOTTOM_IMAGE);
}

function buildSuggestionButtons({ yes = 0, no = 0 }) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('suggestion_yes')
      .setEmoji({ name: 'checkmark', id: SUGGESTION_YES_EMOJI_ID })
      .setLabel(`${yes}`)
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('suggestion_no')
      .setEmoji({ name: 'x', id: SUGGESTION_NO_EMOJI_ID })
      .setLabel(`${no}`)
      .setStyle(ButtonStyle.Secondary)
  );
}

async function handleSuggestCommand(interaction) {
  const suggestion = interaction.options.getString('suggestion', true);
  const channel = await client.channels.fetch(SUGGESTION_CHANNEL_ID).catch(() => null);

  if (!channel || !channel.isTextBased()) {
    await interaction.reply({ content: 'Suggestion channel was not found.', ephemeral: true });
    return;
  }

  await interaction.reply({ content: 'Your suggestion has been submitted.', ephemeral: true });

  const message = await channel.send({
    embeds: [
      buildSuggestionEmbed({
        userId: interaction.user.id,
        suggestion,
        user: interaction.user
      })
    ],
    components: [buildSuggestionButtons({ yes: 0, no: 0 })]
  });

  const suggestions = readSuggestions();
  suggestions[message.id] = {
    messageId: message.id,
    channelId: channel.id,
    userId: interaction.user.id,
    username: interaction.user.username,
    avatarURL: interaction.user.displayAvatarURL({ dynamic: true }),
    suggestion,
    yes: [],
    no: []
  };
  writeSuggestions(suggestions);

  await message.startThread({
    name: `Suggestion by ${interaction.user.username}`.slice(0, 100),
    autoArchiveDuration: 1440
  }).catch(() => {});
}

async function handleSuggestionVote(interaction) {
  const messageId = interaction.message.id;
  const suggestions = readSuggestions();

  if (!suggestions[messageId]) {
    suggestions[messageId] = {
      messageId,
      channelId: interaction.channelId,
      userId: interaction.user.id,
      username: interaction.user.username,
      avatarURL: interaction.user.displayAvatarURL({ dynamic: true }),
      suggestion: 'Suggestion',
      yes: [],
      no: []
    };
  }

  const voteData = suggestions[messageId];
  if (!Array.isArray(voteData.yes)) voteData.yes = [];
  if (!Array.isArray(voteData.no)) voteData.no = [];

  const userId = interaction.user.id;

  if (interaction.customId === 'suggestion_yes') {
    voteData.no = voteData.no.filter(id => id !== userId);
    if (voteData.yes.includes(userId)) voteData.yes = voteData.yes.filter(id => id !== userId);
    else voteData.yes.push(userId);
  }

  if (interaction.customId === 'suggestion_no') {
    voteData.yes = voteData.yes.filter(id => id !== userId);
    if (voteData.no.includes(userId)) voteData.no = voteData.no.filter(id => id !== userId);
    else voteData.no.push(userId);
  }

  suggestions[messageId] = voteData;
  writeSuggestions(suggestions);

  const fakeUser = {
    username: voteData.username || 'Suggestion',
    displayAvatarURL: () => voteData.avatarURL || SUGGESTION_ICON_URL
  };

  await interaction.update({
    embeds: [
      buildSuggestionEmbed({
        userId: voteData.userId,
        suggestion: voteData.suggestion,
        user: fakeUser
      })
    ],
    components: [
      buildSuggestionButtons({
        yes: voteData.yes.length,
        no: voteData.no.length
      })
    ]
  });
}

async function handleStaffFeedbackCommand(interaction) {
  const staffMember = interaction.options.getUser('staff_member', true);
  const rating = interaction.options.getString('rating', true);
  const feedback = interaction.options.getString('feedback', true);

  const channel = await client.channels.fetch(STAFF_FEEDBACK_CHANNEL_ID).catch(() => null);

  if (!channel || !channel.isTextBased()) {
    await interaction.reply({ content: 'Staff feedback channel was not found.', ephemeral: true });
    return;
  }

  const embed = new EmbedBuilder()
    .setColor(13317172)
    .setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.displayAvatarURL({ dynamic: true })
    })
    .addFields(
      { name: 'Staff Member:', value: `${staffMember}`, inline: true },
      { name: 'Rating:', value: rating, inline: true },
      { name: 'Feedback:', value: feedback, inline: false }
    )
    .setImage(STAFF_FEEDBACK_IMAGE)
    .setFooter({
      text: `Minnesota State Roleplay Community • ${new Date().toLocaleString()}`,
      iconURL: STAFF_FEEDBACK_ICON
    });

  await channel.send({
    content: `${staffMember}`,
    embeds: [embed]
  });

  await interaction.reply({
    content: 'Your staff feedback has been submitted.',
    ephemeral: true
  });
}

function buildReactionRolesComponents() {
  return [
    {
      type: 17,
      components: [
        {
          type: 10,
          content:
            '## Server Notifications\n\n' +
            '**Session Ping**\nUsed to notify everyone when a session is starting or important updates during a session.\n\n' +
            '**Department Shouts**\nAnnouncements from PD, FD, and DOT. Only for department-related info.\n\n' +
            '**Shouts**\nMain announcement channel for the server. Important updates are posted here.\n\n' +
            '**Events**\nInfo about upcoming events, times, and what’s going on.\n\n' +
            '**Media Ping**\nOfficial media only (like in-game photos, videos, etc.).\n\n'
        },
        { type: 14, spacing: 2 },
        { type: 12, items: [{ media: { url: REACTION_ROLES_BOTTOM_IMAGE } }] },
        {
          type: 10,
          content:
            '-#  Stay updated with important pings and announcements. This will notify you about sessions, events, department updates, and new media so you don’t miss anything.'
        }
      ],
      accent_color: 15283509
    },
    {
      type: 1,
      components: [
        {
          type: 3,
          custom_id: 'reaction_roles_select',
          placeholder: 'Select your notification roles',
          min_values: 1,
          max_values: 5,
          options: Object.entries(REACTION_ROLES).map(([value, info]) => ({
            label: info.label,
            value,
            emoji: info.emoji
          }))
        }
      ]
    }
  ];
}

async function handleReactionRolesSelect(interaction) {
  const added = [];
  const removed = [];

  for (const value of interaction.values) {
    const info = REACTION_ROLES[value];
    if (!info) continue;

    if (interaction.member.roles.cache.has(info.roleId)) {
      await interaction.member.roles.remove(info.roleId).catch(() => {});
      removed.push(info.label);
    } else {
      await interaction.member.roles.add(info.roleId).catch(() => {});
      added.push(info.label);
    }
  }

  let message = '';
  if (added.length) message += `Added: **${added.join(', ')}**\n`;
  if (removed.length) message += `Removed: **${removed.join(', ')}**`;

  await interaction.reply({
    content: message || 'No role changes were made.',
    ephemeral: true
  });
}

function buildTrainingRequestComponents({ traineeId, trainingType, time, acceptedBy = null, requestId }) {
  return [
    {
      type: 17,
      components: [
        { type: 12, items: [{ media: { url: TRAINING_TOP_IMAGE } }] },
        { type: 14 },
        {
          type: 10,
          content:
            '## Staff Training Request\n' +
            '-# A staff trainee has requested training.\n' +
            `Trainee: <@${traineeId}>\n` +
            `Training Type: ${trainingType}\n` +
            `Status: ${acceptedBy ? `Accepted by <@${acceptedBy}>` : 'Pending Review'}\n` +
            `Time: ${time}`
        },
        { type: 12, items: [{ media: { url: TRAINING_BOTTOM_IMAGE } }] }
      ],
      accent_color: 13116709
    },
    {
      type: 1,
      components: [
        {
          type: 2,
          style: 4,
          custom_id: `training_accept_${requestId}`,
          label: acceptedBy ? 'Training Accepted' : 'Accept Training',
          disabled: !!acceptedBy
        }
      ]
    }
  ];
}

function buildTrainingHostComponents({ trainerId, time, trainingId }) {
  return [
    {
      type: 17,
      components: [
        { type: 12, items: [{ media: { url: TRAINING_TOP_IMAGE } }] },
        { type: 14, spacing: 2 },
        {
          type: 10,
          content:
            '## Training Host\n' +
            "-# A new training request is available. Trainers may review and claim this session to guide the trainee through moderation procedures, rule enforcement, and proper staff conduct.\n\n" +
            `Staff Trainer: <@${trainerId}>\n` +
            `Time: ${time}\n` +
            "Please press the button below if you'd like to attend this training.\n"
        },
        { type: 12, items: [{ media: { url: TRAINING_BOTTOM_IMAGE } }] }
      ],
      accent_color: 16270661
    },
    {
      type: 1,
      components: [
        { type: 2, style: 4, custom_id: `training_attend_${trainingId}`, label: 'Attend Training' },
        { type: 2, style: 4, custom_id: `training_view_${trainingId}`, label: 'View Trainees' }
      ]
    }
  ];
}

async function handleTrainingRequest(interaction) {
  if (!hasRole(interaction.member, TRAINEE_ROLE_ID)) {
    await interaction.reply({ content: 'You do not have permission to request training.', ephemeral: true });
    return;
  }

  if (interaction.channelId !== TRAINING_REQUEST_CHANNEL_ID) {
    await interaction.reply({ content: `<#${TRAINING_REQUEST_CHANNEL_ID}> only.`, ephemeral: true });
    return;
  }

  const trainingType = interaction.options.getString('training_type', true);
  const time = interaction.options.getString('time', true);
  const requestId = createTrainingId();

  const data = readTrainingData();
  data.requests[requestId] = {
    requestId,
    traineeId: interaction.user.id,
    trainingType,
    time,
    acceptedBy: null
  };
  writeTrainingData(data);

  await interaction.reply({ content: 'Training request posted.', ephemeral: true });

  await interaction.channel.send({
    components: buildTrainingRequestComponents({
      traineeId: interaction.user.id,
      trainingType,
      time,
      requestId
    }),
    flags: IS_COMPONENTS_V2
  });
}

async function handleTrainingHost(interaction) {
  if (!hasRole(interaction.member, TRAINER_ROLE_ID)) {
    await interaction.reply({ content: 'You do not have permission to host training.', ephemeral: true });
    return;
  }

  if (interaction.channelId !== TRAINING_HOST_CHANNEL_ID) {
    await interaction.reply({ content: `<#${TRAINING_HOST_CHANNEL_ID}> only.`, ephemeral: true });
    return;
  }

  const time = interaction.options.getString('time', true);
  const trainingId = createTrainingId();

  const trainingData = readTrainingData();
  trainingData.hosts[trainingId] = {
    id: trainingId,
    trainerId: interaction.user.id,
    time,
    trainees: [],
    messageId: null,
    channelId: interaction.channelId
  };
  writeTrainingData(trainingData);

  await interaction.reply({ content: 'Training host message posted.', ephemeral: true });

  const sent = await interaction.channel.send({
    components: buildTrainingHostComponents({
      trainerId: interaction.user.id,
      time,
      trainingId
    }),
    flags: IS_COMPONENTS_V2
  });

  trainingData.hosts[trainingId].messageId = sent.id;
  writeTrainingData(trainingData);
}

async function handleTrainingAccept(interaction) {
  if (!hasRole(interaction.member, TRAINER_ROLE_ID)) {
    await interaction.reply({ content: 'Only staff trainers can accept training requests.', ephemeral: true });
    return;
  }

  const requestId = interaction.customId.replace('training_accept_', '');
  const data = readTrainingData();
  const request = data.requests[requestId];

  if (!request) {
    await interaction.reply({
      content: 'Training request data was not found. Please have the trainee make a new request.',
      ephemeral: true
    });
    return;
  }

  request.acceptedBy = interaction.user.id;
  writeTrainingData(data);

  await interaction.update({
    components: buildTrainingRequestComponents({
      traineeId: request.traineeId,
      trainingType: request.trainingType,
      time: request.time,
      acceptedBy: interaction.user.id,
      requestId
    }),
    flags: IS_COMPONENTS_V2
  });
}

async function handleTrainingAttend(interaction) {
  const trainingId = interaction.customId.replace('training_attend_', '');
  const data = readTrainingData();
  const training = data.hosts[trainingId];

  if (!training) {
    await interaction.reply({ content: 'Training not found.', ephemeral: true });
    return;
  }

  if (!hasRole(interaction.member, TRAINEE_ROLE_ID)) {
    await interaction.reply({ content: 'Only trainees can attend this training.', ephemeral: true });
    return;
  }

  if (!training.trainees.includes(interaction.user.id)) {
    training.trainees.push(interaction.user.id);
    writeTrainingData(data);
    await interaction.reply({ content: 'You have been added to this training.', ephemeral: true });
  } else {
    training.trainees = training.trainees.filter(id => id !== interaction.user.id);
    writeTrainingData(data);
    await interaction.reply({ content: 'You have been removed from this training.', ephemeral: true });
  }
}

async function handleTrainingView(interaction) {
  const trainingId = interaction.customId.replace('training_view_', '');
  const data = readTrainingData();
  const training = data.hosts[trainingId];

  if (!training) {
    await interaction.reply({ content: 'Training not found.', ephemeral: true });
    return;
  }

  if (!hasRole(interaction.member, TRAINER_ROLE_ID)) {
    await interaction.reply({ content: 'Only staff trainers can view trainees.', ephemeral: true });
    return;
  }

  const trainees = training.trainees.length
    ? training.trainees.map(id => `<@${id}>`).join('\n')
    : 'No trainees have signed up yet.';

  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor('#da242e')
        .setTitle('Training Trainees')
        .setDescription(trainees)
    ],
    ephemeral: true
  });
}

function buildNotifierButtonRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('session_ping_toggle')
      .setLabel('Session Notifier')
      .setStyle(ButtonStyle.Danger)
  );
}

function buildJoinButtonRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('Join Server')
      .setStyle(ButtonStyle.Link)
      .setURL(BOOST_JOIN_URL)
  );
}

function buildWelcomeButtons(memberCount) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('Server Guidelines')
      .setStyle(ButtonStyle.Link)
      .setURL(RULES_CHANNEL_LINK),
    new ButtonBuilder()
      .setCustomId('welcome_member_count')
      .setLabel(`${memberCount}th Member`)
      .setEmoji('👋')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
  );
}

function buildVoteButtons(voteCount, disabled = false) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('startup_vote_toggle')
      .setLabel(`Session Vote (${voteCount}/${REQUIRED_VOTES})`)
      .setStyle(ButtonStyle.Danger)
      .setDisabled(disabled),
    new ButtonBuilder()
      .setCustomId('startup_vote_view')
      .setLabel('View Voters')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled)
  );
}

function buildTicketActionRows({ closed = false, claimed = false } = {}) {
  const buttons = [];

  if (!closed) {
    buttons.push(
      {
        type: 2,
        style: 2,
        label: claimed ? 'Unclaim Ticket' : 'Claim Ticket',
        custom_id: claimed ? 'ticket_unclaim' : 'ticket_claim',
        emoji: { name: 'claim', id: '1497029598213574737' }
      },
      {
        type: 2,
        style: 2,
        label: 'Close Ticket',
        custom_id: 'ticket_close',
        emoji: { name: 'delete', id: '1497029553158357074' }
      }
    );
  }

  if (closed) {
    buttons.push({
      type: 2,
      style: 2,
      label: 'Open Ticket',
      custom_id: 'ticket_open',
      emoji: { name: 'open', id: '1497029509457772563' }
    });
  }

  buttons.push({
    type: 2,
    style: 2,
    label: 'Delete Ticket',
    custom_id: 'ticket_delete',
    emoji: { name: 'delete', id: '1497029469205168269' }
  });

  return [{ type: 1, components: buttons }];
}

function buildTicketPanelComponents() {
  return [
    {
      type: 17,
      components: [
        { type: 12, items: [{ media: { url: TICKET_BANNER_URL } }] },
        { type: 14, spacing: 2 },
        {
          type: 10,
          content:
            '# Minnesota Assistance\n' +
            'Need help? Choose the support category that best matches your situation. After you select an option, you will be asked for a few details so our staff can assist you properly.'
        }
      ],
      accent_color: 13773868
    },
    {
      type: 1,
      components: [
        {
          type: 3,
          custom_id: 'ticket_select',
          placeholder: 'Select a ticket type',
          min_values: 1,
          max_values: 1,
          options: [
            { label: 'Management Support', value: 'management', emoji: { name: 'managementsupport', id: '1497011957440577657' } },
            { label: 'Community Support', value: 'community', emoji: { name: 'communitysupport', id: '1497012224533856266' } },
            { label: 'General Support', value: 'general', emoji: { name: 'generalsupport', id: '1497011799839735868' } }
          ]
        }
      ]
    }
  ];
}

function buildTicketModal(ticketType) {
  const config = TICKET_TYPES[ticketType];

  const modal = new ModalBuilder()
    .setCustomId(`ticket_modal_${ticketType}`)
    .setTitle(`${config.label} Ticket`);

  const robloxInput = new TextInputBuilder()
    .setCustomId('roblox_username')
    .setLabel('Roblox Username')
    .setPlaceholder('Enter your Roblox username')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(50);

  const issueInput = new TextInputBuilder()
    .setCustomId('issue_details')
    .setLabel('Describe your issue')
    .setPlaceholder('Explain what you need help with. Include important details.')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMaxLength(1000);

  modal.addComponents(
    new ActionRowBuilder().addComponents(robloxInput),
    new ActionRowBuilder().addComponents(issueInput)
  );

  return modal;
}

function buildTicketCreatedComponents({ userMention, discordUsername, userId, robloxUsername, issueDetails, ticketLabel }) {
  return [
    {
      type: 17,
      components: [
        { type: 12, items: [{ media: { url: TICKET_BANNER_URL } }] },
        { type: 14, spacing: 2 },
        {
          type: 10,
          content:
            `# ${ticketLabel}\n` +
            `${userMention}, thank you for contacting support. A staff member will review your ticket shortly. Please avoid pinging staff while you wait.\n\n` +
            `## User Information\n` +
            `**Discord:** ${discordUsername}\n` +
            `**Discord ID:** ${userId}\n` +
            `**Roblox Username:** ${robloxUsername}\n\n` +
            `## Ticket Inquiry\n` +
            `> ${issueDetails.replace(/\n/g, '\n> ')}\n\n` +
            `Please keep this ticket respectful and provide any extra details staff may request.`
        }
      ],
      accent_color: 14296110
    },
    ...buildTicketActionRows({ closed: false, claimed: false })
  ];
}

function buildPermanentInfoComponents({ players, maxPlayers, queue, staffOnline }) {
  const online = players > 0;

  return [
    {
      type: 17,
      components: [
        { type: 12, items: [{ media: { url: INFO_TOP_IMAGE_URL } }] },
        { type: 14, spacing: 2 },
        {
          type: 10,
          content:
            '# Session Information \n' +
            'Stay updated with upcoming sessions by ensuring you have the notification role assigned.\n' +
            'Times of sessions may vary depending on staff availability.\n\n' +
            '## Server Details:\n\n' +
            '• Server Name: Minnesota State Roleplay Community\n' +
            '• Owner: TameLForYou / saadome5\n' +
            '• Server Code: msrpc\n' +
            '• Fast Join: [Click Here](https://policeroleplay.community/join/msrpc)'
        }
      ],
      accent_color: 10889256
    },
    {
      type: 17,
      components: [
        {
          type: 9,
          components: [
            {
              type: 10,
              content:
                '# Server Statistics\n\n' +
                `Players In-game: ${players} / ${maxPlayers}\n` +
                `Staff Online: ${staffOnline}\n` +
                `Queue: ${queue}`
            }
          ],
          accessory: {
            type: 2,
            style: online ? 3 : 4,
            custom_id: 'server_status_indicator',
            label: online ? 'Server Online' : 'Server Offline',
            disabled: true
          }
        },
        { type: 12, items: [{ media: { url: INFO_BOTTOM_IMAGE_URL } }] }
      ],
      accent_color: 10889256
    }
  ];
}

function buildShutdownEmbed(member, user) {
  return new EmbedBuilder()
    .setTitle('Session Shutdown')
    .setColor('#c72121')
    .setDescription('Our in-game server has now shutdown. We thank everyone who attended this session. Keep an eye out on this channel for our next session. If you would like to be notified for future sessions, click the button.')
    .setImage(SHUTDOWN_BANNER_URL)
    .setFooter({ text: `Shutdown by: ${member.displayName}`, iconURL: user.displayAvatarURL() });
}

function buildStartupEmbed() {
  return new EmbedBuilder()
    .setTitle('Session Startup')
    .setColor('#dc2f27')
    .setDescription("Our in-game server is now open! We invite all members to join and participate in today's session. Please make sure to follow all server rules and maintain realistic roleplay at all times.\n\nIf you would like to receive notifications for future sessions, click the button below.")
    .setImage(STARTUP_BANNER_URL);
}

function buildVoteEmbed() {
  return new EmbedBuilder()
    .setTitle('Session Vote')
    .setColor('#ac1e19')
    .setDescription('A session may be starting soon. We invite all members to vote below if they would like a session to begin. Once enough votes are reached, a session will be opened.')
    .setImage(VOTE_BANNER_URL);
}

function buildBoostEmbed() {
  return new EmbedBuilder()
    .setTitle('Session Boost')
    .setColor('#cd2727')
    .setDescription('Our in-game server is currently active but needs more players. We invite all members to join and help keep the session active.\n\nJoin now using the code: **msrpc**')
    .setImage(BOOST_BANNER_URL);
}

function buildPromptEmbed(title, description) {
  return new EmbedBuilder()
    .setTitle(title)
    .setColor('#da242e')
    .setDescription(description);
}

async function fetchERLCServerStats() {
  const response = await fetch('https://api.policeroleplay.community/v2/server?Players=true&Queue=true', {
    headers: { 'Server-Key': ERLC_SERVER_KEY }
  });

  if (!response.ok) throw new Error(`ERLC API request failed: ${response.status}`);
  return await response.json();
}

async function countDiscordStaffOnline() {
  const guild = await client.guilds.fetch(GUILD_ID);
  await guild.members.fetch();

  const staffRole = guild.roles.cache.get(STAFF_ROLE_ID);
  if (!staffRole) return 0;

  return staffRole.members.filter(member => {
    const status = member.presence?.status;
    return status === 'online' || status === 'idle' || status === 'dnd';
  }).size;
}

async function updatePermanentInfoMessage() {
  if (!ERLC_SERVER_KEY || !GUILD_ID || !PERMANENT_INFO_CHANNEL_ID || !PERMANENT_INFO_MESSAGE_ID || !STAFF_ROLE_ID) {
    console.log('Permanent info updater skipped: missing env vars.');
    return;
  }

  const [erlcData, staffOnline] = await Promise.all([
    fetchERLCServerStats(),
    countDiscordStaffOnline()
  ]);

  const players = Number(erlcData.CurrentPlayers ?? 0);
  const maxPlayers = Number(erlcData.MaxPlayers ?? 40);

  let queue = 0;
  if (Array.isArray(erlcData.Queue)) queue = erlcData.Queue.length;
  else if (typeof erlcData.Queue === 'number') queue = erlcData.Queue;

  await client.rest.patch(
    Routes.channelMessage(PERMANENT_INFO_CHANNEL_ID, PERMANENT_INFO_MESSAGE_ID),
    {
      body: {
        flags: IS_COMPONENTS_V2,
        components: buildPermanentInfoComponents({ players, maxPlayers, queue, staffOnline })
      }
    }
  );
}

function getTicketInfoFromChannel(channel) {
  const topic = channel.topic || '';
  const ownerMatch = topic.match(/ticketOwner:(\d+)/);
  const typeMatch = topic.match(/ticketType:([a-z]+)/);
  const claimedMatch = topic.match(/claimedBy:(\d+|none)/);

  return {
    ownerId: ownerMatch ? ownerMatch[1] : null,
    type: typeMatch ? typeMatch[1] : null,
    claimedBy: claimedMatch ? claimedMatch[1] : 'none'
  };
}

function buildTicketTopic(ownerId, type, claimedBy = 'none') {
  return `ticketOwner:${ownerId} | ticketType:${type} | claimedBy:${claimedBy}`;
}

async function findExistingTicket(guild, userId) {
  return guild.channels.cache.find(channel => channel.topic?.includes(`ticketOwner:${userId}`));
}

async function updateTicketButtons(channel, { closed = false, claimed = false } = {}) {
  const messages = await channel.messages.fetch({ limit: 20 });
  const ticketMessage = messages.find(msg =>
    msg.author.id === client.user.id &&
    msg.components?.length > 0 &&
    msg.components.some(component => {
      try {
        return JSON.stringify(component.toJSON()).includes('ticket_');
      } catch {
        return false;
      }
    })
  );

  if (!ticketMessage) return;

  const currentComponents = ticketMessage.components.map(component => component.toJSON());
  const withoutButtonRow = currentComponents.filter(component => component.type !== 1);

  await client.rest.patch(Routes.channelMessage(channel.id, ticketMessage.id), {
    body: {
      flags: IS_COMPONENTS_V2,
      components: [...withoutButtonRow, ...buildTicketActionRows({ closed, claimed })]
    }
  }).catch(() => {});
}

async function showTicketModal(interaction, ticketType) {
  const existingTicket = await findExistingTicket(interaction.guild, interaction.user.id);

  if (existingTicket) {
    await interaction.reply({ content: `You already have an open ticket: ${existingTicket}`, ephemeral: true });
    return;
  }

  await interaction.showModal(buildTicketModal(ticketType));
}

async function createTicketFromModal(interaction) {
  const ticketType = interaction.customId.replace('ticket_modal_', '');
  const config = TICKET_TYPES[ticketType];

  if (!config) {
    await interaction.reply({ content: 'Invalid ticket type.', ephemeral: true });
    return;
  }

  const existingTicket = await findExistingTicket(interaction.guild, interaction.user.id);

  if (existingTicket) {
    await interaction.reply({ content: `You already have an open ticket: ${existingTicket}`, ephemeral: true });
    return;
  }

  const robloxUsername = interaction.fields.getTextInputValue('roblox_username');
  const issueDetails = interaction.fields.getTextInputValue('issue_details');

  const safeName = interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20);

  const ticketChannel = await interaction.guild.channels.create({
    name: `ticket-${safeName}`,
    type: ChannelType.GuildText,
    parent: config.categoryId,
    topic: buildTicketTopic(interaction.user.id, ticketType),
    permissionOverwrites: [
      { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
      {
        id: interaction.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory
        ]
      },
      {
        id: config.supportRoleId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.ManageMessages
        ]
      }
    ]
  });

  await interaction.reply({ content: `Your ticket has been created: ${ticketChannel}`, ephemeral: true });
  await ticketChannel.send({ content: `${interaction.user}` });

  await client.rest.post(Routes.channelMessages(ticketChannel.id), {
    body: {
      flags: IS_COMPONENTS_V2,
      components: buildTicketCreatedComponents({
        userMention: `<@${interaction.user.id}>`,
        discordUsername: interaction.user.username,
        userId: interaction.user.id,
        robloxUsername,
        issueDetails,
        ticketLabel: config.label
      })
    }
  });
}

function canUseTicketCommand(interaction, ticketInfo) {
  if (SETUP_ALLOWED_USER_IDS.has(interaction.user.id)) return true;
  if (ticketInfo.claimedBy && ticketInfo.claimedBy !== 'none' && ticketInfo.claimedBy === interaction.user.id) return true;
  return isTicketStaff(interaction.member);
}

function sanitizeTicketName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'ticket';
}

async function handleAddUserCommand(interaction) {
  const ticketInfo = getTicketInfoFromChannel(interaction.channel);

  if (!ticketInfo.ownerId || !ticketInfo.type) {
    await interaction.reply({ content: 'This command can only be used inside a ticket channel.', ephemeral: true });
    return;
  }

  if (!canUseTicketCommand(interaction, ticketInfo)) {
    await interaction.reply({ content: 'You do not have permission to manage this ticket.', ephemeral: true });
    return;
  }

  const targetUser = interaction.options.getUser('user', true);

  await interaction.channel.permissionOverwrites.edit(targetUser.id, {
    ViewChannel: true,
    SendMessages: true,
    ReadMessageHistory: true
  });

  await interaction.reply({ embeds: [buildPromptEmbed('User Added', `${targetUser} has been added to this ticket by ${interaction.user}.`)] });
}

async function handleRemoveUserCommand(interaction) {
  const ticketInfo = getTicketInfoFromChannel(interaction.channel);

  if (!ticketInfo.ownerId || !ticketInfo.type) {
    await interaction.reply({ content: 'This command can only be used inside a ticket channel.', ephemeral: true });
    return;
  }

  if (!canUseTicketCommand(interaction, ticketInfo)) {
    await interaction.reply({ content: 'You do not have permission to manage this ticket.', ephemeral: true });
    return;
  }

  const targetUser = interaction.options.getUser('user', true);

  await interaction.channel.permissionOverwrites.edit(targetUser.id, { ViewChannel: false });

  await interaction.reply({ embeds: [buildPromptEmbed('User Removed', `${targetUser} has been removed from this ticket by ${interaction.user}.`)] });
}

async function handleRenameTicketCommand(interaction) {
  const ticketInfo = getTicketInfoFromChannel(interaction.channel);

  if (!ticketInfo.ownerId || !ticketInfo.type) {
    await interaction.reply({ content: 'This command can only be used inside a ticket channel.', ephemeral: true });
    return;
  }

  if (!canUseTicketCommand(interaction, ticketInfo)) {
    await interaction.reply({ content: 'You do not have permission to rename this ticket.', ephemeral: true });
    return;
  }

  const newName = sanitizeTicketName(interaction.options.getString('name', true));
  await interaction.channel.setName(newName);

  await interaction.reply({ embeds: [buildPromptEmbed('Ticket Renamed', `This ticket has been renamed to **${newName}** by ${interaction.user}.`)] });
}

async function handleClaimTicket(interaction) {
  const channel = interaction.channel;
  const ticketInfo = getTicketInfoFromChannel(channel);

  if (!ticketInfo.ownerId || !ticketInfo.type) {
    await interaction.reply({ content: 'This does not look like a valid ticket channel.', ephemeral: true });
    return;
  }

  if (!isTicketStaff(interaction.member)) {
    await interaction.reply({ content: 'Only support staff can claim tickets.', ephemeral: true });
    return;
  }

  for (const roleId of SUPPORT_ROLE_IDS) {
    await channel.permissionOverwrites.edit(roleId, { ViewChannel: false }).catch(() => {});
  }

  await channel.permissionOverwrites.edit(interaction.user.id, {
    ViewChannel: true,
    SendMessages: true,
    ReadMessageHistory: true,
    ManageMessages: true
  });

  await channel.permissionOverwrites.edit(ticketInfo.ownerId, {
    ViewChannel: true,
    SendMessages: true,
    ReadMessageHistory: true
  });

  await channel.setTopic(buildTicketTopic(ticketInfo.ownerId, ticketInfo.type, interaction.user.id));
  await updateTicketButtons(channel, { closed: false, claimed: true });

  await interaction.reply({ embeds: [buildPromptEmbed('Ticket Claimed', `This ticket has been claimed by ${interaction.user}.`)] });
}

async function handleUnclaimTicket(interaction) {
  const channel = interaction.channel;
  const ticketInfo = getTicketInfoFromChannel(channel);
  const config = TICKET_TYPES[ticketInfo.type];

  if (!ticketInfo.ownerId || !ticketInfo.type || !config) {
    await interaction.reply({ content: 'This does not look like a valid ticket channel.', ephemeral: true });
    return;
  }

  if (ticketInfo.claimedBy !== interaction.user.id) {
    await interaction.reply({ content: 'Only the person who claimed this ticket can unclaim it.', ephemeral: true });
    return;
  }

  await channel.permissionOverwrites.edit(interaction.user.id, {
    ViewChannel: null,
    SendMessages: null,
    ReadMessageHistory: null,
    ManageMessages: null
  }).catch(() => {});

  await channel.permissionOverwrites.edit(config.supportRoleId, {
    ViewChannel: true,
    SendMessages: true,
    ReadMessageHistory: true,
    ManageMessages: true
  });

  await channel.setTopic(buildTicketTopic(ticketInfo.ownerId, ticketInfo.type, 'none'));
  await updateTicketButtons(channel, { closed: false, claimed: false });

  await interaction.reply({ embeds: [buildPromptEmbed('Ticket Unclaimed', `This ticket has been unclaimed by ${interaction.user}.`)] });
}

async function handleCloseTicket(interaction) {
  const ticketInfo = getTicketInfoFromChannel(interaction.channel);

  if (!ticketInfo.ownerId) {
    await interaction.reply({ content: 'This does not look like a valid ticket channel.', ephemeral: true });
    return;
  }

  if (!isTicketStaff(interaction.member)) {
    await interaction.reply({ content: 'Only support staff can close tickets.', ephemeral: true });
    return;
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('ticket_confirm_close').setLabel('Confirm Close').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('ticket_cancel_action').setLabel('Cancel').setStyle(ButtonStyle.Secondary)
  );

  await interaction.reply({
    embeds: [buildPromptEmbed('Close Ticket', 'Are you sure you want to close this ticket? The ticket creator will lose access, but staff can reopen it later.')],
    components: [row],
    ephemeral: true
  });
}

async function handleOpenTicket(interaction) {
  const ticketInfo = getTicketInfoFromChannel(interaction.channel);
  const config = TICKET_TYPES[ticketInfo.type];

  if (!ticketInfo.ownerId || !config) {
    await interaction.reply({ content: 'This does not look like a valid ticket channel.', ephemeral: true });
    return;
  }

  if (!isTicketStaff(interaction.member)) {
    await interaction.reply({ content: 'Only support staff can open tickets.', ephemeral: true });
    return;
  }

  await interaction.channel.permissionOverwrites.edit(ticketInfo.ownerId, {
    ViewChannel: true,
    SendMessages: true,
    ReadMessageHistory: true
  });

  await interaction.channel.permissionOverwrites.edit(config.supportRoleId, {
    ViewChannel: true,
    SendMessages: true,
    ReadMessageHistory: true,
    ManageMessages: true
  });

  await interaction.channel.setTopic(buildTicketTopic(ticketInfo.ownerId, ticketInfo.type, 'none'));
  await interaction.channel.setName(`ticket-${interaction.channel.name.replace(/^ticket-|^closed-/, '')}`).catch(() => {});
  await updateTicketButtons(interaction.channel, { closed: false, claimed: false });

  await interaction.reply({ embeds: [buildPromptEmbed('Ticket Reopened', `<@${ticketInfo.ownerId}> has been added back to this ticket.`)] });
}

async function handleDeleteTicket(interaction) {
  const ticketInfo = getTicketInfoFromChannel(interaction.channel);

  if (!ticketInfo.ownerId) {
    await interaction.reply({ content: 'This does not look like a valid ticket channel.', ephemeral: true });
    return;
  }

  if (!isTicketStaff(interaction.member)) {
    await interaction.reply({ content: 'Only support staff can delete tickets.', ephemeral: true });
    return;
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('ticket_confirm_delete').setLabel('Confirm Delete').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('ticket_cancel_action').setLabel('Cancel').setStyle(ButtonStyle.Secondary)
  );

  await interaction.reply({
    embeds: [buildPromptEmbed('Delete Ticket', 'Are you sure you want to delete this ticket? This action cannot be undone.')],
    components: [row],
    ephemeral: true
  });
}

async function confirmCloseTicket(interaction) {
  const ticketInfo = getTicketInfoFromChannel(interaction.channel);

  if (!ticketInfo.ownerId || !ticketInfo.type) {
    await interaction.update({ embeds: [buildPromptEmbed('Invalid Ticket', 'This does not look like a valid ticket channel.')], components: [] });
    return;
  }

  await interaction.channel.permissionOverwrites.edit(ticketInfo.ownerId, { ViewChannel: false });
  await interaction.channel.setName(`closed-${interaction.channel.name.replace(/^ticket-|^closed-/, '')}`).catch(() => {});
  await updateTicketButtons(interaction.channel, {
    closed: true,
    claimed: ticketInfo.claimedBy && ticketInfo.claimedBy !== 'none'
  });

  await interaction.update({ embeds: [buildPromptEmbed('Ticket Closed', 'Ticket closed. The ticket creator has been removed from the channel.')], components: [] });
}

async function confirmDeleteTicket(interaction) {
  await interaction.update({ embeds: [buildPromptEmbed('Deleting Ticket', 'This ticket will be deleted in 3 seconds.')], components: [] });
  setTimeout(() => interaction.channel.delete().catch(console.error), 3000);
}

async function doesVoteMessageStillExist(voteState) {
  try {
    const channel = await client.channels.fetch(voteState.channelId).catch(() => null);
    if (!channel || !channel.isTextBased()) return false;
    const voteMessage = await channel.messages.fetch(voteState.messageId).catch(() => null);
    return !!voteMessage;
  } catch {
    return false;
  }
}

async function autoStartSessionFromVote(voteState) {
  const channel = await client.channels.fetch(voteState.channelId).catch(() => null);
  if (!channel || !channel.isTextBased()) return;

  voteState.ended = true;

  const voterMentions = [...voteState.voters].map(id => `<@${id}>`).join(' ');
  const startupPingContent = `<@&${SESSION_NOTIFIER_ROLE_ID}>${voterMentions ? ` ${voterMentions}` : ''}`;

  await channel.send({
    content: startupPingContent,
    embeds: [buildStartupEmbed()],
    components: [buildNotifierButtonRow()]
  });

  activeStartupVotes.delete(voteState.guildId);
}

async function handleSlashStartup(interaction) {
  if (!hasSessionPermission(interaction.member)) {
    await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    return;
  }

  await interaction.reply({ content: 'Startup sent.', ephemeral: true });

  await interaction.channel.send({
    content: `<@&${SESSION_NOTIFIER_ROLE_ID}>`,
    embeds: [buildStartupEmbed()],
    components: [buildNotifierButtonRow()]
  });
}

async function handleSlashShutdown(interaction) {
  if (!hasSessionPermission(interaction.member)) {
    await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    return;
  }

  await interaction.reply({ content: 'Shutdown sent.', ephemeral: true });

  await interaction.channel.send({
    embeds: [buildShutdownEmbed(interaction.member, interaction.user)],
    components: [buildNotifierButtonRow()]
  });
}

async function handleSlashBoost(interaction) {
  if (!hasSessionPermission(interaction.member)) {
    await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    return;
  }

  await interaction.reply({ content: 'Boost sent.', ephemeral: true });

  await interaction.channel.send({
    embeds: [buildBoostEmbed()],
    components: [buildJoinButtonRow()]
  });
}

async function handleSlashStartupVote(interaction) {
  if (!hasSessionPermission(interaction.member)) {
    await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    return;
  }

  const existingVote = activeStartupVotes.get(interaction.guild.id);

  if (existingVote && !existingVote.ended) {
    const stillExists = await doesVoteMessageStillExist(existingVote);

    if (stillExists) {
      await interaction.reply({ content: 'There is already an active startup vote.', ephemeral: true });
      return;
    }

    activeStartupVotes.delete(interaction.guild.id);
  }

  await interaction.reply({ content: 'Startup vote sent.', ephemeral: true });

  const sentVoteMessage = await interaction.channel.send({
    content: `<@&${SESSION_NOTIFIER_ROLE_ID}>`,
    embeds: [buildVoteEmbed()],
    components: [buildVoteButtons(0, false)]
  });

  activeStartupVotes.set(interaction.guild.id, {
    guildId: interaction.guild.id,
    channelId: sentVoteMessage.channel.id,
    messageId: sentVoteMessage.id,
    voters: new Set(),
    ended: false
  });
}

client.on(Events.MessageDelete, message => {
  if (!message.guild) return;

  const voteState = activeStartupVotes.get(message.guild.id);
  if (voteState?.messageId === message.id) {
    activeStartupVotes.delete(message.guild.id);
  }

  const staffVoteState = activeStaffSessionVotes.get(message.guild.id);
  if (staffVoteState?.messageId === message.id) {
    activeStaffSessionVotes.delete(message.guild.id);
  }
});

client.on(Events.GuildMemberAdd, async member => {
  try {
    const channel = await member.guild.channels.fetch(WELCOME_CHANNEL_ID).catch(() => null);
    if (!channel || !channel.isTextBased()) return;

    const memberCount = member.guild.memberCount;

    await channel.send({
      content: `🍹 | Welcome to Minnesota State Roleplay Community! ${member} You are the **${memberCount}th** member. We hope you enjoy your stay here. Please make sure to read our rules and guidelines below.`,
      components: [buildWelcomeButtons(memberCount)]
    });
  } catch (error) {
    console.error('Welcome message error:', error);
  }
});

client.on(Events.MessageCreate, async message => {
  try {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.member) return;
    if (!message.content.toLowerCase().startsWith(PREFIX)) return;

    const content = message.content.toLowerCase().trim();

    if (
      ![
        '.setupinfo',
        '.setuptickets',
        '.reactionroles'
      ].includes(content)
    ) return;

    if (content === '.reactionroles') {
      if (message.author.id !== OWNER_ID) return;

      await client.rest.post(Routes.channelMessages(message.channel.id), {
        body: {
          flags: IS_COMPONENTS_V2,
          components: buildReactionRolesComponents()
        }
      });

      await message.delete().catch(() => {});
      return;
    }

    if (content === '.setupinfo') {
      if (!SETUP_ALLOWED_USER_IDS.has(message.author.id)) return;

      const created = await client.rest.post(Routes.channelMessages(message.channel.id), {
        body: {
          flags: IS_COMPONENTS_V2,
          components: buildPermanentInfoComponents({ players: 0, maxPlayers: 40, queue: 0, staffOnline: 0 })
        }
      });

      console.log('COPY THIS MESSAGE ID:', created.id);
      await message.delete().catch(() => {});
      return;
    }

    if (content === '.setuptickets') {
      if (!SETUP_ALLOWED_USER_IDS.has(message.author.id)) return;

      const created = await client.rest.post(Routes.channelMessages(message.channel.id), {
        body: {
          flags: IS_COMPONENTS_V2,
          components: buildTicketPanelComponents()
        }
      });

      console.log('TICKET PANEL MESSAGE ID:', created.id);
      await message.delete().catch(() => {});
    }
  } catch (error) {
    console.error('Message command error:', error);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === 'startup') return await handleSlashStartup(interaction);
      if (interaction.commandName === 'shutdown') return await handleSlashShutdown(interaction);
      if (interaction.commandName === 'startupvote') return await handleSlashStartupVote(interaction);
      if (interaction.commandName === 'boost') return await handleSlashBoost(interaction);
      if (interaction.commandName === 'staffsessionvote') return await handleStaffSessionVoteCommand(interaction);

      if (interaction.commandName === 'infract') return await handleInfractCommand(interaction);

      if (interaction.commandName === 'logs') {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'view') return await handleLogsViewCommand(interaction);
      }

      if (interaction.commandName === 'infraction') {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'edit') return await handleInfractionEditCommand(interaction);
      }

      if (interaction.commandName === 'giveaway') {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'host') return await handleGiveawayHostCommand(interaction);
      }

      if (interaction.commandName === 'suggest') return await handleSuggestCommand(interaction);

      if (interaction.commandName === 'staff') {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'feedback') return await handleStaffFeedbackCommand(interaction);
      }

      if (interaction.commandName === 'add') return await handleAddUserCommand(interaction);
      if (interaction.commandName === 'remove') return await handleRemoveUserCommand(interaction);
      if (interaction.commandName === 'rename') return await handleRenameTicketCommand(interaction);
      if (interaction.commandName === 'say') return await handleSayCommand(interaction);
      if (interaction.commandName === 'promotion') return await handlePromotionCommand(interaction);

      if (interaction.commandName === 'traininghost') return await handleTrainingHost(interaction);
      if (interaction.commandName === 'trainingrequest') return await handleTrainingRequest(interaction);

      if (interaction.commandName === 'training') {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'host') return await handleTrainingHost(interaction);
        if (subcommand === 'request') return await handleTrainingRequest(interaction);
      }
    }

    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'logs_revoke_select') return await handleLogsRevokeSelect(interaction);
      if (interaction.customId === 'reaction_roles_select') return await handleReactionRolesSelect(interaction);
      if (interaction.customId === 'ticket_select') {
        await showTicketModal(interaction, interaction.values[0]);
        return;
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId.startsWith('ticket_modal_')) {
        await createTicketFromModal(interaction);
        return;
      }
    }

    if (!interaction.isButton()) return;

    if (interaction.customId === 'staff_session_vote_toggle' || interaction.customId === 'staff_session_vote_view') {
      return await handleStaffSessionVoteButton(interaction);
    }

    if (interaction.customId.startsWith('giveaway_enter_')) return await handleGiveawayEnter(interaction);
    if (interaction.customId.startsWith('giveaway_entries_page_')) return await handleGiveawayEntriesPage(interaction);
    if (interaction.customId.startsWith('giveaway_entries_')) return await handleGiveawayEntries(interaction);

    if (interaction.customId === 'suggestion_yes' || interaction.customId === 'suggestion_no') {
      return await handleSuggestionVote(interaction);
    }

    if (interaction.customId.startsWith('revoke_infraction_')) return await handleRevokeInfraction(interaction);
    if (interaction.customId === 'ticket_claim') return await handleClaimTicket(interaction);
    if (interaction.customId === 'ticket_unclaim') return await handleUnclaimTicket(interaction);
    if (interaction.customId === 'ticket_close') return await handleCloseTicket(interaction);
    if (interaction.customId === 'ticket_open') return await handleOpenTicket(interaction);
    if (interaction.customId === 'ticket_delete') return await handleDeleteTicket(interaction);
    if (interaction.customId === 'ticket_confirm_close') return await confirmCloseTicket(interaction);
    if (interaction.customId === 'ticket_confirm_delete') return await confirmDeleteTicket(interaction);

    if (interaction.customId === 'ticket_cancel_action') {
      return await interaction.update({
        embeds: [buildPromptEmbed('Action Cancelled', 'No changes were made to this ticket.')],
        components: []
      });
    }

    if (interaction.customId.startsWith('training_accept_')) return await handleTrainingAccept(interaction);
    if (interaction.customId.startsWith('training_attend_')) return await handleTrainingAttend(interaction);
    if (interaction.customId.startsWith('training_view_')) return await handleTrainingView(interaction);

    if (interaction.customId === 'session_ping_toggle') {
      const role = interaction.guild.roles.cache.get(SESSION_NOTIFIER_ROLE_ID);
      const member = interaction.member;

      if (!role) return await interaction.reply({ content: 'Role not found.', ephemeral: true });

      if (member.roles.cache.has(role.id)) {
        await member.roles.remove(role.id);
        await interaction.reply({ content: 'Removed Session Notifier role.', ephemeral: true });
      } else {
        await member.roles.add(role.id);
        await interaction.reply({ content: 'Added Session Notifier role.', ephemeral: true });
      }

      return;
    }

    if (interaction.customId !== 'startup_vote_toggle' && interaction.customId !== 'startup_vote_view') return;

    const voteState = activeStartupVotes.get(interaction.guild.id);

    if (!voteState || voteState.messageId !== interaction.message.id || voteState.ended) {
      await interaction.reply({ content: 'This startup vote is no longer active.', ephemeral: true });
      return;
    }

    if (interaction.customId === 'startup_vote_view') {
      const voterIds = [...voteState.voters];
      if (!voterIds.length) return await interaction.reply({ content: 'No one has voted yet.', ephemeral: true });

      return await interaction.reply({
        content: `Current voters (${voterIds.length}/${REQUIRED_VOTES}):\n${voterIds.map(id => `<@${id}>`).join('\n')}`,
        ephemeral: true
      });
    }

    const userId = interaction.user.id;
    if (voteState.voters.has(userId)) voteState.voters.delete(userId);
    else {
      if (voteState.voters.size >= REQUIRED_VOTES) {
        await interaction.reply({ content: 'This vote is already full.', ephemeral: true });
        return;
      }

      voteState.voters.add(userId);
    }

    const voteCount = voteState.voters.size;
    const reachedRequiredVotes = voteCount >= REQUIRED_VOTES;

    await interaction.update({
      embeds: [buildVoteEmbed()],
      components: [buildVoteButtons(voteCount, reachedRequiredVotes)]
    });

    if (reachedRequiredVotes) await autoStartSessionFromVote(voteState);
  } catch (error) {
    console.error('Interaction error:', error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'Something went wrong.', ephemeral: true }).catch(() => {});
    } else {
      await interaction.reply({ content: 'Something went wrong.', ephemeral: true }).catch(() => {});
    }
  }
});

client.login(process.env.DISCORD_TOKEN);