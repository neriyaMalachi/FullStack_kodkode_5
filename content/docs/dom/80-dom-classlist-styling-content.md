---
title: "classList & Styling"
slug: "80-dom-classlist-styling-content"
description: "מוסיפים, מסירים ומחליפים classes של CSS דרך קוד — בלי לגעת בעיצוב ישירות."
summary: "📖 שיעור"
date: 2026-08-09T00:00:00+02:00
lastmod: 2026-08-09T00:00:00+02:00
draft: false
weight: 801
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

ביחידת ה-CSS למדנו class כדרך לעצב אלמנטים. אבל איך "מדליקים"/"מכבים" class דרך JavaScript — למשל, להוסיף class ל-כפתור שנלחץ, או להסתיר אלמנט? `element.classList` נותן API נוח לכך — הרבה יותר טוב מלשנות `style` ישירות בכל שינוי עיצוב.

## מילות מפתח שחשוב לזכור

• `element.classList` — אובייקט שמנהל את רשימת ה-classes של אלמנט

• `.add(name)` — מוסיף class

• `.remove(name)` — מסיר class

• `.toggle(name)` — מוסיף אם חסר, מסיר אם קיים — הפיכה מצב "on/off" בקריאה אחת

• `.contains(name)` — בודק אם class קיים על האלמנט, מחזיר `true`/`false`

• `element.style` — גישה ישירה לתכונות CSS **inline**, לשינויים דינמיים שלא ניתן לתאר עם class מראש (כמו מיקום מדויק לפי חישוב)

```javascript
const menu = document.querySelector(".menu");

menu.classList.toggle("open"); // הופך open/closed בכל קריאה
menu.classList.add("visible");
menu.classList.remove("hidden");

console.log(menu.classList.contains("open")); // true/false
```

## הדגמה חיה

