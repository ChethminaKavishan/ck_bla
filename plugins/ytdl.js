const config = require('../config');
const { cmd } = require('../command');
const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();

// Function to extract YouTube Video ID from URL
function extractYouTubeID(url) {
    const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    return url.match(regex)?.[1] || null;
}

// YouTube Song Download Command
cmd({
    pattern: "song",
    alias: ["ytmp3", "ytmp3dl"],
    react: "🎶",
    desc: "Download Ytmp3",
    category: "download",
    use: ".song <Text or YT URL>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ Please provide a Query or YouTube URL!");

        let id = q.startsWith("https://") ? extractYouTubeID(q) : null;
        if (!id) {
            const searchResults = await dy_scrap.ytsearch(q);
            if (!searchResults?.results?.length) return await reply("❌ No results found!");
            id = searchResults.results[0].videoId;
        }

        const searchData = await dy_scrap.ytsearch(`https://youtube.com/watch?v=${id}`);
        if (!searchData?.results?.length) return await reply("❌ Failed to fetch video!");

        const { url, title, image, timestamp, ago, views, author } = searchData.results[0];

        let info = ` *ʜɪʀᴀɴ ᴍᴅ ꜱᴏɴɢ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ* \n\n` +
            ` *𝐓𝐈𝐓𝐋𝐄 :* ${title || "Unknown"}\n` +
            ` *𝐃𝐔𝐑𝐀𝐓𝐈𝐎𝐍 :* ${timestamp || "Unknown"}\n` +
            ` *𝐕𝐈𝐄𝐖𝐒 :* ${views || "Unknown"}\n` +
            ` *𝐑𝐄𝐋𝐄𝐀𝐒𝐄 𝐃𝐀𝐓𝐄 :* ${ago || "Unknown"}\n` +
            ` *𝐀𝐔𝐓𝐇𝐎𝐑 :* ${author?.name || "Unknown"}\n` +
            ` *𝐔𝐑𝐋 :* ${url || "Unknown"}\n\n` +
            ` *𝚁𝙴𝙿𝙻𝚈 𝚆𝙸𝚃𝙷 𝚈𝙾𝚄𝚁 𝙲𝙷𝙾𝙸𝙲𝙴:*\n` +
            `*>>•1.1* *Audio Type* 🎵\n` +
            `*>>•1.2* *Document Type* 📁\n\n` +
            `${config.FOOTER || "```• ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜᴡᴀ ᴛᴇᴄʜ```"}`;

        const sentMsg = await conn.sendMessage(from, { image: { url: image }, caption: info }, { quoted: mek });
        const messageID = sentMsg.key.id;
        await conn.sendMessage(from, { react: { text: '🎶', key: sentMsg.key } });

        // Listen for a single response
        conn.ev.once('messages.upsert', async (messageUpdate) => {
            try {
                const mekInfo = messageUpdate?.messages[0];
                if (!mekInfo?.message) return;

                const userReply = (mekInfo?.message?.conversation || mekInfo?.message?.extendedTextMessage?.text || "").trim();
                const isReplyToSentMsg = mekInfo?.message?.extendedTextMessage?.contextInfo?.stanzaId === messageID;

                if (!isReplyToSentMsg) return;

                let response = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);
                let downloadUrl = response?.result?.download?.url;
                if (!downloadUrl) return await reply("❌ Download link not found!");

                let msg = await conn.sendMessage(from, { text: "⏳ Downloading Your Song..." }, { quoted: mek });

                let sendData;
                if (userReply === "1.1") {
                    sendData = { audio: { url: downloadUrl }, mimetype: "audio/mpeg" };
                } else if (userReply === "1.2") {
                    sendData = { document: { url: downloadUrl }, fileName: `${title}.mp3`, mimetype: "audio/mpeg", caption: `• Powered by HIRAN MD` };
                } else {
                    return await reply("❌ Invalid choice! Reply with 1️⃣.1️⃣ or 1️⃣.2️⃣.");
                }

                await conn.sendMessage(from, sendData, { quoted: mek });
                await conn.sendMessage(from, { text: 'This Song Brought for you by HIRAN MD✅', edit: msg.key });

            } catch (error) {
                console.error(error);
                await reply(`❌ *An error occurred while processing:* ${error.message || "Error!"}`);
            }
        });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(`❌ *An error occurred:* ${error.message || "Error!"}`);
    }
});

