---
title: "פרויקט מסכם — הוספות"
slug: "117-additions-capstone-project-content"
description: "פרויקט מסכם שמקשיח את Task Manager API לרמת production — לוגים מובנים, ולידציה עם Zod, הגנות OWASP בסיסיות, JWT, וארכיטקטורת MVC נקייה."
summary: "📖 שיעור"
date: 2026-08-11T00:00:00+02:00
lastmod: 2026-08-11T00:00:00+02:00
draft: false
weight: 1171
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

זהו הפרויקט המסכם של יחידת הוספות — ושל **הקורס כולו**: לוקחים את Task Manager API מהפרויקט המסכם של יחידת Server ומקשיחים אותו לרמת production אמיתית, עם כל חמשת הנושאים ביחידה — Logging מובנה, Validation עם Zod, הגנות OWASP בסיסיות, אימות עם JWT, וארגון מחדש לפי MVC — כדי שהשרת לא רק "יעבוד", אלא יהיה מוכן לעולם האמיתי.

עיצוב מלא בלי לגעת בלוגיקה העסקית הקיימת — הפרויקט דורש הפרדת אחריות אמיתית: Middleware אימות/ולידציה מתחברים ב-`routes` לפני שהם מגיעים ל-Controller הדק, ה-Service נשאר "נקי" מ-HTTP ומ-JWT לגמרי, ולוגר מובנה הופך דיבוג ל-production מתהליך אקראי לתהליך ממוקד. זה בדיוק ההבדל בין "שרת שעובד אצלי" לשרת שמוכן להתמודד עם משתמשים אמיתיים.

## מה צריך להיות מוכן בסוף

**דרישות:**
1. ארגון מחדש לפי MVC — `controllers/`, `services/`, `repositories/` — אם עדיין לא כך
2. לוגר מובנה שמדפיס `info` על כל בקשה, ו-`error` על כל שגיאה שנתפסת ב-Error-Handling Middleware
3. סכימות Zod על `POST`/`PUT`, שדוחות בקשה עם `title` חסר או ריק
4. `requireAuth` (JWT) על `POST`/`PUT`/`DELETE` — קריאה/`GET` נשארת פתוחה
5. הגנת OWASP בסיסית אחת לפחות (למשל `helmet()`) מותקנת ופעילה על כל האפליקציה
6. סדר ה-middleware בכל נתיב מוגן הוא תמיד אימות → ולידציה → Controller — לא הפוך

**קריטריוני הצלחה:**

• `POST /tasks` בלי טוקן מחזיר `401`, עוד לפני שהוולידציה בכלל נבדקת

• `POST /tasks` עם טוקן תקין אך בלי `title` מחזיר `400` עם הודעה ברורה

• `POST /tasks` תקין ומאומת מצליח ומתועד בלוג עם רמת `info`

• שגיאה מכוונת (למשל DB שלא זמין) מתועדת בלוג עם רמת `error`, לא רק מודפסת גולמית

## דוקומנטציה רשמית מותרת

[Zod — Official Docs](https://zod.dev/)

[OWASP — Top 10](https://owasp.org/www-project-top-ten/)

[JWT.io — Introduction](https://jwt.io/introduction)

[Helmet.js — Documentation](https://helmetjs.github.io/)
