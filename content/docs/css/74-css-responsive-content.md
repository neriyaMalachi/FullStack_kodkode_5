---
title: "Responsive Design"
slug: "74-css-responsive-content"
description: "עמוד אחד שמתאים את עצמו אוטומטית לכל גודל מסך — מנייד קטן ועד מסך שולחני רחב."
summary: "📖 שיעור"
date: 2026-08-09T00:00:00+02:00
lastmod: 2026-08-09T00:00:00+02:00
draft: false
weight: 741
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

עד עכשיו בנינו פריסות עם Flexbox ו-Grid, אבל בהנחה סמויה של מסך "רגיל". מה קורה כשאותו עמוד נפתח בטלפון נייד ברוחב 375px? sidebar שהיה 200px עלול לתפוס כמעט את כל המסך! **Responsive Design** הוא הגישה לבנות עמוד **אחד** שמתאים את עצמו אוטומטית לכל גודל מסך — לא לבנות עמוד נפרד לכל מכשיר.

## מילות מפתח שחשוב לזכור

• Media Query (שאילתת מדיה) — כלל CSS שחל **רק** כשתנאי מסוים על המסך מתקיים (למשל רוחב מסוים)

• Breakpoint (נקודת שבירה) — רוחב מסך שבו הפריסה "משתנה" באופן מכוון (למשל, מ-3 עמודות ל-1)

• Mobile-First — גישת עיצוב: כותבים קודם CSS למסך **קטן** (הכי מגביל), ואז **מוסיפים** שיפורים למסכים גדולים יותר עם `min-width`

• Viewport — אזור התצוגה הנראה בדפדפן/מכשיר; `<meta name="viewport">` ב-`<head>` קריטי כדי שמובייל לא "יזייף" רוחב שולחני

• Fluid Layout (פריסה נזילה) — פריסה שמשתמשת ביחידות יחסיות (`%`, `fr`, `flex-wrap`) כדי להתאים את עצמה **בלי** breakpoints בכלל, במקומות שאפשר

```css
.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card { flex: 1 1 300px; } /* grows/shrinks, base 300px */

@media (min-width: 768px) {
  .layout { grid-template-columns: 200px 1fr; }
}
```

## הדגמה חיה

