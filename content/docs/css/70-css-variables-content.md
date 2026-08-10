---
title: "CSS Variables"
slug: "70-css-variables-content"
description: "ערכים לשימוש חוזר שמוגדרים פעם אחת ומעודכנים בכל מקום — לא עוד \"חיפוש-החלפה\" ידני."
summary: "📖 שיעור"
date: 2026-08-09T00:00:00+02:00
lastmod: 2026-08-09T00:00:00+02:00
draft: false
weight: 701
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

לאורך שיעורי ה-CSS השתמשנו בערכים ישירים — `color: #3498db`, `padding: 16px` — שוב ושוב, בכל מקום שרצינו אותו צבע/מרווח. מה קורה כשמחליטים לשנות את הצבע הראשי של האתר? חייבים לחפש **כל** מקום שבו הוא מופיע ולהחליף ידנית — מועד לטעויות ולפספוסים. **CSS Variables** (Custom Properties) פותרות את זה: מגדירים ערך **פעם אחת**, בשם משמעותי, ומשתמשים בו בכל מקום — שינוי במקום אחד מתעדכן **בכל מקום** שבו הוא בשימוש.

## מילות מפתח שחשוב לזכור

• Custom Property (משתנה CSS) — מוגדר עם קידומת `--` (למשל `--main-color`), ערך לשימוש חוזר

• `:root` — סלקטור שמייצג את שורש המסמך; משתנים שמוגדרים שם זמינים **בכל** העמוד

• `var(--name)` — פונקציה שקוראת לערך של המשתנה, בכל מקום ב-CSS

• Fallback Value — ערך גיבוי: `var(--name, blue)` משתמש ב-`blue` אם `--name` לא מוגדר

• Cascade + Scope — משתנה CSS "יורש" ומשתתף ב-Cascade כמו כל תכונה אחרת — אפשר "לדרוס" אותו ברמת אלמנט ספציפי

```css
:root {
  --main-color: #3498db;
  --spacing: 16px;
}

.card {
  color: var(--main-color);
  padding: var(--spacing);
}

.card.dark {
  --main-color: #2c3e50; /* דורס רק בתוך .card.dark */
}
```

## הדגמה חיה

