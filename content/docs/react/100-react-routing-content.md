---
title: "React Routing"
slug: "100-react-routing-content"
description: "בונים אפליקציית מספר-עמודים אמיתית, עם ניווט בין \"דפים\" בלי לרענן את הדפדפן בכלל."
summary: "📖 שיעור"
date: 2026-08-09T00:00:00+02:00
lastmod: 2026-08-09T00:00:00+02:00
draft: false
weight: 1001
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

כל מה שבנינו עד עכשיו היה **עמוד אחד** (Single Page). אבל אפליקציה אמיתית צריכה כמה "מסכים": רשימת משימות, פרטי משימה, דף אודות. פתרון פשטני — לינק `<a href="/tasks/5">` רגיל — היה גורם ל**רענון מלא** של הדפדפן, ומאבד את כל ה-state (בדיוק כמו שלמדנו ביחידת HTML Forms/DOM Events!). **React Router** נותן ניווט בין "עמודים" **בתוך** אותה אפליקציית React יחידה, בלי שום רענון — Single Page Application (SPA) אמיתי.

## מילות מפתח שחשוב לזכור

• SPA (Single Page Application) — אפליקציה שרצה בעמוד HTML **אחד**, ומחליפה תוכן דרך JavaScript, בלי רענון בין "עמודים"

• `<BrowserRouter>` — קומפוננטה שעוטפת את כל האפליקציה ומפעילה את מנגנון הניתוב

• `<Routes>` / `<Route path="..." element={...} />` — מגדירים אילו קומפוננטות מוצגות עבור אילו נתיבי URL

• `<Link to="...">` — כמו `<a>`, אבל **בלי** רענון עמוד — משנה את ה-URL ומרנדרת מחדש רק את מה שצריך

• `useParams()` — Hook שקורא פרמטרים דינמיים מה-URL (כמו `:id` ב-`/tasks/:id`)

• `useNavigate()` — Hook לניווט תכנותי (למשל, אחרי שליחת טופס מוצלחת)

```jsx
function App() {
  return (
    <BrowserRouter>
      <Link to="/tasks">משימות</Link>
      <Routes>
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/tasks/:id" element={<TaskDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

function TaskDetails() {
  const { id } = useParams(); // קורא את ה-id מתוך ה-URL
  return <p>פרטי משימה מספר {id}</p>;
}
```

```mermaid
sequenceDiagram
    participant User as משתמש
    participant Link as Link to="/tasks/5"
    participant Router as React Router
    participant Comp as TaskDetails

    User->>Link: לחיצה
    Link->>Router: משנה את ה-URL (בלי רענון!)
    Router->>Router: מוצא Route תואם ל-/tasks/:id
    Router->>Comp: מרנדר TaskDetails עם id=5
    Comp-->>User: מוצג מיד — כל ה-state הקיים נשמר
```

## הסבר עיקרי

Link לא מרענן, בניגוד ל-a רגיל — `<a href="/tasks">` רגיל (מיחידת HTML) שולח בקשת דפדפן אמיתית לשרת ומרענן את כל העמוד — כל ה-state של React (כל `useState`, כל Context) מתאפס. `<Link to="/tasks">` מונע את זה (בפנים, היא קוראת ל-`preventDefault` כמו שלמדנו ביחידת DOM Events!) — היא רק משנה את ה-URL בדפדפן, ו-React Router מרנדרת מחדש **רק** את הקומפוננטה המתאימה ל-Route החדש.

Route matching כ-if/else על ה-URL — `<Routes>` בודקת את ה-URL הנוכחי מול כל `<Route path="...">` שהוגדר, ומרנדרת את ה-`element` של **ההתאמה הראשונה**. `:id` ב-`/tasks/:id` הוא **פרמטר דינמי** — תואם כל ערך (`/tasks/5`, `/tasks/42`...), ו-`useParams()` בתוך `TaskDetails` "קורא" את הערך הספציפי שהיה ב-URL הנוכחי.

useNavigate לניווט תכנותי — לפעמים רוצים לנווט **לא** בתגובה ללחיצה על `<Link>`, אלא כתוצאה מפעולה (כמו `onSubmit` מוצלח בטופס, מיחידת DOM Forms) — `useNavigate()` נותן פונקציה שקוראים לה מתוך קוד רגיל, בלי צורך באלמנט `<Link>` בכלל.

## יתרונות

