const { cmd } = require('../command');
const config = require('../config');

cmd({
  pattern: "menu",
  desc: "Show command categories",
  category: "main",
  filename: __filename
},
async(conn, mek, m, { from, reply, isOwner }) => {

  let menu = `
🧛‍♂️ *${config.BOT_NAME} Command Menu*

🔰 *MAIN COMMANDS*
├ 💠 .alive - බොට් එක onද කියලා බලන්න
├ 📋 .menu - මේ menu එක
├ 🧠 .ai - AI එක්ක කතා කරන්න
├ 🖼️ .photo ai - AI චිත්‍ර

🎨 *MEDIA COMMANDS*
├ 🖼️ .sticker - Sticker එකක් සාදන්න
├ 🎤 .tts si|en text - Voice convert

🌐 *GROUP COMMANDS*
├ ⚙️ .promote / .demote
├ 🚪 .kick / .add / .tagall

${isOwner ? `
👑 *OWNER COMMANDS*
├ 🔁 .restart - Restart Bot
├ 🔐 .shutdown - Stop Bot
├ 📤 .update - Update Bot
` : ''}

🔗 *PREFIX:* "${config.PREFIX}"
📞 *OWNER:* ${config.OWNER_NAME}
🔚 *FOOTER:* ${config.FOOTER}
`;

  await reply(menu);
});
