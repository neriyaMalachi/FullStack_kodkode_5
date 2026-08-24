---
title: "Notes App Project"
slug: "87-dom-notes-app-project-content"
description: "פרויקט מסכם שני: אפליקציית פתקים עם עריכה ישירה בעמוד — מרחיב את דפוס ה-State מהפרויקט הקודם."
summary: "📖 שיעור"
date: 2026-08-09T00:00:00+02:00
lastmod: 2026-08-09T00:00:00+02:00
draft: false
weight: 871
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

## מה זה?

בפרויקט הקודם (Todo App) בנינו CRUD בסיסי עם State יחיד. **Notes App** מרחיב את זה: פתקים שאפשר **לערוך ישירות** (לא רק להוסיף/למחוק), עם עדכון State בזמן אמת תוך כדי הקלדה — תרגול נוסף לאותו דפוס State→Render, בתרחיש שדורש עדכון תכוף יותר.

## מילות מפתח שחשוב לזכור

• Two-way sync (סנכרון דו-כיווני) — כאן, שינוי בשדה עריכה (`input`) חייב לעדכן את ה-state **מיד**, לא רק ב-`submit` — כי אין "שליחה" מפורשת בעריכת פתק חי

• `input` event — (בניגוד ל-`change`, שמופעל רק כשעוזבים את השדה) מופעל **בכל הקלדה בודדת** — קריטי לעדכון state תוך כדי כתיבה

• Debounce (אופציונלי, למתקדמים) — טכניקה לעכב שמירה תכופה מדי (למשל, לא לשמור ל-localStorage על **כל** תו, אלא רק אחרי הפסקה קצרה בהקלדה)

```javascript
function renderNote(note) {
  const textarea = document.createElement("textarea");
  textarea.value = note.content;

  textarea.addEventListener("input", (event) => {
    note.content = event.target.value; // updates state immediately, on every keystroke
    saveNotes();
  });

  return textarea;
}
```

## הדגמה חיה

<div class="demo-live" style="direction:rtl;border:1px solid #d1d5db;border-radius:10px;padding:1.25rem;margin:1.25rem 0;background:#fafafa;color:#111827;">
<p style="font-weight:600;margin:0 0 0.9rem;color:#6b7280;font-size:0.85rem;">🔴 הדגמה חיה — הקלידו בפתק וצפו בסטטוס מתעדכן על כל תו (input), לא רק כשעוזבים את השדה</p>
<button onclick="const wrap=document.createElement('div'); wrap.style.cssText='margin-bottom:0.6rem;'; const ta=document.createElement('textarea'); ta.placeholder='כתבו פתק חדש כאן...'; ta.style.cssText='width:100%;box-sizing:border-box;min-height:60px;padding:0.5rem;border:1px solid #d1d5db;border-radius:6px;font-family:inherit;'; const status=document.createElement('div'); status.textContent='טרם נכתב דבר'; status.style.cssText='font-size:0.8rem;color:#16a34a;margin-top:0.2rem;'; ta.oninput=function(){ status.textContent='נשמר אוטומטית · ' + ta.value.length + ' תווים'; }; wrap.appendChild(ta); wrap.appendChild(status); document.getElementById('demo-notes-list').appendChild(wrap);" style="background:#2563eb;color:#fff;border:none;border-radius:6px;padding:0.5rem 1rem;font-weight:700;cursor:pointer;margin-bottom:0.75rem;">הוסף פתק חדש</button>
<div id="demo-notes-list">
<div style="margin-bottom:0.6rem;">
<textarea placeholder="כתבו פתק כאן..." style="width:100%;box-sizing:border-box;min-height:60px;padding:0.5rem;border:1px solid #d1d5db;border-radius:6px;font-family:inherit;" oninput="this.nextElementSibling.textContent='נשמר אוטומטית · ' + this.value.length + ' תווים';"></textarea>
<div style="font-size:0.8rem;color:#16a34a;margin-top:0.2rem;">טרם נכתב דבר</div>
</div>
</div>
</div>

## הסבר עיקרי

input event, לא change — `change` (מוכר משיעורי Forms) מופעל רק כששדה **מאבד פוקוס** אחרי שינוי — מתאים לטפסים "רגילים" עם כפתור שליחה. אבל בפתק שנערך "בזמן אמת", רוצים לעדכן את ה-state **בכל הקלדה בודדת** (כל תו) — בדיוק זה מה ש-`input` event נותן, בניגוד ל-`change`.

state מתעדכן ישירות מתוך ה-DOM element — שימו לב להבדל מ-Todo App: שם, ה-state (`tasks`) היה "המקור", וה-DOM רק השתקף ממנו. כאן, בגלל שהעריכה קורית **ישירות בתוך שדה טקסט חי**, `event.target.value` (מה-DOM) הוא זה שמעדכן את `note.content` (ב-state) — כיוון הפוך, אבל עדיין אותו עיקרון: State ו-DOM חייבים תמיד להישאר מסונכרנים, בלי קשר לכיוון העדכון.

