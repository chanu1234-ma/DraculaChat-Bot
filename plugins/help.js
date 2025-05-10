const { cmd } = require('../command');
const config = require('../config');

cmd({
  pattern: "help",
  desc: "Show all bot commands",
  category: "main",
  filename: __filename
},
async(conn, mek, m, { from, reply, isOwner }) => {

  const ownerCommands = `
╔═══❖ OWNER COMMANDS ❖═══╗
│🔁 .restart  - Restart bot
│🔐 .shutdown - Stop bot (if supported)
│📤 .update   - Pull latest update (if available)
╚═══════════════════════╝`;

  const userCommands = `
╔═══❖ PUBLIC COMMANDS ❖═══╗
│👻 .alive    - Show bot status
│🎭 .sticker  - Create sticker from image
│🎤 .tts si|en text - Text to voice
│🧠 .ai       - ChatGPT AI reply
│📸 .photo ai - AI Image Generator
╚════════════════════════╝`;

  let message = `🧛‍♂️ *${config.BOT_NAME} Help Panel*\n\n`;

  message += userCommands;
  if (isOwner) {
    message += `\n${ownerCommands}`;
  }

  message += `\n\n🧛 Type *${config.PREFIX}command_name* to use any command.\n`;
  message += `\n🩸 Powered by ${config.BOT_NAME}`;

  return await reply(message);
});
