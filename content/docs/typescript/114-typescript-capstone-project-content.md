---
title: "פרויקט מסכם — TypeScript"
slug: "114-typescript-capstone-project-content"
description: "פרויקט מסכם שממיר את פרויקט קטלוג הספרים מיחידת JavaScript ל-TypeScript מלא, עם interfaces וטיפוסים על כל פונקציה."
summary: "📖 שיעור"
date: 2026-08-11T00:00:00+02:00
lastmod: 2026-08-11T00:00:00+02:00
draft: false
weight: 1141
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

זהו הפרויקט המסכם של יחידת TypeScript: לוקחים את פרויקט "מנהל קטלוג הספרים" מהפרויקט המסכם של יחידת JavaScript — שלושה מודולים, Factory Function, Closure, `async`/`await` — וממירים אותו **במלואו** ל-TypeScript. לא קוד חדש, אלא הוספת שכבת טיפוסים על קוד שכבר עובד: `interface` לכל צורת נתונים חוזרת, טיפוסי פרמטרים והחזרה מפורשים על כל פונקציה, ו-`Promise<T>` על כל פונקציית `async`.

ההמרה לא משנה איך הקוד מתנהג בזמן ריצה — היא מוסיפה שכבת בדיקה שתופסת בדיוק את סוג הטעויות (שדה חסר, שם שדה שגוי) שהיו "עוברות בשקט" בגרסה המקורית של JavaScript, ומתגלות רק כשמישהו מנסה להשתמש בשדה החסר בזמן ריצה. השוואת "לפני ואחרי" (JS מול TS על אותו קוד) היא הדרך הכי ברורה להראות בפועל למה טיפוסים שווים משהו.

## מה צריך להיות מוכן בסוף

**דרישות:**
1. `interface RawWork` לתיאור הנתונים הגולמיים המתקבלים מה-API החיצוני
2. `interface Book` לתיאור אובייקט הספר המעובד, כולל מתודת `view()`
3. `createBook` מקבל פרמטר מטיפוס `RawWork` ומחזיר `Book`, עם טיפוסים מפורשים על הפרמטר ועל ההחזרה
4. `fetchBooksBySubject` מסומנת עם טיפוס החזרה `Promise<RawWork[]>`
5. `tsc` רץ על שלושת הקבצים ומקמפל בלי שגיאות בגרסה התקינה
6. שבירה מכוונת של טיפוס אחד (למשל העברת `RawWork` בלי `title`) מתועדת יחד עם הודעת השגיאה המדויקת שהתקבלה מ-`tsc`

**קריטריוני הצלחה:**

• `tsc` מקמפל את כל הפרויקט בלי שגיאות בגרסה התקינה

• השגיאה המכוונת שנוצרה מצביעה בדיוק על השדה החסר ועל השורה הרלוונטית בקוד

• הקוד המקומפל (`.js`) רץ ומתנהג זהה לחלוטין לגרסת ה-JavaScript המקורית מהפרויקט הקודם

• כל פונקציית `async` בקוד מסומנת עם טיפוס החזרה עטוף ב-`Promise<...>`, לא בטיפוס "החשוף" בלבד

## דוקומנטציה רשמית מותרת

[TypeScript — Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)

[TypeScript — Async/Await](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html)