ניווט בלי רענון עמוד — חוויית משתמש חלקה ומהירה, כמו אפליקציה אמיתית; `:id` דינמי מאפשר URL-ים משמעותיים לכל משאב (`/tasks/5`), לא רק מסך אחד; אפשר "לשתף קישור" ישיר לתוכן ספציפי, בניגוד ל-SPA בלי ניתוב.

## חסרונות

דורש הבנה נוספת מעבר לקומפוננטות רגילות (Route matching, params); ניתוב לא-נכון (path כפול, סדר routes שגוי) יכול לגרום להתנהגות מבלבלת.

## נקודות חשובות למבחן / ראיון עבודה

• `<Link>` מנווט בלי רענון עמוד; `<a>` רגיל מרענן ומאבד את כל ה-state

• `<Route path="..." element={...}>` ממפה נתיב URL לקומפוננטה מסוימת

• `useParams()` קורא פרמטרים דינמיים (כמו `:id`) מה-URL הנוכחי

• `useNavigate()` נותן ניווט תכנותי, לא רק דרך `<Link>`

## טעויות נפוצות

• שימוש ב-`<a href>` רגיל במקום `<Link>` בתוך אפליקציית React — גורם לרענון מיותר ומאבד state

• לשכוח לעטוף את האפליקציה ב-`<BrowserRouter>` — `<Route>`/`<Link>` לא יעבדו כלל בלעדיו

• סדר `<Route>` שגוי (path כללי לפני ספציפי) גורם להתאמה לא-נכונה

## סיכום

React Router נותן ניווט בין "עמודים" בתוך SPA אחד, בלי רענון דפדפן. `<Link to="...">` מחליף `<a>` רגיל; `<Route path="..." element={...}>` ממפה URL לקומפוננטה; `useParams()` קורא פרמטרים דינמיים מה-URL; `useNavigate()` נותן ניווט תכנותי. זה הופך אפליקציית React בודדת לאפליקציית מספר-מסכים אמיתית.

## דוקומנטציה רשמית

[React Router — Official Docs](https://reactrouter.com/en/main)

---

## תרגילים

### תרגיל 1 — ניתוב בסיסי

**המשימה:** הגדירו שני `<Route>` (`/` ו-`/about`), עם `<Link>` בין שניהם.

**בדיקה:** קליק על ה-`<Link>` מחליף את התוכן המוצג, בלי לרענן את הדף (בדקו שה-state של קומפוננטה אחרת בעמוד נשמר).

### תרגיל 2 — פרמטר דינמי

**המשימה:** הגדירו `<Route path="/tasks/:id" element={<TaskDetails />} />`, וקראו את ה-`id` עם `useParams`.

**בדיקה:** ניווט ל-`/tasks/7` מציג "משימה מספר 7"; ניווט ל-`/tasks/12` מציג "משימה מספר 12" — אותה קומפוננטה, פרמטר שונה.

### תרגיל 3 — ניווט תכנותי

**המשימה:** השתמשו ב-`useNavigate` כדי לנווט ל-`/tasks` אוטומטית אחרי שליחת טופס מוצלחת (`onSubmit`).

**בדיקה:** שליחת הטופס מנווטת אוטומטית לעמוד המשימות, בלי לחיצה נוספת על `<Link>`.

---

## פרויקט מסכם

**המשימה:** הפכו את אפליקציית ה-Task (מהשיעורים הקודמים) לאפליקציית מספר-עמודים עם React Router.

**דרישות:**
1. `<Route path="/" element={<TaskList />} />` ו-`<Route path="/tasks/:id" element={<TaskDetails />} />`
2. כל פריט ב-`TaskList` הוא `<Link>` שמנווט לפרטי המשימה שלו
3. `TaskDetails` קוראת את `id` עם `useParams`, ומציגה את המשימה המתאימה (מתוך state/fetch)
4. כפתור "חזרה לרשימה" ב-`TaskDetails` שמשתמש ב-`useNavigate`

**בדיקה:** ניווט בין רשימת המשימות לפרטי משימה ספציפית לא מרענן את העמוד; כתובת ה-URL בדפדפן משתנה בהתאם ומאפשרת שיתוף קישור ישיר.

---

## מה בפרק הבא

בפרק הבא נלמד על **React + Backend Integration** — זהו השיעור המסכם של יחידת ה-React, וכמעט של הקורס כולו: מחברים אפליקציית React מלאה (קומפוננטות, state, hooks, routing) לשרת **אמיתי** — בדיוק אותו שרת Express+DB שבניתם ביחידות השרתים ובסיסי הנתונים.
