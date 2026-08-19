---
title: "Request Body (Express)"
slug: "30-express-body-content"
description: "express.json() מפרסר את גוף הבקשה אוטומטית, ומכין אותו מוכן ב-req.body."
summary: "📖 שיעור"
date: 2026-08-09T00:00:00+02:00
lastmod: 2026-08-09T00:00:00+02:00
draft: false
weight: 301
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

בשיעור על Request Body ב-Vanilla ראינו שקריאת body דורשת אסיפת chunks ידנית, `JSON.parse` עם `try`/`catch`, וכל זה חוזר על עצמו בכל route. Express נותן פתרון מובנה: `express.json()` הוא **Middleware** (נעמיק במושג הזה בשיעור נפרד בהמשך, אבל לעת עתה — חשבו עליו כ"תוסף" שרץ לפני ה-route handler) שמפרסר את ה-body אוטומטית, ומציב את התוצאה מוכנה כ-Object ב-`req.body`.

## מילות מפתח שחשוב לזכור

• `req.body` — Object JavaScript מוכן עם נתוני ה-body; זמין **רק** אחרי הפעלת `express.json()`

• `express.json()` — פונקציה שמחזירה middleware; מפרסרת JSON body אוטומטית

• `express.urlencoded({ extended: true })` — מקבילה ל-`express.json()`, אך לפרסור body מטפסי HTML (`application/x-www-form-urlencoded`)

• `app.use(...)` — רישום middleware גלובלי; **חייב** להיות **לפני** ה-routes שמשתמשים ב-`req.body`

• `Content-Type` header — קובע לשרת איך לפרש את ה-body; חייב להיות `application/json` כדי ש-`express.json()` יפעל

```javascript
import express from "express";

const app = express();
app.use(express.json()); // חייב לבוא לפני הroutes שצריכים req.body!

app.post("/users", (req, res) => {
  const { name, email } = req.body; // כבר Object מוכן!
  res.status(201).json({ id: 1, name, email });
});
```

```mermaid
flowchart RL
    Req["POST /users
    body: raw JSON"] --> MW["express.json()
    מפרסר את ה-Stream"]
    MW --> Handler["route handler
    req.body מוכן"]
```

## הסבר עיקרי

מה `express.json()` בעצם עושה מאחורי הקלעים — בדיוק את מה שכתבנו ידנית בשיעור ה-Vanilla: מקשיב לאירועי `data`/`end` על ה-Stream, מרכיב את התוכן, ומריץ `JSON.parse` עליו — ואז שם את התוצאה ב-`req.body` **לפני** שה-route handler שלכם בכלל מופעל.

הסדר קריטי — `app.use(express.json())` **חייב** להירשם **לפני** ה-routes שמשתמשים ב-`req.body`. Express מריץ middleware ו-routes בדיוק לפי סדר הרישום שלהם בקוד — אם `express.json()` נרשם **אחרי** route מסוים, ל-route ההוא `req.body` יהיה `undefined`.

Content-Type כתנאי — `express.json()` בודק את ה-`Content-Type` header של הבקשה הנכנסת; אם הוא לא `application/json`, ה-middleware **מדלג** ולא מפרסר כלום — `req.body` נשאר `undefined`, **לא** אובייקט ריק `{}`. זו נקודה שמבלבלת בפועל: קוד שמניח שיש תמיד אובייקט (גם ריק) וכותב `req.body.name` יזרוק `TypeError: Cannot read properties of undefined` — לא רק "יקבל `undefined`" בשקט. חשוב לוודא שהלקוח (`fetch`, בשיעורי ה-JavaScript) שולח את ה-header הנכון, ואם יש חשש שבקשה תגיע בלי `Content-Type` תקין, להגן על הקוד עם בדיקה מפורשת (`req.body ?? {}`) לפני שניגשים לשדות שבתוכו.

## יתרונות

