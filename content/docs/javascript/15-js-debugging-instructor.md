---
title: "מערך שיעור: Debugging"
slug: "15-js-debugging-instructor"
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

מטרת השיעור: הסטודנטים יעברו מ"מוסיף console.log ומקווה לטוב" לגישה שיטתית — צמצום מיקום הבאג, שימוש ב-Breakpoints, ו-Call Stack כמפה.

בסוף השיעור הסטודנטים צריכים: להשתמש ב-DevTools Breakpoints במקום console.log, לקרוא Call Stack ולהבין כיצד הגיעו לנקודה מסוימת, ולהשתמש ב-console.table לנתוני API.

דגש קריטי: הדגמה חיה היא לב השיעור. תכלו יותר זמן על DevTools פתוחים עם Breakpoint אמיתי — ופחות על מצגות.

## מהלך השיעור

| חלק בשיעור | משך | הערות ודגשים |
| --- | --- | --- |
| פתיחה וחיבור | 5 דקות | שאלו: "מי מכם הוסיף console.log ואז לא הבין את הפלט?" |
| גוף השיעור — תיאוריה | 20 דקות | console methods, debugger statement, Breakpoints, Call Stack, Watch, Step Over/Into/Out, Network Tab |
| הדגמה חיה | 15 דקות | פתחו DevTools, הכניסו Breakpoint בקוד אמיתי, הראו Step Into, Watch, Call Stack |
| תרגיל חשיבה לאחר המצגת | 5 דקות | מפורט בהמשך המסמך |
| תרגול מעשי | 35 דקות | קוד עם 3 באגים מוסתרים — איתור ותיקון עם Breakpoints בלבד |
| שיתוף וסיכום | 10 דקות | מי מצא את כל הבאגים? כמה console.logs נדרשו? |

## דגשים להעברת השיעור

- console.table — הציגו: console.table(users) במקום console.log(users). impact ויזואלי מיידי.

- Breakpoint ב-DevTools — לחצו על מספר השורה, נקודה אדומה, טענו מחדש, הביצוע נעצר.

- Call Stack — רשימת הפונקציות שקראו אחת לשנייה. LIFO. הראו כשה-debugger עצור.

- Network Tab — כשמשהו לא עובד עם API, פתחו Network Tab ראשון.

- debugger statement — כתבו debugger בקוד, בדיוק כמו Breakpoint. חשוב: להסיר לפני commit.

## מושגים

- **console.log/warn/error:** הדפסת מידע לconsole בסוגי severity שונים.

- **console.table:** הצגת מערך או Object כטבלה.

- **debugger:** מילת מפתח שעוצרת ביצוע ופותחת DevTools.

- **Breakpoint:** נקודת עצירה שמוגדרת ב-DevTools על שורה מסוימת.

- **Call Stack:** מחסנית הפונקציות שנקראו כדי להגיע לנקודה הנוכחית.

- **Watch:** מעקב אחר ביטוי מסוים בזמן ה-debug.

- **Step Over:** ביצוע שורה נוכחית מבלי להיכנס לפונקציה שנקראת בה.

- **Step Into:** כניסה לתוך פונקציה שנקראת בשורה הנוכחית.

- **Network Tab:** כרטיסיה ב-DevTools שמציגה את כל בקשות ה-HTTP.

## תרגיל חשיבה

- **נושא:** איפה הבאג — ובאיזה כלי תמצאו אותו?

- נציג שלושה תרחישי באג: (1) פונקציה מחזירה NaN, (2) API call שלא מגיע, (3) Event Listener שלא מופעל.

- נשאל: "לאיזה כלי תפנו ראשון בכל מקרה?"

- **מהלך:** קריאת התרחישים, דיון על כל בחירה, הדגמה של הדרך הנכונה.

- המדריך יסכם: ראשון Network Tab לבעיות API, ראשון Breakpoint לבעיות לוגיקה, ראשון console.table לבעיות נתונים.
