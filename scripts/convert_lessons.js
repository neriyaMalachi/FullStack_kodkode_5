// Generic lesson builder: docx -> a full self-learning page per topic
// (explanation+examples -> exercises -> summarizing project -> next-chapter
// teaser), plus a separate instructor lesson-plan page. Works across any
// category. Replaces the earlier convert_sample_topics.js / convert_js_intro.js
// one-offs so every topic on the site follows the same page shape.
const fs = require('fs');
const path = require('path');
const { extractDocxAsHugoMarkdown } = require('./docx_to_hugo_md.js');

const OUTPUT_ROOT = 'C:\\Users\\Neriya Malachi\\Desktop\\Agents\\agent_for_presentions\\output';
const CONTENT_ROOT = path.join(__dirname, '..', 'content', 'docs');

// `nextPeek` = {dir, base} of the next topic when it isn't itself part of
// this batch (used only to pull a title + teaser sentence for continuity).
// `title` is set explicitly (English-only, professional term) rather than
// parsed from the docx's own "English — Hebrew" heading — the nav/sidebar
// and breadcrumb should show the term a developer would recognize, not a
// bilingual duplicate.
// `codeExamples`: short illustrative snippets the docx content never had
// (content.docx is prose-only by template) — inserted right after the named
// section's opening paragraph so every explained concept has a tiny runnable
// example next to it, not just in the exercises at the bottom.
const topics = [
  { category: 'git', num: 15, slug: 'git-basics', dir: '02_git/15_git_basic', base: 'git', title: 'Git Basics',
    nextPeek: { dir: '02_git/16_git_github', base: 'github' },
    codeExamples: [
      { after: 'מה זה?', lang: 'bash', code: 'git init\ngit add index.js\ngit commit -m "first commit"\ngit log --oneline' },
      { after: 'הסבר עיקרי', lang: 'bash', code: '# Working Directory -> Staging -> Repository\ngit status        # מה שונה עכשיו\ngit diff          # מה בדיוק השתנה\ngit add .         # -> Staging Area\ngit commit -m "…" # -> Repository (.git/)' },
    ] },

  { category: 'javascript', num: 1, slug: 'js-basics', dir: '01_js/01_js_basic', base: 'javascript_foundations', title: 'JavaScript Basics',
    codeExamples: [
      { after: 'מה זה?', lang: 'javascript', code: 'console.log("Hello, World!"); // רץ גם בדפדפן וגם ב-Node.js\n\nlet x = 5;\nx = "עכשיו זה מחרוזת"; // JS דינמי — אין בדיקת טיפוסים בזמן קומפילציה' },
    ] },
  { category: 'javascript', num: 2, slug: 'js-variables', dir: '01_js/02_js_variables', base: 'variables', title: 'Variables',
    codeExamples: [
      { after: 'מה זה?', lang: 'javascript', code: 'let name = "Dana";\nname = "Avi";        // let — ניתן לשנות\n\nconst age = 30;\nage = 31;            // TypeError: Assignment to constant variable' },
      { after: 'הסבר עיקרי', lang: 'javascript', code: 'if (true) {\n  let inner = "רק כאן בפנים";\n}\nconsole.log(inner); // ReferenceError — inner לא קיים מחוץ ל-block' },
    ] },
  { category: 'javascript', num: 3, slug: 'js-conditions-loops', dir: '01_js/03_js_conditions_loops', base: 'conditions_loops', title: 'Conditions & Loops',
    codeExamples: [
      { after: 'מה זה?', lang: 'javascript', code: 'const age = 20;\nif (age >= 18) {\n  console.log("בגיר");\n} else {\n  console.log("קטין");\n}' },
      { after: 'הסבר עיקרי', lang: 'javascript', code: 'for (let i = 0; i < 3; i++) {\n  console.log(i); // 0, 1, 2\n}' },
    ] },
  { category: 'javascript', num: 4, slug: 'js-functions', dir: '01_js/04_js_functions', base: 'functions', title: 'Functions',
    codeExamples: [
      { after: 'מה זה?', lang: 'javascript', code: 'function add(a, b) {\n  return a + b;\n}\nadd(2, 3); // 5' },
      { after: 'הסבר עיקרי', lang: 'javascript', code: 'sayHi(); // "Hi!" — עובד, declaration מורם (hoisted)\nfunction sayHi() { return "Hi!"; }\n\nsayBye(); // TypeError — expression לא מורם\nconst sayBye = () => "Bye!";' },
    ] },
  { category: 'javascript', num: 5, slug: 'js-string-methods', dir: '01_js/05_js_string_methods', base: 'string_methods', title: 'String Methods',
    codeExamples: [
      { after: 'מה זה?', lang: 'javascript', code: '"Hello".toUpperCase();   // "HELLO"\n"  trim me  ".trim();    // "trim me"\n"a,b,c".split(",");      // ["a", "b", "c"]' },
    ] },
  { category: 'javascript', num: 6, slug: 'js-arrays', dir: '01_js/06_js_arrays', base: 'arrays', title: 'Arrays',
    codeExamples: [
      { after: 'מה זה?', lang: 'javascript', code: 'const fruits = ["apple", "banana"];\nfruits.push("cherry");\nfruits[0];      // "apple"\nfruits.length;  // 3' },
      { after: 'הסבר עיקרי', lang: 'javascript', code: 'const nums = [1, 2, 3];\nnums[10];           // undefined — אין שגיאה\nnums.splice(1, 1);  // מוציא איבר באינדקס 1 -> [1, 3]' },
    ] },
  { category: 'javascript', num: 7, slug: 'js-objects', dir: '01_js/07_js_objects', base: 'objects', title: 'Objects',
    codeExamples: [
      { after: 'מה זה?', lang: 'javascript', code: 'const user = { name: "Dana", age: 28, email: "dana@mail.com" };\nuser.name;      // "Dana" — dot notation\nuser["email"];  // "dana@mail.com" — bracket notation' },
      { after: 'הסבר עיקרי', lang: 'javascript', code: 'const key = "age";\nuser.key;   // undefined — dot לא תומכת במשתנה\nuser[key];  // 28   — bracket כן\n\nconst circle = {\n  radius: 5,\n  area() { return Math.PI * this.radius ** 2; },\n};\ncircle.area(); // 78.53...' },
    ] },
  { category: 'javascript', num: 8, slug: 'js-array-methods', dir: '01_js/08_js_array_methods', base: 'array_methods', title: 'Array Methods',
    codeExamples: [
      { after: 'מה זה?', lang: 'javascript', code: 'const nums = [1, 2, 3, 4];\nnums.map(n => n * 2);          // [2, 4, 6, 8]\nnums.filter(n => n % 2 === 0); // [2, 4]\nnums.reduce((sum, n) => sum + n, 0); // 10' },
      { after: 'הסבר עיקרי', lang: 'javascript', code: 'const users = [{ name: "Dana", age: 17 }, { name: "Avi", age: 20 }];\nusers.find(u => u.age >= 18);   // { name: "Avi", age: 20 } — איבר אחד\nusers.filter(u => u.age >= 18); // [{ name: "Avi", age: 20 }] — מערך\n\nusers.filter(u => u.age >= 18).map(u => u.name); // ["Avi"] — שרשור' },
    ] },
  { category: 'javascript', num: 9, slug: 'js-object-methods', dir: '01_js/09_js_object_methods', base: 'object_methods', title: 'Object Methods',
    codeExamples: [
      { after: 'מה זה?', lang: 'javascript', code: 'const user = { name: "Dana", age: 28 };\nObject.keys(user);    // ["name", "age"]\nObject.values(user);  // ["Dana", 28]\nObject.entries(user); // [["name","Dana"], ["age",28]]' },
      { after: 'הסבר עיקרי', lang: 'javascript', code: 'const merged = { ...user, age: 29 }; // spread — לא נוגע ב-user\nObject.assign(user, { age: 30 });    // assign — משנה את user עצמו!\n\nconst config = Object.freeze({ MAX: 100 });\nconfig.MAX = 999; // נכשל בשקט — עדיין 100' },
    ] },
  { category: 'javascript', num: 10, slug: 'js-closures', dir: '01_js/10_js_closures', base: 'closures', title: 'Closures',
    codeExamples: [
      { after: 'מה זה?', lang: 'javascript', code: 'function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst counter = makeCounter();\ncounter(); // 1\ncounter(); // 2 — זוכר את count בין קריאות' },
      { after: 'הסבר עיקרי', lang: 'javascript', code: 'for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}\n// מדפיס 3, 3, 3 — var משותף לכולם\n\nfor (let j = 0; j < 3; j++) {\n  setTimeout(() => console.log(j), 0);\n}\n// מדפיס 0, 1, 2 — let יוצר binding נפרד לכל איטרציה' },
    ] },
  { category: 'javascript', num: 11, slug: 'js-factories', dir: '01_js/11_js_factories', base: 'factories', title: 'Factory Functions',
    codeExamples: [
      { after: 'מה זה?', lang: 'javascript', code: 'function makeUser(name, age) {\n  return {\n    name, age,\n    greet() { return `Hi, I\'m ${name}`; },\n  };\n}\nconst u1 = makeUser("Dana", 28);\nconst u2 = makeUser("Avi", 35); // עצמאי לגמרי מ-u1' },
      { after: 'הסבר עיקרי', lang: 'javascript', code: 'function makeCounter(start = 0) {\n  let count = start; // private — לא נגיש מבחוץ\n  return { inc: () => ++count, value: () => count };\n}\nconst c = makeCounter();\nc.count;   // undefined — לא נגיש ישירות\nc.value(); // 0' },
    ] },
  { category: 'javascript', num: 12, slug: 'js-modules', dir: '01_js/12_js_modules', base: 'modules', title: 'Modules (ESM)',
    codeExamples: [
      { after: 'מה זה?', lang: 'javascript', code: '// math.js\nexport const add = (a, b) => a + b;\nexport default function multiply(a, b) { return a * b; }\n\n// main.js\nimport multiply, { add } from "./math.js";' },
    ] },
  { category: 'javascript', num: 13, slug: 'js-clean-code', dir: '01_js/13_js_clean_code', base: 'clean_code', title: 'Clean Code',
    codeExamples: [
      { after: 'מה זה?', lang: 'javascript', code: '// לפני\nfunction fn2(x) { if (x) { if (x.active) { return x.name; } } }\n\n// אחרי — Guard Clauses + שם ברור\nfunction getActiveUserName(user) {\n  if (!user) return null;\n  if (!user.active) return null;\n  return user.name;\n}' },
      { after: 'הסבר עיקרי', lang: 'javascript', code: 'if (age > 18) { /* ... */ }         // מספר קסום — למה 18?\n\nconst ADULT_AGE = 18;\nif (age > ADULT_AGE) { /* ... */ }  // ברור למה' },
    ] },
  { category: 'javascript', num: 14, slug: 'js-debugging', dir: '01_js/14_js_debugging', base: 'debugging', title: 'Debugging',
    codeExamples: [
      { after: 'מה זה?', lang: 'javascript', code: 'console.table([\n  { name: "Dana", age: 28 },\n  { name: "Avi", age: 35 },\n]);\n// מציג טבלה קריאה במקום JSON מקונן' },
      { after: 'הסבר עיקרי', lang: 'javascript', code: 'function calcTotal(price) {\n  debugger; // עוצר כאן ב-DevTools אם הן פתוחות\n  return price * 1.17;\n}' },
    ] },
  { category: 'javascript', num: 18, slug: 'js-async', dir: '01_js/18_js_async', base: 'async_javascript', title: 'Async JavaScript',
    codeExamples: [
      { after: 'מה זה?', lang: 'javascript', code: 'console.log("A");\nsetTimeout(() => console.log("B"), 0);\nconsole.log("C");\n// מדפיס: A, C, B — setTimeout רץ רק אחרי שהקוד הסינכרוני נגמר' },
    ] },
  { category: 'javascript', num: 19, slug: 'js-event-loop', dir: '01_js/19_js_event_loop', base: 'event_loop', title: 'Event Loop',
    codeExamples: [
      { after: 'מה זה?', lang: 'javascript', code: 'console.log("1");\nsetTimeout(() => console.log("2 (macrotask)"), 0);\nPromise.resolve().then(() => console.log("3 (microtask)"));\nconsole.log("4");\n// סדר בפועל: 1, 4, 3, 2 — microtasks תמיד לפני macrotasks' },
    ] },
  { category: 'javascript', num: 20, slug: 'js-callbacks', dir: '01_js/20_js_callbacks', base: 'callbacks', title: 'Callbacks',
    codeExamples: [
      { after: 'מה זה?', lang: 'javascript', code: 'function fetchUser(id, callback) {\n  setTimeout(() => callback(null, { id, name: "Dana" }), 500);\n}\nfetchUser(1, (err, user) => {\n  if (err) return console.error(err);\n  console.log(user);\n});' },
    ] },
  { category: 'javascript', num: 21, slug: 'js-promises', dir: '01_js/21_js_promises', base: 'promises', title: 'Promises',
    codeExamples: [
      { after: 'מה זה?', lang: 'javascript', code: 'function getUserById(id) {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => resolve({ id, name: "Dana" }), 500);\n  });\n}\n\ngetUserById(1)\n  .then(user => console.log(user))\n  .catch(err => console.error(err))\n  .finally(() => console.log("done"));' },
      { after: 'הסבר עיקרי', lang: 'javascript', code: 'Promise.all([getUserById(1), getUserById(2)]);        // נכשל מיד אם אחת נכשלת\nPromise.allSettled([getUserById(1), getUserById(2)]); // מחכה לכולן, תמיד' },
    ] },
  { category: 'javascript', num: 22, slug: 'js-fetch-api', dir: '01_js/22_js_fetch_api', base: 'fetch_api', title: 'Fetch API',
    codeExamples: [
      { after: 'מה זה?', lang: 'javascript', code: 'const res = await fetch("/api/users");\nif (!res.ok) throw new Error(`HTTP ${res.status}`); // fetch לא נכשלת על 404!\nconst users = await res.json();' },
      { after: 'הסבר עיקרי', lang: 'javascript', code: 'await fetch("/api/users", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ name: "Dana" }),\n});' },
    ] },
  { category: 'javascript', num: 23, slug: 'js-async-await', dir: '01_js/23_js_async_await', base: 'async_await', title: 'Async / Await',
    nextPeek: { dir: '02_git/16_git_github', base: 'github' },
    codeExamples: [
      { after: 'מה זה?', lang: 'javascript', code: 'async function getUser(id) {\n  const res = await fetch(`/api/users/${id}`);\n  return res.json();\n}' },
      { after: 'הסבר עיקרי', lang: 'javascript', code: '// סדרתי — איטי מיותר כששתי הבקשות עצמאיות\nconst a = await fetchA();\nconst b = await fetchB();\n\n// מקבילי — מהיר יותר\nconst [a2, b2] = await Promise.all([fetchA(), fetchB()]);' },
    ] },

  { category: 'databases', num: 48, slug: 'mongodb-mongoose', dir: '04_DB/48_mongodb_mongoose', base: 'mongoose', title: 'Mongoose (ODM)',
    nextPeek: { dir: '04_DB/49_mongodb_atlas', base: 'mongodb_atlas' },
    codeExamples: [
      { after: 'מה זה?', lang: 'javascript', code: 'const userSchema = new mongoose.Schema({ name: String, age: Number });\nconst User = mongoose.model("User", userSchema);\n\nconst u = await User.create({ name: "Dana", age: 28 });' },
    ] },
];