מחליף עשרות שורות boilerplate מה-Vanilla בשורה אחת (`app.use(express.json())`); טיפול שגיאות פרסור מובנה (JSON לא תקין מטופל אוטומטית ע"י Express); `req.body` מוכן מיד כ-Object נוח.

## חסרונות

חובה לזכור את סדר הרישום (לפני ה-routes); שכחת `Content-Type` נכון בצד הלקוח גורמת ל-`req.body` שנשאר `undefined` בלי הודעת שגיאה ברורה — ועלול לגרום ל-`TypeError` אם ניגשים לשדה בתוכו בלי בדיקה.

## נקודות חשובות למבחן / ראיון עבודה

• `req.body` זמין רק אחרי `app.use(express.json())`, שחייב לבוא לפני ה-routes הרלוונטיים

• `express.json()` דורש `Content-Type: application/json` כדי לפעול

• `express.urlencoded()` מקביל, לפרסור טפסי HTML

• Middleware רץ לפי סדר הרישום המדויק בקוד

## טעויות נפוצות

• רישום `express.json()` **אחרי** routes שמשתמשים ב-`req.body` — הוא יהיה `undefined`

• שכחת `Content-Type: application/json` בבקשת `fetch` מהלקוח

• ציפייה ש-`express.json()` יטפל גם בטפסי HTML — לזה צריך `express.urlencoded()`

## סיכום

`express.json()` הוא middleware שמפרסר body אוטומטית ומכין אותו כ-Object מוכן ב-`req.body` — בדיוק מה שעשינו ידנית ב-Vanilla, אבל בשורה אחת. הרישום שלו (`app.use`) חייב לבוא לפני כל route שצריך `req.body`, וה-client חייב לשלוח `Content-Type: application/json`.

## דוקומנטציה רשמית

[Express — express.json()](https://expressjs.com/en/api.html#express.json)

---

## תרגילים

### תרגיל 1 — קריאת body

**המשימה:** בנו `POST /echo` שמקבל `req.body` ומחזיר אותו בחזרה עם `res.json()`. ודאו ש-`app.use(express.json())` רשום.

**בדיקה:** `curl -X POST http://localhost:3000/echo -H "Content-Type: application/json" -d '{"x":1}'` מחזיר בדיוק `{"x":1}` בסטטוס `200`.

### תרגיל 2 — הוכיחו את חשיבות הסדר

**המשימה:** רשמו `app.use(express.json())` **אחרי** route שמשתמש ב-`req.body`, שלחו בקשה ותעדו מה `req.body` מכיל. אחר כך תקנו את הסדר ובדקו שוב.

**בדיקה:** לפני התיקון `req.body` הוא `undefined`; אחרי העברת `app.use(express.json())` לפני ה-route, `req.body` מכיל את האובייקט שנשלח.

### תרגיל 3 — Content-Type חסר

**המשימה:** שלחו בקשת POST **בלי** `Content-Type: application/json` (למשל `curl -X POST -d '{"x":1}' http://localhost:3000/echo` בלי `-H`), ובדקו מה `req.body` מכיל.

**בדיקה:** `req.body` הוא `undefined` — **לא** אובייקט ריק `{}` — כי `express.json()` מדלג על פרסור לגמרי כשה-`Content-Type` לא תואם, ולא מציב שום ערך.

---

## פרויקט מסכם

**המשימה:** בנו `POST /tasks` שמוסיף משימה למערך בזיכרון.

**דרישות:**
1. `app.use(express.json())` במקום נכון (לפני ה-route)
2. `req.body` מצופה להכיל `{ title }`
3. אם `title` חסר — החזירו `400` עם הודעת שגיאה ברורה
4. אחרת — הוסיפו למערך והחזירו `201` עם המשימה שנוצרה

**בדיקה:** `curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"קניות"}'` מחזיר status `201` עם משימה שכוללת `title: "קניות"`; אותה בקשה עם `-d '{}'` מחזירה status `400`.

---

## מה בפרק הבא

בפרק הבא נלמד על **req.params & req.query** — בשיעור ה-Vanilla על URL Params פיצלנו `pathname` ידנית כדי לחלץ חלק דינמי כמו `42` מ-`/users/42`. Express נותן לזה תחביר נוח בהרבה: `req.params` ו-`req.query` הם שני מקורות מידע **שונים** שקל לבלבל בי
