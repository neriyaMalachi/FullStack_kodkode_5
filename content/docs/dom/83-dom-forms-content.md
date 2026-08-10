---
title: "DOM Forms"
slug: "83-dom-forms-content"
description: "קוראים ומטפלים בנתוני טופס דרך JavaScript, בלי לתת לדפדפן לרענן את העמוד."
summary: "📖 שיעור"
date: 2026-08-09T00:00:00+02:00
lastmod: 2026-08-09T00:00:00+02:00
draft: false
weight: 831
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

ביחידת ה-HTML למדנו Forms כמנגנון שהדפדפן מטפל בו לבד (`action`+`method`). ביחידת Events למדנו `preventDefault` למניעת רענון. עכשיו: איך בפועל **קוראים** את כל הנתונים שהמשתמש הזין, כדי לעבד אותם ב-JavaScript (למשל, לשלוח עם `fetch` במקום רענון מלא)?

## מילות מפתח שחשוב לזכור

• `event.preventDefault()` — (מוכר מהשיעור הקודם) חובה על אירוע `submit` כדי למנוע רענון עמוד

• `input.value` — הערך הנוכחי של שדה קלט בודד

• `FormData` — אובייקט שאוסף **את כל** שדות הטופס בבת אחת, לפי ה-`name` שהוגדר על כל `<input>`

• `FormData.get(name)` — שולף ערך שדה בודד מתוך `FormData`

• Client-side Validation — בדיקת תקינות בקוד JavaScript, **לפני** שממשיכים לעבד/לשלוח — מעבר ל-`required` הבסיסי של HTML

```javascript
const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  console.log(data.get("name"), data.get("email"));
});
```

## הדגמה חיה

<div class="demo-live" style="direction:rtl;border:1px solid #d1d5db;border-radius:10px;padding:1.25rem;margin:1.25rem 0;background:#fafafa;color:#111827;">
<p style="font-weight:600;margin:0 0 0.9rem;color:#6b7280;font-size:0.85rem;">🔴 הדגמה חיה — שליחה אוספת FormData בפועל, בלי רענון עמוד</p>
<form onsubmit="event.preventDefault(); const data=new FormData(this); document.getElementById('demo-forms-out').textContent='נאסף: name=\''+data.get('name')+'\', email=\''+data.get('email')+'\'';">
<input type="text" name="name" placeholder="שם" required style="border:1px solid #9ca3af;border-radius:6px;padding:0.4rem 0.6rem;margin-inline-end:0.5rem;" />
<input type="email" name="email" placeholder="אימייל" required style="border:1px solid #9ca3af;border-radius:6px;padding:0.4rem 0.6rem;margin-inline-end:0.5rem;" />
<button type="submit" style="background:#2563eb;color:#fff;border:none;border-radius:6px;padding:0.45rem 1rem;font-weight:700;cursor:pointer;">שלח (בלי רענון)</button>
</form>
<p id="demo-forms-out" style="margin:0.75rem 0 0;font-size:0.85rem;color:#059669;font-weight:600;"></p>
</div>

## הסבר עיקרי

FormData אוסף הכל בבת אחת — במקום לגשת בנפרד לכל שדה עם `querySelector`+`.value`, `new FormData(form)` אוסף **את כל** הנתונים מהטופס בבת אחת, מבוסס על ה-`name` שכל `<input>` הוגדר איתו (זוכרים משיעור HTML Forms — למה `name` קריטי?). `.get("fieldName")` שולף ערך ספציפי מתוכו.

preventDefault חובה כאן, לא אופציונלי — בדיוק כמו בשיעור Events, בלי `event.preventDefault()` על `submit`, הדפדפן ינווט/ירענן לפי ה-`action` של הטופס — כל הקוד שכתבתם (איסוף `FormData`, שליחה ב-`fetch`) לעולם לא ירוץ, כי העמוד "עוזב" לפני שהוא מגיע לזה.

Client-side Validation כשכבה נוספת — `required` (HTML) עוצר שליחה אם שדה ריק — אבל מה אם צריך בדיקה מורכבת יותר? בתוך ה-`submit` handler, **לפני** שממשיכים לעבד/לשלוח את הנתונים, בודקים תנאים נוספים ב-JavaScript, ומציגים הודעת שגיאה מותאמת אם צריך — אבל (זוכרים משיעור HTML Forms) זו **תמיד** רק שכבה נוספת לחוויית משתמש, לעולם לא תחליף ל-Validation בשרת.

