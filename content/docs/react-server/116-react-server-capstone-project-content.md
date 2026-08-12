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

## מה זה?

זהו הפרויקט המסכם של יחידת React + Server — וגם שיעור-הסיכום הלא-רשמי של רוב הקורס: לוקחים את אפליקציית ה-Task Manager מהפרויקט המסכם של יחידת React ומשדרגים אותה עם כל מה שנלמד כאן — Axios במקום `fetch` גולמי, זרימת התחברות עם Protected Routes, הכנה לפריסה (Deployment), ועדכונים בזמן אמת עם WebSockets בין כמה משתמשים מחוברים.

## מילות מפתח שחשוב לזכור

• Axios Interceptor — פונקציה שרצה אוטומטית על **כל** בקשה יוצאת — כאן: מוסיפה `Authorization: Bearer <token>` בלי לחזור על זה בכל קריאה

• Protected Route — קומפוננטת עטיפה שבודקת Auth State לפני שמאפשרת גישה, ומפנה ל-Login אם אין משתמש מחובר

• `npm run build` — הופך את קוד ה-React ל-Static Files סופיים, ש-Express מגיש עם `express.static`

• WebSocket (Socket.io) — חיבור פתוח וממושך; השרת "דוחף" עדכון לכל הלקוחות המחוברים, לא רק עונה על בקשה