// YouTube Video Download Command
cmd({
    pattern: "video",
    alias: ["ytmp4", "ytvideo"],
    react: "🎬",
    desc: "Download Ytmp4",
    category: "download",
    use: ".video <Text or YT URL>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ Please provide a Query or YouTube URL!");

        let id = q.startsWith("https://") ? extractYouTubeID(q) : null;
        if (!id) {
            const searchResults = await dy_scrap.ytsearch(q);
            if (!searchResults?.results?.length) return await reply("❌ No results found!");
            id = searchResults.results[0].videoId;
        }

        const searchData = await dy_scrap.ytsearch(`https://youtube.com/watch?v=${id}`);
        if (!searchData?.results?.length) return await reply("❌ Failed to fetch video!");

        const { url, title, image, timestamp, ago, views, author } = searchData.results[0];

        let info = ` *ʜɪʀᴀɴ ᴍᴅ ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ* \n\n` +
            ` *𝐓𝐈𝐓𝐋𝐄 :* ${title || "Unknown"}\n` +
            ` *𝐃𝐔𝐑𝐀𝐓𝐈𝐎𝐍 :* ${timestamp || "Unknown"}\n` +
            ` *𝐕𝐈𝐄𝐖𝐒 :* ${views || "Unknown"}\n` +
            ` *𝐑𝐄𝐋𝐄𝐀𝐒𝐄 𝐃𝐀𝐓𝐄 :* ${ago || "Unknown"}\n` +
            ` *𝐀𝐔𝐓𝐇𝐎𝐑 :* ${author?.name || "Unknown"}\n` +
            ` *𝐔𝐑𝐋 :* ${url || "Unknown"}\n\n` +
            ` *𝚁𝙴𝙿𝙻𝚈 𝚆𝙸𝚃𝙷 𝚈𝙾𝚄𝚁 𝙲𝙷𝙾𝙸𝙲𝙴:*\n` +
            `*>>•1.1* *360p* 🖥️\n` +
            `*>>•1.2* *480p* 📱\n` +
            `*>>•1.3* *720p* 🎥\n\n` +
            `${config.FOOTER || "```• ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜᴡᴀ ᴛᴇᴄʜ```"}`;

        const sentMsg = await conn.sendMessage(from, { image: { url: image }, caption: info }, { quoted: mek });
        const messageID = sentMsg.key.id;
        await conn.sendMessage(from, { react: { text: '🎬', key: sentMsg.key } });

        // Listen for a single response
        conn.ev.once('messages.upsert', async (messageUpdate) => {
            try {
                const mekInfo = messageUpdate?.messages[0];
                if (!mekInfo?.message) return;

                const userReply = (mekInfo?.message?.conversation || mekInfo?.message?.extendedTextMessage?.text || "").trim();
                const isReplyToSentMsg = mekInfo?.message?.extendedTextMessage?.contextInfo?.stanzaId === messageID;

                if (!isReplyToSentMsg) return;

                let response = await dy_scrap.ytmp4(`https://youtube.com/watch?v=${id}`);
                let downloadUrl = response?.result?.download?.url;
                if (!downloadUrl) return await reply("❌ Download link not found!");

                let msg = await conn.sendMessage(from, { text: "⏳ Downloading Your Video..." }, { quoted: mek });

                let sendData;
                if (userReply === "1.1") {
                    sendData = { video: { url: downloadUrl }, mimetype: "video/mp4" , caption:```• ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜᴡᴀ ᴛᴇᴄʜ```};
                } else if (userReply === "1.2") {
                    sendData = { video: { url: downloadUrl }, mimetype: "video/mp4", caption: ````• ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜᴡᴀ ᴛᴇᴄʜ```` };
                } else if (userReply === "1.3") {
                    sendData = { video: { url: downloadUrl }, mimetype: "video/mp4", caption: ````• ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜᴡᴀ ᴛᴇᴄʜ```` };
                } else {
                    return await reply("❌ Invalid choice! Reply with 1️⃣.1️⃣, 1️⃣.2️⃣, or 1️⃣.3️⃣.");
                }

                await conn.sendMessage(from, sendData, { quoted: mek });
                await conn.sendMessage(from, { text: 'This Video Brought for You by HIRAN-MD ✅', edit: msg.key });

            } catch (error) {
                console.error(error);
                await reply(`❌ *An error occurred while processing:* ${error.message || "Error!"}`);
            }
        });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(`❌ *An error occurred:* ${error.message || "Error!"}`);
    }
});
