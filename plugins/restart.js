const config = require('../config');
const { cmd } = require('../command');
const { sleep } = require('../lib/functions');

cmd({
    pattern: "restart",
    desc: "Restart the bot",
    category: "owner", // Only the bot owner should be able to use this command
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (isOwner) {  // Only allow owner to restart the bot
            reply("Bot is restarting... Please wait.");
            await sleep(1500);  // Giving time for the message to send before restarting
            const { exec } = require("child_process");
            exec("pm2 restart all", (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    reply(`Error during restart: ${err.message}`);
                    return;
                }
                if (stderr) {
                    console.log(stderr);
                    reply(`Error during restart: ${stderr}`);
                    return;
                }
                console.log(stdout);
                reply("Bot has been restarted successfully!");
            });
        } else {
            reply("You are not authorized to use this command. Only the owner can restart the bot.");
        }
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
