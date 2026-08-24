---
title: "Transitions & Animations (בונוס)"
slug: "75-css-transitions-animations-content"
description: "תנועה חלקה בין מצבים — משינוי מיידי ומקפצני לשינוי הדרגתי ומהוקצע, בלי JavaScript."
summary: "📖 שיעור"
date: 2026-08-09T00:00:00+02:00
lastmod: 2026-08-09T00:00:00+02:00
draft: false
weight: 751
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

בשיעור Pseudo-Selectors ראינו ש-`:hover` יכול לשנות תכונה (למשל צבע רקע) — אבל השינוי קורה **מיידית**, בקפיצה חדה. **Transitions** הופכות שינוי כזה **להדרגתי** — מ-A ל-B לאורך זמן מוגדר, חלק ומהוקצע. **Animations** הולכות צעד קדימה: מגדירות רצף שלבים מלא (לא רק "מ-A ל-B"), שיכול לרוץ אוטומטית, לחזור על עצמו, בלי שום אירוע מפעיל (כמו hover).

## מילות מפתח שחשוב לזכור

• `transition` — מגדיר שינוי הדרגתי בתכונה, כשהערך שלה משתנה (למשל ב-`:hover`)

• `transition-duration` — כמה זמן השינוי לוקח (למשל `0.3s`)

• `transition-timing-function` — "קצב" השינוי לאורך הזמן (`ease`, `linear`, `ease-in-out`)

• `@keyframes` — מגדיר רצף שלבים מלא (`0%`, `50%`, `100%`...) לאנימציה

• `animation` — מפעיל `@keyframes` על אלמנט, עם משך, חזרות, וכיוון

```css
.button {
  background: blue;
  transition: background 0.3s ease;
}
.button:hover { background: darkblue; }

@keyframes pulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.1); }
  100% { transform: scale(1); }
}
.badge { animation: pulse 2s infinite; }
```

## הדגמה חיה

