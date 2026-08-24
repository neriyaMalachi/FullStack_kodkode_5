---
title: "פרויקט מסכם — Docker"
slug: "110-docker-capstone-project-content"
description: "פרויקט מסכם שבונה Dockerfile רב-שלבי, מריץ אותו יחד עם מסד נתונים דרך docker compose, ומעביר קונפיגורציה דרך קובץ .env — בלי שום ערך קשיח בקוד."
summary: "📖 שיעור"
date: 2026-08-11T00:00:00+02:00
lastmod: 2026-08-11T00:00:00+02:00
draft: false
weight: 1101
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

זהו הפרויקט המסכם של יחידת Docker: לוקחים את הידע מכל שלושת השיעורים — Dockerfile (בניית Image), Docker Compose (הרצת כמה קונטיינרים יחד) — ומוסיפים שלב אחד קדימה: **Dockerfile רב-שלבי (Multi-Stage)** ל-Image קטן ונקי יותר, ו**קובץ `.env`** שמעביר קונפיגורציה ל-Compose בלי לכתוב אף ערך קשיח. שלב הבנייה מתקין את כל התלויות, ושלב הריצה הסופי מעתיק ממנו רק את מה שבאמת צריך — Image קטן יותר, ומשטח-התקפה קטן יותר. זו בדיוק ההגדרה של "מוכן ל-production" בעולם ה-containers.

## מה צריך להיות מוכן בסוף

**דרישות:**
1. Dockerfile רב-שלבי לשרת ה-Node שלכם — שלב בנייה + שלב ריצה קטן (`node:20-alpine`), עם `COPY --from=<שלב הבנייה>` בשלב הסופי
2. `.dockerignore` שחוסם `node_modules`, `.env`, ו-`.git`
3. `docker-compose.yml` עם Service `app` (מה-Dockerfile) ו-Service `db` (`postgres:16` או `mongo:7`), עם `depends_on` ו-`volumes` לשמירת נתונים
4. כל סיסמה/פורט/כתובת מגיעים מקובץ `.env` דרך `${VAR}` — אף ערך קשיח ב-`docker-compose.yml`
5. `.env` מופיע ב-`.gitignore` ואינו מחובר לריפו

**קריטריוני הצלחה:**

• `docker compose up --build` מריץ את שני השירותים בהצלחה, והאפליקציה מגיבה ב-`curl` על הפורט שמוגדר ב-`.env`

• `docker images` מראה שה-Image של ה-`app` קטן משמעותית ממה שהיה בגרסה בשלב-אחד

• שינוי סיסמה ב-`.env` והרצה מחדש של `docker compose up` מעדכנים את שני השירותים בלי לגעת ב-YAML בכלל

• אין שום ערך קשיח (סיסמה, פורט, כתובת) כתוב ישירות ב-`docker-compose.yml`

## דוקומנטציה רשמית מותרת

[Docker Docs — Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)

[Docker Compose — Environment variables](https://docs.docker.com/compose/how-tos/environment-variables/)
