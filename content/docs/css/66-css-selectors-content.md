---
title: "CSS Selectors"
slug: "66-css-selectors-content"
description: "איך \"מדברים\" אל אלמנטים ספציפיים ב-HTML כדי לעצב רק אותם."
summary: "📖 שיעור"
date: 2026-08-09T00:00:00+02:00
lastmod: 2026-08-09T00:00:00+02:00
draft: false
weight: 661
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

ביחידת ה-HTML בנינו מבנה — אבל בלי שום עיצוב חזותי, כל עמוד נראה כמו טקסט שחור על רקע לבן, בגופן ברירת מחדל. **CSS** (Cascading Style Sheets) הוא שפת העיצוב שקובעת איך HTML **נראה**: צבעים, גדלים, מרווחים, מיקום. אבל לפני שאפשר לעצב משהו, צריך לדעת **איזה** אלמנט לעצב — זה בדיוק תפקידם של **Selectors**: תבניות שבוחרות אילו אלמנטים ב-HTML יקבלו כל חוק עיצוב.

## מילות מפתח שחשוב לזכור

• Selector (בורר) — תבנית שבוחרת אילו אלמנטים ב-HTML חוק CSS מסוים יחול עליהם

• Element Selector — בוחר לפי שם התג עצמו (`p { }` בוחר את כל ה-`<p>`)

• Class Selector (`.name`) — בוחר כל אלמנט עם `class="name"` — ניתן לשימוש חוזר על הרבה אלמנטים

• ID Selector (`#name`) — בוחר את האלמנט **היחיד** עם `id="name"` — כל `id` חייב להיות ייחודי בעמוד

• Combinator (מצרף) — מחבר סלקטורים כדי לתאר קשר ביניהם: `div p` (כל `p` בתוך `div`), `div > p` (רק `p` שהוא **ילד ישיר** של `div`)

• Declaration Block — הגוף שבין הסוגריים המסולסלים `{ property: value; }` — חוקי העיצוב עצמם

```css
p { color: blue; }
.highlight { background: yellow; }
#main-title { font-size: 2rem; }
nav a { text-decoration: none; }
```

## הדגמה חיה

