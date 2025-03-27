const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function downloadMediafire(mediafireUrl) {
    try {
        console.log("• ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜᴡᴀ ᴛᴇᴄʜ\n");

        // Step 1: Get download link from the API
        const apiUrl = `https://sadiya-tech-apis.vercel.app/download/mfiredl?url=${encodeURIComponent(mediafireUrl)}`;
        const response = await axios.get(apiUrl);
        
        if (!response.data || !response.data.result || !response.data.result.link) {
            throw new Error("Invalid API response or no download link found.");
        }

        const downloadLink = response.data.result.link;
        const fileName = response.data.result.filename || "downloaded_file";
        console.log(`Downloading: ${fileName}`);

        // Step 2: Download the file
        const fileResponse = await axios({
            url: downloadLink,
            method: "GET",
            responseType: "stream",
        });

        // Step 3: Save the file locally
        const filePath = path.join(__dirname, fileName);
        const writer = fs.createWriteStream(filePath);

        fileResponse.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on("finish", () => {
                console.log("\n✅ File downloaded successfully!");
                console.log("• ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜᴡᴀ ᴛᴇᴄʜ");
                resolve(`File saved as: ${filePath}`);
            });
            writer.on("error", reject);
        });
    } catch (error) {
        console.error("Error:", error.message);
    }
}

// Example usage
const mediafireUrl = "https://www.mediafire.com/file/s9co8o5n5ftch9q/RULLMDV5.7z/file";
downloadMediafire(mediafireUrl).then(console.log);