## יתרונות

`FormData` אוסף את כל הנתונים בקריאה אחת, בלי `querySelector` נפרד לכל שדה; מאפשר טיפול מלא בטופס (validation, שליחה עם `fetch`) בלי רענון עמוד; Client-side Validation נותן משוב מיידי למשתמש.

## חסרונות

שכחת `preventDefault` הופכת את כל שאר הקוד ל"מת" (לא רץ בכלל, כי הדף עוזב קודם); `FormData` דורש ש-`name` יהיה מוגדר נכון על כל שדה — שדה בלי `name` פשוט לא מופיע ב-`FormData`.

## נקודות חשובות למבחן / ראיון עבודה

• `event.preventDefault()` על `submit` הוא תנאי הכרחי לטיפול JavaScript בטופס

• `FormData(form)` אוסף את כל שדות הטופס, לפי `name`, בקריאה אחת

• `.get(name)` שולף ערך שדה בודד מתוך `FormData`

• Client-side Validation היא תוספת לחוויית משתמש, לא תחליף ל-Validation בשרת

## טעויות נפוצות

• שכחת `event.preventDefault()` — כל הקוד אחרי זה לא רץ בפועל, כי העמוד כבר מתחיל לרענן

• שדה `<input>` בלי `name` — לא מופיע ב-`FormData` בכלל, גם אם יש לו ערך

• להסתמך רק על Client-side Validation, בלי Validation מקביל בשרת

## סיכום

טיפול בטפסים ב-JavaScript מתחיל תמיד ב-`event.preventDefault()` על `submit`, כדי למנוע רענון עמוד. `new FormData(form)` אוסף את כל שדות הטופס בבת אחת (לפי `name`); `.get(name)` שולף ערך ספציפי. Client-side Validation נותנת משוב מיידי, אך היא תמיד שכבה נוספת — לא תחליף ל-Validation בשרת.

## דוקומנטציה רשמית

[MDN — FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)

---

## תרגילים

### תרגיל 1 — submit עם preventDefault

**המשימה:** הוסיפו `addEventListener("submit", ...)` עם `preventDefault`, שמדפיס "הטופס נשלח" לקונסול.

**בדיקה:** לחיצה על "שלח" מדפיסה את ההודעה ולא מרעננת את העמוד.

### תרגיל 2 — FormData

**המשימה:** על טופס עם שדות `name` ו-`email`, אספו את הערכים עם `new FormData(form)` והדפיסו אותם.

**בדיקה:** הפלט מציג נכון את הערכים שהוזנו בפועל, לפי `name` השדה.

### תרגיל 3 — Client-side Validation נוסף

**המשימה:** הוסיפו בדיקה שהשדה `age` (אם קיים) הוא מספר גדול מ-0, לפני שממשיכים לעבד את הטופס.

**בדיקה:** הזנת גיל שלילי או 0 מציגה הודעת שגיאה ועוצרת את התהליך; גיל תקין ממשיך כרגיל.

---

## פרויקט מסכם

**המשימה:** הפכו את טופס ההרשמה (מיחידת HTML Forms) לטופס מטופל-JavaScript מלא.

**דרישות:**
1. `preventDefault` על `submit`
2. איסוף כל הנתונים עם `FormData`
3. בדיקת Validation נוספת אחת מעבר ל-`required` (למשל אורך מינימלי לשם)
4. אם תקין — הצגת "תודה על ההרשמה" באלמנט בעמוד (בלי רענון); אם לא — הצגת הודעת שגיאה ברורה

**בדיקה:** שליחה עם נתונים תקינים מציגה הודעת תודה בלי רענון; שליחה עם נתונים לא-תקינים מציגה הודעת שגיאה ספציפית, בלי לאפס את שאר השדות.

---

## מה בפרק הבא

בפרק הבא נלמד על **Event Delegation** — בשיעור Creating & Removing בנינו רשימת משימות שגדלה דינמית. בעיה: אם רושמים `addEventListener` על **כל** פריט חדש שנוצר, זה לא רק מסורבל — פריטים שנוצרים **אחרי** שהקוד כבר רץ פעם אחת פשוט "מפספסים" א