<div class="demo-live" style="direction:rtl;border:1px solid #d1d5db;border-radius:10px;padding:1.25rem;margin:1.25rem 0;background:#fafafa;color:#111827;font-family:inherit;">
<p style="font-weight:600;margin:0 0 0.75rem;color:#6b7280;font-size:0.85rem;">🔴 הדגמה חיה — כל תיבה מעוצבת ע"י סלקטור אחר</p>
<style>
.demo-sel-elem{color:#2563eb;margin:0 0 0.5rem;}
.demo-sel-class{background:#fef08a;padding:0.35rem 0.6rem;border-radius:6px;display:inline-block;margin:0 0 0.5rem;}
#demo-sel-id{font-size:1.3rem;margin:0 0 0.5rem;color:#111827;}
.demo-sel-nav a{text-decoration:none;color:#059669;font-weight:600;}
.demo-sel-nav a:hover{text-decoration:underline;}
</style>
<p class="demo-sel-elem">אני נבחרתי ע"י <code style="direction:ltr;display:inline-block;">p</code> (Element Selector) — כחול</p>
<span class="demo-sel-class">אני נבחרתי ע"י <code style="direction:ltr;display:inline-block;">.highlight</code> (Class) — רקע צהוב</span>
<h4 id="demo-sel-id">אני נבחרתי ע"י <code style="direction:ltr;display:inline-block;">#main-title</code> (ID)</h4>
<nav class="demo-sel-nav"><a href="#">קישור בתוך nav — נבחר ע"י <code style="direction:ltr;display:inline-block;">nav a</code> (Combinator), נסו לרחף עליו</a></nav>
</div>

## הסבר עיקרי

Class מול ID — מתי להשתמש במה — `class` נועד לשימוש חוזר: הרבה אלמנטים יכולים לחלוק אותה class ולקבל את אותו עיצוב (למשל, כל הכפתורים באתר עם `class="btn"`). `id` הוא ייחודי — רק **אלמנט אחד** בעמוד יכול להיות עם `id="main-title"`. ברוב המצבים, class היא הבחירה הגמישה יותר; `id` שמור בעיקר לעוגנים (`<a href="#section1">`) ולשימושי JavaScript ייחודיים.

Combinators כמתארים קשרים במבנה — `nav a` (עם רווח) בוחר כל `<a>` שנמצא **בכל מקום** בתוך `<nav>`, גם אם מקונן עמוק. `nav > a` (עם `>`) בוחר רק `<a>` שהוא **ילד ישיר** של `<nav>`, לא מקונן עמוק יותר. ההבדל הזה חשוב כשיש מבנה HTML מורכב עם אלמנטים מקוננים.

בחירת סלקטור נכון היא כבר עיצוב אדריכלי — סלקטור רחב מדי (`div { color: red; }`) משפיע על **כל** ה-`div`-ים בעמוד — כנראה יותר ממה שהתכוונתם. class ממוקדת (`.error-message { color: red; }`) משפיעה רק על מה שבאמת רציתם.

## יתרונות

Selectors נותנים דיוק — אפשר לעצב בדיוק את מה שרוצים בלי לגעת בשאר; class ניתנת לשימוש חוזר על הרבה אלמנטים, חוסכת חזרתיות; Combinators מתארים קשרים מבניים בלי להוסיף class לכל אלמנט.

## חסרונות

סלקטורים רחבים מדי (כמו `div` גנרי) עלולים לפגוע באלמנטים שלא התכוונתם לעצב; Combinators עמוקים (`div div div span`) הופכים קשה לתחזוקה כשה-HTML משתנה.

## נקודות חשובות למבחן / ראיון עבודה

• Class (`.name`) לשימוש חוזר על הרבה אלמנטים; ID (`#name`) ייחודי לאלמנט אחד בעמוד

• רווח בין סלקטורים = "צאצא בכל עומק"; `>` = "ילד ישיר בלבד"

• Element Selector בוחר לפי שם תג; Class/ID בוחרים לפי attribute

• עדיף class ממוקדת על סלקטור רחב מדי, כדי לא לפגוע באלמנטים לא-קשורים

## טעויות נפוצות

• שימוש חוזר באותו `id` על כמה אלמנטים — לא תקין ב-HTML, וגם מבלבל CSS/JavaScript

• סלקטור רחב מדי (כמו `div`) שמשפיע על אלמנטים לא-מכוונים

• בלבול בין `div p` (צאצא בכל עומק) ל-`div > p` (ילד ישיר בלבד)

## סיכום

Selectors בוחרים אילו אלמנטים ב-HTML כל חוק CSS יחול עליהם: Element Selector לפי שם תג, Class לשימוש חוזר, ID לאלמנט ייחודי. Combinators (רווח, `>`) מתארים קשרים מבניים בין אלמנטים מקוננים. בחירת סלקטור מדויק היא הבסיס לכל עיצוב CSS מסודר.

## דוקומנטציה רשמית

[MDN — CSS Selectors](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors)

---

## תרגילים

### תרגיל 1 — סלקטורים בסיסיים

**המשימה:** על עמוד HTML קיים (מיחידת HTML), כתבו CSS שמעצב את כל ה-`<h1>` בצבע כחול, ואת כל האלמנטים עם `class="highlight"` ברקע צהוב.

**בדיקה:** כל כותרות ה-`<h1>` בעמוד מוצגות בכחול; רק אלמנטים עם ה-class הספציפית מקבלים רקע צהוב.

### תרגיל 2 — Combinators

**המשימה:** כתבו CSS שמעצב רק קישורים (`<a>`) שנמצאים בתוך `<nav>` (לא בכל מקום בעמוד) בלי קו תחתון.

**בדיקה:** קישורים בתוך `<nav>` מוצגים בלי קו תחתון; קישורים באזורים אחרים של העמוד (למשל בתוך `<footer>`) עדיין מציגים קו תחתון רגיל.

### תרגיל 3 — class מול id

**המשימה:** תארו (בכתיבה) תרחיש קונקרטי שבו class מתאימה יותר, ותרחיש שבו id מתאים יותר.

**בדיקה:** התיאורים מבוססים על "שימוש חוזר" (class) מול "ייחודיות" (id) כהבחנה המרכזית.

---

## פרויקט מסכם

**המשימה:** הוסיפו קובץ CSS ראשון לעמוד ה-"אודות" (מיחידת HTML) עם סלקטורים מגוונים.

**דרישות:**
1. סלקטור element (למשל `p`) שמעצב את כל הפסקאות
2. לפחות 2 class-ים שונות לאלמנטים ספציפיים (למשל `.highlight`, `.subtitle`)
3. סלקטור combinator אחד (רווח או `>`) שמתאר קשר מבני

**בדיקה:** העמוד נראה עכשיו עם עיצוב אמיתי (לא ברירת מחדל); בדיקה ב-DevTools מראה בדיוק אילו אלמנטים כל סלקטור פגע בהם.

---

## מה בפרק הבא

בפרק הבא נלמד על **Box Model & Units** — בשיעור הקודם למדנו **מה** לעצב (Selectors). עכשיו: איך CSS בכלל **מודד** גודל ומרווח? כל אלמנט ב-CSS, בלי יוצא מן הכלל, נחשב **קופסה מלבנית** — גם אם זה טקסט, תמונה, או כפתור. ה-**Box Model** מתאר את 
