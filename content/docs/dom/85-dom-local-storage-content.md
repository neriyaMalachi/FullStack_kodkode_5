---
title: "LocalStorage"
slug: "85-dom-local-storage-content"
description: "שומרים נתונים בדפדפן שנשארים גם אחרי סגירת הטאב או רענון — בלי שרת בכלל."
summary: "📖 שיעור"
date: 2026-08-09T00:00:00+02:00
lastmod: 2026-08-09T00:00:00+02:00
draft: false
weight: 851
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

כל מה שבנינו עד עכשיו נעלם ברענון עמוד — רשימת המשימות, ה-dark mode, כל state ב-JavaScript חוזר לברירת המחדל. ביחידת ה-DB למדנו לשמור נתונים בשרת — אבל מה אם רוצים לשמור **מקומית, בדפדפן עצמו**, בלי שרת בכלל (למשל, העדפת משתמש, או רשימת משימות בפרויקט צד-לקוח בלבד)? **LocalStorage** הוא API מובנה בדפדפן לשמירת נתונים שנשארים **גם אחרי** סגירת הטאב או רענון.

## מילות מפתח שחשוב לזכור

• `localStorage` — אובייקט גלובלי שמאחסן זוגות מפתח-ערך, **בדפדפן עצמו**, לצמיתות (עד שמישהו מוחק ידנית)

• `localStorage.setItem(key, value)` — שומר ערך תחת מפתח; הערך חייב להיות **מחרוזת**

• `localStorage.getItem(key)` — שולף ערך לפי מפתח; מחזיר `null` אם לא קיים

• `localStorage.removeItem(key)` — מוחק ערך ספציפי

• `JSON.stringify`/`JSON.parse` — הופכים אובייקט/מערך למחרוזת ובחזרה — הכרחי כי `localStorage` שומר **רק** מחרוזות

```javascript
const tasks = [{ title: "Shopping", done: false }];

localStorage.setItem("tasks", JSON.stringify(tasks));

const saved = JSON.parse(localStorage.getItem("tasks"));
console.log(saved); // the original array, brought back to life
```

## הדגמה חיה

<div class="demo-live" style="direction:rtl;border:1px solid #d1d5db;border-radius:10px;padding:1.25rem;margin:1.25rem 0;background:#fafafa;color:#111827;">
<p style="font-weight:600;margin:0 0 0.9rem;color:#6b7280;font-size:0.85rem;">🔴 הדגמה חיה — שמירה אמיתית ב-localStorage של הדפדפן שלכם; רעננו את העמוד (F5) ולחצו "טען" — הערך עדיין שם</p>
<input id="demo-ls-input" type="text" placeholder="הקלידו כאן משהו..." style="width:100%;box-sizing:border-box;padding:0.5rem;border:1px solid #d1d5db;border-radius:6px;margin-bottom:0.6rem;">
<div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;">
<button onclick="localStorage.setItem('demo-ls-note', document.getElementById('demo-ls-input').value); document.getElementById('demo-ls-out').textContent='נשמר: ' + document.getElementById('demo-ls-input').value;" style="background:#2563eb;color:#fff;border:none;border-radius:6px;padding:0.5rem 1rem;font-weight:700;cursor:pointer;">שמור (setItem)</button>
<button onclick="const v=localStorage.getItem('demo-ls-note'); document.getElementById('demo-ls-out').textContent = v===null ? 'אין ערך שמור (null)' : 'נטען: ' + v;" style="background:#16a34a;color:#fff;border:none;border-radius:6px;padding:0.5rem 1rem;font-weight:700;cursor:pointer;">טען (getItem)</button>
<button onclick="localStorage.removeItem('demo-ls-note'); document.getElementById('demo-ls-out').textContent='נמחק (removeItem)';" style="background:#dc2626;color:#fff;border:none;border-radius:6px;padding:0.5rem 1rem;font-weight:700;cursor:pointer;">מחק (removeItem)</button>
</div>
<div id="demo-ls-out" style="background:#fff;border:1px dashed #9ca3af;border-radius:6px;padding:0.6rem;color:#374151;">עדיין לא נשמר כלום</div>
</div>

## הסבר עיקרי

localStorage שומר רק מחרוזות — ניסיון לשמור מערך ישירות בלי `JSON.stringify` ישמור פשוט `"[object Object]"` — לא שימושי! `JSON.stringify(tasks)` הופך את המערך למחרוזת JSON תקינה שאפשר לשמור, ו-`JSON.parse(...)` בכיוון ההפוך הופך אותה **בחזרה** לאובייקט/מערך אמיתי כשקוראים אותה.

null כשלא קיים — `localStorage.getItem("tasks")` מחזיר `null` אם המפתח לא נשמר אף פעם — כמו `querySelector` שלא מצא אלמנט. `JSON.parse(null)` בפועל **לא** זורק שגיאה (מחזיר `null`), אבל תמיד כדאי לבדוק במפורש ולתת ברירת מחדל (כמו מערך ריק) לפני שמנסים לעבוד עם הנתונים.

