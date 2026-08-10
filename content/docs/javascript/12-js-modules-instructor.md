---
title: "מערך שיעור: Modules (ES Modules)"
slug: "12-js-modules-instructor"
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

מטרת השיעור: הסטודנטים יבינו שפרויקטים מודרניים לא כותבים קוד בקובץ אחד — כל קובץ הוא Module עצמאי עם ייצוא מוגדר, ויידעו לכתוב Named Exports, Default Exports, ו-Barrel Files.

בסוף השיעור הסטודנטים צריכים: לכתוב Named ו-Default exports ולייבא אותם נכון, לארגן קבצים ב-Barrel File, ולהבין למה Tree Shaking מועדף ביחס ל-import*.

דגש קריטי: הנושא הוא ארגון קוד — לא סינטקס. Named exports מועדפים כי IDE יודע לאוטוקמפלט. Default exports גורמים לאי-עקביות בשמות.

## מהלך השיעור

| חלק בשיעור | משך | הערות ודגשים |
| --- | --- | --- |
| פתיחה וחיבור | 5 דקות | שאלו: "מה קורה כשכל הקוד בקובץ אחד ב-1000 שורות?" |
| גוף השיעור — תיאוריה | 25 דקות | Named Export/Import, Default Export, Barrel Files, Dynamic Import, הבדל ESM ל-CommonJS |
| תרגיל חשיבה לאחר המצגת | 10 דקות | מפורט בהמשך המסמך |
| תרגול מעשי | 40 דקות | פיצול קוד קיים לקבצים, כתיבת Barrel File, ייבוא נכון |
| שיתוף וסיכום | 10 דקות | הצגת תוצרים |

## דגשים להעברת השיעור

- Named vs Default — Named: המייבא חייב לדעת את השם המדויק. Default: המייבא בוחר שם כרצונו — זה גורם לחוסר עקביות בצוות.

- Barrel File — index.js שמרכז ייצואים מאפשר import קצר. נפוץ ב-React.

- Tree Shaking — כשמייבאים רק מה שצריך, ה-bundler יכול להסיר את השאר. import * as מונע זאת.

- CommonJS vs ESM — Node.js גדל עם require(). ES Modules הוא הסטנדרט המודרני.

- Circular Imports — אזכירו כסכנה: שני קבצים שמייבאים זה מזה גורם לבאגים קשים לאיתור.

## מושגים

- **Module:** כל קובץ JavaScript הוא Module עצמאי — משתנים לא דולפים לScope גלובלי.

- **Named Export:** ייצוא מפורש בשם — export const fn = .... יכולים להיות כמה בקובץ אחד.

- **Default Export:** ייצוא ראשי — export default fn. אחד בלבד לקובץ.

- **Named Import:** import { fn, utils } from "./file" — חייב להתאים בשם.

- **Barrel File:** קובץ index.js שמרכז ייצואים ממספר קבצים.

- **Tree Shaking:** הסרת קוד שלא בשימוש ע"י ה-bundler — עובד רק עם Named Imports.

- **Dynamic Import:** await import("./module") — טעינה lazy בזמן ריצה.

## תרגיל חשיבה

- **נושא:** ממה בנוי הimport הזה?

- נציג שלוש שורות import שונות ונשאל מה כל אחת מייבאת ואיזה סוג Export נדרש בקובץ המקור.

- נוסיף שורה עם import * as utils ונשאל: "מה החסרון כאן בהשוואה ל-Named Import?"

- **מהלך:** ניתוח כל שורה, הבנת מה קורה מאחורי הקלעים, דיון על ארגון קוד.

- המדריך יראה שעקביות בסגנון הייצוא מקלה על כל חברי הצוות.
