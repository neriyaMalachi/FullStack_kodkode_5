---
title: "פרויקט מסכם — Testing"
slug: "111-testing-capstone-project-content"
description: "פרויקט מסכם שכותב שלוש שכבות בדיקה על אותו קוד — Unit, Server Unit עם Mocks, ו-Integration — ומראה מתי כל אחת מתאימה."
summary: "📖 שיעור"
date: 2026-08-11T00:00:00+02:00
lastmod: 2026-08-11T00:00:00+02:00
draft: false
weight: 1111
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

זהו הפרויקט המסכם של יחידת Testing: כותבים **שלוש שכבות בדיקה** על אותו קוד בדיוק — Unit Tests על פונקציות טהורות, Server Unit Testing עם Mocks על לוגיקה עסקית מבודדת מה-DB, ו-Integration Testing שמריץ שרת אמיתי ושולח בקשת HTTP אמיתית.

שלוש השכבות ביחד נותנות ביטחון גם בלוגיקה הטהורה, גם בהתנהגות עם תלויות מבודדות, וגם בחיבור האמיתי בין כל החלקים — וזו בדיוק פירמידת הבדיקות שמשמשת פרויקטים אמיתיים: בסיס רחב ומהיר של Unit Tests, וקומץ Integration Tests שמכסים את הנתיבים הקריטיים ביותר. המטרה של הפרויקט: להרגיש בפועל למה כל שכבה קיימת, ולמה אף אחת מהן לא "מספיקה" לבד.

## מה צריך להיות מוכן בסוף

**דרישות:**
1. **Unit Tests** — לפחות 3 בדיקות על פונקציית ולידציה טהורה (כמו `isValidTask`), בלי שום תלות חיצונית
2. **Server Unit Tests** — לפחות 3 בדיקות על `taskService`, עם `fakeRepo` מבוסס `mock.fn()`, כולל בדיקה שמוודאת שה-Repository **לא** נקרא כשהוולידציה נכשלת
3. **Integration Tests** — לפחות 2 בדיקות שמריצות את שרת ה-Express האמיתי מיחידת Server ושולחות בקשת HTTP אמיתית (למשל `POST /tasks` ואז `GET /tasks/:id`), כולל ניקוי (teardown) הנתונים בסוף כל בדיקה
4. כל שלוש הסוויטות רצות בהצלחה יחד עם `node --test`

**קריטריוני הצלחה:**

• `node --test` מריץ את כל שלוש השכבות ומדווח "0 failing"

• זמן הריצה הכולל של ה-Unit וה-Server Unit Tests יחד הוא שברירי שנייה

• ה-Integration Tests באמת יוצרים ומוחקים נתונים אמיתיים (ניתן לוודא בלוגים או ב-DB עצמו), לא רק "מדמים" זאת

• בדיקת ה-Server Unit שבודקת קלט לא-תקין מוודאת גם שה-Repository המדומה לא נקרא בכלל, לא רק שהפונקציה זרקה שגיאה

## דוקומנטציה רשמית מותרת

[Node.js — Test Runner](https://nodejs.org/api/test.html)

[Martin Fowler — Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
