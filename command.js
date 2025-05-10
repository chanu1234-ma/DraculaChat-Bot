const { cmd } = require('../lib/command');

cmd(
  {
    pattern: 'hi',
    fromMe: false,
    desc: 'Say hi with love ❤️',
    category: 'chat',
  },
  async (message) => {
    const reply = `හයි! 😊
මම ඩ්‍රැකියුලා 😈
ඔයාට මගෙන් ඕනෙ මොකක්ද?
මිතුරන් වෙමුද? 💖`;
    
    await message.reply(reply);
  }
);
