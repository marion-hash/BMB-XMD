const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiS0hGOXFFcHVNSy9OWkZqSzI4aUExcXdybEZ0Yk9jVURXN0VrVE5UaU5FTT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVTVvMTFyaEVicWVkT0tnbzA3NXoyRGNpUU55cWszdDhTUnM2NzJDZVFrUT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJNSVFkVDJLSHI5dklJNGpMSXJ3QTlONmVnTmxXT0l2UUJ0enZtTjBpVTFJPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJyVmxWTkgyVC81b1RtdTZuMjFGUkVPRmhiYXA0MVNhekZ4dTBCUmlZNXdnPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImFFeHR4SDd3MmFJa0tXNEFQa1pRNUdWV3RmbjBEUVRzRzJLMzZ0Y0FLa2M9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im1zZmdFeElVTDhNZDJaNU9hK3pIUlhqMndqWlQyUEs2ZHFEQkxXUFk0VEE9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoia0xlSytnTHBnY01Za2RldzFMTWxoY2NDaVB0RmZLZCsvaDJrS0RSQ2JVST0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUlZXWlZKZWV4ckRPV2htZ21HeHUyRFlGNytLRVFnd290ZUtFRjFtR2VnND0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImJXc3RnSmMxUUtMU2UzeHlPdEw2MGtsbVc1M1FZWlZsaDBBTkx1RDFLWW5Vd3RJK2ZMZHRydzJQMUFYNmUxSnA2TW5TenNOUlROZUVwOGxlZmQvUERnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTM3LCJhZHZTZWNyZXRLZXkiOiJDalBrZ1MzeElSbnpLOGtReW93b2g5RVVpcnJoL1VHOXdBK1lVUkdCSUNrPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjI1NTc5NDQwNjEwOUBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiI2RTVFNDJDN0Q5OTNDMzNCRkYxQTk5QjUyMUIxQzIyMCJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzUyOTY0MTk5fV0sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjoxLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwicmVnaXN0ZXJlZCI6dHJ1ZSwicGFpcmluZ0NvZGUiOiJFWlpOUlpERiIsIm1lIjp7ImlkIjoiMjU1Nzk0NDA2MTA5OjQ2QHMud2hhdHNhcHAubmV0IiwibGlkIjoiMTY4MTMxNDEwNTQ2ODEzOjQ2QGxpZCIsIm5hbWUiOiJATE9SRCBWQVlORSJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSmU3OE53RkVNbTQ4TU1HR0FnZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiQ1RjMFZJSUR6NkM5bzd3OWV6TG1uQjNRMnNKWXZWOVYyL0FlNnZhU1l5ST0iLCJhY2NvdW50U2lnbmF0dXJlIjoiRk9kdGs4eGc0UG5pRGdtNFVubUNzTmRYT01vVnA5RXdwMUpCeVdtemR0MHFVa1hHVEg1T1pNOTF0c2RKTjBmSzFpUngyYWd4N1VjTGd6MHpEcnlSRHc9PSIsImRldmljZVNpZ25hdHVyZSI6IkYyMVlJRkt0U01jYmUvSGVUdUxiNGtIWWpqaUxJVUpST0ZEY2RCeHF4WDByd2NZZFhzWGttVjVNYnAvR084SkVJc1JncXFjL0xLVHBXQjFub1hWTENBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU1Nzk0NDA2MTA5OjQ2QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlFrM05GU0NBOCtndmFPOFBYc3k1cHdkME5yQ1dMMWZWZHZ3SHVyMmttTWkifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBVUlDQT09In0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc1Mjk2NDE4MywibGFzdFByb3BIYXNoIjoiMkc0QW11IiwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFEZXIifQ==',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "B.M.B-TECH",
    NUMERO_OWNER : process.env.NUMERO_OWNER || " 𝙱.𝙼.𝙱-𝚇𝙼𝙳",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'B.M.B-TECH',
    URL : process.env.BOT_MENU_LINKS || 'https://files.catbox.moe/hvi870.jpg',
    MODE: process.env.PUBLIC_MODE || "no",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || 'sleeping',
    ANTICALL : process.env.ANTICALL || 'ni',   
    AUTO_BIO : process.env.AUTO_BIO || 'yes',               
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ANTIDELETE1 : process.env.ANTI_DELETE_MESSAGE || 'ni',
    AUTO_REACT : process.env.AUTO_REACT || 'yes',
    AUTO_REACT : process.env.AUTO_REACT || 'yes',              
    AUTO_REACT_STATUS : process.env.AUTO_REACT_STATUS || 'yes',
    AUTO_READ : process.env.AUTO_READ || 'no',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});

