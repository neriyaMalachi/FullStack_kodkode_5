---
title: "MongoDB Compass"
slug: "52-mongodb-compass-content"
description: "כלי GUI רשמי לצפייה ועריכה חזותית של נתוני MongoDB — בלי לכתוב שאילתות בקוד."
summary: "📖 שיעור"
date: 2026-08-09T00:00:00+02:00
lastmod: 2026-08-09T00:00:00+02:00
draft: false
weight: 521
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

## מה זה?

עד עכשיו כל שאילתת MongoDB נכתבה כקוד (JavaScript/Shell). לפעמים רוצים פשוט **לראות** מה יש ב-collection, לבדוק אם document התעדכן כמו שציפינו, או לתקן ערך אחד ידנית — בלי לכתוב שאילתה בשביל זה. **MongoDB Compass** הוא כלי GUI (ממשק גרפי) רשמי שמתחבר ל-Cluster שלכם (ב-Atlas, בדיוק כמו Table Editor ב-Supabase) ומציג את הנתונים באופן חזותי, עם אפשרות לסנן, לערוך ולמחוק בלי לכתוב קוד.

## מילות מפתח שחשוב לזכור

• GUI (Graphical User Interface) — ממשק חזותי לתפעול, בניגוד לכתיבת פקודות/קוד

• Connection — חיבור שמור ב-Compass ל-Cluster ספציפי, בעזרת אותו Connection String מ-Atlas

• Document View — תצוגת ה-documents ב-collection, עם אפשרות לערוך שדות ישירות בעכבר

• Filter Bar — שדה בראש המסך שבו מקלידים filter (באותו תחביר JavaScript שלמדנו בשיעור MongoDB Basics) כדי לסנן מה מוצג

• Schema Analysis — כלי מובנה שסורק collection ומראה אילו שדות קיימים בפועל ובאיזה אחוז מה-documents — שימושי במיוחד כי MongoDB לא אוכפת Schema קשיח

## הדגמה חיה

<div class="demo-live" style="direction:ltr;border:1px solid #d1d5db;border-radius:10px;padding:1.25rem;margin:1.25rem 0;background:#fafafa;color:#111827;">
<p style="direction:rtl;font-weight:600;margin:0 0 0.9rem;color:#6b7280;font-size:0.85rem;">🔴 מדמה (mock) את מסך Compass — לא כלי אמיתי, רק להמחשה</p>
<div style="background:#1f2937;color:#e5e7eb;border-radius:6px;padding:0.5rem 0.75rem;font-family:monospace;font-size:0.85rem;margin-bottom:0.75rem;">{ priority: { $gte: 3 } }&nbsp;&nbsp;<span style="color:#9ca3af;">← Filter Bar</span></div>
<div style="display:flex;flex-direction:column;gap:6px;">
<div style="background:#fff;border:1px solid #e5e7eb;border-radius:6px;padding:0.5rem 0.75rem;font-family:monospace;font-size:0.8rem;">{ _id: 1, title: "דוח", priority: 5, done: false }</div>
<div style="background:#fff;border:1px solid #e5e7eb;border-radius:6px;padding:0.5rem 0.75rem;font-family:monospace;font-size:0.8rem;">{ _id: 2, title: "מצגת", priority: 4, done: true }</div>
</div>
</div>

## הסבר עיקרי

Compass מדבר באותה שפה כמו הקוד — ה-Filter Bar ב-Compass מקבל בדיוק את אותו תחביר filter שלמדנו בשיעורי MongoDB Basics ו-Operators (`{ done: false }`, `{ priority: { $gte: 3 } }`) — זה לא כלי נפרד עם שפה משלו, אלא ממשק חזותי לאותה שפה בדיוק שכבר מכירים.

Schema Analysis כפתרון לבעיית "בלי Schema קשיח" — בשיעור "רלציוני מול NoSQL" ראינו שהחיסרון של NoSQL הוא שקל ליצור documents לא-עקביים בלי לשים לב. Schema Analysis של Compass סורק את כל ה-collection ומראה, למשל, שרק חלק מה-documents כוללים שדה מסוים — נותן נראות למבנה בפועל, גם בלי Schema שאוכף אותו.

מתי GUI ומתי קוד — Compass מצוין לבדיקה מהירה, ניפוי שגיאות ("למה ה-document הזה לא מתעדכן?"), ותיקון ידני חד-פעמי. אבל לוגיקה שחוזרת על עצמה (כמו מה ששרת Express מריץ בכל בקשה) חייבת להיות בקוד — Compass הוא כלי עזר, לא תחליף לקוד השרת.

