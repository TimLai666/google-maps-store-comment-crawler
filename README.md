# Google 商家評論爬蟲

這是一個用於爬取 Google 商家評論的爬蟲程式，輸入商家名稱，即可爬取該商家的評論。

## 使用方式

此爬蟲有 Python 和 JavaScript 兩個版本：

- Python 版本：`crawler.ipynb`，可執行於 Jupyter Notebook 或 Google Colab。

- JavaScript 版本：`crawler.js`，可自行下載原始碼用於 node.js 環境。
  - 使用方式：
    - 呼叫 `fetchGoogleMapsComments` 函式，並傳入商家名稱，即可取得該商家的評論。
    - 參數
      - `storeName`: 商家名稱。
      - `pageCount`: 要爬取的評論頁數，設為 0 可爬取所有頁面，預設為 1。
      - `maxWaitingInterval`: 最大等待時間，程式會在爬取每次爬取下一頁時自動等待 1~n 秒，預設為 5000 毫秒（5秒）。

    - 範例：
    ```javascript
    fetchGoogleMapsComments('星巴克').then(comments => console.log(comments));
    ```
