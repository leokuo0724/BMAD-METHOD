# Knowledge Builder Agents

## Agent Roster

### 1. Knowledge Curator (curator)

**Type**: Expert Agent
**Role**: Content Extraction & Knowledge Management Expert
**Status**: 📝 Planned

**Purpose**:
主要代理，負責內容擷取與知識管理。專業但友善的學習導師，善於將複雜內容簡化。

**Core Capabilities**:

- 網址內容擷取與解析
- 多語言內容理解與翻譯
- 結構化知識模板應用
- 大綱生成與重點提取

**Main Commands**:

- `/digest [url]` - 消化單一網址並生成知識筆記
- `/translate [language]` - 翻譯內容為指定語言
- `/summarize` - 生成執行摘要
- `/configure` - 配置使用者偏好

**Next Steps**:

- [ ] Run `/bmad:bmb:workflows:create-agent` to create this agent
- [ ] Define full command structure
- [ ] Create agent personality and communication style
- [ ] Integrate with digest-article workflow

---

### 2. Tag Master (tag-master)

**Type**: Expert Agent
**Role**: Intelligent Tagging & Classification Expert
**Status**: 📅 Phase 2

**Purpose**:
專業代理，負責智慧標記與知識組織。系統化思維的組織專家，建立知識之間的連結。

**Core Capabilities**:

- 自動主題識別與標記
- 智慧分類與層級建立
- 知識圖譜關聯分析
- 標籤系統管理

**Main Commands**:

- `/tag [content]` - 為內容自動生成標籤
- `/categorize` - 將內容分類到知識體系
- `/relate [topic]` - 找出相關知識連結
- `/search [query]` - 搜尋知識庫

**Next Steps**:

- [ ] Implement in Phase 2
- [ ] Design tagging algorithm
- [ ] Build classification taxonomy
- [ ] Create knowledge graph structure

---

## Creating New Agents

To create a new agent for this module:

```bash
/bmad:bmb:workflows:create-agent
```

When prompted:

1. Select module: `knowledge-builder`
2. Choose agent type: Expert or Module
3. Define personality and commands
4. Save to this agents/ directory

---

## Agent Development Priority

1. **Phase 1 MVP**: Knowledge Curator (basic version)
2. **Phase 2**: Tag Master (智慧標記)
3. **Future**: Additional specialized agents as needed

---

_Module: Knowledge Builder_
_Last Updated: 2025-11-18_
