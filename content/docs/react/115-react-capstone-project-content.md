---
title: "פרויקט מסכם — React"
slug: "115-react-capstone-project-content"
description: "פרויקט מסכם שבונה אפליקציית Task Manager מלאה עם React — קומפוננטות, state, hooks, Context, Routing, וחיבור לשרת אמיתי, הכל יחד."
summary: "📖 שיעור"
date: 2026-08-11T00:00:00+02:00
lastmod: 2026-08-11T00:00:00+02:00
draft: false
weight: 1151
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

זהו הפרויקט המסכם של יחידת React — הגדול והמקיף ביותר בקורס עד כה: אפליקציית **Task Manager** מלאה, מרובת-עמודים, שמשלבת את **כל שלושה-עשר** השיעורים ביחידה — Components, State, Lists & Conditional Rendering, useRef, useEffect, Context API, Custom Hooks, Error Boundaries, State Management, Performance, Routing, ו-Backend Integration — לכדי אפליקציה אחת שרצה מול שרת ה-Express האמיתי מהפרויקט המסכם של יחידת Server. Custom Hook מפריד "מה מוצג" מ"איך משיגים את הנתונים", Routing הופך את זה ל"אפליקציה" אמיתית עם כמה מסכים, Context משתף מידע רחב בלי Prop Drilling, ו-Error Boundary נותן חוסן מול קריסות רינדור.

## מה צריך להיות מוכן בסוף

**דרישות:**
1. `useTasks` — Custom Hook שמושך משימות מהשרת האמיתי, עם טיפול מלא ב-loading/error/success
2. שני עמודים לפחות עם React Router: רשימת משימות (`/`) ופרטי משימה בודדת (`/tasks/:id`)
3. Context אחד לפחות (למשל ערכת נושא בהיר/כהה) שזמין לכל האפליקציה
4. Error Boundary שעוטף את אזור התוכן הראשי
5. `React.memo` על קומפוננטת כרטיס משימה, כדי למנוע רינדור מיותר כש-state אחר משתנה
6. חיבור אמיתי לשרת — לא נתונים מדומים — עם `VITE_API_URL` מ-Environment Variable

**קריטריוני הצלחה:**

• רשימת המשימות נטענת מהשרת האמיתי ומוצגת נכון

• לחיצה על משימה מנווטת ל-`/tasks/:id` בלי רענון עמוד, ומציגה פרטים מלאים

• כיבוי השרת זמנית מציג מצב `error` ברור, לא מסך ריק או תקוע

• הוספת/מחיקת משימה משפיעה בפועל על השרת, ורענון מלא של העמוד עדיין מציג את השינוי

• קריסת רינדור בכרטיס משימה בודד (למשל שדה `undefined`) לא מפילה את שאר האפליקציה

## דוקומנטציה רשמית מותרת

[React — Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

[React Router — Official Docs](https://reactrouter.com/)

[React — Context](https://react.dev/learn/passing-data-deeply-with-context)
