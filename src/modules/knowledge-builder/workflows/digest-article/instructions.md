# Digest Article - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/custom/modules/knowledge-builder/workflows/digest-article/workflow.yaml</critical>
<critical>ALWAYS communicate in {communication_language} throughout the workflow</critical>
<critical>Use the professional, concise communication style defined in the Knowledge Curator agent persona</critical>

<workflow>

<action>Record workflow start time as {{workflow_start_time}}</action>

<step n="1" goal="Get article URL from user">
<critical>This workflow supports direct URL parameter. If user invoked with `/digest <url>`, use that URL directly without asking.</critical>

<check if="URL provided as parameter">
  <action>Use the provided URL as {{source_url}}</action>
  <action>Skip asking, proceed directly to validation</action>
</check>

<check if="no URL parameter">
  <ask>請提供要消化的文章 URL:</ask>
  <action>Store the URL as {{source_url}}</action>
</check>

<action>Validate URL format (must be valid http/https URL)</action>

<check if="invalid URL">
  <action>Report error: "❌ 無效的 URL 格式"</action>
  <goto step="1">Request URL again</goto>
</check>
</step>

<step n="2" goal="Fetch and analyze article content">
<critical>PERFORMANCE OPTIMIZATION: Try WebFetch first (faster for static content), only use Playwright if WebFetch fails or returns insufficient content.</critical>

<action>Attempt to fetch content using WebFetch (preferred for speed):

**Primary method - WebFetch**:

1. Use WebFetch tool to fetch {{source_url}}
2. Check if returned content contains substantial article text (> 500 characters of actual content)
3. If content is sufficient, proceed to extraction

**Fallback method - Playwright MCP** (if WebFetch fails or returns insufficient content):

1. Navigate to {{source_url}} using playwright_navigate
2. Wait for page to fully load (wait for network idle)
3. Use playwright_snapshot to get page accessibility tree and extract full HTML content
4. Parse HTML to identify image elements with their URLs, alt text, and surrounding context

Why this order:

- WebFetch is 5-10x faster for static blogs (Medium, Dev.to, personal blogs)
- Playwright is only needed for JavaScript-heavy sites (React docs, SPAs)

**Note**: Ensure Playwright MCP is configured with `--headless` flag to avoid browser windows popping up. See INSTALLATION.md for configuration details.
</action>

<action>Extract the following information from fetched content:

- Article title
- Main content sections and structure
- Code blocks (if any)
- Headings and subheadings
- Author and publication date (if available)
  </action>

<check if="fetch fails or content empty">
  <action>Report error: "❌ 無法擷取文章內容,請確認 URL 是否正確且可訪問"</action>
  <goto step="1">Request different URL</goto>
</check>

<action>Generate article outline analyzing the structure and main sections</action>
<action>Create URL-friendly slug from article title for filename (lowercase, hyphens, no spaces)</action>
<action>Store as {{article_title_slug}}</action>
</step>

<step n="3" goal="Extract core information with context">
<critical>Perform ALL extraction and analysis in the ORIGINAL LANGUAGE of the article. Do NOT translate yet - translation happens in Step 4 after content is condensed.</critical>

<action>Analyze the fetched content and extract the following sections with emphasis on WHY and HOW context:

**Executive Summary** ({{executive_summary}}):

- **WHAT**: Describe what this article is about in 1 sentence
- **WHY**: Explain why this topic matters (problem it solves, pain point it addresses)
- **KEY TAKEAWAY**: The single most important insight readers should remember
- Keep total to 3-4 sentences, written for human understanding

**Problem Context** ({{problem_context}}):

- What problem or challenge is this article addressing?
- What was the motivation for this solution/approach?
- What makes this problem worth solving?
- Include real-world scenarios or use cases if mentioned
- If article doesn't explicitly discuss a problem, analyze the implicit problem being solved

**Core Concepts** ({{core_concepts}}):
For each concept (3-5 total), structure as:

- **Concept Name**: Brief definition
- **Why it matters**: Explain the reasoning behind this concept
- **How it works**: High-level mechanism (not implementation details)
- **Connection**: How it relates to other concepts in the article

**Key Points with Rationale** ({{key_points}}):
For each point (5-8 total), include:

- **The Point**: What is being stated
- **Why**: The reasoning or motivation behind it
- **Practical Impact**: How this affects real-world usage
- **Example**: Brief concrete example if available

Format: "**Point**: [statement] | **Why**: [reasoning] | **Impact**: [practical effect]"

**Technical Details** ({{technical_details}}):
Organize technical content by topic/feature, embedding code examples inline where they're relevant:

For each technical topic:

1. **Concept/Feature name**: Brief introduction
2. **Why it matters**: Motivation and use cases
3. **How to use it**: Explanation with inline code examples
4. **Code example format** (when needed):
   - Brief context: "Here's how to [do X]:"
   - Code block (preserve exactly, no translation, with language identifier)
   - Key points: Explain important parts below the code
   - Usage note: "Use this when [scenario] because [reason]"
5. **Variations/Options**: Different approaches with their tradeoffs
6. **Common pitfalls**: What to avoid

**Structure example**:

````
### useState Hook

useState 讓函數元件管理內部狀態。當你需要記住使用者輸入、切換狀態、或追蹤任何會改變的值時使用。

**基本用法**:

