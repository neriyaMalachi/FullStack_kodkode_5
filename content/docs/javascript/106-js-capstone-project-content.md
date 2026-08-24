---
title: "פרויקט מסכם — JavaScript"
slug: "106-js-capstone-project-content"
description: "פרויקט מסכם שמחבר יחד את כל יסודות JavaScript — פונקציות, מערכים, אובייקטים, closures, מודולים ו-async/await."
summary: "📖 שיעור"
date: 2026-08-11T00:00:00+02:00
lastmod: 2026-08-11T00:00:00+02:00
draft: false
weight: 1061
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

## הגדרת הפרויקט

זהו הפרויקט המסכם של יחידת JavaScript: לא מושג חדש, אלא **חיבור** של כל מה שנלמד ביחידה — משתנים, תנאים ולולאות, פונקציות, מערכים ואובייקטים, מתודות מערך (`map`/`filter`/`sort`), closures, factory functions, מודולים (`import`/`export`), קוד נקי, דיבאגינג, ו-`fetch`/`async`/`await` — לכדי **תוכנית עבודה אחת אמיתית**: קטלוג ספרים שנטען מ-API חיצוני. עדיין **בלי DOM ובלי שרת** (אלה יחידות נפרדות בהמשך) — הפלט הוא `console.log`, בדיוק כמו רוב היחידה. הפרויקט מפוצל למודולים לפי אחריות — קובץ שמדבר עם ה-API לא צריך לדעת כלום על מבנה "ספר", וקובץ שבונה "ספר" לא צריך לדעת כלום על `fetch` — בדיוק כמו החלוקה שנלמדה ביחידת Clean Code.

## מה צריך להיות מוכן בסוף

**דרישות:**
1. `api.js` — פונקציית `async` אחת שקוראת ל-Open Library Subjects API (או כל API ציבורי חופשי אחר) ומחזירה מערך גולמי; זריקת שגיאה ברורה אם התגובה לא תקינה
2. `library.js` — `createBook(rawWork)` (Factory) שמחזיר אובייקט "ספר" עם `title`/`author`/`year` ומתודת `view()` שסופרת צפיות דרך Closure פרטי
3. `index.js` — קורא ל-`api.js`, הופך כל תוצאה ל"ספר" עם `library.js`, ושומר הכל במערך אחד
4. שימוש ב-`filter` להצגת ספרים משנה מסוימת ואילך, ו-`sort` למיון הקטלוג לפי שנה
5. `try`/`catch` סביב הקריאה האסינכרונית ב-`index.js`, עם הודעת שגיאה ברורה אם ה-API לא זמין

**קריטריוני הצלחה:**

• הרצת `index.js` (עם `node`) מדפיסה קטלוג ספרים אמיתי מה-API, ממוין וכולל רק תוצאות שעברו את הסינון

• ניתוק האינטרנט (או שינוי כתובת ה-API לשגויה בכוונה) מדפיס הודעת שגיאה ברורה, לא קריסה עם stack trace גולמי

• קריאה חוזרת ל-`view()` על אותו ספר מגדילה את המונה בכל פעם, ולא ניתנת לשינוי ישיר מבחוץ

• `api.js` לא מכיל שום ידע על מבנה "ספר", ו-`library.js` לא מכיל שום קריאה ל-`fetch`

## דוקומנטציה רשמית מותרת

[MDN — JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

[Open Library — Subjects API](https://openlibrary.org/dev/docs/api/subjects)
