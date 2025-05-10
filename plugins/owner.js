const { cmd, commands } = require('../command');
const { sleep } = require('../lib/functions');
const config = require('../config');
const { exec } = require("child_process");

// Restart bot command (Owner only)
cmd({
    pattern: "restart",
    desc: "Restart the bot",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isOwner) return reply("You are not the owner of the bot!");
        reply("Bot restarting...");
        await sleep(1500);
        exec("pm2 restart all");
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// Shutdown bot command (Owner only)
cmd({
    pattern: "shutdown",
    desc: "Shutdown the bot",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isOwner) return reply("You are not the owner of the bot!");
        reply("Shutting down...");
        await sleep(1500);
        exec("pm2 stop all");
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// Evaluate JavaScript code (Owner only)
cmd({
    pattern: "eval",
    desc: "Evaluate JavaScript code",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isOwner) return reply("You are not the owner of the bot!");
        const code = body.slice(command.length).trim();
        if (!code) return reply("Please provide the code to evaluate.");
        
        let result = eval(code);
        result = typeof result === 'string' ? result : require('util').inspect(result);
        reply(result);
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Join group via invite link (Owner only)
cmd({
    pattern: "join",
    desc: "Make the bot join a group via invite link",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isOwner) return reply("You are not the owner of the bot!");
        const inviteLink = args[0];
        if (!inviteLink) return reply("Please provide an invite link.");
        
        await conn.groupAcceptInvite(inviteLink);
        reply("Bot has joined the group successfully.");
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Leave the group (Owner only)
cmd({
    pattern: "leave",
    desc: "Make the bot leave the group",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isOwner) return reply("You are not the owner of the bot!");
        await conn.groupLeave(from);
        reply("Bot has left the group.");
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

module.exports = { restart, shutdown, eval, join, leave };
