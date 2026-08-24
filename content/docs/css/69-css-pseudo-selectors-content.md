---
title: "Pseudo-Selectors"
slug: "69-css-pseudo-selectors-content"
description: "בוחרים אלמנטים לפי מצב (hover, focus) או מיקום מבני (nth-child) — בלי class נוספת בכל HTML."
summary: "📖 שיעור"
date: 2026-08-09T00:00:00+02:00
lastmod: 2026-08-09T00:00:00+02:00
draft: false
weight: 691
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

בשיעור Selectors בחרנו אלמנטים לפי תג/class/id — תכונות **קבועות** ב-HTML. אבל מה אם רוצים לעצב כפתור **רק כשהעכבר מרחף מעליו**, או **רק שורה שנייה** בטבלה, בלי להוסיף class נפרדת לכל שורה? **Pseudo-classes** בוחרות לפי **מצב** או **מיקום מבני** של אלמנט; **Pseudo-elements** יוצרים "חלק וירטואלי" של אלמנט שלא קיים ב-HTML בכלל.

## מילות מפתח שחשוב לזכור

• Pseudo-class (פסאודו-מחלקה, `:name`) — בוחר אלמנט לפי מצב/מיקום, לא תג/class קבועים

• `:hover` — כשהעכבר מרחף מעל האלמנט

• `:focus` — כשהאלמנט ממוקד (למשל, שדה `<input>` שנלחץ עליו) — קריטי לנגישות מקלדת

• `:nth-child(n)` — בוחר אלמנט לפי מיקומו בין אחיו (למשל `:nth-child(2)` = השני, `:nth-child(odd)` = כל האי-זוגיים)

• Pseudo-element (פסאודו-אלמנט, `::name`) — יוצר "חלק" באלמנט שלא קיים ב-HTML: `::before`/`::after` (תוכן שנוסף לפני/אחרי), `::first-line`

```css
button:hover { background: #eee; }
input:focus { outline: 2px solid blue; }
tr:nth-child(odd) { background: #f9f9f9; }
.tooltip::after { content: "More info"; }
```

## הדגמה חיה