<div class="demo-live" style="direction:rtl;border:1px solid #d1d5db;border-radius:10px;padding:1.25rem;margin:1.25rem 0;background:#fafafa;color:#111827;">
<p style="font-weight:600;margin:0 0 0.9rem;color:#6b7280;font-size:0.85rem;">🔴 הדגמה חיה — לחצו על התיבה, בלי שום JavaScript, רק CSS</p>
<style>
.demo-vars-checkbox{width:18px;height:18px;vertical-align:middle;cursor:pointer;}
.demo-vars-label{margin-inline-start:0.5rem;cursor:pointer;font-weight:600;}
.demo-vars-card{--card-bg:#ffffff;--card-fg:#111827;--card-accent:#2563eb;background:var(--card-bg);color:var(--card-fg);border:1px solid #d1d5db;border-radius:8px;padding:1rem;margin-top:0.9rem;transition:background 0.3s ease,color 0.3s ease;}
.demo-vars-checkbox:checked ~ .demo-vars-card{--card-bg:#1f2937;--card-fg:#f9fafb;--card-accent:#60a5fa;}
.demo-vars-card h5{color:var(--card-accent);margin:0 0 0.4rem;}
</style>
<input type="checkbox" id="demo-vars-toggle" class="demo-vars-checkbox" />
<label for="demo-vars-toggle" class="demo-vars-label">🌙 הפעל ערכת כהה (דריסת <code style="direction:ltr;display:inline-block;">--card-bg</code>)</label>
<div class="demo-vars-card">
<h5>כרטיס עם CSS Variables</h5>
<p style="margin:0;">הרקע, הטקסט, וצבע הכותרת כולם קוראים ל-<code style="direction:ltr;display:inline-block;">var(--card-bg)</code> וכו' — שינוי המשתנים דרך התיבה למעלה משנה את כל הכרטיס בבת אחת.</p>
</div>
</div>

## הסבר עיקרי

:root כ"מקום מרכזי" — מגדירים משתנים תחת `:root` (בפועל, האלמנט `<html>`) כדי שיהיו זמינים **לכל** העמוד — בדיוק כמו קובץ קונפיגורציה מרכזי. בכל מקום אחר ב-CSS, `var(--main-color)` "מושך" את הערך משם.

עדכון אחד, כל מקום מתעדכן — זה בדיוק היתרון המרכזי: אם `--main-color` משתנה מ-`#3498db` לצבע אחר, **כל** מקום שהשתמש ב-`var(--main-color)` מתעדכן אוטומטית — בלי לחפש ולהחליף ידנית בעשרות מקומות בקובץ ה-CSS.

דריסה מקומית (Scope) — שימו לב בדוגמה: `.card.dark` **מגדיר מחדש** את `--main-color` — אבל רק **בתוך** `.card.dark` (וצאצאיו). זה מאפשר "ערכת נושא" (theme) חלופית לחלק מהעמוד, בלי לשנות את המשתנה הגלובלי — בדיוק כמו scope של משתנה `let`/`const` ב-JavaScript שכבר מכירים.

## יתרונות

עדכון ערך במקום אחד משפיע על כל השימושים בו; קריא יותר — `var(--main-color)` מתאר משמעות, לא רק צבע גולמי; תומך ב-Scope — אפשר "לדרוס" ערך באזור ספציפי, כמו dark mode לחלק מהעמוד.

## חסרונות

דורש תכנון מראש (אילו ערכים באמת חוזרים על עצמם וכדאי להפוך למשתנה); שמות משתנים לא-עקביים בפרויקט גדול יכולים ליצור בלגן; פחות "תכונות" מפתרונות preprocessor כמו Sass (אין חישובים מובנים, לדוגמה).

## נקודות חשובות למבחן / ראיון עבודה

• `--name: value;` מגדיר משתנה; `var(--name)` קורא לו

• `:root` הוא המקום הנפוץ ביותר להגדרת משתנים גלובליים

• `var(--name, fallback)` נותן ערך גיבוי אם המשתנה לא מוגדר

• משתנים משתתפים ב-Cascade — אפשר לדרוס אותם ברמת סלקטור ספציפי (Scope)

## טעויות נפוצות

• שכחת קידומת `--` בהגדרה — בלעדיה, זה לא מוגדר כמשתנה בכלל

• שימוש-יתר במשתנים לכל ערך, גם כאלה שלא חוזרים על עצמם — מוסיף מורכבות בלי תועלת

• להגדיר משתנה בתוך סלקטור ספציפי (לא `:root`) ולצפות שיהיה זמין גלובלית — הוא זמין רק שם ובצאצאיו

## סיכום

CSS Variables (`--name`, נקראים עם `var(--name)`) נותנים ערכים לשימוש חוזר שמוגדרים פעם אחת. `:root` הוא המקום הנפוץ למשתנים גלובליים; אפשר לדרוס אותם ברמת סלקטור ספציפי (Scope), בדיוק כמו Cascade רגילה. עדכון ערך במקום אחד משפיע על כל השימושים בו — בלי חיפוש-והחלפה ידני.

## דוקומנטציה רשמית

[MDN — Using CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

## תרגילים

### תרגיל 1 — משתנה ראשון

**המשימה:** הגדירו `--main-color` תחת `:root`, והשתמשו בו ב-`color` של לפחות 3 אלמנטים שונים בעמוד.

**בדיקה:** שינוי הערך של `--main-color` במקום ההגדרה היחיד משנה את הצבע בכל שלושת האלמנטים בו-זמנית.

### תרגיל 2 — Fallback Value

**המשימה:** השתמשו ב-`var(--undefined-var, green)` על אלמנט, כשה-`--undefined-var` לא מוגדר בכלל.

**בדיקה:** האלמנט מוצג בירוק (ה-fallback) — הוכחה שהפונקציה `var` משתמשת בערך הגיבוי כשהמשתנה חסר.

### תרגיל 3 — דריסת Scope

**המשימה:** הגדירו `--card-bg` תחת `:root` בצבע אחד, ודרסו אותו לצבע אחר בתוך class ספציפית (למשל `.dark-card`).

**בדיקה:** כרטיסים רגילים מציגים את הצבע הגלובלי; כרטיסים עם `.dark-card` מציגים את הצבע הדרוס — בלי שהגדרת ה-`:root` השתנתה.

---

## פרויקט מסכם

**המשימה:** בנו "מערכת עיצוב" (design system) בסיסית לעמוד האודות בעזרת CSS Variables.

**דרישות:**
1. משתנים תחת `:root` ל: צבע ראשי, צבע משני, מרווח בסיסי, רדיוס פינות
2. שימוש בכל המשתנים האלה בלפחות 4 מקומות שונים בעמוד
3. סכימת "ערכת כהה" (`.dark-theme` על `<body>` או דומה) שדורסת את המשתנים הרלוונטיים

**בדיקה:** הוספת class `.dark-theme` ל-`<body>` משנה את מראה כל האלמנטים שמשתמשים במשתנים, בלי לגעת בשום כלל CSS אחר.

---

## מה בפרק הבא

בפרק הבא נלמד על **CSS Position** — עד עכשיו, כל האלמנטים שלנו זרמו זה אחרי זה, מלמעלה למטה, בסדר שהם מופיעים ב-HTML ("Normal Flow"). אבל מה אם רוצים כפתור "X" שצף **בפינה** של כרטיס, בלי קשר לזרימה הרגילה? או תפריט עליון שנשאר **דבוק**
