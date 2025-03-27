const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    SESSION_ID: process.env.SESSION_ID || "HxoTSDhA#d7PepxWVLKFEgC36KzU99HTcDT5NZbXLaMxcXW0Xnpw",
    FOOTER: process.env.FOOTER || "> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜᴡᴀ ᴛᴇᴄʜ",
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
    READ_MESSAGE: process.env.READ_MESSAGE || "false", // Added auto-read configuration
    MODE: process.env.MODE || "inbox",
    AUTO_VOICE: process.env.AUTO_VOICE || "false",
    AUTO_STICKER: process.env.AUTO_STICKER || "false",
    AUTO_REPLY: process.env.AUTO_REPLY || "false",
    ALIVE_IMG: process.env.ALIVE_IMG || "https://raw.githubusercontent.com/hiranyaofc/Data_Base-for-My-Projects/refs/heads/main/Alive%20IMG.jpeg",
    ANTI_LINK: process.env.ANTI_LINK || "true",
    ANTI_BAD: process.env.ANTI_BAD || "true",
    PREFIX: process.env.PREFIX || ".",
    FAKE_RECORDING: process.env.FAKE_RECORDING || "true",
    AUTO_REACT: process.env.AUTO_REACT || "false",
    HEART_REACT: process.env.HEART_REACT || "false",
    OWNER_REACT: process.env.OWNER_REACT || "false",
    BOT_NAME: process.env.BOT_NAME || "𝐇𝐈𝐑𝐀𝐍 𝐌𝐃 𝐕3",
    OMDB_API_KEY: process.env.OMDB_API_KEY || "76cb7f39", // omdbapi.com
    MOVIE_API_KEY: process.env.MOVIE_API_KEY || "sky|97e02fda9faf1bf4823b9ea90816a254b38969e5"
};

