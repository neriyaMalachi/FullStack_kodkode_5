---
title: "פרויקט מסכם — בסיסי נתונים"
slug: "109-db-capstone-project-content"
description: "פרויקט מסכם שמעצב את אותו תחום נתונים פעמיים — פעם רלציונית עם SQL, פעם עם MongoDB ו-Mongoose — כדי להבין באמת מתי לבחור מה."
summary: "📖 שיעור"
date: 2026-08-11T00:00:00+02:00
lastmod: 2026-08-11T00:00:00+02:00
draft: false
weight: 1091
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

זהו הפרויקט המסכם של יחידת בסיסי הנתונים: לא טכנולוגיה חדשה, אלא **אותו תחום נתונים בדיוק** — פלטפורמת בלוג קטנה עם משתמשים, פוסטים ותגובות — מעוצב **פעמיים**: פעם כסכימה רלציונית ב-SQL (עם Foreign Keys ו-JOIN), ופעם כמסמכי MongoDB עם Mongoose. המטרה: להרגיש בעצמכם את ההבדל בין השתיים, לא רק לקרוא עליו — ולתרגל בחירה מודעת בין Embedding (נתונים מוטמעים בתוך document) ל-Referencing (הפניה, כמו FK) לפי דפוס הקריאה בפועל, לא רק לפי מבנה הנתונים.

## מה צריך להיות מוכן בסוף

**דרישות — גרסה רלציונית:**
1. טבלאות `users`, `posts`, `comments`, עם Foreign Keys נכונים (`posts.user_id`, `comments.post_id`, `comments.user_id`)
2. שאילתת `JOIN` שמחזירה כל פוסט עם שם הכותב שלו
3. שאילתת `JOIN` נוספת (עם שתי טבלאות נוספות) שמחזירה כל תגובה עם שם הפוסט ושם כותב התגובה

**דרישות — גרסה MongoDB + Mongoose:**
1. `User` Schema ו-`Post` Schema, כאשר `Post` מחזיק `author` כ-Reference ל-`User`
2. תגובות **מוטמעות** כמערך בתוך `Post` (לא collection נפרד) — נמקו למה זו בחירה סבירה כאן
3. שאילתה עם `.populate("author")` שמחזירה פוסט מלא עם פרטי הכותב, לא רק ID

**קריטריוני הצלחה:**

• בגרסה הרלציונית, שתי שאילתות ה-JOIN מחזירות שמות אמיתיים (לא IDs) לצד הנתונים הרלוונטיים

• בגרסת MongoDB, `Post.find().populate("author")` מחזיר אובייקט `author` מלא (`name`/`email`), לא ID גולמי

• התגובות מופיעות כמערך מוטמע בתוך document הפוסט, בלי query נוסף כדי להביא אותן

• כל Foreign Key בגרסה הרלציונית אכן אוכף קשר לשורה קיימת (אי אפשר להכניס `user_id` שלא קיים)

## דוקומנטציה רשמית מותרת

[PostgreSQL — Joins](https://www.postgresql.org/docs/current/tutorial-join.html)

[Mongoose — Populate](https://mongoosejs.com/docs/populate.html)

[Mongoose — Schemas](https://mongoosejs.com/docs/guide.html)
