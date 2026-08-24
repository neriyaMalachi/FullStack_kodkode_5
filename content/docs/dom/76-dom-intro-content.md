---
title: "DOM Intro"
slug: "76-dom-intro-content"
description: "איך JavaScript \"רואה\" ומדבר עם עמוד HTML שכבר נטען — הגשר בין הקוד לתצוגה."
summary: "📖 שיעור"
date: 2026-08-09T00:00:00+02:00
lastmod: 2026-08-09T00:00:00+02:00
draft: false
weight: 761
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

ביחידת ה-HTML כבר הזכרנו: הדפדפן בונה מ-HTML עץ אובייקטים שנקרא **DOM** (Document Object Model). עד עכשיו, כל השינויים בעמוד היו **סטטיים** — מה שכתבנו ב-HTML/CSS זה מה שמוצג, בלי יכולת להגיב למשתמש בזמן אמת. **DOM API** הוא האוסף של אובייקטים ופונקציות שדרכם JavaScript **קורא ומשנה** את העץ הזה, אחרי שהעמוד כבר נטען — זה מה שהופך עמוד "מת" לאפליקציה אינטראקטיבית.

## מילות מפתח שחשוב לזכור

• DOM (Document Object Model) — הייצוג הפנימי של הדפדפן ל-HTML, כעץ של אובייקטים שניתנים לקריאה ולשינוי

• `document` — האובייקט הגלובלי שמייצג את כל המסמך; נקודת הכניסה לכל DOM API

• Node (צומת) — כל "פריט" בעץ ה-DOM: אלמנט, טקסט, הערה

• Element — סוג ספציפי של Node שמייצג תג HTML (`<div>`, `<p>`...)

• Live vs Static — שינוי ב-DOM דרך JavaScript **משתקף מיד** על המסך — בניגוד לקובץ HTML המקורי, שלא משתנה

```javascript
console.log(document.title);        // the page title
console.log(document.body);         // the <body> as an object
document.title = "New title";       // immediate change — reflected on screen right away
```

## הדגמה חיה

<div class="demo-live" style="direction:rtl;border:1px solid #d1d5db;border-radius:10px;padding:1.25rem;margin:1.25rem 0;background:#fafafa;color:#111827;">
<p style="font-weight:600;margin:0 0 0.9rem;color:#6b7280;font-size:0.85rem;">🔴 הדגמה חיה — משנה בפועל את כותרת הטאב של הדפדפן שלכם (הביטו למעלה!)</p>
<button onclick="document.title='שיניתי את הכותרת!'" style="background:#2563eb;color:#fff;border:none;border-radius:6px;padding:0.5rem 1rem;font-weight:700;cursor:pointer;margin-inline-end:0.5rem;">שנה את document.title</button>
<button onclick="document.title=document.title" style="background:#6b7280;color:#fff;border:none;border-radius:6px;padding:0.5rem 1rem;font-weight:700;cursor:pointer;">רענון הדף משחזר את המקור</button>
</div>

## הסבר עיקרי

document כשער כניסה — כל אינטראקציה עם ה-DOM מתחילה מ-`document` — אובייקט גלובלי שקיים אוטומטית בכל דף. `document.body`, `document.title`, ובהמשך `document.querySelector(...)` — כולם "יוצאים" מנקודת הכניסה הזו.

שינוי מיידי, לא רק תיאורטי — כשכותבים `document.title = "כותרת חדשה"`, זה **לא** רק ערך במשתנה JavaScript — זה משנה בפועל את מה שמוצג בכרטיסיית הדפדפן, **מיד**. זה ההבדל המהותי בין DOM לבין קובץ HTML: ה-DOM הוא הייצוג ה"חי" בזיכרון, שהדפדפן מצייר מחדש בכל שינוי.

Node מול Element — לא כל Node הוא Element! טקסט בתוך `<p>שלום</p>` הוא גם Node (Text Node), אבל לא Element — Element מייצג ספציפית תג HTML. ההבחנה הזו חשובה כי הרבה מתודות DOM עובדות רק על Elements.