saveNotes בכל input — קריאה ל-`saveNotes()` (ששומרת ל-localStorage) **בכל אירוע `input` בודד** אומרת שכל תו שמוקלד נשמר מיד — אין סיכון לאבד תוכן אם המשתמש סוגר את הטאב באמצע כתיבה. (בפרויקטים אמיתיים גדולים, לפעמים "ממתינים" קצת בין שמירות — Debounce — כדי לא לבזבז ביצועים על שמירה בכל תו בודד; זו הרחבה אופציונלית, לא חובה כאן.)

## יתרונות

State ו-DOM מסונכרנים תמיד, גם בעריכה חיה ישירה; `input` event נותן חוויית "שמירה אוטומטית" בלי כפתור שמירה נפרד; מתרגל את אותו דפוס State→Render בתרחיש שונה מ-Todo App, מחזק את ההבנה.

## חסרונות

שמירה ל-localStorage בכל תו בודד (בלי Debounce) יכולה להיות מיותרת לביצועים בפרויקטים גדולים מאוד; בלי `id` ייחודי ברור לכל פתק, קל לבלבל בין פתקים בעדכון ה-state.

## נקודות חשובות

• `input` event מופעל בכל הקלדה בודדת; `change` מופעל רק כששדה מאבד פוקוס אחרי שינוי

• עדכון State יכול לזרום גם **מה-DOM אל ה-state** (כמו כאן), לא רק בכיוון ההפוך — אבל תמיד חייבים סנכרון

• Debounce (מושג מתקדם) מעכב פעולה תכופה (כמו שמירה) עד הפסקה קצרה בפעילות

• כל פתק צריך מזהה ייחודי (`id`) כדי לדעת איזה פתק ב-state לעדכן כשעורכים אותו

## טעויות נפוצות

• שימוש ב-`change` במקום `input` לעריכה חיה — עדכון קורה רק אחרי איבוד פוקוס, לא תוך כדי הקלדה

• עדכון ה-DOM (textarea) בלי לעדכן את ה-state המתאים — ברענון הבא, השינוי האחרון "נעלם"

• חוסר `id` ייחודי לכל פתק — קשה לדעת איזה פתק בדיוק לעדכן/למחוק מתוך ה-state

## סיכום

Notes App מרחיב את דפוס ה-State→Render מ-Todo App לעריכה חיה: `input` event (לא `change`) מעדכן את ה-state בכל הקלדה בודדת, ו-`saveNotes()` שומר ל-localStorage מיד. זה מתרגל את אותו עיקרון מרכזי — State ו-DOM חייבים תמיד סנכרון — בכיוון עדכון הפוך מה-Todo App, ומכין את הקרקע לספריות כמו React בהמשך הקורס.

## דוקומנטציה רשמית

[MDN — HTMLElement: input event](https://developer.mozilla.org/en-US/docs/Web/API/Element/input_event)

---

## תרגילים

### תרגיל 1 — input event בסיסי

**המשימה:** הוסיפו `addEventListener("input", ...)` על `<textarea>`, שמדפיס לקונסול את הערך הנוכחי בכל הקלדה.

**בדיקה:** כל תו שמוקלד (לא רק בעזיבת השדה) מדפיס עדכון חדש בקונסול.

### תרגיל 2 — עדכון state מה-DOM

**המשימה:** צרו אובייקט `note` עם שדה `content` ריק, ועדכנו אותו בכל `input` על textarea מתאים.

**בדיקה:** אחרי הקלדה, הדפסת `note.content` מציגה בדיוק את מה שכתוב ב-textarea באותו רגע.

### תרגיל 3 — id ייחודי לפתקים מרובים

**המשימה:** צרו 2 פתקים עם `id` שונה, וודאו שעריכה בפתק אחד מעדכנת רק את ה-state שלו, לא של הפתק השני.

**בדיקה:** הקלדה בפתק א' לא משנה את `content` של פתק ב' ב-state.

---

## פרויקט מסכם

**המשימה:** בנו אפליקציית "פתקים" (Notes) עם עריכה חיה ושמירה אוטומטית.

**דרישות:**
1. State כמערך `notes` (`{ id, content }`), נטען מ-localStorage בעליית העמוד
2. כפתור "פתק חדש" שיוצר פתק ריק (עם `id` ייחודי) ומוסיף אותו לרשימה
3. כל פתק מוצג כ-`<textarea>` שעורכים ישירות; `input` event מעדכן את ה-state המתאים (לפי `id`) בכל הקלדה
4. כפתור מחיקה לכל פתק, מטופל עם Event Delegation
5. שמירה אוטומטית ל-localStorage בכל שינוי (הוספה, עריכה, מחיקה)

**בדיקה:** רענון מלא של העמוד (F5) שומר את כל הפתקים עם התוכן המדויק שהוקלד; עריכת פתק אחד לא משפיעה על פתקים אחרים; מחיקת פתק עובד גם על פתקים שנוצרו אחרי טעינת העמוד (Event Delegation).