<div class="demo-live" style="direction:rtl;border:1px solid #d1d5db;border-radius:10px;padding:1.25rem;margin:1.25rem 0;background:#fafafa;color:#111827;">
<p style="font-weight:600;margin:0 0 0.9rem;color:#6b7280;font-size:0.85rem;">🔴 הדגמה חיה — נסו לרחף עם העכבר, ללחוץ Tab, ולהסתכל על הפסים</p>
<style>
.demo-pseudo-btn{background:#e5e7eb;border:1px solid #9ca3af;border-radius:6px;padding:0.5rem 1rem;font-size:0.95rem;cursor:pointer;transition:background 0.2s;}
.demo-pseudo-btn:hover{background:#a7f3d0;}
.demo-pseudo-input{border:1px solid #9ca3af;border-radius:6px;padding:0.45rem 0.6rem;font-size:0.95rem;outline:none;margin-inline-start:0.75rem;}
.demo-pseudo-input:focus{outline:3px solid #60a5fa;border-color:#2563eb;}
.demo-pseudo-list{list-style:none;margin:0.9rem 0 0;padding:0;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;}
.demo-pseudo-list li{padding:0.4rem 0.75rem;}
.demo-pseudo-list li:nth-child(odd){background:#f3f4f6;}
.demo-pseudo-quote::after{content:" ✓ נוצר עם ::after";color:#059669;font-weight:600;}
</style>
<button class="demo-pseudo-btn">רחפו עליי (:hover)</button>
<input class="demo-pseudo-input" type="text" placeholder="לחצו כאן (:focus)" />
<ul class="demo-pseudo-list">
<li>שורה 1 (אי-זוגית — רקע אפור)</li>
<li>שורה 2 (זוגית)</li>
<li>שורה 3 (אי-זוגית — רקע אפור)</li>
<li>שורה 4 (זוגית)</li>
</ul>
<p class="demo-pseudo-quote" style="margin:0.75rem 0 0;font-size:0.9rem;">הטקסט הזה</p>
</div>

## הסבר עיקרי

:hover ו-:focus כמצבים דינמיים — האלמנט עצמו לא משתנה ב-HTML — רק ה**מצב** שלו (העכבר עליו, או שהוא ממוקד) קובע אם החוק חל. זה מה שנותן לכפתורים ושדות "תגובתיות" ויזואלית בלי שום JavaScript. `:focus` חשוב במיוחד לנגישות — משתמש שמנווט עם מקלדת (Tab) צריך לראות **בבירור** איזה אלמנט ממוקד כרגע.

:nth-child כדפוס מבני, לא class — דמיינו טבלה עם 50 שורות, ורוצים "פסים" (שורה בהירה, שורה כהה, לסירוגין) — בלי `:nth-child(odd)`/`:nth-child(even)`, הייתם צריכים להוסיף class ל**כל שורה בנפרד**. `:nth-child` נותן דפוס אוטומטי לפי מיקום, בלי לגעת ב-HTML כלל.

::before/::after כתוכן וירטואלי — `content: "מידע נוסף"` עם `::after` **יוצר** טקסט חדש שלא קיים ב-HTML המקורי בכלל — נוסף חזותית "אחרי" האלמנט. זה שימושי לאייקונים דקורטיביים, ציטוטים, או תוויות קטנות — בלי "ללכלך" את ה-HTML הסמנטי בתוכן שהוא בעצם עיצוב, לא מידע.

## יתרונות

:hover/:focus נותנים אינטראקטיביות חזותית בלי שום JavaScript; :nth-child חוסך צורך ב-class נפרדת לכל אלמנט; ::before/::after מוסיפים תוכן עיצובי בלי "ללכלך" את ה-HTML הסמנטי.

## חסרונות

שימוש-יתר ב-::before/::after להסתרת תוכן **משמעותי** (לא דקורטיבי) פוגע בנגישות — קוראי מסך לא תמיד "רואים" תוכן שנוצר ב-CSS; `:nth-child` עם ביטויים מורכבים (`:nth-child(3n+1)`) פחות אינטואיטיבי בהתחלה.

## נקודות חשובות

• Pseudo-class (`:name`, נקודה אחת) בוחר לפי מצב/מיקום; Pseudo-element (`::name`, שתי נקודות) יוצר חלק וירטואלי

• `:focus` קריטי לנגישות — חייב להישאר ברור למשתמשי מקלדת, לא להסיר אותו סתם

• `:nth-child(odd)`/`:nth-child(even)` נותנים דפוסים לסירוגין בלי class נוספת

• `::before`/`::after` דורשים `content` כדי להופיע בכלל, גם אם ריק (`content: ""`)

## טעויות נפוצות

• הסרת עיצוב `:focus` ברירת מחדל (`outline: none`) בלי להחליף באלטרנטיבה — פוגע קשות בנגישות מקלדת

• שימוש ב-`::before`/`::after` לתוכן **משמעותי** (לא רק דקורטיבי) — קוראי מסך עלולים לפספס אותו

• שכחת `content` על `::before`/`::after` — הפסאודו-אלמנט פשוט לא מופיע בכלל

## סיכום

Pseudo-classes (`:hover`, `:focus`, `:nth-child`) בוחרות אלמנטים לפי מצב או מיקום מבני, לא תכונות קבועות ב-HTML. Pseudo-elements (`::before`, `::after`) יוצרים תוכן וירטואלי שלא קיים ב-HTML. `:focus` קריטי לנגישות מקלדת — אסור להסיר בלי תחליף.

## דוקומנטציה רשמית

[MDN — Pseudo-classes and pseudo-elements](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Pseudo-classes_and_pseudo-elements)

---

## תרגילים

### תרגיל 1 — hover ו-focus

**המשימה:** עצבו כפתור עם `:hover` (שינוי רקע) ושדה `<input>` עם `:focus` (מסגרת בולטת).

**בדיקה:** ריחוף עכבר מעל הכפתור משנה רקע מיד; לחיצת Tab עד לשדה ה-input מציגה מסגרת ברורה.

### תרגיל 2 — nth-child לפסים

**המשימה:** צרו רשימה או טבלה עם לפחות 6 שורות, ועצבו שורות אי-זוגיות ברקע אפור בעזרת `:nth-child(odd)`.

**בדיקה:** השורות 1, 3, 5 (אי-זוגיות) מוצגות עם רקע אפור; 2, 4, 6 נשארות בברירת המחדל.

### תרגיל 3 — ::after לתוכן דקורטיבי

**המשימה:** הוסיפו לקישורים חיצוניים (`<a>` עם `target="_blank"`) סימן קטן (כמו חץ) אחרי הטקסט, בעזרת `::after` ו-`content`.

**בדיקה:** הסימן מופיע אחרי כל קישור חיצוני, בלי להוסיף אותו בפועל ל-HTML.

---

## פרויקט מסכם

**המשימה:** שפרו את הנגישות והאינטראקטיביות של עמוד האודות עם Pseudo-selectors.

**דרישות:**
1. כל אלמנט לחיץ (כפתורים, קישורים) מקבל עיצוב `:hover` ברור
2. כל שדה קלט (מיחידת HTML Forms) מקבל עיצוב `:focus` בולט וברור
3. טבלה או רשימה עם `:nth-child` לפסים לסירוגין
4. שימוש אחד לפחות ב-`::before`/`::after` לתוכן דקורטיבי (לא משמעותי)

**בדיקה:** ניווט מלא במקלדת (Tab) בעמוד מראה בבירור איפה הפוקוס בכל רגע; אף אלמנט אינטראקטיבי לא "שקוף" ויזואלית ב-hover/focus.

---

## מה בפרק הבא

בפרק הבא נלמד על **CSS Variables** — לאורך שיעורי ה-CSS השתמשנו בערכים ישירים — `color: #3498db`, `padding: 16px` — שוב ושוב, בכל מקום שרצינו אותו צבע/מרווח. מה קורה כשמחליטים לשנות את הצבע הראשי של האתר? חייבים לחפש **כל** מקום שבו הוא 
