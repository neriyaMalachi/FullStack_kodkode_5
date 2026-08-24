---
title: "פרויקט מסכם — Git"
slug: "107-git-capstone-project-content"
description: "פרויקט מסכם שמחבר יחד repository מקומי, GitHub מרוחק, ענפים, ומיזוג עם קונפליקט — זרימת עבודה אמיתית מקצה לקצה."
summary: "📖 שיעור"
date: 2026-08-11T00:00:00+02:00
lastmod: 2026-08-11T00:00:00+02:00
draft: false
weight: 1071
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

זהו הפרויקט המסכם של יחידת Git: לא פקודה חדשה, אלא **זרימת עבודה מלאה** שמחברת את כל מה שנלמד — repository מקומי (Basics), remote ב-GitHub עם Pull Request (GitHub), וענף נפרד עם מיזוג שכולל קונפליקט אמיתי (Branches & Merge) — בדיוק כמו שעובדים על פרויקט אמיתי בעבודה, מההתחלה ועד הסוף. Pull Request הוא שכבה מעל `git merge` הרגיל, לא מנגנון שונה במהותו — וקונפליקט נפתר באותו אופן בין אם הוא קרה מקומית או דרך ממשק GitHub.

## מה צריך להיות מוכן בסוף

**דרישות:**
1. Repository ב-GitHub, מחובר לעותק מקומי (בין אם נוצר מקומית ונדחף, או שוכפל מ-GitHub)
2. קובץ במאגר עם ערך שנוצר ונדחף ל-`main`
3. ענף נפרד שמשנה את אותו ערך, נדחף ל-GitHub, ונפתח לו Pull Request
4. קונפליקט אמיתי: אותה שורה שונתה גם ב-`main` וגם בענף, לפני שהענף מוזג
5. פתרון הקונפליקט (מקומית או דרך ממשק GitHub) עם commit ברור, ומיזוג סופי לתוך `main`
6. מחיקת הענף שכבר מוזג, גם מקומית וגם ב-GitHub

**קריטריוני הצלחה:**

• הקובץ ב-`main` (גם מקומית וגם ב-GitHub) מכיל ערך יחיד וסופי, בלי סימוני קונפליקט (`<<<<`/`====`/`>>>>`)

• `git log --oneline` מראה את כל ה-commits, כולל commit ייעודי לפתרון הקונפליקט

• הענף שמוזג כבר לא קיים — לא מקומית ולא ב-GitHub

• `git switch main && git pull` מקומית מציג את התוצאה הסופית הנכונה, זהה למה שרואים ב-GitHub

## דוקומנטציה רשמית מותרת

[GitHub Docs — About Pull Requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)

[Git Docs — git-merge](https://git-scm.com/docs/git-merge)
