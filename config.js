const fs = require('fs');

// Load environment variables if config.env exists
if (fs.existsSync('config.env')) {
    require('dotenv').config({ path: './config.env' });
}

// Convert string to boolean safely
function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    SESSION_ID: process.env.SESSION_ID || '',

    OWNER_NAME: process.env.OWNER_NAME || 'Chamara',
    OWNER_NUMBER: process.env.OWNER_NUMBER || '94763408860', // without + sign
    BOT_NAME: process.env.BOT_NAME || 'Dracula Chat Bot',
    PREFIX: process.env.PREFIX || '.',
    LANG: process.env.LANG || 'si', // si for Sinhala, en for English

    WORK_TYPE: process.env.WORK_TYPE || 'public', // public | private
    AUTO_READ: convertToBool(process.env.AUTO_READ || 'true'),
    AUTO_REACT: convertToBool(process.env.AUTO_REACT || 'true'),

    FOOTER: process.env.FOOTER || 'Dracula Bot © 2025',
    BOT_IMAGE: process.env.BOT_IMAGE || 'https://png.pngtree.com/png-clipart/20231017/original/pngtree-halloween-pumpkin-head-male-character-riding-a-flaming-horse-png-image_13279545.png',

    ALIVE_IMG: process.env.ALIVE_IMG || 'https://i.imgur.com/DraculaImage.jpg',
    ALIVE_MSG: process.env.ALIVE_MSG || '🧛‍♂️ Dracula Bot is Alive and Watching You at Midnight! 🌙',

    // New AI-related fields
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',  // API Key for OpenAI
    AI_MODEL: process.env.AI_MODEL || 'text-davinci-003',
    AI_TEMP: process.env.AI_TEMP || '0.7',
    AI_MAX_TOKENS: process.env.AI_MAX_TOKENS || '150',

    // MEGA storage credentials
    MEGA_EMAIL: process.env.MEGA_EMAIL || '',
    MEGA_PASSWORD: process.env.MEGA_PASSWORD || '',
};
