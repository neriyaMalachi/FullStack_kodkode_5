---
title: "מערך שיעור: Async / Await"
slug: "23-js-async-await-instructor"
description: "משך: 2 שעות אקדמיות (90 דקות)."
summary: "📋 מערך מרצה"
date: 2026-08-06T00:00:00+02:00
lastmod: 2026-08-06T00:00:00+02:00
draft: false
weight: 230
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

מטרת השיעור: הסטודנטים יאמצו את async/await כדרך הכתיבה המועדפת ל-async code — קריא, דומה ל-sync, ועם try/catch לטיפול בשגיאות.

בסוף השיעור הסטודנטים צריכים: לכתוב פונקציות async עם await, לטפל בשגיאות עם try/catch, ולהריץ פעולות מקביליות עם Promise.all במקום await סדרתי.

דגש קריטי: await סדרתי הוא הבאג הנפוץ ביותר — שתי שורות await זו אחר זו = הבקשה השנייה מחכה לראשונה. אם הן עצמאיות — זה latency מיותר. Promise.all הוא הפתרון.

## מהלך השיעור

| חלק בשיעור | משך | הערות ודגשים |
| --- | --- | --- |
| פתיחה וחיבור | 5 דקות | הציגו promise chain של 4 שלבים לעומת אותו קוד עם async/await |
| גוף השיעור — תיאוריה | 25 דקות | async function, await, try/catch, Sequential vs Parallel, Promise.all, Top-level await |
| תרגיל חשיבה לאחר המצגת | 10 דקות | מפורט בהמשך המסמך |
| תרגול מעשי | 40 דקות | המרת Callbacks ו-Promises ל-async/await, תיקון await סדרתי לא-נחוץ |
| שיתוף וסיכום | 10 דקות | מי מצא את ה-await הסדרתי ותיקן לPromise.all? |

## דגשים להעברת השיעור

- "async תמיד מחזיר Promise" — גם אם הפונקציה מחזירה מספר רגיל, היא תעטוף אותו ב-Promise.

- await בתוך async בלבד — await מחוץ ל-async = SyntaxError.

- try/catch — כשPromise נדחה, await זורק שגיאה. try/catch תופסת אותה.

- Sequential vs Parallel — הראו שתי בקשות await זו אחר זו ואז מדדו זמן. ואז Promise.all.

- await forEach — אזהרה: לא עובד כצפוי. השתמשו ב-Promise.all עם map, או for...of.

## מושגים

- **async function:** פונקציה שמחזירה תמיד Promise.

- **await:** עצירה זמנית של ביצוע הפונקציה עד ש-Promise מסתיים.

- **try/catch ב-async:** הדרך לטיפול בשגיאות.

- **Sequential await:** שני await זה אחר זה — הבקשה השנייה מחכה לסיום הראשונה.

- **Parallel await:** await Promise.all([a(), b()]) — שתי הבקשות רצות במקביל.

- **Top-level await:** שימוש ב-await ברמה עליונה ב-ES Module.

- **IIFE async:** דרך להריץ async code ב-top-level בסביבה שלא תומכת ב-top-level await.

## תרגיל חשיבה

- **נושא:** מה קורה כשאין await?

- נציג פונקציה async שקוראת לה מבחוץ — ומישהו שכח await על הקריאה.

- נשאל: "מה יודפס כשמנסים להשתמש בתוצאה מיד?"

- **מהלך:** הדגמת הבאג, גילוי ש-[object Promise] הוא הפלט, הוספת await, הסבר.

- המדריך יסכם: "שכחת await = קיבלת Promise object ולא ערך. זה שקט — אין שגיאה."
