# Knowledge Builder Development Roadmap

## Phase 1: MVP (Minimum Viable Module)

### Core Components

- [ ] **Knowledge Curator agent (基本版)**
  - [ ] 定義 agent YAML 規格
  - [ ] 實作 `/digest` 指令
  - [ ] 實作 `/translate` 指令
  - [ ] 實作 `/summarize` 指令
  - [ ] 實作 `/configure` 指令

- [ ] **digest-article workflow (核心功能)**
  - [ ] 建立 workflow.yaml
  - [ ] 撰寫 instructions.md
  - [ ] 建立 template.md (知識筆記模板)
  - [ ] 實作 URL 擷取邏輯
  - [ ] 實作內容分析與大綱生成
  - [ ] 實作翻譯功能
  - [ ] 實作檔案儲存邏輯

- [ ] **基本知識模板**
  - [x] Technical Article 模板
  - [ ] Tutorial 模板
  - [ ] API Docs 模板
  - [ ] Blog Post 模板

- [ ] **configure-preferences workflow**
  - [ ] 建立配置 workflow
  - [ ] 實作語言設定
  - [ ] 實作模板選擇
  - [ ] 實作路徑配置

### Deliverables

- [ ] 功能性的單文章消化流程
- [ ] Markdown 格式的知識筆記輸出
- [ ] 基本的翻譯支援（繁中/英）
- [ ] 簡單的檔案組織結構
- [ ] 使用者配置系統

### 驗證標準

- [ ] 能成功消化一篇技術文章並生成筆記
- [ ] 輸出格式清晰可讀
- [ ] 新使用者可在 10 分鐘內完成首次使用

---

## Phase 2: Enhancement

### Core Components

- [ ] **Tag Master agent（智慧標記）**
  - [ ] 定義 agent 規格
  - [ ] 實作自動標記功能
  - [ ] 實作分類功能
  - [ ] 實作關聯分析

- [ ] **batch-digest workflow**
  - [ ] 批次處理邏輯
  - [ ] 自動關聯分析
  - [ ] 主題分組
  - [ ] 索引生成

- [ ] **search-knowledge workflow**
  - [ ] 語義搜尋實作
  - [ ] 標籤匹配
  - [ ] 結果排序
  - [ ] 摘要呈現

- [ ] **更多知識模板**
  - [ ] Tutorial 模板完善
  - [ ] API Docs 模板
  - [ ] Blog Post 模板

- [ ] **增強的標籤系統**
  - [ ] 標籤索引建立
  - [ ] 自動分類邏輯
  - [ ] 標籤關聯分析

### Deliverables

- [ ] 智慧自動標記功能
- [ ] 批次處理多個 URL
- [ ] 語義搜尋功能
- [ ] 主題知識庫組織
- [ ] 標籤索引和分類系統

### 驗證標準

- [ ] 標籤準確度達 80%
- [ ] 可批次處理 10+ 篇文章
- [ ] 搜尋結果相關性高

---

## Phase 3: Polish and Optimization

### Core Components

- [ ] **update-knowledge workflow（內容更新）**
  - [ ] 重新擷取邏輯
  - [ ] 差異比對
  - [ ] 合併更新
  - [ ] 版本記錄

- [ ] **export-knowledge workflow（多格式匯出）**
  - [ ] PDF 匯出
  - [ ] HTML 匯出
  - [ ] JSON 匯出
  - [ ] 樣式設計

- [ ] **build-knowledge-graph workflow（知識圖譜）**
  - [ ] 關聯分析演算法
  - [ ] 圖譜資料結構
  - [ ] 視覺化實作
  - [ ] 互動功能

- [ ] **進階模板系統（可自訂）**
  - [ ] 模板編輯器
  - [ ] 自訂變數
  - [ ] 模板預覽

- [ ] **外部整合（Notion, Obsidian）**
  - [ ] Notion API 整合
  - [ ] Obsidian 格式相容
  - [ ] Anki 匯出
  - [ ] GitHub 整合

### Deliverables

- [ ] 知識圖譜視覺化
- [ ] 多格式匯出（PDF, HTML, JSON）
- [ ] 版本控制和內容更新機制
- [ ] 外部工具整合
- [ ] 效能優化和錯誤處理強化

### 驗證標準

- [ ] 知識庫可管理 500+ 篇筆記
- [ ] 圖譜清晰呈現知識關聯
- [ ] 匯出格式專業且美觀

---

## Quick Commands

### 創建新 agent:

```
/bmad:bmb:workflows:create-agent
```

### 創建新 workflow:

```
/bmad:bmb:workflows:create-workflow
```

### 測試模組:

```
bmad install knowledge-builder
```

---

## 開發筆記

### 優先順序

1. Phase 1 MVP - digest-article workflow (核心價值)
2. Phase 1 MVP - 配置與模板系統
3. Phase 2 - 智慧標記與搜尋

### 技術決策

- 使用 Markdown 作為唯一輸出格式（Phase 1-2）
- 本地檔案系統儲存，不使用資料庫（Phase 1）
- 雙 Agent 架構
- 原文參考系統：段落連結 + 標題記錄

### 待解決問題

- [ ] 翻譯 API 選擇（Google Translate, DeepL, 或 LLM）
- [ ] 標籤分類法設計
- [ ] 知識圖譜視覺化工具選擇

---

_Last Updated: 2025-11-18_
