---
title: "DOM Content"
slug: "79-dom-content-content"
description: "משנים את הטקסט וה-HTML בתוך אלמנט — התוכן שהמשתמש בפועל רואה."
summary: "📖 שיעור"
date: 2026-08-09T00:00:00+02:00
lastmod: 2026-08-09T00:00:00+02:00
draft: false
weight: 791
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

עד עכשיו בחרנו אלמנטים (Selecting) והגבנו לאירועים (Events) — אבל איך משנים בפועל **מה מוצג** בתוך אלמנט? למשל, "0 פריטים בעגלה" שהופך ל-"3 פריטים בעגלה" אחרי קליק. `textContent` ו-`innerHTML` הן שתי הדרכים המרכזיות לקרוא ולשנות את תוכן אלמנט — עם הבדל קריטי ביניהן.

## מילות מפתח שחשוב לזכור

• `element.textContent` — קורא/כותב את **הטקסט הגולמי** בתוך אלמנט; כל HTML שמכניסים דרכו נשמר כטקסט מילולי, לא מתפרש

• `element.innerHTML` — קורא/כותב **HTML ממש**; מחרוזת שמכילה תגיות **תתפרש** כ-HTML אמיתי

• XSS (Cross-Site Scripting) — פרצת אבטחה שבה קלט משתמש זדוני, שהוכנס עם `innerHTML`, מתפרש כקוד רץ

• `element.value` — קורא/כותב את **הערך** של שדה טופס (`<input>`, `<textarea>`) — לא `textContent`!

```javascript
const counter = document.querySelector(".counter");
counter.textContent = "3 items in cart"; // always safe

const box = document.querySelector(".box");
box.innerHTML = "<strong>bold</strong>"; // parsed as real HTML
```

## הדגמה חיה

<div class="demo-live" style="direction:rtl;border:1px solid #d1d5db;border-radius:10px;padding:1.25rem;margin:1.25rem 0;background:#fafafa;color:#111827;">
<p style="font-weight:600;margin:0 0 0.9rem;color:#6b7280;font-size:0.85rem;">🔴 הדגמה חיה — אותה מחרוזת בדיוק, שתי תוצאות שונות</p>
<button onclick="document.getElementById('demo-content-text').textContent='<strong>טקסט</strong>'" style="background:#2563eb;color:#fff;border:none;border-radius:6px;padding:0.45rem 0.9rem;font-weight:700;cursor:pointer;margin-inline-end:0.5rem;">הכנס עם textContent</button>
<button onclick="document.getElementById('demo-content-html').innerHTML='<strong>טקסט</strong>'" style="background:#dc2626;color:#fff;border:none;border-radius:6px;padding:0.45rem 0.9rem;font-weight:700;cursor:pointer;">הכנס עם innerHTML</button>
<div style="display:flex;gap:8px;margin-top:0.9rem;">
<div style="flex:1;background:#fff;border:1px solid #d1d5db;border-radius:6px;padding:0.75rem;min-height:2rem;">textContent: <span id="demo-content-text"></span></div>
<div style="flex:1;background:#fff;border:1px solid #d1d5db;border-radius:6px;padding:0.75rem;min-height:2rem;">innerHTML: <span id="demo-content-html"></span></div>
</div>
</div>

## הסבר עיקרי

textContent מול innerHTML — ההבדל הקריטי — כתיבת מחרוזת עם תגיות דרך `textContent` מציגה את המחרוזת **המילולית** על המסך (עם התגיות עצמן כטקסט!) — לא מפרשת אותה. `innerHTML` **כן** מפרש את זה כ-HTML אמיתי, ומציג את התוכן מעוצב בפועל. לכן `textContent` מתאים כמעט תמיד להצגת טקסט רגיל.

XSS — הסכנה האמיתית ב-innerHTML עם קלט משתמש — אם משתמשים ב-`innerHTML = userInput` כשה-`userInput` מגיע ישירות מהמשתמש (למשל, תוכן שדה טופס), ומשתמש זדוני מזין תג `<img>` עם `onerror` שמריץ קוד, זה **ירוץ בפועל** בדפדפן של כל מי שרואה את התוכן — זו התקפת XSS, מקבילה ל-SQL Injection (מיחידת ה-DB) אבל בצד הלקוח. **לעולם** לא משתמשים ב-`innerHTML` עם קלט משתמש שלא סוננה — `textContent` בטוח תמיד, כי הוא לעולם לא "מריץ" תגיות.

