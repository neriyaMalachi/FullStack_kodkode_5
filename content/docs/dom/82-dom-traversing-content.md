---
title: "Traversing the DOM"
slug: "82-dom-traversing-content"
description: "נעים בין אלמנטים קרובים — הורה, ילדים, אחים — בלי לבחור אותם מחדש מ-document."
summary: "📖 שיעור"
date: 2026-08-09T00:00:00+02:00
lastmod: 2026-08-09T00:00:00+02:00
draft: false
weight: 821
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

עד עכשיו כל בחירה של אלמנט התחילה מ-`document.querySelector`. אבל מה אם יש לכם **כבר** אלמנט (למשל, זה שנלחץ ב-`event.target`), ורוצים להגיע ל**הורה** שלו, או ל**אח** הסמוך? לחפש מחדש מ-`document` יהיה מיותר ולפעמים בלתי אפשרי (אם אין סלקטור ייחודי). **Traversing** (ניווט בעץ) נותן דרך לנוע **יחסית** לאלמנט שכבר יש לכם ביד.

## מילות מפתח שחשוב לזכור

• `element.parentElement` — האלמנט ההורה הישיר

• `element.children` — כל הילדים הישירים (רק Elements, לא טקסט)

• `element.closest(selector)` — מחפש **כלפי מעלה** בעץ (הורה, סבא...) עד שמוצא אלמנט שתואם לסלקטור — או `null`

• `element.nextElementSibling` / `.previousElementSibling` — האח הבא/הקודם (רק Elements)

```javascript
const item = document.querySelector(".task-item");

console.log(item.parentElement);       // <ul class="task-list">
console.log(item.children);            // ילדי הפריט (אם יש)
console.log(item.nextElementSibling);  // הפריט הבא ברשימה

const card = item.closest(".card");    // מחפש כרטיס-אב, גם אם מקונן עמוק
```

## הדגמה חיה

<div class="demo-live" style="direction:rtl;border:1px solid #d1d5db;border-radius:10px;padding:1.25rem;margin:1.25rem 0;background:#fafafa;color:#111827;">
<p style="font-weight:600;margin:0 0 0.9rem;color:#6b7280;font-size:0.85rem;">🔴 הדגמה חיה — לחצו על האייקון הפנימי; closest('.demo-trav-card') מוצא ומסמן את הכרטיס האב</p>
<div id="demo-trav-card" class="demo-trav-card" style="background:#fff;border:2px solid #d1d5db;border-radius:8px;padding:1rem;display:inline-block;transition:border-color 0.3s;">
כרטיס חיצוני
<button onclick="event.target.closest('.demo-trav-card').style.borderColor='#059669'" style="margin-inline-start:0.5rem;background:#e5e7eb;border:none;border-radius:4px;padding:0.2rem 0.6rem;cursor:pointer;">🔍 אייקון מקונן (לחצו)</button>
</div>
</div>

## הסבר עיקרי

closest כ"חיפוש כלפי מעלה" — `closest` שימושי במיוחד כשמקבלים `event.target` בתוך handler על אלמנט מקונן עמוק (למשל, קליק על אייקון **בתוך** כפתור **בתוך** כרטיס) — `event.target.closest(".card")` "מטפס" בעץ עד שמוצא את הכרטיס האב, לא משנה כמה עמוק ה-`target` המקורי מקונן. זה קריטי בשיעור הבא (Event Delegation).

parentElement מול children — כיוונים הפוכים: `parentElement` הולך **כלפי מעלה** (הורה יחיד); `children` הולך **כלפי מטה** (כל הילדים הישירים, לא נכדים). שני אלה **לא** משתמשים ב-selector בכלל — הם פשוט "עוקבים אחרי הקשרים" בעץ, בלי לחפש שום דבר.

Elements בלבד, לא כל Node — `children` מחזיר **רק** Elements — לא Text Nodes (רווחים בין תגיות). זה בדרך כלל מה שרוצים בפועל — לעבוד רק עם תגי HTML אמיתיים, לא עם רווחים "שקופים" בין תגיות.

