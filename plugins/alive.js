const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "alive",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        return await conn.sendMessage(from, {
            image: { url: config.BOT_IMAGE },  // BOT_IMAGE URL එක
            caption: `I am alive! I'm ${config.BOT_NAME} 😊` // BOT_NAME එක
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
