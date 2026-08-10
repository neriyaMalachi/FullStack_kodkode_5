---
title: "Selecting Elements"
slug: "77-dom-selecting-content"
description: "איך מוצאים אלמנט ספציפי בעץ ה-DOM כדי לעבוד איתו — הצעד הראשון לכל מניפולציה."
summary: "📖 שיעור"
date: 2026-08-09T00:00:00+02:00
lastmod: 2026-08-09T00:00:00+02:00
draft: false
weight: 771
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

בשיעור הקודם הכרנו את `document` כנקודת כניסה. אבל `document.body` נותן רק את כל ה-`<body>` — איך מוצאים **אלמנט ספציפי** בתוכו, למשל כפתור מסוים או רשימת משימות? בדיוק כמו Selectors ב-CSS (שכבר מכירים), JavaScript נותן מתודות לבחירת אלמנטים ספציפיים מתוך ה-DOM — אבל כאן, הבחירה מחזירה **אובייקט** שאפשר לעבוד איתו בקוד, לא רק חוק עיצוב.

## מילות מפתח שחשוב לזכור

• `document.querySelector(selector)` — מחזיר את **האלמנט הראשון** שתואם לסלקטור CSS (בדיוק כמו סלקטורי CSS שכבר מכירים)

• `document.querySelectorAll(selector)` — מחזיר **את כל** האלמנטים התואמים, כ-NodeList

• `document.getElementById(id)` — מחזיר אלמנט לפי `id` בלבד, מהיר יותר אך פחות גמיש

• NodeList — מבנה דמוי-מערך שמחזיר `querySelectorAll`; ניתן ל-`forEach`, אך **לא** כולל את כל מתודות המערך (כמו `map`) ישירות

• `null` — מוחזר מ-`querySelector` אם שום אלמנט לא תואם — קריטי לבדוק לפני שימוש

```javascript
const button = document.querySelector(".submit-btn");
const allCards = document.querySelectorAll(".card");
const header = document.getElementById("main-header");

allCards.forEach(card => console.log(card));
```

## הדגמה חיה

<div class="demo-live" style="direction:rtl;border:1px solid #d1d5db;border-radius:10px;padding:1.25rem;margin:1.25rem 0;background:#fafafa;color:#111827;">
<p style="font-weight:600;margin:0 0 0.9rem;color:#6b7280;font-size:0.85rem;">🔴 הדגמה חיה — לחצו כדי להריץ querySelectorAll('.demo-select-card') בפועל</p>
<div style="display:flex;gap:8px;margin-bottom:0.75rem;">
<div class="demo-select-card" style="background:#fff;border:1px solid #d1d5db;border-radius:6px;padding:0.75rem;flex:1;text-align:center;">כרטיס 1</div>
<div class="demo-select-card" style="background:#fff;border:1px solid #d1d5db;border-radius:6px;padding:0.75rem;flex:1;text-align:center;">כרטיס 2</div>
<div class="demo-select-card" style="background:#fff;border:1px solid #d1d5db;border-radius:6px;padding:0.75rem;flex:1;text-align:center;">כרטיס 3</div>
</div>
<button onclick="document.querySelectorAll('.demo-select-card').forEach(c => { c.style.background='#dbeafe'; c.style.borderColor='#2563eb'; })" style="background:#2563eb;color:#fff;border:none;border-radius:6px;padding:0.5rem 1rem;font-weight:700;cursor:pointer;">הרץ querySelectorAll ← סמן את כל הכרטיסים</button>
</div>

## הסבר עיקרי

querySelector משתמש בדיוק בתחביר CSS — `document.querySelector(".submit-btn")` משתמש **באותו תחביר סלקטורים** שכבר מכירים משיעורי CSS — class, id, combinators, גם pseudo-selectors. זה יתרון עצום: אין תחביר חדש ללמוד — אם יודעים לכתוב סלקטור CSS, יודעים לבחור אלמנט ב-JavaScript.

querySelector מול querySelectorAll — ההבדל קריטי: `querySelector` מחזיר **אלמנט בודד** (הראשון שמתאים) או `null`; `querySelectorAll` מחזיר **את כולם** כ-NodeList, גם אם יש רק אחד, וגם אם אין אף אחד (NodeList ריק, לא `null`). לכן על `querySelector` תמיד כדאי לבדוק `if (element)` לפני שימוש — אחרת, קריאה למתודה על `null` תזרוק שגיאה.