value לשדות טופס, לא textContent — שדה `<input>` לא מציג תוכן דרך `textContent` בכלל — הערך שהמשתמש הקליד נגיש רק דרך `element.value`. זו טעות נפוצה למתחילים: לנסות `input.textContent` ולקבל מחרוזת ריקה.

## יתרונות

`textContent` בטוח מ-XSS תמיד, בלי צורך לחשוב על זה; `innerHTML` נותן גמישות ליצור מבנה HTML מורכב במחרוזת אחת, כשצריך.

## חסרונות

`innerHTML` עם קלט משתמש לא-מסונן הוא סיכון אבטחה חמור; `innerHTML` איטי יותר מ-`textContent` לעדכונים תכופים (הדפדפן צריך לפרסר HTML מחדש כל פעם).

## נקודות חשובות

• `textContent` מציג תגיות כטקסט מילולי; `innerHTML` מפרש אותן כ-HTML אמיתי

• `innerHTML` עם קלט משתמש לא-מסונן פותח פרצת XSS — סיכון אבטחה אמיתי

• שדות טופס (`<input>`) נקראים/נכתבים דרך `.value`, לא `textContent`

• ברירת המחדל הבטוחה: `textContent` לטקסט רגיל, `innerHTML` רק כשבאמת צריך HTML דינמי

## טעויות נפוצות

• שימוש ב-`innerHTML` עם קלט משתמש ישיר — פרצת XSS

• ניסיון לקרוא ערך שדה טופס עם `textContent` במקום `.value` — מחזיר ריק

• שימוש ב-`innerHTML` כברירת מחדל לכל דבר, גם כשמספיק `textContent` — סיכון מיותר וגם פחות יעיל

## סיכום

`textContent` קורא/כותב טקסט גולמי (בטוח תמיד); `innerHTML` קורא/כותב HTML אמיתי (מסוכן עם קלט משתמש לא-מסונן — פרצת XSS). `element.value` הוא הדרך לגשת לערך שדות טופס, לא `textContent`. ברירת המחדל הבטוחה היא `textContent`, אלא אם באמת צריך HTML דינמי.

## דוקומנטציה רשמית

[MDN — Node.textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)

---

## תרגילים

### תרגיל 1 — textContent

**המשימה:** בחרו אלמנט ושנו את `textContent` שלו לטקסט חדש.

**בדיקה:** הטקסט על המסך משתנה מיד לערך החדש.

### תרגיל 2 — ההבדל מ-innerHTML

**המשימה:** נסו להכניס מחרוזת עם תגית `<strong>` גם עם `textContent` וגם עם `innerHTML`, לשני אלמנטים שונים. השוו איך זה נראה.

**בדיקה:** עם `textContent`, מוצג הטקסט המילולי כולל סימני התגית; עם `innerHTML`, מוצג הטקסט בפועל בהדגשה.

### תרגיל 3 — value על שדה קלט

**המשימה:** קראו וכתבו את `.value` של שדה `<input>`, ונסו גם `textContent` עליו (לראות שזה לא עובד).

**בדיקה:** `.value` מחזיר ומעדכן את הטקסט בשדה בפועל; `textContent` על אותו שדה מחזיר מחרוזת ריקה.

---

## פרויקט מסכם

**המשימה:** הוסיפו "מונה קליקים" חי לעמוד האודות.

**דרישות:**
1. אלמנט שמציג "0 קליקים" בהתחלה
2. כפתור שבכל קליק מעדכן את המונה (`textContent`) למספר גבוה יותר
3. שדה קלט שהתוכן שלו (`.value`) מוצג בזמן אמת באלמנט אחר בעמוד (בלי `innerHTML`)

**בדיקה:** כל קליק מעלה את המונה בדיוק ב-1; הקלדה בשדה מעדכנת את התצוגה מיד, בלי לרענן; שום מקום בקוד לא משתמש ב-`innerHTML` עם קלט מהמשתמש.

---

## מה בפרק הבא

בפרק הבא נלמד על **classList & Styling** — ביחידת ה-CSS למדנו class כדרך לעצב אלמנטים. אבל איך "מדליקים"/"מכבים" class דרך JavaScript — למשל, להוסיף class ל-כפתור שנלחץ, או להסתיר אלמנט? `element.classList` נותן API נוח לכך — הרבה יותר טוב מלש
