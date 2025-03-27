const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const config = require('../config');

const API_URL = "https://api.skymansion.site/movies-dl/search";
const DOWNLOAD_URL = "https://api.skymansion.site/movies-dl/download";
const API_KEY = config.MOVIE_API_KEY;

let movieSelections = {};
let qualitySelections = {};

// Function to convert text into stylish font
function toStylishFont(text) {
    const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const stylish = "ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾᵠᴿˢᵀᵁⱽᵂˣʸᶻᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖᵠʳˢᵗᵘᵛʷˣʸᶻ";
    return text.split("").map(c => {
        let index = normal.indexOf(c);
        return index !== -1 ? stylish[index] : c;
    }).join("");
}

// Movie search command
cmd({
    pattern: "sinhalasub",
    alias: ["moviedl", "films"],
    react: '🎬',
    category: "movie",
    desc: "HIRAN MD MOVIE DOWNLOADER",
    filename: __filename
}, async (robin, m, mek, { from, q, reply }) => {
    try {
        if (!q || q.trim() === '') return await reply('❌ Please provide a movie name! (e.g., Deadpool)');

        const searchUrl = `${API_URL}?query=${encodeURIComponent(q)}&apikey=${API_KEY}`;
        let response = await fetchJson(searchUrl);

        if (!response || !response.results || response.results.length === 0) {
            return await reply(`❌ No results found for: *${q}*`);
        }

        let moviesList = response.results.slice(0, 5); 
        let message = `🎬 *HIRAN MD MOVIE DOWNLOADER*\n\n🔎 *Search Results for:* ${q}\n\n`;
        moviesList.forEach((movie, index) => {
            message += `*${index + 1}.* ${movie.title} (${movie.year})\n`;
        });
        message += `\n💬 *Reply with a number (1-${moviesList.length}) to choose a movie.*\n\n${config.FOOTER || '• ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜᴡᴀ ᴛᴇᴄʜ'}`;

        movieSelections[from] = { moviesList, mek }; 
        await reply(message);
    } catch (error) {
        console.error('Error in movie command:', error);
        await reply('❌ Something went wrong. Please try again later.');
    }
});

// Handle movie selection
cmd({
    onMessage: true
}, async (robin, m, mek, { from, body, reply }) => {
    if (movieSelections[from] && /^[1-5]$/.test(body.trim())) {
        let { moviesList, mek: originalMek } = movieSelections[from];
        let movieIndex = parseInt(body.trim()) - 1;
        let selectedMovie = moviesList[movieIndex];

        if (!selectedMovie) return;

        const detailsUrl = `${DOWNLOAD_URL}?id=${selectedMovie.id}&apikey=${API_KEY}`;
        let detailsResponse = await fetchJson(detailsUrl);

        if (!detailsResponse || !detailsResponse.links || detailsResponse.links.length === 0) {
            delete movieSelections[from];
            return await reply('❌ No download links found for this movie.');
        }

        let availableLinks = detailsResponse.links;
        let message = `🎬 *${selectedMovie.title}*\n🗓 Year: ${selectedMovie.year}\n📺 Genres: ${selectedMovie.genres.join(', ')}\n\n📌 *Choose Quality:*\n\n`;
        availableLinks.forEach((link, index) => {
            message += `*${index + 1}.* ${link.quality} - ${link.size}MB\n`;
        });
        message += `\n💬 *Reply with a number (1-${availableLinks.length}) to select quality.*\n\n${config.FOOTER || '• ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜᴡᴀ ᴛᴇᴄʜ'}`;

        qualitySelections[from] = { availableLinks, selectedMovie, mek: originalMek };
        delete movieSelections[from];

        await robin.sendMessage(from, {
            image: { url: selectedMovie.poster }, 
            caption: message,
            quoted: originalMek
        });
    }
});

// Handle quality selection & start download
cmd({
    onMessage: true
}, async (robin, m, mek, { from, body, reply }) => {
    if (qualitySelections[from] && /^[1-5]$/.test(body.trim())) {
        let { availableLinks, selectedMovie, mek: originalMek } = qualitySelections[from];
        let qualityIndex = parseInt(body.trim()) - 1;
        let selectedDownload = availableLinks[qualityIndex];

        if (!selectedDownload || !selectedDownload.url.startsWith('http')) {
            delete qualitySelections[from];
            return await reply('❌ No valid download link available.');
        }

        const fileId = selectedDownload.url.split('/').pop();
        const directDownloadLink = `https://pixeldrain.com/api/file/${fileId}?download`;

        const stylishTitle = toStylishFont(selectedMovie.title);
        const fileName = `ʜɪʀᴀɴ ᴍᴏᴠɪᴇ ᴅʟ | ${stylishTitle} - ${selectedDownload.quality}.mp4`;
        const filePath = path.join(__dirname, fileName);
        const writer = fs.createWriteStream(filePath);
        
        const { data } = await axios({
            url: directDownloadLink,
            method: 'GET',
            responseType: 'stream'
        });

        data.pipe(writer);

        writer.on('finish', async () => {
            await robin.sendMessage(from, {
                document: fs.readFileSync(filePath),
                mimetype: 'video/mp4',
                fileName: fileName,
                caption: `🎬 *${stylishTitle}*\n📌 Quality: ${selectedDownload.quality}\n✅ *Download Complete!*\n\n${config.FOOTER || '• ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜᴡᴀ ᴛᴇᴄʜ'}`,
                thumbnail: { url: selectedMovie.poster },
                quoted: originalMek 
            });
            fs.unlinkSync(filePath);
        });

        writer.on('error', async (err) => {
            console.error('Download Error:', err);
            await reply('❌ Failed to download movie. Please try again.');
        });

        delete qualitySelections[from];
    }
});
