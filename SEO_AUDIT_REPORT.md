# SEO & AI-Search Audit Report — SDF Clothing (June 2026)

## 1. Executive Summary
**Overall SEO Health Score: 82/100**

SDF Clothing has a strong technical foundation, especially regarding modern AI-search readiness and technical performance. The site whitelists AI agents and uses structured "citation nodes" effectively. However, there is a significant tail of "thin" content pages and a lack of keyword targeting consistency across the 200+ service/location pages.

### Top 5 Issues
1.  **Keyword Dilution:** Many sub-pages fail to include "Clothing Manufacturer" or "Garment Manufacturer" in the Title, H1, or first 100 words, missing easy ranking opportunities.
2.  **Duplicate SEO Metadata:** 23 pages share identical Title/Description tags due to variable-based template reuse (e.g., `src/pages/sustainable-clothing-manufacturers.astro` and others).
3.  **Missing Schema Data:** 21 standard content pages lack JSON-LD structured data, missing a core signal for both Google and AI aggregators.
4.  **Thin Tool Pages:** Some interactive tools (e.g., Lead Time Calculator) lack static explanatory text (FAQs, "How it works"), making them difficult for crawlers to understand without executing JS.
5.  **Schema ID Inconsistency:** A significant number of pages (190+) still use the legacy `#organization` ID instead of the standardized `#org`, potentially fragmenting the Knowledge Graph.

---

## 2. Phase 1: Standard Content Pages (Summary)
Total Pages Audited: 288

| Page | Keyword Presence | Title/Meta OK | H1 OK | Canonical OK | Schema OK | Issues |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| / (index) | ✅ Yes | ✅ OK | ✅ Yes | ✅ Yes | ✅ Yes | None |
| /clothing-manufacturers | ✅ Yes | ✅ OK | ✅ Yes | ✅ Yes | ✅ Yes | None |
| /apparel-manufacturers | ✅ Yes | ✅ OK | ✅ Yes | ✅ Yes | ✅ Yes | Duplicate title with /top-apparel-manufacturers |
| /clothing-manufacturer-usa | ✅ Yes | ✅ OK | ✅ Yes | ✅ Yes | ✅ Yes | None |
| /certifications | ❌ Partial | ❌ Missing | ✅ Yes | ✅ Yes | ✅ Yes | Missing frontmatter title/desc |
| /low-moq-clothing-manufacturers | ✅ Yes | ✅ OK | ✅ Yes | ✅ Yes | ✅ Yes | None |
| /products | ❌ No | ❌ Missing | ✅ Yes | ✅ Yes | ❌ No | Missing Schema & Title |
| /cargo-pants-manufacturer | ✅ Yes | ❌ Missing | ✅ Yes | ✅ Yes | ❌ No | Missing Schema & Title |

*Note: 288 pages were audited. 164 pages lack the primary target keyword "Clothing Manufacturer" in their H1/Title. 23 pages have duplicate titles.*

### Critical Phase 1 Findings:
*   **Missing H1s:** 5 pages (mostly in `journal/` and `insights/Glossary.astro`).
*   **Missing Schema:** 21 pages including `/products`, `/philanthropy`, and several journal entries.
*   **Duplicate Titles:** Found across "Top 50", "Sustainable", and several location-specific pages.

---

## 3. Phase 2: Tools, Calculators, and Converters

| Tool Page | Unique Title/Meta | Static Explainer? | Schema Type | Issues |
| :--- | :--- | :--- | :--- | :--- |
| /tools/garment-cost-calculator | ✅ Yes | ✅ Yes | WebApplication | None |
| /tools/aql-calculator | ✅ Yes | ✅ Yes | WebApplication | None |
| /tools/eu-readiness-checker | ✅ Yes | ✅ Yes | WebApplication | None |
| /tools/lead-time-calculator | ✅ Yes | ❌ No | WebApplication | Lacks "How it works" text |
| /tools/moq-calculator | ✅ Yes | ❌ No | WebApplication | Lacks FAQ/Context |
| /tools/gsm-converter | ✅ Yes | ✅ Yes | WebApplication | None |
| /tools/sample-request | ✅ Yes | ❌ No | None | Missing Schema |
| /insights/AqlTool | ❌ No | ✅ Yes | None | Is a component, needs a dedicated page |

---

## 4. Phase 3: Site-wide Technical SEO
*   **robots.txt:** Perfect. Explicitly whitelists `Google-Extended`, `GPTBot`, and `PerplexityBot`. Includes `Content-Signal: ai-input=yes`.
*   **Sitemap:** Automated via `@astrojs/sitemap`. Correctly prioritized (Home=1.0, Core=0.9).
*   **Core Web Vitals:**
    *   **LCP:** Font preloading (Inter v13) and early CSS injection for hero elements are implemented.
    *   **CLS:** Explicit aspect ratios for hero images and `min-height` on hero sections are present.
    *   **Images:** Using Astro's `sharp` service for WebP/AVIF conversion.
*   **Canonical Tags:** Centralized in `BaseHead.astro`. Strips 'www' and enforces trailing slashes.

---

## 5. Phase 4: AI Search Readiness
*   **Structure:** High usage of bulleted lists and short, punchy paragraphs near the top of pages (ideal for RAG extraction).
*   **Attribution:** "Chowdhury Remon" is correctly attributed as the author on key authority pages.
*   **Citation Nodes:** The site uses `sr-only` nodes for AI-specific data (e.g., B2B factory specs) which is visible to LLM crawlers but not humans.
*   **Robots Policy:** The site is one of the few B2B sites explicitly whitelisting AI-search bots, giving it a first-mover advantage in AI Overviews.

---

## 6. Prioritized Fix List

### Critical (Immediate Action)
*   **Fix Standardized Schema ID:** Update 190+ instances of `"@id": "https://sdfltd.com/#organization"` to `#org` to match `BaseHead`.
*   **Fix Missing H1s:** Add H1s to `journal/` pages and `Glossary.astro`.
*   **Fix Duplicate Titles:** Ensure the 23 pages using `VAR:pageTitle` have unique strings passed to the layout.

### High Priority
*   **Keyword Optimization:** Audit the 164 pages missing "Clothing Manufacturer" and inject the keyword naturally into H1s and Titles.
*   **Tool Supporting Content:** Add "How to Use" and "FAQ" sections to the Lead Time and MOQ calculators.
*   **Missing Schema:** Add `Service` or `Article` schema to the 21 identified pages.

### Medium Priority
*   **Internal Link Audit:** Some tools are "islands" with few links back to relevant service pages (e.g., `hs-code` tool should link to `customs-clearance` guide).
*   **Meta Description Length:** Shorten the 51 descriptions exceeding 160 characters to avoid truncation.

### Low Priority
*   **Image Alt Text Review:** While present, many alts are generic. Optimize for "Garment Factory Dhaka" vs just "Factory".

---

## 7. Concrete Recommendations for Tool Pages
1.  **The "Static First" Rule:** Every tool must have at least 300 words of static text (Explanation + FAQ + Use Case) rendered on the server. This ensures AI systems can cite the tool's *logic* even if they can't *run* it.
2.  **FAQ Schema for Tools:** Every tool should have its own `FAQPage` schema addressing common user questions (e.g., "What is AQL 2.5?").
3.  **Dedicated Tool Routes:** Move tools currently living as components (e.g., `AqlTool.astro` in `insights/`) to their own dedicated URLs in `/tools/` to maximize SEO surface area.
