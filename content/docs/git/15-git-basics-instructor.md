---
title: "מערך שיעור: Git — יסודות"
slug: "15-git-basics-instructor"
description: "משך: 2 שעות אקדמיות (90 דקות)."
summary: "📋 מערך מרצה"
date: 2026-08-06T00:00:00+02:00
lastmod: 2026-08-06T00:00:00+02:00
draft: false
weight: 150
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

משך: 2 שעות אקדמיות (90 דקות).

מטרת השיעור: הסטודנטים יבינו שGit הוא לא כלי "גיבוי" — אלא מערכת שמאפשרת לעבוד בביטחון: לנסות, לשנות, לחזור, ולשתף — מבלי לפחד.

בסוף השיעור הסטודנטים צריכים: לבצע את ה-workflow הבסיסי (init → add → commit → log), להגדיר .gitignore נכון, ולדעת לבטל שינויים בבטחה.

דגש קריטי: Git הוא עיסוק מוטורי — לא תיאוריה. כל הסבר חייב להיות מלווה בהדגמה מיידית במסוף. git status הוא הפקודה הכי חשובה.

## מהלך השיעור

| חלק בשיעור | משך | הערות ודגשים |
| --- | --- | --- |
| פתיחה וחיבור | 5 דקות | שאלו: "מי מכם איבד עבודה כי מחק קובץ בטעות?" ואז: "מי שמר 5 גרסאות של final_v3_FINAL.js?" |
| גוף השיעור — תיאוריה | 20 דקות | 3 האזורים, הפקודות הבסיסיות, .gitignore, ביטול שינויים |
| הדגמה חיה | 20 דקות | init → add → commit → log — הכל בפועל במסוף |
| תרגיל חשיבה לאחר המצגת | 5 דקות | מפורט בהמשך המסמך |
| תרגול מעשי | 30 דקות | כל סטודנט מאתחל repo, עורך קבצים, עושה commits |
| שיתוף וסיכום | 10 דקות | הצגת log — מי עשה הכי הרבה commits עם הודעות ברורות? |

## דגשים להעברת השיעור

- git status — הפקודה שהסטודנטים ירוצו הכי הרבה. לפני כל add, אחרי כל add, לפני כל commit.

- 3 האזורים — ציירו על הלוח: Working Directory → Staging Area → Repository.

- .gitignore — צרו ראשון, לפני ה-commit הראשון. node_modules ו-.env תמיד שם.

- Commit messages — הודעת commit היא מכתב לעצמכם ולצוות. "fix" לא אומר כלום.

- git restore ו-git restore --staged — שתי פקודות שונות, סכנה שונה.

## מושגים

- **Repository:** מאגר Git שמכיל את היסטוריית כל ה-commits.

- **Working Directory:** הקבצים במחשב — המצב הנוכחי, לפני add.

- **Staging Area:** אזור ביניים — קבצים שנוספו ל-commit הבא אך טרם committed.

- **Commit:** snapshot מוגמר עם timestamp, message, ו-hash ייחודי.

- **git add:** העברת שינויים מWorking Directory ל-Staging Area.

- **git restore:** ביטול שינויים ב-Working Directory (מסוכן).

- **git restore --staged:** הוצאת קובץ מ-Staging Area (בטוח).

- **.gitignore:** קובץ שמגדיר אילו קבצים Git לא יעקוב אחריהם.

## תרגיל חשיבה

- **נושא:** מה נמצא בכל אזור?

- נציג sequence: עורכים קובץ A, עורכים קובץ B, מבצעים git add A. שואלים: "מה נמצא ב-Working/Staging/Repository?"

- נוסיף: "אם עכשיו git commit — מה נשמר?"

- **מהלך:** ציור 3 האזורים על הלוח, ניתוח ה-sequence שלב אחר שלב, ניחוש קבוצתי.

- המדריך יסכם: "Staging פועל כ-draft. commit הוא רק מה שב-Staging. קובץ B ישאר ב-Working Directory."