## יתרונות

מאפשר ניווט יעיל יחסית לאלמנט קיים, בלי חיפוש חוזר מ-`document`; `closest` נותן דרך אמינה למצוא הורה רלוונטי, גם עם קינון עמוק ולא-צפוי; מתאים במיוחד לעבודה עם `event.target`.

## חסרונות

שרשראות ניווט ארוכות (כמה `parentElement` ברצף) שבירות מאוד — כל שינוי קטן ב-HTML שובר אותן; פחות ברור/מפורש מ-`querySelector` עם class ייעודית.

## נקודות חשובות למבחן / ראיון עבודה

• `parentElement`/`children`/`nextElementSibling` נעים יחסית לאלמנט קיים, בלי חיפוש חדש

• `closest(selector)` מחפש כלפי מעלה עד שמוצא התאמה — או `null`

• `children` מחזיר רק Elements, לא Text Nodes

• `closest` שימושי במיוחד עם `event.target` באירועים על אלמנטים מקוננים

## טעויות נפוצות

• שרשראות ניווט ארוכות ושבירות במקום `closest` עם סלקטור ברור

• להניח ש-`children` כולל טקסט/רווחים — הוא כולל רק Elements

• לשכוח לבדוק `null` אחרי `closest` (אם לא נמצא הורה תואם)

## סיכום

Traversing נותן ניווט יחסי לאלמנט קיים בעץ ה-DOM: `parentElement` (למעלה), `children` (למטה), `nextElementSibling`/`previousElementSibling` (לצדדים). `closest(selector)` מחפש הורה תואם כלפי מעלה, גם עם קינון עמוק — שימושי מאוד עם `event.target`.

## דוקומנטציה רשמית

[MDN — Element.closest()](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest)

---

## תרגילים

### תרגיל 1 — parentElement ו-children

**המשימה:** בחרו אלמנט מקונן, והדפיסו את `.parentElement` ואת `.children` שלו.

**בדיקה:** `.parentElement` מציג את ההורה הישיר הנכון; `.children` מציג רק Elements, לא טקסט.

### תרגיל 2 — nextElementSibling

**המשימה:** על רשימת `<li>`, בחרו את הראשון ונווטו דרך `nextElementSibling` שוב ושוב (עם לולאה) עד `null`.

**בדיקה:** הלולאה עוברת על כל פריטי הרשימה בסדר, ועוצרת אוטומטית כשמגיעה לסוף.

### תרגיל 3 — closest

**המשימה:** על אייקון מקונן עמוק בתוך כרטיס, השתמשו ב-`closest(".card")` מתוך handler על האייקון הפנימי.

**בדיקה:** `closest` מוצא ומחזיר את הכרטיס האב, למרות שהאירוע קרה על האייקון המקונן עמוק בתוכו.

---

## פרויקט מסכם

**המשימה:** הוסיפו לכל כרטיס ברשימת הכרטיסים (מיחידת CSS) כפתור "מחק" שמוחק את **הכרטיס כולו**, לא רק את הכפתור.

**דרישות:**
1. כל כרטיס מכיל כפתור "מחק" מקונן בתוכו
2. ה-handler על הכפתור משתמש ב-`closest(".card")` כדי למצוא את הכרטיס האב
3. `.remove()` מסיר את הכרטיס השלם מהעמוד

**בדיקה:** קליק על "מחק" בכל כרטיס מסיר בדיוק את הכרטיס הנכון (זה שהכפתור מקונן בתוכו), לא כרטיס אחר.

---

## מה בפרק הבא

בפרק הבא נלמד על **DOM Forms** — ביחידת ה-HTML למדנו Forms כמנגנון שהדפדפן מטפל בו לבד (`action`+`method`). ביחידת Events למדנו `preventDefault` למניעת רענון. עכשיו: איך בפועל **קוראים** את כל הנתונים שהמשתמש הזין, כדי לעבד אותם ב-Ja
