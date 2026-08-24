---
title: "פרויקט מסכם — React + Server"
slug: "116-react-server-capstone-project-content"
description: "פרויקט מסכם שמשדרג את אפליקציית ה-Task Manager עם Axios, זרימת התחברות, בנייה לפריסה, ועדכונים בזמן אמת עם WebSockets."
summary: "📖 שיעור"
date: 2026-08-11T00:00:00+02:00
lastmod: 2026-08-11T00:00:00+02:00
draft: false
weight: 1161
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

זהו הפרויקט המסכם של יחידת React + Server — וגם שיעור-הסיכום הלא-רשמי של רוב הקורס: לוקחים את אפליקציית ה-Task Manager מהפרויקט המסכם של יחידת React ומשדרגים אותה עם ארבעה נושאים מרכזיים: Axios עם Interceptor במקום `fetch` גולמי עם הוספת token ידנית בכל קריאה, זרימת התחברות מלאה עם Protected Routes שמגנות על תוכן בצד הלקוח, הכנה לפריסה עם `npm run build` ו-`express.static`, ועדכונים בזמן אמת בין כמה משתמשים מחוברים עם WebSockets.

Interceptor מרכזי חוסך כפילות קוד ומונע שכחת token באיזו קריאה; Protected Routes נותנות חוויית משתמש ברורה גם אם ההגנה האמיתית היא בשרת; WebSockets נותנים תחושת אפליקציה "חיה" שמתעדכנת מיד. זה בדיוק המעגל השלם של הקורס — תקשורת מסודרת עם השרת, ניהול הרשאות, בנייה לפרודקשן, ותקשורת דו-כיוונית בזמן אמת, לכדי אפליקציית Full-Stack אחת שלמה.

## מה צריך להיות מוכן בסוף

**דרישות:**
1. כל תקשורת עם השרת עוברת דרך מופע Axios מרכזי עם Interceptor שמוסיף `Authorization: Bearer <token>` אוטומטית לכל בקשה יוצאת
2. עמוד Login שמאחסן טוקן ב-`localStorage`, ו-`AuthContext` שמחזיק את מצב ההתחברות באפליקציה
3. קומפוננטת `ProtectedRoute` שעוטפת את עמוד רשימת המשימות — משתמש לא-מחובר מופנה מיד ל-Login
4. `npm run build` מייצר גרסת production של ה-React, שהשרת Express מגיש עם `express.static`, כאשר ה-Catch-all Route שלה ממוקם **אחרי** כל ה-API routes
5. חיבור WebSocket שמשדר לכל הלקוחות המחוברים בזמן אמת כאשר משימה חדשה נוספת, כולל ניקוי ה-listener (`socket.off`) ב-cleanup של `useEffect`

**קריטריוני הצלחה:**

• גישה לרשימת המשימות בלי התחברות מפנה מיד לעמוד Login

• אחרי התחברות, כל קריאות ה-API כוללות טוקן תקין אוטומטית, בלי קוד חוזר בכל endpoint

• הרצת `npm run build` ולאחריה הפעלת שרת ה-Express מגישה בהצלחה את האפליקציה המובנית מאותו שרת בדיוק

• שני טאבים פתוחים במקביל — הוספת משימה באחד מופיעה מיד גם בשני, בלי רענון ידני של הדף

## דוקומנטציה רשמית מותרת

[Axios — Interceptors](https://axios-http.com/docs/interceptors)

[Socket.io — Get Started](https://socket.io/docs/v4/tutorial/introduction)