<div class="demo-live" style="direction:rtl;border:1px solid #d1d5db;border-radius:10px;padding:1.25rem;margin:1.25rem 0;background:#fafafa;color:#111827;">
<p style="font-weight:600;margin:0 0 0.9rem;color:#6b7280;font-size:0.85rem;">🔴 הדגמה חיה — גררו את הפינה (↘ בפינה הימנית-תחתונה) כדי לשנות רוחב, ותראו את הכרטיסים "זורמים" מחדש — בלי אף media query</p>
<style>
.demo-resp-resizer{resize:horizontal;overflow:auto;min-width:160px;max-width:100%;width:420px;border:2px dashed #9ca3af;border-radius:8px;padding:0.75rem;background:#fff;}
.demo-resp-gallery{display:flex;flex-wrap:wrap;gap:8px;}
.demo-resp-card{flex:1 1 110px;background:#0ea5e9;color:#fff;border-radius:6px;padding:0.75rem;text-align:center;font-weight:700;font-size:0.85rem;}
</style>
<div class="demo-resp-resizer">
<div class="demo-resp-gallery">
<div class="demo-resp-card">כרטיס 1</div>
<div class="demo-resp-card">כרטיס 2</div>
<div class="demo-resp-card">כרטיס 3</div>
<div class="demo-resp-card">כרטיס 4</div>
</div>
</div>
</div>

## הסבר עיקרי

Mobile-First כסדר כתיבה, לא רק סיסמה — כותבים קודם CSS **בסיסי** שמתאים למסך הכי צר (בלי media query בכלל) — זה ברירת המחדל שכל מכשיר "רואה". אחר כך, `@media (min-width: 768px) { ... }` **מוסיף** שיפורים למסכים **גדולים יותר** מ-768px. זה הפוך מ"Desktop-First" (לכתוב לגדול ואז לצמצם) — Mobile-First בדרך כלל נותן CSS פשוט ואמין יותר, כי ברירת המחדל היא כבר המקרה המגביל ביותר.

flex: 1 1 300px כפריסה נזילה, בלי breakpoint — שימו לב שהדוגמה **לא** דורשת media query בכלל: `flex: 1 1 300px` (grow, shrink, basis) אומר "כל כרטיס רוצה 300px, אבל יכול לגדול או להתכווץ לפי המקום הפנוי" — בשילוב עם `flex-wrap: wrap` (משיעור Flexbox), הכרטיסים **אוטומטית** מסתדרים ליותר/פחות עמודות לפי רוחב המסך, בלי לקבוע breakpoint ידני בכלל.

Viewport meta tag כתנאי הכרחי — בלי `<meta name="viewport" content="width=device-width, initial-scale=1">` ב-`<head>`, דפדפני מובייל **מזייפים** רוחב שולחני (בד"כ 980px) ומקטינים את הכל בזום-החוצה — כל ה-Responsive Design שבניתם פשוט לא יעבוד כמצופה בלי השורה הזו.

## יתרונות

עמוד אחד משרת את כל המכשירים — לא צריך לתחזק גרסאות נפרדות; Mobile-First נותן ברירת מחדל פשוטה ואמינה; Fluid Layout (Flexbox/Grid עם יחידות יחסיות) מפחית את הצורך ב-breakpoints רבים.

## חסרונות

דורש בדיקה על מכשירים/רזולוציות מרובים בפועל; breakpoints רבים מדי (במקום Fluid Layout במקומות שאפשר) הופכים CSS למסורבל; קל לשכוח את ה-viewport meta tag ולתהות למה Responsive "לא עובד".

## נקודות חשובות

• Mobile-First: כותבים CSS בסיסי למסך קטן, ומוסיפים עם `min-width` למסכים גדולים

• Media Query חלה רק כשהתנאי (למשל רוחב מסך) מתקיים

• `<meta name="viewport">` הוא תנאי הכרחי ל-Responsive Design במובייל

• Fluid Layout (`flex`, `fr`, `%`) יכול להתאים למסך בלי breakpoints בכלל, במקומות רבים

## טעויות נפוצות

• שכחת `<meta name="viewport">` — כל ה-media queries "לא עובדות" כמצופה במובייל

• גישת Desktop-First (לכתוב לגדול, ואז "לתקן" לקטן) — בדרך כלל מוביל ל-CSS מסורבל יותר

• הגדרת יותר מדי breakpoints, במקום להשתמש ב-Fluid Layout (Flexbox/Grid) שמתאים את עצמו אוטומטית

## סיכום

Responsive Design בונה עמוד אחד שמתאים את עצמו לכל גודל מסך. Media Queries (`@media (min-width: ...)`) מחילות CSS רק בתנאים מסוימים; גישת Mobile-First כותבת קודם למסך קטן ומוסיפה שיפורים למסכים גדולים. Fluid Layout (Flexbox/Grid עם `flex`/`fr`) מפחית את הצורך ב-breakpoints ידניים. `<meta name="viewport">` הוא תנאי הכרחי לכל זה לעבוד במובייל.

## דוקומנטציה רשמית

[MDN — Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

---

## תרגילים

### תרגיל 1 — viewport meta tag

**המשימה:** הוסיפו `<meta name="viewport" content="width=device-width, initial-scale=1">` לעמוד קיים, ובדקו בכלי "Device Toolbar" של DevTools (סימולציית מובייל) לפני ואחרי.

**בדיקה:** לפני ההוספה, העמוד מוצג "מוקטן" ברוחב מלא בסימולציית מובייל; אחרי ההוספה, הוא מוצג בקנה מידה נכון.

### תרגיל 2 — Media Query בסיסי

**המשימה:** כתבו CSS שמשנה את `flex-direction` של תפריט מ-`column` (מובייל, ברירת מחדל) ל-`row` (מ-768px ומעלה) עם `@media (min-width: 768px)`.

**בדיקה:** בסימולציית מובייל צר, התפריט אנכי; ברוחב 768px ומעלה, הוא הופך לאופקי.

### תרגיל 3 — Fluid Layout בלי breakpoint

**המשימה:** עצבו גלריית כרטיסים עם `flex-wrap: wrap` ו-`flex: 1 1 250px` (בלי שום media query).

**בדיקה:** כמות הכרטיסים בכל שורה משתנה אוטומטית לפי רוחב החלון — יותר כרטיסים בשורה במסך רחב, פחות בצר — בלי אף `@media`.

---

## פרויקט מסכם

**המשימה:** הפכו את עמוד האודות (עם ה-Grid/Flexbox מהשיעורים הקודמים) ל-Responsive מלא.

**דרישות:**
1. `<meta name="viewport">` תקין ב-`<head>`
2. גישת Mobile-First: CSS בסיסי מתאים למובייל, עם `@media (min-width: ...)` לשיפורים במסכים גדולים
3. פריסת ה-Grid (header/sidebar/main/footer) עוברת לעמודה אחת (sidebar מעל main, לא לצד) במסך צר
4. גלריית הכרטיסים משתמשת ב-Fluid Layout (`flex-wrap`+`flex-basis`) בלי breakpoint נפרד לה

**בדיקה:** בדיקה ב-DevTools בשלושה רוחבי מסך שונים (מובייל, טאבלט, שולחני) מראה פריסה תקינה ושמישה בכל אחד, בלי גלישה אופקית או תוכן חתוך.

---

## מה בפרק הבא

בפרק הבא נלמד על **Transitions & Animations** — בשיעור Pseudo-Selectors ראינו ש-`:hover` יכול לשנות תכונה (למשל צבע רקע) — אבל השינוי קורה **מיידית**, בקפיצה חדה. **Transitions** הופכות שינוי כזה **להדרגתי** — מ-A ל-B לאורך זמן מוגדר, חלק ומהוקצע. 
