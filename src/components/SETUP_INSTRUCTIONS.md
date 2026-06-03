# SDF Clothing — Learning Hub Setup Instructions

## তোমার Astro project-এ কোন ফাইল কোথায় রাখবে

```
your-astro-project/
├── src/
│   ├── pages/
│   │   └── insights/
│   │       └── index.astro          ← REPLACE করো (এটা নতুন Learning Hub page)
│   ├── components/
│   │   ├── FobCalculator.astro      ← NEW (FOB Price Calculator)
│   │   ├── AqlTool.astro            ← NEW (AQL Sample Size Calculator)
│   │   ├── LeadTimeEstimator.astro  ← NEW (Lead Time Estimator)
│   │   └── Glossary.astro           ← NEW (Industry Glossary)
│   └── data/
│       └── learning-hub.ts          ← NEW (all content data)
```

---

## Step-by-step নির্দেশ

### Step 1 — `src/data/` folder তৈরি করো
তোমার project-এ যদি `src/data/` folder না থাকে, তাহলে তৈরি করো।

### Step 2 — data file রাখো
`learning-hub.ts` → `src/data/learning-hub.ts`

### Step 3 — Components রাখো
নিচের ৪টি ফাইল → `src/components/` folder-এ রাখো:
- `FobCalculator.astro`
- `AqlTool.astro`
- `LeadTimeEstimator.astro`
- `Glossary.astro`

### Step 4 — Main page replace করো
`index.astro` → `src/pages/insights/index.astro`
(পুরনো insights/index.astro টা backup রাখতে পারো)

### Step 5 — Downloads folder তৈরি করো (optional)
`public/downloads/` folder তৈরি করো এবং এই ৪টি ফাইল রাখো:
- `factory-audit-checklist.pdf`
- `rfq-template.docx`
- `eu-compliance-timeline.pdf`
- `vendor-scorecard.xlsx`

যদি এখন না থাকে, Download card গুলো দেখাবে কিন্তু click করলে 404 হবে।
সাময়িকভাবে `href="#"` করে রাখতে পারো।

---

## কী কী নতুন feature আছে

| Feature | Description |
|---|---|
| **FOB Calculator** | Garment type, fabric cost, SAM, quantity দিলে FOB price breakdown দেয় |
| **AQL Calculator** | Lot size + AQL levels দিলে sample size ও Ac/Re numbers দেয় |
| **Lead Time Estimator** | Product type, destination, shipping mode দিলে T&A breakdown দেয় |
| **Industry Glossary** | 20টি searchable + filterable industry terms |
| **Learning Paths** | 3টি curated reading sequence |
| **Article Filter** | Sector filter + live search সব articles-এ |
| **Downloadable Resources** | 4টি template/checklist card |
| **Newsletter signup** | Email capture (Web3Forms বা তোমার endpoint দিয়ে replace করো) |
| **Sector pills** | Hero-এর sector pills click করলে article list filter হয় |

---

## Newsletter endpoint বদলানো

`index.astro` ফাইলের এই অংশটা খোঁজো:
```js
// Replace this with your actual form endpoint (Web3Forms, Mailchimp, etc.)
this.innerHTML = '<p ...>✓ Subscribed...</p>';
```
এখানে তোমার Web3Forms বা Mailchimp API call যোগ করো।

---

## TypeScript issue হলে

`learning-hub.ts` file টা `.js` করে দিতে পারো এবং import এ `.ts` → `.js` করো।

---

## Notes

- সব design তোমার existing `global.css` এর সাথে ১০০% consistent।
- Black `#000`, Red `#e00`, White `#fff` — কোনো নতুন color নেই।
- সব tools pure HTML/CSS/JS — কোনো extra npm package লাগবে না।
- Mobile responsive সব কিছু।
- Accessibility: ARIA labels, live regions, min-height 44px buttons সব আছে।
