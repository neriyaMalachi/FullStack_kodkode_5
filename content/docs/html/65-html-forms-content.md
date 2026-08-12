---
title: "HTML Forms"
slug: "65-html-forms-content"
description: "איך משתמש שולח מידע לשרת — שדות קלט, תוויות ותקינות בסיסית, עוד לפני JavaScript."
summary: "📖 שיעור"
date: 2026-08-09T00:00:00+02:00
lastmod: 2026-08-09T00:00:00+02:00
draft: false
weight: 651
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

לאורך יחידת השרתים, כל בקשת `POST`/`PUT` שראינו נשלחה מקוד (`fetch`). אבל **משתמש אמיתי** לא כותב קוד — הוא ממלא שדות בטופס ולוחץ כפתור. **HTML Forms** הם המנגנון המובנה לכך: `<form>` עם שדות קלט (`<input>`, `<textarea>`...) שאוספים מידע מהמשתמש, ושולחים אותו לשרת — הכל בלי אפילו שורת JavaScript אחת (למרות שבפועל, כמעט תמיד נשלב JavaScript בהמשך הקורס).

## מילות מפתח שחשוב לזכור

• `<form>` — האלמנט העוטף שמגדיר טופס, כולל **לאן** (`action`) ו**איך** (`method`) לשלוח את הנתונים

• `<input type="...">` — שדה קלט בודד; ה-`type` קובע את סוג הקלט: `text`, `email`, `password`, `number`, `checkbox` ועוד

• `<label>` — תווית טקסט שמסבירה מה שדה קלט אמור להכיל; `for` מחבר אותה ל-`id` של השדה

• `required` — Attribute שגורם לדפדפן **לחסום שליחה** אם השדה ריק — Validation בסיסי, בלי קוד

• `<button type="submit">` — כפתור ששולח את הטופס

```html
<form action="/register" method="POST">
  <label for="name">שם:</label>
  <input type="text" id="name" name="name" required />

  <label for="email">אימייל:</label>
  <input type="email" id="email" name="email" required />

  <button type="submit">הרשמה</button>
</form>
```

## הדגמה חיה

