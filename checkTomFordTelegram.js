const axios = require("axios");
const cheerio = require("cheerio");

const URL = "https://www.tomfordbeauty.co.uk/product/eye-colour-quad?shade=30_Insolent_Rose";
// const URL = "https://www.tomfordbeauty.co.uk/product/eye-colour-quad?shade=02_Rose_Veil";

// 你的 Bot Token 和 ChatID
const BOT_TOKEN = "7970847951:AAGOMWTA8IHAlCw7oBrvYY1j0Dg6pLtnODs";
const CHAT_ID = "-4563102099";

// 发 Telegram 消息
async function sendTelegram(msg) {
    const telegramURL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    try {
        await axios.post(telegramURL, {
            chat_id: CHAT_ID,
            text: msg
        });
        console.log("📨 Telegram 通知已发送");
    } catch (err) {
        console.error("Telegram 通知失败：", err.message);
    }
}

async function checkStock() {
    try {
        const response = await axios.get(URL, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const $ = cheerio.load(response.data);

        // 直接用 class 精准定位
        const btn = $("button.product-details-add-to-bag-button");

        // 按钮文字
        const text = btn.text().trim().toLowerCase();

        // 是否 disabled
        const disabled = btn.attr("disabled") !== undefined;

        const now = new Date().toLocaleString();

        if (text.includes("add to bag") && !disabled) {
            console.log(`[${now}] 🎉 已补货！`);
        } else {
            console.log(`[${now}] ❌ 还没货`);
        }

    } catch (error) {
        console.error("请求失败：", error.message);
    }
}

// 每 5 分钟检查一次
setInterval(checkStock, 5 * 60 * 1000);
checkStock();