<div class="demo-live" style="direction:rtl;border:1px solid #d1d5db;border-radius:10px;padding:1.25rem;margin:1.25rem 0;background:#fafafa;color:#111827;">
<p style="font-weight:600;margin:0 0 0.9rem;color:#6b7280;font-size:0.85rem;">🔴 הדגמה חיה — רחפו על הכפתור (transition), והביטו בעיגול הפועם לצדו (animation, רץ ברציפות)</p>
<style>
.demo-anim-btn{background:#2563eb;color:#fff;border:none;border-radius:8px;padding:0.6rem 1.3rem;font-size:0.95rem;font-weight:700;cursor:pointer;transition:background 0.35s ease,transform 0.35s ease;}
.demo-anim-btn:hover{background:#1e3a8a;transform:scale(1.08);}
@keyframes demo-anim-pulse{0%{transform:scale(1);opacity:1;}50%{transform:scale(1.25);opacity:0.7;}100%{transform:scale(1);opacity:1;}}
.demo-anim-badge{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:999px;background:#dc2626;color:#fff;font-weight:700;margin-inline-start:1.25rem;animation:demo-anim-pulse 1.6s ease-in-out infinite;}
</style>
<button class="demo-anim-btn">רחפו עליי</button>
<span class="demo-anim-badge">5</span>
</div>

## הסבר עיקרי

transition צריך שני "מצבים" קיימים — Transition **לא** יוצרת תנועה בעצמה — היא רק "מחליקה" בין ערך התחלתי לערך סופי, כשהערך **כבר משתנה** ממקור אחר (כמו `:hover`, או שינוי class ב-JavaScript). בלי `:hover` שמשנה את `background`, ה-`transition` שהגדרנו פשוט לא "יקרה" — אין לה מה "להחליק" ביניהם.

@keyframes נותן שליטה על כל הדרך, לא רק התחלה-סוף — `0% { scale(1) }`, `50% { scale(1.1) }`, `100% { scale(1) }` מתאר רצף שלם: גדל, ואז חוזר לגודל המקורי — לא רק "מ-A ל-B" כמו transition. `animation: pulse 2s infinite` מפעיל את זה **אוטומטית**, שוב ושוב (`infinite`), בלי צורך ב-`:hover` או כל אירוע מפעיל אחר.

transform במקום שינוי width/height ישיר — הדוגמה משתמשת ב-`transform: scale(...)` במקום, למשל, לשנות `width`/`height` ישירות. הסיבה: `transform` (וגם `opacity`) הם "זולים" לדפדפן לאנימציה — הוא לא צריך לחשב מחדש את כל הפריסה (layout) של שאר העמוד סביב האלמנט, רק "לצייר" אותו מחדש בגודל/מיקום שונה. שינוי `width`/`height` ישיר גורם ל-layout מחדש בכל פריים — הרבה יותר יקר ועלול "לגמגם".

## יתרונות

תנועה חלקה משפרת משמעותית תחושת "איכות" של ממשק, בלי שום JavaScript; `transform`/`opacity` נותנים אנימציות חלקות וזולות ביצועית; `@keyframes` נותן שליטה מלאה על רצפים מורכבים.

## חסרונות

אנימציות שינוי `width`/`height`/`top`/`left` ישירות (במקום `transform`) עלולות "לגמגם" בביצועים גרועים; שימוש-יתר באנימציות (הכל זז) פוגע בשימושיות ומעצבן משתמשים; חוסר תשומת לב לנגישות (`prefers-reduced-motion`) פוגע במשתמשים רגישים לתנועה.

## נקודות חשובות

• `transition` מחליק שינוי בין שני ערכים קיימים; `animation`+`@keyframes` מגדירים רצף שלם, אוטונומי

• `transition` דורש טריגר חיצוני (כמו `:hover`) שמשנה את הערך; `animation` יכול לרוץ לבד עם `infinite`

• `transform`/`opacity` הם התכונות ה"זולות" ביותר לאנימציה מבחינת ביצועים

• `transition-timing-function` קובע את "קצב" השינוי (`ease`, `linear`...)

## טעויות נפוצות

• להגדיר `transition` בלי שום דבר שמשנה את הערך בפועל — הוא פשוט לא "קורה" אף פעם

• אנימציית `width`/`height`/`top`/`left` ישירות במקום `transform` — ביצועים גרועים יותר

• שימוש-יתר באנימציות בכל מקום — מסיח דעת ופוגע בחוויית משתמש, במקום לשפר אותה

## סיכום

`transition` הופכת שינוי תכונה (כמו `:hover`) להדרגתי במקום מיידי — אך דורשת שינוי ערך ממקור חיצוני. `@keyframes`+`animation` מגדירים רצף שלבים מלא שיכול לרוץ אוטונומית. `transform`/`opacity` הם התכונות המומלצות לאנימציה מבחינת ביצועים, כי הן לא מכריחות חישוב layout מחדש.

## דוקומנטציה רשמית

[MDN — Using CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions/Using_CSS_transitions)

---

## תרגילים

### תרגיל 1 — transition ראשון

**המשימה:** הוסיפו לכפתור `transition: background 0.3s ease;` עם `:hover` ששינה רקע.

**בדיקה:** ריחוף עכבר מעל הכפתור מראה שינוי רקע **הדרגתי** (לא מיידי) לאורך כ-0.3 שניות.

### תרגיל 2 — @keyframes בסיסי

**המשימה:** כתבו `@keyframes` בשם `fadeIn` (מ-`opacity: 0` ל-`opacity: 1`), והפעילו אותו על אלמנט עם `animation: fadeIn 1s;`.

**בדיקה:** האלמנט "מופיע" בהדרגה כשהעמוד נטען, במקום להופיע מיד באטימות מלאה.

### תרגיל 3 — transform מול width לביצועים

**המשימה:** צרו שני אלמנטים שגדלים ב-`:hover` — אחד עם `transition: width`, השני עם `transition: transform` (`scale`). השוו חלקות התנועה (במיוחד אם יש הרבה תוכן סביב).

**בדיקה:** שני האלמנטים נראים "גדלים" חזותית, אך שינוי ה-`transform` לא גורם לתוכן שסביבו "לזוז"/להתאים מחדש (layout), בעוד ששינוי `width` כן.

---

## פרויקט מסכם

**המשימה:** הוסיפו אנימציות ואפקטי מעבר לעמוד האודות המלא (Grid+Flexbox+Responsive מהשיעורים הקודמים).

**דרישות:**
1. `transition` חלק על כל אלמנט אינטראקטיבי (כפתורים, קישורים) ב-`:hover`
2. אנימציית `@keyframes` אחת לפחות (למשל fade-in לכרטיסים בטעינת העמוד)
3. שימוש ב-`transform`/`opacity` בלבד לאנימציות (לא `width`/`height`/`top`/`left`)

**בדיקה:** כל אינטראקציה (hover) מרגישה חלקה, לא מיידית/מקפצנית; בדיקת Performance ב-DevTools (אם רוצים לאמת) לא מראה "Layout Shift" חוזר בזמן האנימציות.

---

## מה בפרק הבא

בפרק הבא — **פרויקט מסכם ליחידת CSS**: מעצבים את עמוד ה-HTML הסמנטי מהיחידה הקודמת במלואו — משתני CSS, Flexbox, Grid ותגובתיות — בלי לגעת ב-HTML עצמו.
