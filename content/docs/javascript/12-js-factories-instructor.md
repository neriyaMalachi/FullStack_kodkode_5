---
title: "מערך שיעור: Factory Functions"
slug: "12-js-factories-instructor"
description: "משך: 2 שעות אקדמיות (90 דקות)."
summary: "📋 מערך מרצה"
date: 2026-08-06T00:00:00+02:00
lastmod: 2026-08-06T00:00:00+02:00
draft: false
weight: 120
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

מטרת השיעור: הסטודנטים יבינו שFactory Function היא הדרך הפשוטה ביותר ליצור Objects עם לוגיקה ומצב פרטי — ללא Class, ללא this, ללא prototype.

בסוף השיעור הסטודנטים צריכים: לכתוב Factory Function שמחזירה Object עם מתודות, לשלב Closure ליצירת Private State, ולהבין מתי Factory עדיפה על Class.

דגש קריטי: Factory Functions הן הגשר הטבעי בין Closures ל-OOP. אל תכנסו ל-new, this, ו-prototype — אלה נושא שיעור Classes.

## מהלך השיעור

| חלק בשיעור | משך | הערות ודגשים |
| --- | --- | --- |
| פתיחה וחיבור | 5 דקות | שאלו: "איך יוצרים 50 משתמשים שכל אחד מהם Object עם מתודות?" |
| גוף השיעור — תיאוריה | 25 דקות | Factory בסיסית, Factory עם Private State (Closure), השוואה לObject Literal, מתי Factory עדיפה |
| תרגיל חשיבה לאחר המצגת | 10 דקות | מפורט בהמשך המסמך |
| תרגול מעשי | 40 דקות | כתיבת makeUser, makeCounter, makeCart — כל אחת עם מתודות ו-Private State |
| שיתוף וסיכום | 10 דקות | הצגת תוצרים |

## דגשים להעברת השיעור

- הדגישו שFactory הוא פונקציה רגילה לחלוטין: אין מילת קסם.

- Private State — הדגימו שאי-אפשר לגשת ל-count ישירות מחוץ לפונקציה. זה Closure שלמדנו בשיעור הקודם.

- Shorthand Properties — כשהמפתח והמשתנה נקראים אותו דבר, אפשר לכתוב רק שם אחד.

- הדגישו את יתרון ה-Factory על Object Literal: Object Literal הוא עותק אחד, Factory יוצרת כמה שרוצים.

- אל תכנסו ל-prototype — Classes נושא הבא.

## מושגים

- **Factory Function:** פונקציה רגילה שמחזירה Object חדש בכל קריאה — ללא new, ללא this.

- **Private State:** משתנה שמוגדר בתוך Factory ואינו חשוף ישירות.

- **Shorthand Property:** כשמפתח ה-Object ושם המשתנה זהים — { name } במקום { name: name }.

- **Closure בFactory:** כל קריאה ל-Factory יוצרת Scope חדש ועצמאי.

- **Method Shorthand:** כתיבת פונקציה כמתודה ב-Object.

## תרגיל חשיבה

- **נושא:** כמה Factories יש לנו וכמה מצבים?

- נציג Factory שיוצרת Counter, ואז שתי קריאות שיוצרות שני Counters נפרדים.

- נשאל: "מה ה-value של כל Counter? האם הם משפיעים זה על זה?"

- **מהלך:** הצגת הקוד, ניחוש + נימוק, הרצה, הסבר ש-Closure = Scope נפרד לכל קריאה.

- המדריך יחבר: "כשתלמדו React — כל Component הוא כמו Factory Call. State שלו פרטי. זה Closure."