function firstNonHeadingText(markdown, maxLen) {
  for (const raw of markdown.split('\n')) {
    const t = raw.trim();
    if (!t || t.startsWith('#') || t.startsWith('```') || t.startsWith('|')) continue;
    if (/^\*{0,2}(דף תוכן|מערך שיעור)/.test(t)) continue; // boilerplate subtitle, not real content
    return t.replace(/\*\*/g, '').slice(0, maxLen);
  }
  return '';
}

function escapeYaml(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

// Inserts a fenced code snippet right after the opening paragraph of the
// named "## <headingText>" section (i.e. right where a reader would want a
// tiny example of what was just explained).
function insertCodeExample(markdown, headingText, lang, code) {
  const lines = markdown.split('\n');
  const headingIdx = lines.findIndex(l => l.trim() === `## ${headingText}`);
  if (headingIdx === -1) {
    console.warn('  (code example skipped — heading not found:', headingText, ')');
    return markdown;
  }
  let insertAt = headingIdx + 1;
  while (insertAt < lines.length && lines[insertAt].trim() === '') insertAt++; // skip blank line after heading
  while (insertAt < lines.length && lines[insertAt].trim() !== '') insertAt++; // walk to end of first paragraph
  const snippet = '```' + lang + '\n' + code + '\n```';
  return [...lines.slice(0, insertAt), '', snippet, ...lines.slice(insertAt)].join('\n');
}

function stripLeadingTitle(md) {
  const lines = md.split('\n');
  if (lines[0] && lines[0].startsWith('# ')) {
    lines.shift();
    while (lines.length && lines[0].trim() === '') lines.shift();
  }
  return lines.join('\n');
}

// The theme already renders <h1>{{.Title}}</h1> above the content, and right
// after the docx's own "# Title" comes a boilerplate bold subtitle line
// ("**דף תוכן – X**" / "**מערך שיעור: X**") — both are now redundant on the
// page and just look like a stutter, so strip title + that one extra line.
function stripHeaderBoilerplate(md) {
  const withoutTitle = stripLeadingTitle(md);
  const lines = withoutTitle.split('\n');
  if (lines[0] && /^\*{0,2}(דף תוכן|מערך שיעור)/.test(lines[0].trim())) {
    lines.shift();
    while (lines.length && lines[0].trim() === '') lines.shift();
  }
  return lines.join('\n');
}

function demoteHeadings(md, levels) {
  return md
    .split('\n')
    .map(line => {
      const m = line.match(/^(#{1,4})\s/);
      if (!m) return line;
      return '#'.repeat(m[1].length + levels) + line.slice(m[1].length);
    })
    .join('\n');
}

const docxCache = new Map();
async function loadDocx(dir, base, kind) {
  const key = `${dir}|${base}|${kind}`;
  if (docxCache.has(key)) return docxCache.get(key);
  const p = path.join(OUTPUT_ROOT, dir, `${base}_${kind}.docx`);
  const result = fs.existsSync(p) ? await extractDocxAsHugoMarkdown(p) : null;
  docxCache.set(key, result);
  return result;
}

async function titleAndTeaser(dir, base) {
  const doc = await loadDocx(dir, base, 'content');
  if (!doc) return null;
  return {
    title: (doc.headings[0] && doc.headings[0].text) || base,
    teaser: firstNonHeadingText(doc.markdown, 220),
  };
}

async function buildLesson(topic, nextInfo) {
  const contentDoc = await loadDocx(topic.dir, topic.base, 'content');
  const exerciseDoc = await loadDocx(topic.dir, topic.base, 'exercise');
  const projectDoc = await loadDocx(topic.dir, topic.base, 'project');
  if (!contentDoc) { console.log('SKIP (no content doc):', topic.slug); return; }

  const title = topic.title || (contentDoc.headings[0] && contentDoc.headings[0].text) || topic.slug;
  const description = firstNonHeadingText(contentDoc.markdown, 150) || title;

  let mainContent = stripHeaderBoilerplate(contentDoc.markdown);
  for (const ex of topic.codeExamples || []) {
    mainContent = insertCodeExample(mainContent, ex.after, ex.lang, ex.code);
  }
  const sections = [mainContent];
  if (exerciseDoc) {
    sections.push('---\n\n## תרגילים\n\n' + demoteHeadings(stripLeadingTitle(exerciseDoc.markdown), 1));
  }
  if (projectDoc) {
    sections.push('---\n\n## פרויקט מסכם\n\n' + demoteHeadings(stripLeadingTitle(projectDoc.markdown), 1));
  }
  if (nextInfo) {
    sections.push('---\n\n## מה בפרק הבא\n\n' + `בפרק הבא נלמד על **${nextInfo.title}** — ${nextInfo.teaser}`);
  }

  const weight = topic.num * 10 + 1;
  const frontmatter = `---
title: "${escapeYaml(title)}"
slug: "${topic.num}-${topic.slug}-content"
description: "${escapeYaml(description)}"
summary: "📖 שיעור"
date: 2026-08-06T00:00:00+02:00
lastmod: 2026-08-06T00:00:00+02:00
draft: false
weight: ${weight}
toc: true
sidebar:
  collapsed: true
params:
  seo:
    title: ""
    description: ""
    canonical: ""
    robots: ""
---

`;
  const outDir = path.join(CONTENT_ROOT, topic.category);
  fs.mkdirSync(outDir, { recursive: true });
  const fileName = `${topic.num}-${topic.slug}-content.md`;
  fs.writeFileSync(path.join(outDir, fileName), frontmatter + sections.join('\n\n') + '\n', 'utf8');
  console.log('wrote', path.join(topic.category, fileName));
}

async function buildInstructor(topic) {
  const doc = await loadDocx(topic.dir, topic.base, 'instructor');
  if (!doc) { console.log('SKIP (no instructor doc):', topic.slug); return; }
  const title = (doc.headings[0] && doc.headings[0].text) || topic.slug;
  const description = firstNonHeadingText(doc.markdown, 150) || title;
  const weight = topic.num * 10;
  const frontmatter = `---
title: "${escapeYaml(title)}"
slug: "${topic.num}-${topic.slug}-instructor"
description: "${escapeYaml(description)}"
summary: "📋 מערך מרצה"
date: 2026-08-06T00:00:00+02:00
lastmod: 2026-08-06T00:00:00+02:00
draft: false
weight: ${weight}
toc: true
sidebar:
  collapsed: true
params:
  seo:
    title: ""
    description: ""
    canonical: ""
    robots: ""
---

`;
  const outDir = path.join(CONTENT_ROOT, topic.category);
  fs.mkdirSync(outDir, { recursive: true });
  const fileName = `${topic.num}-${topic.slug}-instructor.md`;
  fs.writeFileSync(path.join(outDir, fileName), frontmatter + stripLeadingTitle(doc.markdown) + '\n', 'utf8');
  console.log('wrote', path.join(topic.category, fileName));
}

(async () => {
  // Group by category, sorted by num, so "next lesson" defaults to the next
  // item in the same category unless nextPeek overrides it.
  const byCategory = new Map();
  for (const t of topics) {
    if (!byCategory.has(t.category)) byCategory.set(t.category, []);
    byCategory.get(t.category).push(t);
  }
  for (const list of byCategory.values()) list.sort((a, b) => a.num - b.num);

  for (const t of topics) {
    const group = byCategory.get(t.category);
    const idx = group.indexOf(t);
    let nextInfo = null;
    if (idx < group.length - 1) {
      const nextTopic = group[idx + 1];
      nextInfo = await titleAndTeaser(nextTopic.dir, nextTopic.base);
      if (nextTopic.title) nextInfo.title = nextTopic.title;
    } else if (t.nextPeek) {
      nextInfo = await titleAndTeaser(t.nextPeek.dir, t.nextPeek.base);
    }
    await buildLesson(t, nextInfo);
    await buildInstructor(t);
  }
})();
