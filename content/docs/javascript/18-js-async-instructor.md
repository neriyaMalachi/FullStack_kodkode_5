---
title: "מערך שיעור: Async JavaScript"
slug: "18-js-async-instructor"
description: "משך: 2 שעות אקדמיות (90 דקות)."
summary: "📋 מערך מרצה"
date: 2026-08-06T00:00:00+02:00
lastmod: 2026-08-06T00:00:00+02:00
draft: false
weight: 180
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

מטרת השיעור: הסטודנטים יבינו מדוע JavaScript צריכה Async — Single Thread, Non-Blocking — ויפנימו שהקוד שכתבו עד עכשיו היה Synchronous.

בסוף השיעור הסטודנטים צריכים: להסביר למה setTimeout(fn, 0) לא רץ מיד, לכתוב Callback בסיסי, ולהבין ש-Promises ו-async/await פותרים בעיות של Callbacks.

דגש קריטי: זה שיעור מבוא לAsync. אל תנסו לכסות Promises ו-async/await בעומק — הם יבואו בשיעורים הבאים.

## מהלך השיעור

| חלק בשיעור | משך | הערות ודגשים |
| --- | --- | --- |
| פתיחה וחיבור | 5 דקות | הציגו: console.log("A"), setTimeout(()=>console.log("B"),0), console.log("C"). שאלו: "מה יודפס ראשון?" |
| גוף השיעור — תיאוריה | 25 דקות | Single Thread, Blocking vs Non-Blocking, Event Loop בסיסי, setTimeout, Callbacks, מבוא לPromise |
| תרגיל חשיבה לאחר המצגת | 10 דקות | מפורט בהמשך המסמך |
| תרגול מעשי | 40 דקות | כתיבת setTimeout, Callback chains, גילוי Callback Hell |
| שיתוף וסיכום | 10 דקות | מי הצליח לצפות נכון את סדר הפלט? |

## דגשים להעברת השיעור

- "שבירת האשליה" — הריצו את דוגמת A/B/C. רוב הסטודנטים יגידו A,B,C. התוצאה: A,C,B.

- Single Thread — JavaScript רצה על Thread אחד. לכן היא לא יכולה לחכות.

- Callback Hell — הראו פירמידת Callbacks. הוויזואל מדבר בעד עצמו.

- setTimeout(fn, 0) — 0 מילישניות לא אומר מיד, אלא "אחרי שה-Stack הנוכחי התרוקן".

- הצגת Promise — רק הבטחה: הפתרון יבוא בשיעור הבא.

## מושגים

- **Synchronous:** קוד שמחכה לסיום כל שורה לפני שממשיך.

- **Asynchronous:** פעולה שמתחילה ומחזירה שליטה מיד.

- **Single-threaded:** JavaScript מריצה פעולה אחת בכל רגע.

- **Non-blocking:** פעולות I/O לא עוצרות את הרצת שאר הקוד.

- **Event Loop:** המנגנון שמנהל מתי Async callbacks רצים.

- **Callback Queue:** תור של Callbacks שמחכים לרוץ כשה-Call Stack ריק.

- **setTimeout(fn, delay):** מתזמן Callback לאחר delay מינימלי.

- **Callback Hell:** Callbacks מקוננים עמוק — קשה לקריאה ולתחזוקה.

## תרגיל חשיבה

- **נושא:** מה יקרה כשנפעיל בקשה לשרת?

- נציג פסאודוקוד: שליחת בקשה, הדפסת "הבקשה נשלחה", וקבלת נתונים.

- נשאל: "באיזה סדר יגיעו שלושת ה-logs?"

- **מהלך:** ניחוש, הדגמה, גילוי שה-console.log מגיע לפני הנתונים.

- המדריך יציג Callback כפתרון — ויאמר: "Callback עובד. אבל כשיש 3 בקשות תלויות זו בזו? נראה שיעור הבא."
