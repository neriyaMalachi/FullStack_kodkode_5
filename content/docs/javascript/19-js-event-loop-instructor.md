---
title: "מערך שיעור: Event Loop"
slug: "19-js-event-loop-instructor"
description: "משך: 2 שעות אקדמיות (90 דקות)."
summary: "📋 מערך מרצה"
date: 2026-08-06T00:00:00+02:00
lastmod: 2026-08-06T00:00:00+02:00
draft: false
weight: 190
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

מטרת השיעור: הסטודנטים יבינו את מנגנון Event Loop לעומק — ההבדל בין Microtasks ל-Macrotasks, ומדוע Promise callback רץ לפני setTimeout גם כשה-setTimeout הוגדר ראשון.

בסוף השיעור הסטודנטים צריכים: לצפות נכון את סדר הרצת קוד async מעורב, להסביר למה Promises מועדפות על setTimeout לcallbacks עדיפות גבוהה, ולאבחן timing bugs בקוד.

דגש קריטי: זה הנושא התיאורטי הכי מורכב ביחידת ה-Async. אל תמהרו. ציירו את המנגנון על הלוח בכל שלב.

## מהלך השיעור

| חלק בשיעור | משך | הערות ודגשים |
| --- | --- | --- |
| פתיחה וחיבור | 5 דקות | חיבור לשיעור הקודם: היום נבין בדיוק מדוע Promise callback מועדפת |
| גוף השיעור — תיאוריה | 35 דקות | Call Stack, Web APIs, Callback Queue (Macrotask), Microtask Queue, סדר עדיפויות, Tick |
| תרגיל חשיבה לאחר המצגת | 15 דקות | מפורט בהמשך המסמך |
| תרגול מעשי | 25 דקות | ניתוח קטעי קוד וחיזוי סדר הפלט |
| שיתוף וסיכום | 10 דקות | מי ניצח? מי היה בטוח ולא? |

## דגשים להעברת השיעור

- ציירו על הלוח — לא מצגת. Call Stack, Web APIs, Microtask Queue, Macrotask Queue.

- סדר עדיפויות — Sync → Microtasks → Macrotasks. Microtask Queue מתרוקן לגמרי לפני Macrotask חדש. תמיד.

- Promise callback = Microtask — .then() נרשם ב-Microtask Queue.

- דוגמאות טריפות — תנו 2-3 דוגמאות קוד מעורב ובקשו ניחוש לפני הרצה.

- "לא צריך להשתמש ב-queueMicrotask" — ידע זה תיאורטי, אבל מסביר 90% מ-timing bugs.

## מושגים

- **Call Stack:** מחסנית ביצוע — פונקציות נכנסות ויוצאות (LIFO).

- **Web APIs:** setTimeout, fetch, DOM Events — מנוהלים מחוץ ל-JS Engine.

- **Macrotask Queue:** תור לcallbacks מ-setTimeout, setInterval, I/O events.

- **Microtask Queue:** תור עדיפות גבוהה — Promise callbacks, queueMicrotask.

- **Tick:** מחזור אחד של Event Loop.

- **Event Loop:** הלולאה שבודקת: Stack ריק? → ריק Microtask Queue → הכנס Macrotask אחד.

- **requestAnimationFrame:** Macrotask מיוחד שרץ לפני render של הדפדפן.

## תרגיל חשיבה

- **נושא:** מה יודפס ובאיזה סדר?

- נציג 4-5 שורות: console.log sync, setTimeout callback, Promise.resolve().then callback, עוד console.log sync.

- נשאל: "כתבו את הסדר שתצפו לו. נמקו כל שורה."

- **מהלך:** כתיבת ניחוש אישי, דיון, הדגמה חיה, הסבר כל שלב עם הציור על הלוח.

- המדריך יחדד: "Promise callback תמיד לפני setTimeout, גם כש-setTimeout=0. זה Event Loop spec."
