const axios = require('axios');

// Fetch buffer from URL (used for images, files, etc.)
const getBuffer = async (url, options = {}) => {
  try {
    const res = await axios({
      method: 'get',
      url,
      headers: {
        'DNT': 1,
        'Upgrade-Insecure-Requests': 1
      },
      responseType: 'arraybuffer',
      ...options
    });
    return res.data;
  } catch (e) {
    console.log('[❌] getBuffer Error:', e);
    return null;
  }
};

// Extract admin IDs from group participants
const getGroupAdmins = (participants = []) => {
  return participants.filter(p => p.admin).map(p => p.id);
};

// Generate a random number with extension (e.g., for file naming)
const getRandom = (ext = '') => `${Math.floor(Math.random() * 10000)}${ext}`;

// Human-readable format for large numbers
const h2k = (num) => {
  const SI_SYMBOL = ['', 'K', 'M', 'B', 'T'];
  const tier = Math.log10(Math.abs(num)) / 3 | 0;
  if (tier == 0) return num.toString();
  const suffix = SI_SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;
  return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
};

// Check if a string is a valid URL
const isUrl = (url = '') => {
  const pattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/gi;
  return pattern.test(url);
};

// Format an object as a pretty JSON string
const Json = (obj) => JSON.stringify(obj, null, 2);

// Convert seconds into a human-readable time format
const runtime = (seconds) => {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor(seconds % (3600 * 24) / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);
  return `${d ? d + 'd, ' : ''}${h ? h + 'h, ' : ''}${m ? m + 'm, ' : ''}${s}s`;
};

// Pause execution for a given time
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch and parse JSON from a URL
const fetchJson = async (url, options = {}) => {
  try {
    const res = await axios({
      method: 'GET',
      url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (DraculaBot)'
      },
      ...options
    });
    return res.data;
  } catch (err) {
    console.log('[❌] fetchJson Error:', err);
    return null;
  }
};

module.exports = {
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep,
  fetchJson
};
