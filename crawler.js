class GoogleMapsCommentCrawler {
    constructor() {
        this.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
        };
        this.storeSearchUrl = "https://www.google.com/maps/search/{store_name}";
        this.commentUrl = "https://www.google.com/maps/rpc/listugcposts";
    }

    async getStoreId(storeName) {
        const url = this.storeSearchUrl.replace("{store_name}", encodeURIComponent(storeName));
        try {
            const response = await fetch(url, { headers: this.headers });
            if (!response.ok) throw new Error("獲取商家 ID 失敗: 無效的回應");
            const text = await response.text();
            const pattern = /0x[a-fA-F0-9]+:0x[a-fA-F0-9]+/;
            const match = text.match(pattern);
            if (!match) throw new Error("無法取得商家 ID");
            return match[0];
        } catch (error) {
            console.error("獲取商家 ID 失敗:", error.message);
            return null;
        }
    }

    async getComments(storeId, pageCount = 1, sortedBy = 2, maxWaitingInterval = 5000) {
        let nextToken = "";
        let comments = [];

        for (let page = 1; page <= pageCount; page++) {
            console.log(`正在抓取第 ${page} 頁評論...`);

            const params = {
                "authuser": "0",
                "hl": "zh-TW",
                "gl": "tw",
                "pb": (
                    `!1m6!1s${storeId}!6m4!4m1!1e1!4m1!1e3!2m2!1i10!2s`
                    + `${nextToken}`
                    + `!5m2!1s0OBwZ4OnGsrM1e8PxIjW6AI!7e81!8m5!1b1!2b1!3b1!5b1!7b1!11m0!13m1!1e${sortedBy}`
                )
            };

            try {
                const urlParams = new URLSearchParams(params).toString();
                const response = await fetch(`${this.commentUrl}?${urlParams}`, { headers: this.headers });
                if (!response.ok) throw new Error("獲取評論失敗: 無效的回應");

                const text = await response.text();
                const jsonData = JSON.parse(text.substring(4)); // Google 回應前綴 `)]}'`
                nextToken = jsonData[1];

                jsonData[2].forEach(comment_data => {
                    // try {
                    const commentDate = comment_data?.at(0)?.at(2)?.at(2)?.at(0)?.at(1)?.at(21)?.at(6);
                    comments.push({
                        "評論者": comment_data[0][1][4][5][0],
                        "評論者id": comment_data[0][0],
                        "評論者狀態": comment_data[0][1][4][5][10][0],
                        "評論者等級": comment_data[0][1][4][5][9],
                        "留言時間": comment_data[0][1][6],
                        "留言日期": commentDate ? commentDate.at(-1) : null,
                        "評論": comment_data[0][2].at(-1)[0][0],
                        "評論分數": comment_data[0][2][0][0]
                    });
                    // } catch (parseError) {
                    //     console.error("解析評論時發生錯誤:", parseError.message);
                    // }
                });

                if (!nextToken) break;
            } catch (error) {
                console.error("獲取評論失敗:", error.message);
                break;
            }

            // 隨機等待時間來模擬人為點擊，防止被封鎖
            const waitTime = Math.floor(Math.random() * (maxWaitingInterval - 1000)) + 1000;
            console.log(`等待 ${waitTime / 1000} 秒後抓取下一頁...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        return comments;
    }
}

async function fetchGoogleMapsComments(storeName, pageCount = 3, maxWaitingInterval = 5000) {
    if (!storeName) {
        throw new Error("請輸入店名");
    }

    const crawler = new GoogleMapsCommentCrawler();
    const storeId = await crawler.getStoreId(storeName);
    if (!storeId) throw new Error("無法獲取商家 ID");

    console.log(`商家 ID: ${storeId}`);
    const comments = await crawler.getComments(storeId, pageCount, 2, maxWaitingInterval);

    return comments;
}

