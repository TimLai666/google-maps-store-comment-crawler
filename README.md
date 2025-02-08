# Google 商家評論爬蟲

這是一個用於爬取 Google 商家評論的爬蟲程式，輸入商家名稱，即可爬取該商家的評論。

程式碼改自 [【網路爬蟲】使用 API 方式爬取 Google 商家評論爬取（附Python程式碼）](https://medium.com/p/5465a19a31b7)。

## 使用方式

此爬蟲有 Python 和 JavaScript 兩個版本：

- Python 版本：`crawler.ipynb`，可執行於 Jupyter Notebook 或 Google Colab。

- JavaScript 版本：`crawler.js`，可自行下載原始碼用於 node.js 環境。
  - 使用方式：
    1. 呼叫 `fetchStoreCommentsByName` 函式，並傳入商家名稱，即可取得該商家的評論。
    2. 呼叫 `fetchStoreCommentsById` 函式，並傳入商家 ID，即可取得該商家的評論。
    - 參數
      - `storeName` / `storeId`: 商家名稱 / 商家 ID。
      - `pageCount`(可選): 要爬取的評論頁數，設為 0 可爬取所有頁面，預設為 1。
      - `maxWaitingInterval`(可選): 最大等待時間，程式會在爬取每次爬取下一頁時隨機等待 1~n 秒，預設為 5000 毫秒（5秒）。

    - 範例：
    ```javascript
    import { fetchStoreCommentsByName } from "./crawler.js";

    fetchStoreCommentsByName("全家").then((comments) => {
      console.log(comments);
    });
    ```

    - 查詢名稱相近的店家：
      - 呼叫 `fetchGoogleMapsStores` 函式，並傳入商家名稱，即可取得名稱相近的店家列表。
      - 參數
        - `storeName`: 商家名稱。
      - 回傳值
        - 店家陣列。
        ```javascript
        [{
          id: string,
          name: string,
        }]
        ```