localStorage מול משתנה רגיל — ב-JavaScript רגיל, מערך רגיל בזיכרון נעלם ברענון עמוד — הזיכרון מתאפס לגמרי. `localStorage` הוא נפרד מגמרי מהזיכרון של הדף — הוא שייך ל**דפדפן**, לאתר הספציפי (domain), ונשאר גם אחרי רענון, סגירת טאב, ואפילו סגירת הדפדפן כולו.

## יתרונות

נתונים נשארים בין רענונים/הפעלות, בלי שרת בכלל; API פשוט מאוד — `setItem`/`getItem`/`removeItem`; מתאים מצוין להעדפות משתמש (dark mode) ולפרויקטים צד-לקוח בלבד.

## חסרונות

מוגבל בגודל (בד"כ כ-5-10MB, תלוי דפדפן); שומר רק מחרוזות — דורש `JSON.stringify`/`parse` ידני לכל דבר שאינו טקסט פשוט; זמין **רק** בדפדפן שבו נשמר — לא מסונכרן בין מכשירים (בניגוד ל-DB אמיתי בשרת, מיחידת ה-DB).

## נקודות חשובות

• `localStorage` שומר זוגות מפתח-ערך, כמחרוזות בלבד, שנשארים גם אחרי רענון/סגירה

• `JSON.stringify` הופך אובייקט/מערך למחרוזת לשמירה; `JSON.parse` הופך בחזרה

• `getItem` מחזיר `null` אם המפתח לא קיים — צריך לטפל בזה במפורש

• `localStorage` שייך לדומיין הספציפי, לא מסונכרן בין מכשירים שונים

## טעויות נפוצות

• לשמור אובייקט/מערך ב-`localStorage` בלי `JSON.stringify` — נשמר כמחרוזת חסרת-ערך

• לשכוח לבדוק `null` לפני `JSON.parse` בפעם הראשונה שהמפתח לא קיים

• להתייחס ל-`localStorage` כתחליף למסד נתונים אמיתי — הוא מקומי בלבד, לא משותף בין משתמשים/מכשירים

## סיכום

`localStorage` שומר זוגות מפתח-ערך בדפדפן עצמו, שנשארים גם אחרי רענון עמוד או סגירת טאב — בלי שרת בכלל. הוא שומר **רק מחרוזות**, ולכן `JSON.stringify`/`JSON.parse` הכרחיים לשמירה ושליפה של אובייקטים/מערכים. `getItem` מחזיר `null` אם המפתח לא קיים — תמיד לבדוק לפני שימוש.

## דוקומנטציה רשמית

[MDN — Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

## תרגילים

### תרגיל 1 — שמירה ושליפה בסיסית

**המשימה:** שמרו מחרוזת פשוטה (כמו שם משתמש) ב-`localStorage`, רעננו את העמוד, ושלפו אותה בחזרה.

**בדיקה:** אחרי רענון, `getItem` עדיין מחזיר את הערך ששמרתם — לא `null`.

### תרגיל 2 — שמירת אובייקט/מערך

**המשימה:** שמרו מערך אובייקטים (כמו רשימת משימות) עם `JSON.stringify`, ושלפו אותו בחזרה עם `JSON.parse`.

**בדיקה:** הערך שחוזר הוא מערך אמיתי (לא מחרוזת) עם אותם השדות והערכים כמו לפני השמירה.

### תרגיל 3 — טיפול ב-null

**המשימה:** נסו `getItem` על מפתח שבטוח לא קיים, וטפלו ב-`null` עם ברירת מחדל (מערך ריק).

**בדיקה:** הקוד לא זורק שגיאה — משתמש במערך ריק כברירת מחדל כשהמפתח לא נמצא.

---

## פרויקט מסכם

**המשימה:** הוסיפו שמירה מתמשכת (persist) למצב ה-dark mode (משיעור classList) ולרשימת המטלות (משיעור Event Delegation).

**דרישות:**
1. מצב ה-dark mode נשמר ב-`localStorage` בכל שינוי, ונטען מחדש אוטומטית כשהעמוד נפתח
2. רשימת המטלות (כל הפריטים) נשמרת ב-`localStorage` (עם `JSON.stringify`) בכל הוספה/מחיקה
3. בטעינת העמוד, הרשימה "נבנית מחדש" מה-DOM לפי מה ששמור ב-`localStorage` (עם `JSON.parse`)

**בדיקה:** רענון מלא של העמוד (F5) משמר גם את מצב ה-dark mode וגם את כל פריטי רשימת המטלות, בדיוק כפי שהיו לפני הרענון.

---

## מה בפרק הבא

בפרק הבא נלמד על **Todo App Project** — זהו פרויקט מסכם ראשון ליחידת ה-DOM: מיישמים **יחד** את כל מה שנלמד — Selecting, Events, Content, classList, Creating & Removing, Traversing, Forms, Event Delegation, ו-LocalStorage — לכדי אפליקציית מש