## יתרונות

מאפשר אפליקציות אינטראקטיביות אמיתיות, לא רק עמודים סטטיים; שינויים משתקפים מיד על המסך, בלי לרענן את העמוד; API אחיד שכל דפדפן מודרני תומך בו.

## חסרונות

מניפולציית DOM תכופה מדי (הרבה שינויים בכל פעם) יכולה לפגוע בביצועים; קוד DOM "ידני" רב יכול להיות פחות קריא מגישות מודרניות (כמו React, בהמשך הקורס).

## נקודות חשובות

• DOM הוא הייצוג הפנימי-בזיכרון של HTML, לא הקובץ עצמו

• `document` הוא נקודת הכניסה לכל פעולת DOM

• שינוי DOM משתקף מיד על המסך — "חי", לא סטטי

• Node הוא מונח כללי (כולל טקסט); Element הוא ספציפית תג HTML

## טעויות נפוצות

• לבלבל בין קובץ ה-HTML המקורי (שנשאר ללא שינוי בדיסק) לבין ה-DOM (שמשתנה בזיכרון בזמן ריצה)

• לנסות לגשת ל-DOM לפני שהעמוד סיים להיטען — אלמנטים עוד לא קיימים

• להתייחס לכל Node כ-Element — טקסט ברווחים בין תגיות הוא גם Node

## סיכום

ה-DOM הוא הייצוג הפנימי-בזיכרון של הדפדפן ל-HTML, כעץ אובייקטים. `document` הוא נקודת הכניסה שדרכה JavaScript קורא ומשנה אותו — כל שינוי משתקף מיד על המסך, בלי לרענן. זה הבסיס לכל אינטראקטיביות אמיתית באתר.

## דוקומנטציה רשמית

[MDN — Introduction to the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)

---

## תרגילים

### תרגיל 1 — קריאת מידע מה-DOM

**המשימה:** פתחו קונסול בדפדפן על עמוד כלשהו, והריצו `document.title` ו-`document.body`.

**בדיקה:** `document.title` מחזיר מחרוזת עם כותרת העמוד; `document.body` מחזיר אובייקט שמייצג את ה-`<body>`.

### תרגיל 2 — שינוי מיידי

**המשימה:** שנו את `document.title` לערך חדש דרך הקונסול, ובדקו את כרטיסיית הדפדפן.

**בדיקה:** כותרת הכרטיסייה משתנה מיד, בלי לרענן את הדף.

### תרגיל 3 — Node מול Element

**המשימה:** הסבירו (בכתיבה) למה טקסט בתוך `<p>שלום</p>` הוא Node אך לא Element.

**בדיקה:** ההסבר מזכיר ש-Text Node מייצג תוכן טקסטואלי גולמי, לא תג HTML.

---

## פרויקט מסכם

**המשימה:** כתבו קובץ JavaScript קטן שמשנה כמה תכונות בסיסיות של עמוד קיים דרך ה-DOM.

**דרישות:**
1. שינוי `document.title`
2. קריאה והדפסה של `document.body.children.length` (מספר האלמנטים הישירים ב-body)
3. תיעוד (בהערת קוד) של ההבדל בין מה שרואים בקובץ ה-HTML למה שקורה בפועל אחרי הרצת הסקריפט

**בדיקה:** הרצת הסקריפט משנה את כותרת הכרטיסייה; מספר האלמנטים המודפס תואם למה שסופרים ידנית ב-HTML.

---

## מה בפרק הבא

בפרק הבא נלמד על **Selecting Elements** — בשיעור הקודם הכרנו את `document` כנקודת כניסה. אבל `document.body` נותן רק את כל ה-`<body>` — איך מוצאים **אלמנט ספציפי** בתוכו, למשל כפתור מסוים או רשימת משימות? בדיוק כמו Selectors ב-CSS (שכבר מכירי