<div class="demo-live" style="direction:rtl;border:1px solid #d1d5db;border-radius:10px;padding:1.25rem;margin:1.25rem 0;background:#fafafa;color:#111827;">
<p style="font-weight:600;margin:0 0 0.9rem;color:#6b7280;font-size:0.85rem;">🔴 הדגמה חיה — נסו ללחוץ "הרשמה" בלי למלא שדה, ואז עם label (לחצו על הטקסט "שם:")</p>
<style>
.demo-form label{display:inline-block;width:70px;font-weight:600;}
.demo-form input{border:1px solid #9ca3af;border-radius:6px;padding:0.4rem 0.6rem;margin-bottom:0.6rem;}
.demo-form button{background:#2563eb;color:#fff;border:none;border-radius:6px;padding:0.5rem 1.2rem;font-weight:700;cursor:pointer;}
</style>
<form class="demo-form" onsubmit="event.preventDefault(); this.querySelector('.demo-form-result').textContent='✓ הטופס תקין! (לא נשלח באמת, זו רק הדגמה)';">
<div><label for="demo-form-name">שם:</label><input type="text" id="demo-form-name" name="name" required /></div>
<div><label for="demo-form-email">אימייל:</label><input type="email" id="demo-form-email" name="email" required /></div>
<button type="submit">הרשמה</button>
<p class="demo-form-result" style="margin:0.6rem 0 0;font-size:0.85rem;color:#059669;font-weight:600;"></p>
</form>
</div>

## הסבר עיקרי

label ו-for/id כחיבור נגיש — `<label for="name">` מחובר ל-`<input id="name">` דרך ה-`id` המשותף. זה לא רק "נחמד" — זה נותן שני יתרונות מוחשיים: (1) לחיצה על הטקסט של ה-label ממקדת אוטומטית את השדה, ו-(2) קורא מסך מקריא את ה-label כשהמשתמש מגיע לשדה — בלעדיו, המשתמש העיוור לא יודע מה השדה אמור להכיל.

action ו-method כ"כתובת ופועל" — בדיוק כמו ש-`fetch(url, { method: "POST" })` שכבר מכירים משיעור Fetch API שולח בקשה ל-URL עם method מסוים, `<form action="/register" method="POST">` עושה בדיוק את אותו הדבר — אבל **הדפדפן עצמו** בונה ושולח את הבקשה, כולל כל שדות הטופס כ-body, בלי JavaScript בכלל.

required כ-Validation בלי קוד — `required` הוא הצורה הפשוטה ביותר של Validation (זוכרים `required` ב-Mongoose Schema? זה בדיוק אותו רעיון, אבל בצד הלקוח): הדפדפן **חוסם** שליחת הטופס ומציג הודעה, אם השדה ריק — לפני שהבקשה אפילו נשלחת לשרת. זה שיפור חוויית משתמש (משוב מיידי), אבל **לא תחליף** ל-Validation בצד השרת (זוכרים Validation עם Zod, ביחידת השרתים?) — משתמש זדוני יכול לעקוף Validation בצד הלקוח בקלות.

## יתרונות

שליחת נתונים מובנית בדפדפן, בלי JavaScript נדרש; `label` נותן נגישות ונוחות שימוש (קליק על הטקסט ממקד את השדה); `required` נותן משוב מיידי למשתמש, לפני שליחה מיותרת לשרת.

## חסרונות

Validation בצד הלקוח (`required` וכו') **לעולם** לא מספיק לבד — חובה Validation גם בשרת; חוויית שליחת טופס "רגילה" (בלי JavaScript) גורמת לרענון עמוד מלא — לרוב רוצים למנוע זאת עם JavaScript (`fetch`, בהמשך הקורס).

## נקודות חשובות למבחן / ראיון עבודה

• `<form action="..." method="...">` קובע לאן ואיך לשלוח נתונים

• `<label for="id">` מחובר ל-`<input id="...">` — קריטי לנגישות ולנוחות שימוש

• `required` חוסם שליחה אם שדה ריק — Validation בצד הלקוח, לא תחליף ל-Validation בשרת

• `type` על `<input>` קובע את סוג הקלט (`text`, `email`, `password`, `number`...) ומשפיע גם על מקלדת מובייל שמוצגת

## טעויות נפוצות

• `<input>` בלי `<label>` מחובר — משתמש עם קורא מסך לא יודע מה השדה אמור להכיל

• להסתמך רק על `required`/Validation בצד הלקוח בלי Validation בשרת — ניתן לעקיפה בקלות

• שכחת `name` על `<input>` — בלעדיו, הערך של השדה **לא נשלח בכלל** לשרת

## סיכום

HTML Forms אוספים קלט ממשתמש ושולחים אותו לשרת, דרך `<form action="..." method="...">` ושדות `<input>`. `<label>` מחובר לשדה דרך `for`/`id`, קריטי לנגישות. `required` נותן Validation מיידי בצד הלקוח — אך לעולם לא תחליף ל-Validation בשרת (Zod, ביחידת השרתים). זו נקודת המפגש הראשונה בין HTML לבין כל מה שלמדתם ביחידת השרתים.

## דוקומנטציה רשמית

[MDN — Your First HTML Form](https://developer.mozilla.org/en-US/docs/Learn/Forms/Your_first_form)

---

## תרגילים

### תרגיל 1 — טופס פשוט

**המשימה:** בנו טופס עם שדה `text` (שם) ושדה `email`, כל אחד עם `<label>` מחובר נכון, ו-`required` על שניהם.

**בדיקה:** לחיצה על טקסט ה-label ממקדת את השדה המתאים; לחיצה על "שלח" בלי למלא שדה חוסמת שליחה עם הודעת דפדפן.

### תרגיל 2 — סוגי input שונים

**המשימה:** הוסיפו לטופס שדה `number` (גיל) ו-`checkbox` (הסכמה לתנאים).

**בדיקה:** בשדה ה-`number`, מקלדת מובייל (אם בודקים בטלפון) מציגה מקלדת מספרים; ה-`checkbox` ניתן לסימון/ביטול בעכבר.

### תרגיל 3 — שליחה ובדיקת נתונים

**המשימה:** הגדירו `action="/register"` ו-`method="POST"`, ושלחו את הטופס (גם אם אין שרת אמיתי שמאזין — בדקו ב-DevTools Network מה נשלח).

**בדיקה:** ב-Network tab, רואים בקשת `POST` ל-`/register` עם הנתונים שמילאתם ב-body — כולל שם השדה (`name`) שהגדרתם.

---

## פרויקט מסכם

**המשימה:** בנו טופס הרשמה מלא לעמוד ה-"אודות" מהפרויקטים הקודמים.

**דרישות:**
1. שדות: שם (`text`, חובה), אימייל (`email`, חובה), גיל (`number`), הודעה (`textarea`)
2. `<label>` מחובר נכון לכל שדה
3. `required` על שדות חובה
4. `action`/`method` מוגדרים (גם אם אין שרת אמיתי מאחורי זה עדיין)

**בדיקה:** כל `<label>` ניתן ללחיצה וממקד את השדה המתאים; ניסיון שליחה בלי למלא שדה חובה נחסם עם הודעת דפדפן; ב-Network tab, השליחה מציגה את כל השדות עם ה-`name` שלהם.

---

## מה בפרק הבא

בפרק הבא — **פרויקט מסכם ליחידת HTML**: בונים עמוד סמנטי מלא — מבנה, תמונה נגישה, טבלת נתונים וטופס — הכל עדיין בלי CSS או JavaScript.
