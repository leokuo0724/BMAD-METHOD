# Knowledge Builder Workflows

## Workflow Ecosystem

Knowledge Builder 提供三層次的 workflow 生態系統：

---

## Core Workflows (必須 - Phase 1)

### 1. digest-article

**Status**: 📝 To Create
**Priority**: P0 - 核心價值
**Type**: Document Workflow
**Complexity**: Standard

**Purpose**:
將單一網址轉換為結構化知識筆記

**Flow**:
URL 輸入 → 內容擷取 → 語義分析 → 大綱生成 → 重點提取 → 翻譯 → 標記 → 儲存

**Output**:
標準化的知識筆記檔案 (Markdown)

**Next Steps**:

```bash
/bmad:bmb:workflows:create-workflow
```

---

### 2. batch-digest

**Status**: 📅 Phase 2
**Priority**: P1
**Type**: Action Workflow
**Complexity**: Standard

**Purpose**:
批次處理多個網址，建立主題知識庫

**Flow**:
URL 列表 → 逐一處理 → 自動關聯 → 主題分組 → 生成索引

**Output**:
主題知識資料夾 + 索引檔案

---

### 3. search-knowledge

**Status**: 📅 Phase 2
**Priority**: P1
**Type**: Interactive Workflow
**Complexity**: Standard

**Purpose**:
搜尋和檢索已建立的知識庫

**Flow**:
查詢輸入 → 語義搜尋 → 標籤匹配 → 關聯分析 → 結果排序 → 呈現摘要

**Output**:
相關知識列表 + 摘要

---

## Feature Workflows (進階 - Phase 2-3)

### 4. update-knowledge

**Status**: 📅 Phase 3
**Type**: Action Workflow
**Complexity**: Complex

**Purpose**:
更新已存在的知識筆記（當原文有變更）

**Flow**:
重新擷取 → 差異比對 → 合併更新 → 版本記錄

---

### 5. export-knowledge

**Status**: 📅 Phase 3
**Type**: Action Workflow
**Complexity**: Simple

**Purpose**:
匯出知識庫為不同格式（PDF, HTML, JSON）

**Flow**:
選擇範圍 → 格式轉換 → 樣式應用 → 生成檔案

---

### 6. build-knowledge-graph

**Status**: 📅 Phase 3
**Type**: Interactive Workflow
**Complexity**: Complex

**Purpose**:
視覺化知識之間的關聯

**Flow**:
分析標籤 → 建立關聯 → 生成圖譜 → 互動式呈現

---

## Utility Workflows (工具 - Phase 1)

### 7. manage-templates

**Status**: 📅 Phase 2
**Type**: Interactive Workflow
**Complexity**: Simple

**Purpose**:
管理和自訂知識筆記模板

**Flow**:
瀏覽模板 → 編輯/新增 → 預覽 → 儲存

---

### 8. configure-preferences

**Status**: 📝 To Create
**Priority**: P0
**Type**: Interactive Workflow
**Complexity**: Simple

**Purpose**:
設定個人偏好（預設語言、模板、標籤規則）

**Flow**:
載入設定 → 互動式調整 → 驗證 → 儲存

---

## Creating New Workflows

To create a new workflow for this module:

```bash
/bmad:bmb:workflows:create-workflow
```

When prompted:

1. Select module: `knowledge-builder`
2. Choose workflow type: Document, Action, or Interactive
3. Define steps and logic
4. Save to this workflows/ directory

---

## Workflow Development Priority

**Phase 1 (MVP)**:

1. ✅ digest-article (P0 - 核心)
2. ✅ configure-preferences (P0 - 設定)

**Phase 2 (Enhancement)**: 3. batch-digest (P1) 4. search-knowledge (P1) 5. manage-templates (P2)

**Phase 3 (Polish)**: 6. update-knowledge (P2) 7. export-knowledge (P2) 8. build-knowledge-graph (P3)

---

_Module: Knowledge Builder_
_Last Updated: 2025-11-18_
