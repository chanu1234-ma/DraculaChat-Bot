const {
  default: makeWASocket,
  useSingleFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore
} = require('@whiskeysockets/baileys');

const { Boom } = require('@hapi/boom');
const P = require('pino');
const fs = require('fs');

const { state, saveState } = useSingleFileAuthState('./auth_info.json');

async function startBot() {
  const { version, isLatest } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
    logger: P({ level: 'silent' }),
    browser: ['DraculaBot', 'Safari', '1.0']
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error = Boom(lastDisconnect?.error))?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('connection closed due to', lastDisconnect.error, ', reconnecting', shouldReconnect);
      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === 'open') {
      console.log('✅ Dracula Bot Connected Successfully!');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const messageContent = msg.message.conversation || msg.message.extendedTextMessage?.text;
    if (!messageContent) return;

    if (messageContent.toLowerCase() === '.alive') {
      await sock.sendMessage(msg.key.remoteJid, {
        image: { url: 'https://i.imgur.com/DraculaImage.jpg' },
        caption: '🧛‍♂️ Dracula Bot is Alive and Watching You at Midnight! 🌙'
      }, { quoted: msg });
    }
  });
}

startBot();
