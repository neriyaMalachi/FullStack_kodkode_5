---
title: "פרויקט מסכם — Server"
slug: "108-server-capstone-project-content"
description: "פרויקט מסכם שבונה API RESTful מלא — Express, Router, Middleware, טיפול שגיאות ו-dotenv יחד בשרת אחד עובד."
summary: "📖 שיעור"
date: 2026-08-11T00:00:00+02:00
lastmod: 2026-08-11T00:00:00+02:00
draft: false
weight: 1081
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

זהו הפרויקט המסכם של יחידת Server: לא נושא חדש, אלא **חיבור** של כל מה שנלמד — HTTP, Express, Router, Middleware Pipeline (כולל טיפול שגיאות מרכזי), `req.params`/`req.query`, ו-`dotenv` — לכדי API RESTful אחד שלם: **Task Manager API**. זהו בדיוק השרת שיחידות React ו-React + Server בהמשך הקורס יתחברו אליו.

Router ו-Middleware Pipeline הופכים שרת גדול לקריא ומאורגן, במקום קובץ ענק אחד; Error-Handling Middleware מרכזי מונע כפילות טיפול-שגיאות בכל route בנפרד; ו-`dotenv` נותן גמישות בין סביבות (פיתוח, בדיקות, production) בלי לגעת בקוד כלל — רק בקובץ `.env`.

## מה צריך להיות מוכן בסוף

**דרישות:**
1. Router נפרד (`routes/tasks.js`) עם חמשת ה-endpoints הבסיסיים: `GET /tasks`, `GET /tasks/:id`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`
2. `GET /tasks` תומך בסינון לפי query string (למשל `?completed=true`)
3. Middleware לוג בסיסי שרץ על כל בקשה נכנסת (מדפיס method + url)
4. `express.json()` ממוקם לפני ה-routes, כדי ש-`POST`/`PUT` יקבלו `req.body` תקין
5. Error-Handling Middleware עם 4 פרמטרים (`err, req, res, next`), ממוקם בסוף הקובץ — אחרי כל שאר ה-middleware וה-routes
6. `PORT` נקרא מ-`process.env.PORT` דרך `dotenv`, ולא קשיח בקוד

**קריטריוני הצלחה:**

• `POST /tasks` עם גוף תקין (למשל `{"title":"קניות"}`) מחזיר `201` ואת המשימה שנוצרה

• `GET /tasks/999` (מזהה שלא קיים) מחזיר `404` עם גוף JSON תקין, לא stack trace גולמי

• `GET /tasks?completed=true` מחזיר רק את המשימות שהושלמו

• שינוי `PORT` בקובץ `.env` משנה בפועל על איזה פורט השרת מאזין, בלי לגעת בקוד כלל

## דוקומנטציה רשמית מותרת

[Express — Routing](https://expressjs.com/en/guide/routing.html)

[Express — Error Handling](https://expressjs.com/en/guide/error-handling.html)
