# ASUS 會議室預約 Agent — Office Add-in

在 Outlook 新增會議時，一鍵開啟 ASUS Booking System 並自動搜尋立德8F會議室。

---

## 安裝步驟

### Step 1：上傳到 GitHub Pages

1. 在 GitHub 建立新的 Repository，名稱取為 `asus-booking-addin`
2. 將本資料夾中所有檔案上傳
3. 進入 Repository Settings → Pages → Source 選 `main` branch → Save
4. 等待約 1 分鐘，GitHub Pages 網址會是：
   `https://YOUR_GITHUB_USERNAME.github.io/asus-booking-addin/`

### Step 2：修改 manifest.xml

將 `manifest.xml` 中所有的 `YOUR_GITHUB_USERNAME` 替換為你的 GitHub 帳號名稱。

例如帳號是 `jingyuan-wu`，就把：
```
https://YOUR_GITHUB_USERNAME.github.io/asus-booking-addin/
```
改為：
```
https://jingyuan-wu.github.io/asus-booking-addin/
```

### Step 3：在 Outlook 側載 Add-in

1. 開啟桌面版 Outlook
2. 點選上方工具列「**取得增益集**」（或「Get Add-ins」）
3. 選擇左側「**我的增益集**」→「**新增自訂增益集**」→「**從檔案新增**」
4. 選擇 `manifest.xml` 檔案
5. 點選「安裝」

### Step 4：使用

1. 在 Outlook 新增會議
2. 工具列會出現「🏢 預約會議室」按鈕
3. 點擊後，右側開啟面板，顯示會議日期
4. 點擊「開啟預約系統並搜尋」，瀏覽器自動開啟並執行預約流程

---

## 注意事項

- 需要 Microsoft 365 帳號（公司帳號通常已包含）
- GitHub Pages 必須是 HTTPS（預設就是）
- Add-in 僅安裝在你的帳號，不影響其他同事
