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

## מה זה?

זהו הפרויקט המסכם של יחידת Server: לא נושא חדש, אלא **חיבור** של כל מה שנלמד — HTTP, Express, Router, Middleware (כולל טיפול שגיאות), `req.params`/`req.query`, ו-`dotenv` — לכדי API RESTful אחד שלם: **Task Manager API**. זה בדיוק השרת שיחידות React ו-React + Server בהמשך הקורס יתחברו אליו.

## מילות מפתח שחשוב לזכור

• Router — קובץ נפרד לכל קבוצת endpoints, מחובר ל-`app` הראשי עם `app.use("/tasks", tasksRouter)`

• Middleware Pipeline — סדר ריצה קבוע: לוגים → parsing (`express.json()`) → routes → טיפול שגיאות, תמיד **בסוף**

• REST מלא — חמשת הפעולות הבסיסיות על משאב (`GET`/`GET :id`/`POST`/`PUT`/`DELETE`) עם Status Codes נכונים

• Error-Handling Middleware — פונקציה עם **4 פרמטרים** (`err, req, res, next`) שתופסת כל שגיאה שנזרקת/מועברת עם `next(err)`

```javascript
// app.js — הרכבת כל היחידה למקום אחד
import express from "express";
import "dotenv/config";
import tasksRouter from "./routes/tasks.js";

const app = express();

app.use((req, res, next) => {           // middleware לוג בסיסי
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(express.json());                 // parsing גוף הבקשה
app.use("/tasks", tasksRouter);           // Router נפרד

app.use((req, res) => {                  // 404 — שום route לא תפס
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {        // Error-Handling Middleware — תמיד אחרון
  console.error(err.message);
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(process.env.PORT || 3000);
```

## הסבר עיקרי

הרכבה מלאה, לא רק כתיבה — כל לקח ביחידה בנה **חלק אחד** מה-pipeline: `express.json()` (Body) הופך גוף בקשה ל-`req.body` שימושי, Router מפריד את ה-routes של `/tasks` לקובץ נפרד, Middleware הלוג רץ על **כל** בקשה לפני שהיא מגיעה ל-route, ו-Error-Handling Middleware תופס **כל** שגיאה שקורית בכל route, במקום שכל route יטפל בשגיאות בעצמו. זה בדיוק ההבדל בין "לדעת לכתוב endpoint בודד" לבין "לבנות שרת אמיתי" — הרכבת החלקים לפי סדר נכון.

סדר ה-middleware קובע התנהגות — לוג **לפני** `express.json()` אומר שרואים בקשה גם אם ה-body שלה שבור; `express.json()` **לפני** ה-routes אומר ש-`req.body` כבר מוכן כשמגיעים אליהם; ה-404 handler ו-Error-Handling Middleware **בסוף**, בסדר הזה, אומר "אם שום route לא תפס — 404; אם route זרק שגיאה — היא מגיעה לכאן ולא מפילה את השרת".

dotenv מפריד קונפיגורציה מקוד — `process.env.PORT` (במקום `3000` קשיח בקוד) מאפשר להריץ את אותו שרת בדיוק על פורטים שונים בסביבות שונות (פיתוח, בדיקות, production) בלי לגעת בקוד בכלל — רק בקובץ `.env`.

## יתרונות

Router + Middleware Pipeline הופכים שרת גדול לקריא ומאורגן, לא קובץ ענק אחד; Error-Handling Middleware מרכזי מונע כפילות טיפול-שגיאות בכל route; dotenv נותן גמישות בין סביבות בלי לשנות קוד.

## חסרונות

יותר קבצים ו"חוטים" לעקוב אחריהם מאשר שרת וניל פשוט (מיחידת הבסיסים); סדר middleware שגוי (למשל error-handler לא-אחרון) יכול לגרום להתנהגות מבלבלת שקשה לאבחן.

## נקודות חשובות למבחן / ראיון עבודה

• סדר middleware קבוע: לוגים → parsing → routes → 404 → error-handling — בסוף תמיד

• Router מפריד routes לפי משאב, מחובר עם `app.use("/prefix", router)`