<div class="demo-live" style="direction:rtl;border:1px solid #d1d5db;border-radius:10px;padding:1.25rem;margin:1.25rem 0;background:#fafafa;color:#111827;">
<p style="font-weight:600;margin:0 0 0.9rem;color:#6b7280;font-size:0.85rem;">🔴 הדגמה חיה — כל קליק מריץ classList.toggle('demo-active') בפועל</p>
<style>.demo-classlist-box{background:#e5e7eb;border-radius:8px;padding:1rem;text-align:center;font-weight:700;transition:all 0.25s;}.demo-classlist-box.demo-active{background:#059669;color:#fff;transform:scale(1.05);}</style>
<button onclick="document.getElementById('demo-classlist-box').classList.toggle('demo-active')" style="background:#2563eb;color:#fff;border:none;border-radius:6px;padding:0.5rem 1rem;font-weight:700;cursor:pointer;margin-bottom:0.75rem;">classList.toggle('demo-active')</button>
<div id="demo-classlist-box" class="demo-classlist-box">הקופסה הזו</div>
</div>

## הסבר עיקרי

classList עדיף על style ישיר — במקום לכתוב `element.style.display = "none"`, `element.style.opacity = "0"` וכו' בקוד JavaScript, עדיף להגדיר class מראש ב-CSS ורק "להדליק/לכבות" אותה עם `classList`. זה שומר על **הפרדת אחריות**: CSS מגדיר **איך** נראה כל מצב, JavaScript רק קובע **איזה** מצב פעיל — בדיוק כמו ש-Semantic HTML (מיחידת HTML) הפריד תפקיד ממבנה.

toggle כ"מתג" נוח — `classList.toggle("open")` הוא הרבה יותר קצר מבדיקת `contains` עם `if/else` ידני — הוא בודק ומחליף במכה אחת, מתאים בדיוק לתפריטי המבורגר, dropdowns, ותגי show/hide.

מתי כן style ישיר — יש מקרים ש-class מראש לא מספיק — למשל, מיקום מדויק לפי חישוב דינמי שלא ניתן לדעת מראש בזמן כתיבת ה-CSS. שם, `element.style` הוא הכלי הנכון — אבל זה המקרה **החריג**, לא ברירת המחדל.

## יתרונות

`classList` שומר על הפרדה נקייה בין עיצוב (CSS) ללוגיקה (JavaScript); `toggle` נותן קוד קצר וקריא ל"מצבי on/off"; `contains` מאפשר לבדוק מצב נוכחי לפני החלטה.

## חסרונות

שינוי `element.style` ישיר מיצר עיצוב "inline" שקשה יותר לתחזק ולדרוס עם CSS רגיל (Specificity גבוהה במיוחד); שימוש-יתר ב-`style` ישיר במקום classes מוגדרות מראש מבזבז את היתרון של הפרדת אחריות.

## נקודות חשובות למבחן / ראיון עבודה

• `classList.add`/`.remove`/`.toggle`/`.contains` מנהלים classes בלי לגעת בעיצוב ישירות

• `toggle` מוסיף אם חסר, מסיר אם קיים — קיצור נוח למצבי on/off

• `element.style` משנה CSS inline ישירות — Specificity הכי גבוהה, שמור למקרים חריגים

• עדיף class + CSS מוגדר מראש על שינוי `style` ישיר — הפרדת אחריות

## טעויות נפוצות

• שינוי `element.style` ישירות לכל דבר, במקום להגדיר class מראש ולהשתמש ב-`classList` — עיצוב "inline" מפוזר וקשה לתחזק

• שכחת ה-`.` בשם ה-class כשמעבירים ל-`classList.add`/`remove` — `classList` מצפה לשם **בלי** נקודה (בניגוד לסלקטור CSS)

• להשתמש ב-`if/else` ארוך במקום `toggle` הפשוט יותר

## סיכום

`element.classList` מנהל classes דרך `add`/`remove`/`toggle`/`contains`, בלי לגעת בעיצוב ישירות — שומר על הפרדה נקייה בין CSS (איך נראה) ל-JavaScript (איזה מצב פעיל). `element.style` נותן גישה ישירה ל-CSS inline, שמורה למקרים שבאמת דורשים חישוב דינמי שלא ניתן להגדיר מראש כ-class.

## דוקומנטציה רשמית

[MDN — Element.classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)

---

## תרגילים

### תרגיל 1 — add/remove

**המשימה:** הוסיפו class `highlight` (מוגדרת מראש ב-CSS) לאלמנט עם `classList.add`, ואז הסירו אותה אחרי 2 שניות עם `setTimeout`.

**בדיקה:** האלמנט מקבל את העיצוב מיד, ומאבד אותו בדיוק אחרי 2 שניות.

### תרגיל 2 — toggle לתפריט

**המשימה:** בנו כפתור "המבורגר" שמפעיל `classList.toggle("open")` על תפריט, בכל קליק.

**בדיקה:** קליק ראשון פותח את התפריט (class נוסף); קליק שני סוגר אותו (class מוסר) — לסירוגין.

### תרגיל 3 — contains לבדיקת מצב

**המשימה:** לפני הוספת class, בדקו עם `classList.contains` אם היא כבר קיימת, והדפיסו הודעה מתאימה.

**בדיקה:** הפלט משתנה בהתאם למצב הנוכחי בפועל — "כבר קיים" מול "נוסף כעת".

---

## פרויקט מסכם

**המשימה:** בנו "מצב כהה" (dark mode toggle) לעמוד האודות, בעזרת classList.

**דרישות:**
1. כפתור שמפעיל `classList.toggle("dark-theme")` על `document.body`
2. CSS מוגדר מראש (מיחידת CSS Variables) ל-`.dark-theme` שדורס משתני צבע
3. שימוש ב-`classList.contains` כדי לעדכן את טקסט הכפתור בהתאם למצב הנוכחי

**בדיקה:** קליק על הכפתור מחליף מצב עיצוב מלא; טקסט הכפתור תמיד תואם למצב הנוכחי בפועל.

---

## מה בפרק הבא

בפרק הבא נלמד על **Creating & Removing Elements** — עד עכשיו שינינו אלמנטים שכבר **קיימים** ב-HTML. אבל מה אם רוצים להוסיף פריט חדש לרשימת משימות שהמשתמש הקליד? אין תג HTML מוכן מראש בשביל זה — צריך **ליצור** אלמנט חדש **בקוד**, ולהכניס אותו לעמוד. `do