NodeList לא בדיוק מערך — `querySelectorAll` מחזיר NodeList — דמוי-מערך, ניתן ל-`forEach`, אבל **חסר** מתודות מערך כמו `map`/`filter` ישירות (בדפדפנים ישנים יותר; בדפדפנים מודרניים `forEach` כן עובד ישירות עליו). אם צריך `map`/`filter` אמיתיים, צריך להמיר עם `Array.from(nodeList)`.

## יתרונות

תחביר סלקטורים זהה ל-CSS — לא צריך ללמוד שפה חדשה; `querySelector`/`querySelectorAll` גמישים מאוד — כל סלקטור CSS תקין; `getElementById` מהיר במיוחד לחיפוש לפי id.

## חסרונות

`querySelector` מחזיר `null` בלי שגיאה אם לא נמצא — קל לשכוח לבדוק ולקבל `TypeError` מאוחר יותר; NodeList לא זהה למערך אמיתי — יכול להפתיע מי שמצפה למתודות מערך מלאות.

## נקודות חשובות למבחן / ראיון עבודה

• `querySelector` מחזיר אלמנט אחד (או `null`); `querySelectorAll` מחזיר NodeList (גם אם ריק)

• תחביר הסלקטורים ב-`querySelector` זהה לחלוטין לסלקטורי CSS

• `getElementById` מהיר יותר אך מוגבל ל-`id` בלבד

• `Array.from(nodeList)` ממיר NodeList למערך אמיתי עם כל מתודות המערך

## טעויות נפוצות

• שימוש בתוצאה של `querySelector` בלי לבדוק אם היא `null` — קריסה עם `TypeError` אם האלמנט לא נמצא

• ניסיון להשתמש ב-`.map()` ישירות על NodeList (עלול לא לעבוד, תלוי בסביבה) — צריך `Array.from` קודם

• שגיאת typo בסלקטור (למשל שכחת נקודה לפני class) — `querySelector` פשוט מחזיר `null`, בלי הודעת שגיאה מפורשת

## סיכום

`querySelector`/`querySelectorAll` בוחרים אלמנטים מה-DOM באותו תחביר CSS שכבר מוכר — `querySelector` מחזיר אחד (או `null`), `querySelectorAll` מחזיר NodeList עם כולם. `getElementById` הוא אלטרנטיבה מהירה לחיפוש לפי `id`. בדיקת `null` לפני שימוש היא הרגל חובה.

## דוקומנטציה רשמית

[MDN — Document.querySelector()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)

---

## תרגילים

### תרגיל 1 — querySelector בסיסי

**המשימה:** על עמוד עם כמה כרטיסים (class="card"), בחרו את **הראשון** בעזרת `querySelector` והדפיסו אותו.

**בדיקה:** הפלט מציג אלמנט DOM אחד — לא NodeList, לא מערך.

### תרגיל 2 — querySelectorAll ו-forEach

**המשימה:** בחרו את **כל** הכרטיסים עם `querySelectorAll`, והדפיסו את תוכן הטקסט של כל אחד עם `forEach`.

**בדיקה:** מודפסת שורה לכל כרטיס בעמוד — לא רק הראשון.

### תרגיל 3 — טיפול ב-null

**המשימה:** כתבו `querySelector` עם סלקטור שבטוח לא קיים בעמוד, ובדקו `if (element)` לפני ניסיון שימוש בו.

**בדיקה:** הקוד לא זורק שגיאה — מדפיס הודעה חלופית (כמו "לא נמצא") במקום לקרוס.

---

## פרויקט מסכם

**המשימה:** כתבו סקריפט שבוחר ומדפיס מידע על כל האלמנטים האינטראקטיביים בעמוד האודות (מהיחידות הקודמות).

**דרישות:**
1. בחירת כל הכפתורים (`querySelectorAll("button")`) והדפסת הטקסט של כל אחד
2. בחירת כל שדות הקלט (`querySelectorAll("input")`) והדפסת ה-`type` של כל אחד
3. בדיקת `null` לפני שימוש בכל `querySelector` יחיד

**בדיקה:** הפלט בקונסול מציג נכון את כל הכפתורים והשדות בעמוד, בלי שגיאות.

---

## מה בפרק הבא

בפרק הבא נלמד על **DOM Events** — עד עכשיו כל מה שכתבנו רץ **פעם אחת**, כשהעמוד נטען. אבל אפליקציה אמיתית מגיבה **למשתמש** — קליק על כפתור, הקלדה בשדה. **Events** (אירועים) הם המנגנון של הדפדפן להודיע לקוד "קרה משהו" — ו-**Event Liste