• Error-Handling Middleware מזוהה לפי **4 פרמטרים** (`err` ראשון) — Express קורא לה אוטומטית כש-`next(err)` נקרא

• `dotenv` טוען משתני סביבה מ-`.env`; קוד קורא אותם דרך `process.env`, לעולם לא ערכים קשיחים

## טעויות נפוצות

• להציב את ה-Error-Handling Middleware **לא** בסוף הרשימה — Express לא יזהה אותה נכון

• לשכוח `express.json()` ואז לתהות למה `req.body` הוא `undefined`

• להחזיר `200` על שגיאה (למשל משאב לא נמצא) במקום `404`/`400`/`500` נכון

• להדפיס סיסמאות/מפתחות API ישירות בקוד במקום לקרוא אותם מ-`.env`

## סיכום

הפרויקט המסכם מרכיב שרת Express שלם מכל חלקי היחידה: Router מארגן endpoints לפי משאב, Middleware Pipeline (לוג → parsing → routes → 404 → שגיאות) קובע איך כל בקשה זורמת, ו-`dotenv` מפריד קונפיגורציה מקוד. זה בדיוק ה-API שיחידות React ו-React + Server יתחברו אליו בהמשך הקורס.

## דוקומנטציה רשמית

[Express — Routing](https://expressjs.com/en/guide/routing.html)

[Express — Error Handling](https://expressjs.com/en/guide/error-handling.html)

---

## תרגילים

### תרגיל 1 — Router בסיסי

**המשימה:** הוציאו endpoint בודד (`GET /tasks`) מ-`app.js` לקובץ Router נפרד, וחברו אותו בחזרה.

**בדיקה:** קריאה ל-`GET /tasks` עדיין עובדת זהה לפני ואחרי ההפרדה — רק מיקום הקוד השתנה.

### תרגיל 2 — Error-Handling Middleware

**המשימה:** הוסיפו middleware טיפול-שגיאות בסוף `app.js`, וגרמו לאחד ה-routes לזרוק שגיאה מכוונת (`throw new Error("test")`) כדי לבדוק שהוא נתפס.

**בדיקה:** הבקשה מחזירה JSON עם שדה `error`, לא stack trace גולמי ולא קריסת שרת.

---

## פרויקט מסכם

**המשימה:** בנו Task Manager API מלא — CRUD שלם למשאב "משימות", מאורגן עם Router ו-Middleware Pipeline נכון.

**דרישות:**
1. Router נפרד (`routes/tasks.js`) עם חמשת ה-endpoints הבסיסיים: `GET /tasks`, `GET /tasks/:id`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`
2. `GET /tasks` תומך בסינון לפי query string (`?completed=true`)
3. Middleware לוג בסיסי שרץ על כל בקשה (מדפיס method + url)
4. `express.json()` לפני ה-routes, כדי ש-`POST`/`PUT` יקבלו `req.body` תקין
5. Error-Handling Middleware בסוף הקובץ — כל שגיאה (כולל 404 על משימה לא-קיימת) חוזרת כ-JSON עם Status Code נכון, לא stack trace
6. `PORT` נקרא מ-`process.env.PORT` (עם `dotenv`), לא קשיח בקוד

**בדיקה:** `POST /tasks` עם `{"title":"קניות"}` מחזיר `201` ואת המשימה שנוצרה; `GET /tasks/999` (לא קיים) מחזיר `404` עם JSON תקין; `GET /tasks?completed=true` מחזיר רק משימות שהושלמו; שינוי `PORT` ב-`.env` משנה בפועל על איזה פורט השרת מאזין, בלי לגעת בקוד.

## מה בפרק הבא

בפרק הבא נתחיל יחידה חדשה — **בסיסי נתונים**. עד עכשיו כל הנתונים בשרת שלנו חיו במערך זמני בזיכרון — כל הפעלה מחדש של השרת מוחקת הכל. ביחידת בסיסי הנתונים נלמד לשמור נתונים **לצמיתות**, גם אחרי שהשרת נכבה — הבסיס לכל אפליקציה אמיתית.
