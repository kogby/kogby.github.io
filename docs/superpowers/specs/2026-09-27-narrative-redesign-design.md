# 網站敘事重構 — Design Spec

日期：2026-09-27 · 分支：`feat/narrative-redesign`

## 目標

把網站的敘事從「6 個細分 domain 的星座圖」收斂成一個清楚的定位：**Systems × ML，交集是 ML Infra**。

- Recruiter 落地 5 秒內看懂這個定位，然後一路往下滑完 experience / projects / skills。
- 第一印象是 professional；私人內容（Writings、Life List）存在但不干擾。

## 資訊架構

```
/  (單一長頁)
 ├ #about       Hero（大標語保留）+ Summary
 ├ #map         文氏圖 Systems × ML → ML Infra
 ├ #experience  Work + Research 一條時間軸；Leadership 精簡清單在最後
 ├ #projects    依區塊分組：ML Infra → Systems → ML
 ├ #skills      技能 chips + Coursework
 ├ #studying    Currently Studying（有封面）
 └ #contact

/writings       Substack / Medium 文章清單（外連 ↗）
/life           Life 100 List
```

**Nav：** `kogby   Experience  Projects  Skills  Contact │ personal`

- 連結用 `/#experience` 形式，從 `/writings` 點也會回到首頁對應段落。
- 各 section 加 `scroll-margin-top`，固定 nav 不擋標題。
- `personal`：細分隔線 + 淡灰手寫字，連到 `/writings`。
- `/writings` 和 `/life` 共用一個 route group layout `app/(personal)/layout.tsx`，放「Writings · Life List」小導覽。

**移除：**

- 路由 `/experience` `/projects` `/skills` `/studying` `/contact`（由長頁取代）。
- 首頁 Selected Work、Life teaser。
- `ProjectsView`（tab 切換）、`ConstellationGraph`、Projects 的 tech-tag 篩選。
- Experience 的 Work/Research/Leadership tab。

## 文氏圖（`#map`）

**畫面：**

- SVG，兩個只有線條、無填色的圓（line-art）。左圓 **Systems**，右圓 **Machine Learning**，交集標 **ML Infra**。
- 圓標題下方的灰字：
  - Systems：`Distributed Systems · Cloud Infra · Data Engineering`
  - ML：`Data Science · ML Engineering`

**點：**

- 實心 ● = project，空心 ○ = experience。只收 Work + Research，不收 Leadership。
- 每區的點排成一條垂直欄、等距，位置固定、無隨機。
- 圖下方有一行圖例：`● project ○ experience`。

**區塊規則**（`lib/venn.ts` 的 `regionOf(domains)`，只讀 `career.json` 現有的 `domains` 欄位，不改 resume 用的資料）：

1. 有 `mlinfra`，或同時有 {`backend`, `distributed`} 其一 **和** {`ds`, `mle`} 其一 → **ML Infra**
2. 否則有 {`ds`, `mle`} 其一 → **ML**
3. 否則 → **Systems**

`de` 不會讓一個項目進交集。

**預期落點：**

| 區塊 | Experience ○ | Project ● |
|---|---|---|
| ML Infra | Amazon | GPU Kernels on B200、LoadShift |
| Systems | LINE、Trend Micro | Distributed Miner、Memory Allocator、Online Judge、NTU Rating |
| ML | EVA Air、Data Quality Pipeline、Cathay、NTU Productivity Lab、NTU Info Economy Lab | AI GO House Price |

**互動：**

- Hover 區塊 → 該區的點亮起（紫 `--accent-primary`），其餘淡化。
- Hover 或 focus 點 → 顯示名稱。
- 點擊點 → 平滑捲到對應卡片（`#exp-<slug>` / `#project-<slug>`），卡片邊框閃紫約 1 秒。
- 每個點是 `<button>`，有 `aria-label`。
- 手機上點一下 = 捲動。

## 內容

- **Summary：** 用現成文字，不新寫。內容是 Hero 原本的「Recent work spans…」段落，加上未使用的 `Bio.tsx` 文字（CMU、LINE、EVA Air、NTU Data Analytics Club、「minimal, observable systems」）。放在 Hero 下方；Hero 只留大標語、「Hi, I'm Jerry」那句、畢業/求職那行、CTA、社群連結。
- **Hero CTA：** 「View Work」→ `#map`，「Contact Me」→ `#contact`。
- **公司 logo：**
  - 來源：Wikimedia Commons 或官方網站。對象是 Amazon、EVA Air、Trend Micro、Cathay Financial、NTU（NTU 各 lab 共用）。Leadership 清單不放 logo，所以社團類不找。
  - 存到 `public/logos/`，路徑填進 `career.json` 既有的 `logoUrl` 欄位。
  - 每個檔案都驗證能正常開啟（上次有壞檔）。找不到的保留首字母 fallback。
  - 預設灰階，hover 轉彩色。
- **封面：** DDIA 書封、CMU 15-445 縮圖（CMU Database Group logo），存 `public/studying/`，填進 `studyingNow[].imageUrl`。
- **Experience：**
  - Work + Research 一條時間軸，每項最多 3 bullets（同現在）。
  - Leadership 放在最後，一行一項：org · role · period。
  - 每項有 `id="exp-<slug>"`。
- **Projects：**
  - 卡片依 ML Infra → Systems → ML 三個標題分組；tech tags 保留在卡片上。
  - 每張有 `id="project-<slug>"`。
- **Skills：** chips 不變，下方接 `CourseworkList`。

## 背景

- `body`：米白底 + 24px 淡灰方格線。用 CSS `linear-gradient` 畫 1px 線，視覺上無漸層。
- `components/GridBackground.tsx`（client）：
  - 一層 `position: fixed` 的同款方格，線色稍深帶紫。
  - 用 `mask-image: radial-gradient(circle ~200px at var(--mx) var(--my), …)` 只露出游標附近。
  - `mousemove`（rAF 節流）更新 `--mx/--my`。
- `@media (hover: none)` 和 `prefers-reduced-motion: reduce` 時隱藏這層，只剩靜態方格。
- 卡片維持白底，確保可讀。

## 私人頁

- **`/writings`：**
  - 手寫字標題，清單來自 `lib/data.ts` 新增的 `writings: { title, date, platform, url, blurb }[]`，每篇外連 ↗。
  - 空的時候顯示「first post coming soon」，加上 Medium 個人頁連結（Substack 網址提供後再加）。
- **`/life`：** 內容不變，搬進 `(personal)` route group，網址不變。

## 不做（YAGNI）

- Nav 捲動時高亮目前段落。
- RSS 自動抓文（等文章多了再做：build 時抓 + GitHub Action 排程重 build）。
- 專案縮圖輪播 modal（等有截圖再做）。
- 深色模式。

## 驗證

- `npm run build`（static export）和 `npm run lint` 通過。
- `regionOf` 有一個小的 assert 檢查腳本，確認上表的落點。
- 無頭瀏覽器截圖：桌面寬度和 400px 手機寬度，確認版面、文氏圖、背景。
- 每個 nav 跳轉都落在正確段落；從 `/writings` 點 nav 會回到首頁對應段落。