\```javascript
const [count, setCount] = useState(0);
\```

- `count`: 目前的狀態值
- `setCount`: 更新函數,呼叫它會觸發重新渲染
- `0`: 初始值

**複雜狀態範例** - 當狀態是物件時:

\```javascript
const [user, setUser] = useState({ name: '', age: 0 });

// 更新時要展開舊狀態,因為 setState 會替換而非合併
setUser(prev => ({ ...prev, name: 'John' }));
\```

使用函數形式 `prev => ...` 當新狀態依賴舊狀態時,確保拿到最新值。

**何時使用**: 簡單的狀態邏輯。如果狀態更新邏輯複雜或有多個相關值,考慮使用 useReducer。
````

**Important**:

- Code examples should be contextual, not collected separately
- Embed code where it naturally fits the explanation
- Always explain WHY this code pattern, not just WHAT it does
- Include practical scenarios for when to use each approach

**Best Practices with Reasoning** ({{best_practices}}):
For each practice:

- **Practice**: The recommendation
- **Why it's best**: Reasoning and benefits
- **What happens if ignored**: Consequences of not following it
- **How to implement**: Practical steps
- Format as: "**DO**: [action] because [reason]. **DON'T**: [anti-pattern] as it [consequence]"

**Mental Models** ({{mental_models}}):

- What analogies or metaphors does the author use?
- What conceptual frameworks are presented?
- How should readers think about this topic?
- What common misconceptions are corrected?

**Further Reading** ({{further_reading}}):

- Referenced links with brief context (why each is relevant)
- Official documentation links
- Related concepts to explore
- Leave empty if none mentioned
  </action>

<action>For each section:

- Prioritize clarity and human understanding over technical completeness
- Always explain WHY before diving into HOW
- Connect concepts to practical use cases
- Use natural language, not just bullet points
- Skip sections that don't apply (e.g., if no code examples, leave empty)
  </action>

Note: Code examples are embedded within {{technical_details}} and other relevant sections, not as a separate output.
</step>

<step n="4" goal="Translate condensed content to target language">
<critical>PERFORMANCE OPTIMIZATION: Only translate the CONDENSED, EXTRACTED content from Step 3, NOT the original article. This significantly reduces translation time and token usage.</critical>

<check if="target language same as article language">
  <action>Skip translation - content is already in target language {translation_language}</action>
  <action>Proceed directly to Step 5</action>
</check>

<action>Translate ONLY the extracted and condensed content sections to {translation_language}:

- Executive summary
- Problem context
- Core concepts
- Key points
- Mental models
- Technical details (translate explanations, NOT code)
- Best practices
- Further reading

Translation guidelines:

- Maintain technical accuracy for domain-specific terms
- Keep code snippets in original language (DO NOT translate code or comments in code)
- Preserve markdown formatting and code blocks
- Keep technical terms in English if no good {translation_language} equivalent exists
- Use professional, clear language matching the Curator persona
- Ensure code examples remain embedded in their contextual sections
  </action>

<action>Update all template variables with translated content</action>
</step>

<step n="5" goal="Generate tags and metadata">
<action>Analyze the article content and generate relevant tags:

Identify 3-8 tags covering:

- Primary technology/framework (e.g., "React", "TypeScript", "Docker")
- Topic category (e.g., "Architecture", "Testing", "Performance")
- Specific concepts (e.g., "Hooks", "Async", "Caching")
- Skill level if apparent (e.g., "Advanced", "Beginner-Friendly")

Format as YAML array: ["tag1", "tag2", "tag3"]
Store as {{tags}}
</action>

<action>Set {{digest_date}} to current date in YYYY-MM-DD format</action>
<action>Set {{translation_language}} from config</action>
</step>

<step n="6" goal="Apply template and save knowledge note">
<action>Apply the technical-article.md template with all collected variables:
- {{article_title}}
- {{source_url}}
- {{digest_date}}
- {{translation_language}}
- {{tags}}
- {{outline}}
- {{executive_summary}}
- {{problem_context}} (problem/motivation context)
- {{core_concepts}}
- {{key_points}}
- {{mental_models}} (conceptual frameworks and analogies)
- {{technical_details}} (includes embedded code examples)
- {{best_practices}}
- {{further_reading}}
- {{personal_notes}} (leave as empty placeholder for user to fill later)

Note: Code examples are embedded within {{technical_details}} section contextually, not as a separate variable.
</action>

<action>Implement source reference system per module brief Decision 5:

- For sections with clear headings in original article: Include heading title and paragraph link
- Format: "**原文標題**: [Section Title]" followed by link if anchor available
- If article lacks anchor points: Record original section titles only
- Add reference note at top: "📎 [查看完整原文]({{source_url}})"
  </action>

<action>Save the generated knowledge note to: {knowledge_base_path}/{{article_title_slug}}.md</action>

<action>Create knowledge base directory if it doesn't exist</action>

<check if="save fails">
  <action>Report error: "❌ 無法儲存檔案,請檢查路徑權限"</action>
  <action>Display the generated content for manual saving</action>
</check>
</step>

<step n="7" goal="Report completion with quality summary">
<action>Record workflow end time as {{workflow_end_time}}</action>
<action>Calculate total execution time in seconds: {{workflow_duration}}</action>

<action>Display completion report in concise, professional format matching Curator persona:

✅ 知識筆記已生成

**📄 筆記位置**: {{final_output_path}}
**🏷️ 標籤**: {{tags}}
**📊 內容結構**:

- 問題脈絡與動機
- 核心概念 (WHY + HOW)
- 關鍵洞察與實際影響
- 心智模型與類比
- 技術細節與最佳實踐 (含內嵌程式碼範例)

**💡 關鍵要點**: {{executive_summary}}

**⏱️ 執行時間**: {{workflow_duration}} 秒

Follow Curator's communication style: concise, result-oriented, no unnecessary elaboration
</action>
</step>

</workflow>