```jsx
// api.js — Axios עם Interceptor, במקום fetch חוזר בכל מקום
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

```jsx
// ProtectedRoute.jsx — שער לפני תוכן מוגן
function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  return children;
}
```

```jsx
// TaskList.jsx — עדכון בזמן אמת עם WebSocket, בנוסף לטעינה הראשונית מ-Axios
useEffect(() => {
  socket.on("taskAdded", (task) => setTasks((prev) => [...prev, task]));
  return () => socket.off("taskAdded");
}, []);
```

## הסבר עיקרי

Interceptor פותר בעיה שהייתה חוזרת בכל קריאת רשת — בלי Interceptor, כל קריאת `fetch`/`axios` הייתה צריכה להוסיף ידנית את ה-token ל-headers — קל לשכוח באחת מהן. עם Interceptor אחד ב-`api.js`, **כל** קריאה שמשתמשת ב-`api` (במקום `axios` הגולמי) מקבלת אוטומטית את ה-token, בלי לחזור על הקוד בכל endpoint.

Protected Route היא הגנת UX, לא אבטחה — `ProtectedRoute` מונע מהממשק להציג תוכן מוגן למי שלא מחובר — אבל היא רצה **בדפדפן**, ומשתמש נחוש יכול לעקוף אותה ולפנות ישירות ל-API. ההגנה **האמיתית** היא בשרת (מיחידת Auth & JWT) — בדיוק אותו עיקרון של Client-Side Validation מיחידת HTML Forms: נוחות למשתמש התם, לא הגנה מפני תוקף.

WebSocket לא מחליף את Axios — הוא מוסיף שכבה — טעינת המשימות **הראשונית** עדיין קורית עם Axios/`fetch` רגיל (בקשה-תשובה חד-פעמית). WebSocket מתווסף **מעליה**: אחרי הטעינה הראשונית, החיבור הפתוח מאזין לעדכונים **חדשים** שקורים אחרי-כן, בלי שהלקוח צריך "לשאול שוב" (Polling).

## יתרונות

Interceptor מרכזי חוסך כפילות קוד ומונע שכחת token באיזו קריאה; Protected Routes נותנות חוויית משתמש ברורה גם אם ההגנה האמיתית היא בשרת; WebSockets נותנים תחושת אפליקציה "חיה" שמתעדכנת מיד, לא רק בטעינה.

## חסרונות

חיבור WebSocket פתוח דורש ניהול נוסף (ניתוקים, reconnection) שלא קיים בבקשת HTTP רגילה; Protected Routes מוסיפות שכבת מורכבות (Auth Context, בדיקות בכל route) שלא נחוצה באפליקציה בלי משתמשים.

## נקודות חשובות למבחן / ראיון עבודה

• Axios Interceptor רץ אוטומטית על כל בקשה — נפוץ במיוחד להוספת טוקן Authorization

• Protected Route היא הגנת UX בצד לקוח — ההגנה האמיתית תמיד גם בשרת

• `npm run build` הופך React ל-Static Files; Express מגיש אותם עם `express.static` + Catch-all Route

• WebSocket מתווסף מעל תקשורת HTTP רגילה, לא מחליף אותה — טעינה ראשונית עדיין דרך fetch/Axios

## טעויות נפוצות

• לסמוך רק על Protected Route בצד לקוח בלי לבדוק הרשאות גם בשרת

• לשכוח `socket.off` ב-cleanup של `useEffect` — כל טעינה מחדש של הקומפוננטה מוסיפה listener כפול

• לשים את ה-Catch-all Route של Express **לפני** ה-API routes — "בולע" בטעות גם בקשות API אמיתיות

• לשמור מידע רגיש (לא רק טוקן) ב-`localStorage` — רק הטוקן, לעולם לא סיסמה גולמית

## סיכום

הפרויקט המסכם משדרג את אפליקציית ה-Task Manager עם Axios+Interceptor לתקשורת נקייה עם השרת, Protected Routes שמסתירות תוכן ממי שלא מחובר, הכנה מלאה לפריסה עם `npm run build`+`express.static`, ו-WebSockets לעדכונים בזמן אמת בין כמה משתמשים. זה בדיוק המעגל השלם של הקורס — מ-HTML גולמי ועד אפליקציית Full-Stack חיה, מרובת-משתמשים, שמתעדכנת בזמן אמת.

## דוקומנטציה רשמית

[Axios — Interceptors](https://axios-http.com/docs/interceptors)

[Socket.io — Get Started](https://socket.io/docs/v4/tutorial/introduction)

---

## תרגילים

### תרגיל 1 — מעבר מ-fetch ל-Axios עם Interceptor

**המשימה:** קחו קריאת `fetch` קיימת עם הוספת token ידנית, והמירו אותה ל-Axios עם Interceptor מרכזי.

**בדיקה:** כל קריאה שמשתמשת במופע ה-Axios כולל את ה-token אוטומטית, בלי לכתוב אותו שוב באף מקום.

### תרגיל 2 — Protected Route בסיסי

**המשימה:** בנו `ProtectedRoute` שמפנה ל-`/login` אם אין משתמש ב-Context, ועטפו איתו route אחד.

**בדיקה:** ניסיון גישה ל-route המוגן בלי התחברות מפנה מיד ל-`/login`; אחרי התחברות (מדומה), הגישה מתאפשרת.

---

## פרויקט מסכם

**המשימה:** שדרגו את אפליקציית ה-Task Manager (מהפרויקט המסכם של יחידת React) עם ארבעת הנושאים ביחידה.

**דרישות:**
1. כל תקשורת עם השרת עוברת דרך מופע Axios עם Interceptor שמוסיף `Authorization` אוטומטית
2. עמוד Login שמאחסן טוקן ב-`localStorage`, ו-`AuthContext` שמחזיק את מצב ההתחברות
3. `ProtectedRoute` עוטף את עמוד רשימת המשימות — משתמש לא-מחובר מופנה ל-Login
4. `npm run build` מייצר גרסת production, שהשרת Express מגיש עם `express.static` + Catch-all Route (אחרי ה-API routes)
5. WebSocket שמשדר "משימה נוספה" לכל הלקוחות המחוברים בזמן אמת

**בדיקה:** גישה לרשימת המשימות בלי התחברות מפנה ל-Login; אחרי התחברות, כל קריאות ה-API כוללות טוקן תקין אוטומטית; `npm run build` ואז הרצת שרת ה-Express מגישה את האפליקציה המובנית בהצלחה מאותו שרת; שני טאבים פתוחים — הוספת משימה באחד מופיעה מיד בשני, בלי רענון.

## מה בפרק הבא

בפרק הבא — חבילת נושאים משלימה, **הוספות**: Logging, Validation עם Zod, יסודות OWASP, Auth & JWT, ו-MVC & DDD — נושאים שמעמיקים ומחזקים את שכבת השרת שבניתם לאורך הקורס.
