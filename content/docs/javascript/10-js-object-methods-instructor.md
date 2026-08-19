---
title: "מערך שיעור: Object Methods — מתודות Object"
slug: "10-js-object-methods-instructor"
description: "משך: 2 שעות אקדמיות (90 דקות)."
summary: "📋 מערך מרצה"
date: 2026-08-06T00:00:00+02:00
lastmod: 2026-08-06T00:00:00+02:00
draft: false
weight: 100
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

משך: 2 שעות אקדמיות (90 דקות).

מטרת השיעור: הסטודנטים יבינו למה אין for...in נקי לעיבוד אובייקטים, ויכירו את הכלים המובנים שפותרים את זה — keys/values/entries לאיטרציה, assign/spread למיזוג, freeze להגנה, ו-fromEntries להפוך מערך בחזרה לאובייקט.

בסוף השיעור הסטודנטים צריכים: להשתמש ב-Object.keys/values/entries כדי לעבור על אובייקט, למזג אובייקטים עם spread בלי לפגוע במקור, ולהסביר מתי Object.freeze שימושי.

דגש קריטי: זה שיעור "ארגז כלים" — כמה מתודות סטטיות, כל אחת פותרת חלק אחר מהבעיה שהוצגה בפתיחה.

## מהלך השיעור

| חלק בשיעור | משך | הערות ודגשים |
| --- | --- | --- |
| הבעיה + מה הן מתודות Object | 15 דקות | שלושה כאבים: איטרציה ידנית, מיזוג ידני, אין הגנה |
| keys / values / entries | 20 דקות | שלוש דרכים לצאת מהאובייקט למערך |
| assign ו-spread | 15 דקות | שתיהן ממזגות; spread מועדף כי הוא לא נוגע ב-target |
| freeze | 15 דקות | הגנה על config — שינוי נכשל בשקט |
| in, מפתח דינמי, fromEntries | 15 דקות | בדיקת קיום מאפיין; fromEntries כהפך מ-entries |
| תרגול מעשי | 10 דקות | שקף "נסה בעצמך" — Object.entries + reduce |

## דגשים להעברת השיעור

- קודם הבעיה, אחר כך רשימת הכלים.

- entries הוא ה"שווה ערך" בין Object למערך — מאפשר map/filter/reduce על תוכן האובייקט.

- assign מול spread — assign כותב לתוך ה-object הראשון (mutating אם לא {} ריק); spread תמיד יוצר object חדש.

- freeze נכשל בשקט — cfg.MAX = 999 לא זורק שגיאה, פשוט לא עושה כלום. תראו את זה חי.

- fromEntries הוא ההפך מ-entries.

## מושגים

- **Object.keys(obj):** מחזיר מערך של כל מפתחות ה-Object.

- **Object.values(obj):** מחזיר מערך של כל ערכי ה-Object.

- **Object.entries(obj):** מחזיר מערך של זוגות [key, value].

- **Object.assign(target, ...sources):** מעתיק תכונות ממקורות ל-target; משנה את ה-target עצמו.

- **Spread ({...obj}):** מיזוג/שכפול אובייקטים ליצירת אובייקט חדש.

- **Object.freeze(obj):** נועל Object — shallow, מקוננים לא מוקפאים.

- **Object.fromEntries(entries):** ממיר מערך של זוגות חזרה ל-Object.

- **"key" in obj:** בודק אם מאפיין קיים באובייקט.

## תרגיל חשיבה

- **נושא:** למה Object.assign({}, base, extra) ולא Object.assign(base, extra)?

- נציג: שתי קריאות ל-assign — אחת עם {} ריק כפרמטר ראשון, אחת בלי.

- נשאל: "בדקו את base אחרי כל קריאה — האם הוא השתנה?"

- **מהלך:** בלי {} ריק, base עצמו הוא ה-target, ולכן assign משנה אותו. עם {} ריק, לא נוגעים ב-base בכלל.

- המדריך יסכם: הפרמטר הראשון של assign הוא זה שמשתנה — אם לא רוצים לפגוע במקור, השתמשו ב-spread.