## יתרונות

צפייה ועריכה מהירה של נתונים בלי לכתוב שאילתה; Schema Analysis נותן נראות למבנה בפועל של collection ללא Schema קשיח; אותו תחביר filter כמו בקוד — לא צריך ללמוד שפה נפרדת.

## חסרונות

לא מתאים ללוגיקה שחוזרת על עצמה (כמו קוד שרת) — רק לבדיקה/עריכה חד-פעמית; עריכה ידנית ישירה ב-production מסוכנת (בלי code review, בלי היסטוריה) אם לא זהירים.

## נקודות חשובות

• Compass הוא כלי GUI רשמי ל-MongoDB, מקביל מבחינה תפקודית ל-Table Editor של Supabase

• ה-Filter Bar משתמש באותו תחביר filter כמו בקוד (`find()`), לא שפה נפרדת

• Schema Analysis מראה אילו שדות קיימים בפועל ב-collection, גם בלי Schema קשיח

• Compass מתחבר עם אותו Connection String של ה-Cluster מ-Atlas

## טעויות נפוצות

• להתייחס ל-Compass כתחליף לכתיבת קוד שרת, במקום ככלי עזר לבדיקה וניפוי שגיאות

• עריכה ידנית של נתוני production ב-Compass בלי גיבוי, ולגלות אחר כך שהיה צריך את הנתון המקורי

• לשכוח שהשינויים ב-Compass הם **אמיתיים** ומיידיים על ה-Cluster — אין "בטל שינויים" גלובלי

## סיכום

MongoDB Compass הוא כלי GUI רשמי לצפייה, סינון ועריכה חזותית של נתוני MongoDB, מקביל ל-Table Editor של Supabase. ה-Filter Bar משתמש באותו תחביר filter כמו הקוד; Schema Analysis נותן נראות למבנה ה-collection בפועל. שימושי לבדיקה מהירה ותיקון ידני — לא תחליף ללוגיקת שרת בקוד.

## דוקומנטציה רשמית

[MongoDB Compass — Official Docs](https://www.mongodb.com/docs/compass/current/)

---

## תרגילים

### תרגיל 1 — התחברות

**המשימה:** התקינו את Compass והתחברו ל-Cluster שהקמתם בשיעור Atlas, בעזרת ה-Connection String.

**בדיקה:** Compass מציג את רשימת ה-databases שב-Cluster, כולל ה-database `course` שיצרתם.

### תרגיל 2 — סינון עם Filter Bar

**המשימה:** ב-collection `tasks`, הקלידו ב-Filter Bar את אותו filter מתרגיל MongoDB Operators (`{ priority: { $gte: 3 } }`).

**בדיקה:** Compass מציג רק documents עם `priority` 3 ומעלה — אותה תוצאה כמו כשהרצתם את זה בקוד.

### תרגיל 3 — עריכה ישירה

**המשימה:** ערכו ידנית (בעכבר, בלי קוד) את הערך של `done` באחד ה-documents.

**בדיקה:** הרצת `find()` בקוד (או ב-mongosh) אחרי העריכה מציגה את הערך המעודכן — הוכחה שהשינוי ב-Compass השפיע על אותו Cluster.

---

## פרויקט מסכם

**המשימה:** השתמשו ב-Compass לבדוק ולתעד את מצב ה-collection `tasks` שבניתם.

**דרישות:**
1. Schema Analysis על `tasks` — תעדו (בכתיבה) אילו שדות קיימים ובאיזה אחוז מה-documents
2. סננו עם Filter Bar את כל המשימות הלא-גמורות בעדיפות גבוהה, וספרו כמה יש
3. תקנו ידנית (בעכבר) לפחות document אחד עם ערך שגוי/חסר
4. אמתו את התיקון בעזרת שאילתת קוד (`find`) בנפרד מ-Compass

**בדיקה:** התיעוד כולל את רשימת השדות ואחוזי ההופעה שלהם; שאילתת האימות בקוד מציגה את הערך המתוקן.

---

## מה בפרק הבא

בפרק הבא נלמד על **Mongoose (ODM)** — Mongoose הוא ODM (Object Document Mapper) ל-MongoDB ב-Node.js — הוא עוטף את ה-Native Driver ומוסיף שכבת Schema, Validation, ו-API נוח שמחזיר Promises. הבעיה שנפתרת: Native Driver לבדו לא אוכף מבנה או 
