---
title: "Event Delegation"
slug: "84-dom-event-delegation-content"
description: "listener אחד על הורה, במקום עשרות על כל ילד — כולל ילדים שעוד לא נוצרו."
summary: "📖 שיעור"
date: 2026-08-09T00:00:00+02:00
lastmod: 2026-08-09T00:00:00+02:00
draft: false
weight: 841
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

בשיעור Creating & Removing בנינו רשימת משימות שגדלה דינמית. בעיה: אם רושמים `addEventListener` על **כל** פריט חדש שנוצר, זה לא רק מסורבל — פריטים שנוצרים **אחרי** שהקוד כבר רץ פעם אחת פשוט "מפספסים" את הרישום! **Event Delegation** פותר את זה בגישה שונה לגמרי: רושמים **listener יחיד** על ה**הורה** (שכבר קיים), ומשתמשים ב-`event.target` כדי לדעת על **איזה ילד** בדיוק לחצו — גם אם הוא נוצר אחרי שה-listener נרשם.

## מילות מפתח שחשוב לזכור

• Event Bubbling (בעבוע אירועים) — אירוע שקורה על אלמנט "מטפס" אוטומטית גם להורים שלו — זו התכונה שמאפשרת Delegation בכלל

• Event Delegation — רישום listener יחיד על הורה, שמטפל באירועים מכל הילדים שלו (כולל עתידיים) דרך `event.target`

• `event.target.closest(selector)` — (משיעור Traversing) הכלי המרכזי ב-Delegation — מוצא את ה"ילד הרלוונטי" מתוך `event.target`, גם אם הקליק היה על אלמנט מקונן עמוק בתוכו

```javascript
const list = document.querySelector(".task-list");

// listener יחיד — לא משנה כמה <li> יש או ייווצרו בעתיד
list.addEventListener("click", (event) => {
  const deleteBtn = event.target.closest(".delete-btn");
  if (!deleteBtn) return; // הקליק לא היה על כפתור מחיקה

  deleteBtn.closest("li").remove();
});
```

## הדגמה חיה

<div class="demo-live" style="direction:rtl;border:1px solid #d1d5db;border-radius:10px;padding:1.25rem;margin:1.25rem 0;background:#fafafa;color:#111827;">
<p style="font-weight:600;margin:0 0 0.9rem;color:#6b7280;font-size:0.85rem;">🔴 הדגמה חיה — listener יחיד על ה-ul; הוסיפו פריט חדש ובדקו שגם "מחק" שלו עובד</p>
<button onclick="const li=document.createElement('li'); li.style.cssText='background:#fff;border:1px solid #d1d5db;border-radius:6px;padding:0.4rem 0.6rem;margin-bottom:4px;display:flex;justify-content:space-between;'; li.innerHTML='<span>פריט חדש</span>'; const btn=document.createElement('button'); btn.className='demo-deleg-btn'; btn.textContent='מחק'; btn.style.cssText='background:#dc2626;color:#fff;border:none;border-radius:4px;padding:0.1rem 0.5rem;cursor:pointer;'; li.appendChild(btn); document.getElementById('demo-deleg-list').appendChild(li);" style="background:#2563eb;color:#fff;border:none;border-radius:6px;padding:0.5rem 1rem;font-weight:700;cursor:pointer;margin-bottom:0.75rem;">הוסף פריט דינמי</button>
<ul id="demo-deleg-list" onclick="const btn=event.target.closest('.demo-deleg-btn'); if(btn) btn.closest('li').remove();" style="list-style:none;padding:0;margin:0;">
<li style="background:#fff;border:1px solid #d1d5db;border-radius:6px;padding:0.4rem 0.6rem;margin-bottom:4px;display:flex;justify-content:space-between;"><span>פריט קיים מראש</span><button class="demo-deleg-btn" style="background:#dc2626;color:#fff;border:none;border-radius:4px;padding:0.1rem 0.5rem;cursor:pointer;">מחק</button></li>
</ul>
</div>

## הסבר עיקרי

Event Bubbling כבסיס לכל הרעיון — כשמשתמש לוחץ על כפתור "מחק" **בתוך** `<li>` **בתוך** `<ul>`, האירוע לא "נעצר" על הכפתור — הוא "מבעבע" אוטומטית גם ל-`<li>`, גם ל-`<ul>`, וכן הלאה עד ל-`document`. Delegation מנצל את זה: רושמים listener על ה-`<ul>` (ההורה היציב), ולא על כל `<li>` (שנוצרים ונהרסים).

closest פותר "על מה בדיוק לחצו" — `event.target` הוא האלמנט **המדויק** שנלחץ — יכול להיות ה"פנימי ביותר" של האייקון בכפתור, לא הכפתור עצמו. `event.target.closest(".delete-btn")` "מטפס" מ-`target` כלפי מעלה עד שמוצא את הכפתור — או `null` אם הקליק בכלל לא היה קרוב לכפתור מחיקה (ואז `return` מוקדם, כמו בדוגמה).

פותר את בעיית "אלמנטים עתידיים" — זה בדיוק היתרון המרכזי: ה-listener נרשם **פעם אחת**, על ה-`<ul>` שכבר קיים בטעינת העמוד. כל `<li>` חדש שנוצר **אחר כך** (כמו בשיעור Creating & Removing) **אוטומטית** מטופל, כי ה-Bubbling "מעלה" את האירוע שלו לאותו `<ul>` — בלי לרשום listener נפרד לכל פריט חדש.

## יתרונות

listener יחיד במקום עשרות — יעיל בזיכרון ובביצועים; עובד אוטומטית על אלמנטים שנוצרים בעתיד, בלי קוד נוסף; מרכז את כל לוגיקת הטיפול באזור אחד בקוד, קל יותר לתחזוקה.

## חסרונות

דורש הבנה של Event Bubbling ו-`closest` — פחות ישיר-לעין למתחילים; אם ההורה נבחר לא נכון (למשל, רחוק מדי בעץ), הקוד עדיין "עובד" אך פחות יעיל.

## נקודות חשובות למבחן / ראיון עבודה

• Event Delegation מנצל Event Bubbling — אירוע "מטפס" מהילד המדויק להורים שלו אוטומטית

• listener יחיד על הורה מטפל בכל הילדים, כולל כאלה שעוד לא נוצרו בזמן הרישום

• `event.target.closest(selector)` מוצא את "הילד הרלוונטי" מתוך אלמנט הקליק המדויק

• Delegation פותר את בעיית "פריטים דינמיים שלא היו קיימים בזמן `addEventListener`"

## טעויות נפוצות

• להמשיך לרשום `addEventListener` על כל אלמנט חדש בנפרד, במקום Delegation — לא-יעיל ומועד לבאגים (פספוס פריטים שנוצרו מאוחר)

• לשכוח `if (!deleteBtn) return;` — הקוד ממשיך לרוץ גם כשהקליק לא היה קרוב לכפתור הרלוונטי, ועלול לזרוק שגיאה

• לבלבל בין `event.target` (המדויק) ל-`event.currentTarget` (האלמנט שעליו רשמו את ה-listener — ה"הורה")

## סיכום

Event Delegation רושם listener יחיד על הורה יציב, ומנצל Event Bubbling כדי לטפל בקליקים על כל הילדים — כולל כאלה שייווצרו בעתיד. `event.target.closest(selector)` מוצא את הילד הרלוונטי מתוך אלמנט הקליק המדויק. זה פותר בדיוק את הבעיה של רשימות דינמיות (Creating & Removing) — יעיל יותר וחסין יותר מרישום listener נפרד לכל פריט.

## דוקומנטציה רשמית

[MDN — Event bubbling and capture](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_bubbling_and_capture)

---

## תרגילים

### תרגיל 1 — Delegation בסיסי

**המשימה:** על רשימת `<li>` קיימת, רשמו listener **יחיד** על ה-`<ul>` שמדפיס את `event.target.textContent` בכל קליק על פריט.

**בדיקה:** קליק על כל פריט מדפיס את הטקסט שלו, למרות שה-listener נרשם רק פעם אחת על ה-`<ul>`.

### תרגיל 2 — closest למציאת כפתור מקונן

**המשימה:** הוסיפו לכל פריט ברשימה כפתור "מחק" מקונן. השתמשו ב-`event.target.closest(".delete-btn")` מתוך ה-listener היחיד על ה-`<ul>`.

**בדיקה:** קליק על הכפתור (או אפילו על אייקון בתוכו, אם יש) מזוהה נכון כ-"delete-btn"; קליק בשאר הפריט לא מזוהה ככפתור מחיקה.

### תרגיל 3 — פריטים דינמיים

**המשימה:** הוסיפו כפתור "הוסף פריט חדש" שיוצר `<li>` חדש (עם כפתור מחיקה) בזמן ריצה. בדקו שהמחיקה עובדת גם על הפריט החדש, בלי לרשום לו listener נפרד.

**בדיקה:** לחיצה על "מחק" בפריט **שנוצר אחרי טעינת הדף** עדיין עובדת נכון — הוכחה ל-Delegation אמיתי.

---

## פרויקט מסכם

**המשימה:** שכתבו את רשימת המטלות (משיעור Creating & Removing) עם Event Delegation, במקום listener לכל פריט.

**דרישות:**
1. listener יחיד על ה-`<ul>`/container, לא על כל `<li>` בנפרד
2. שימוש ב-`event.target.closest(".delete-btn")` לזיהוי לחיצות מחיקה
3. תמיכה בכפתור "סמן כבוצע" נוסף על כל פריט, גם הוא מטופל דרך אותו listener יחיד (עם `closest` מתאים)
4. הוספת פריטים חדשים בזמן ריצה, ווידוא שכל הכפתורים עליהם עובדים בלי קוד נוסף

**בדיקה:** מחיקה וסימון-כבוצע עובדים נכון על פריטים ישנים וחדשים כאחד; הקוד מכיל `addEventListener` יחיד לכל הרשימה, לא אחד לכל פריט.

---

## מה בפרק הבא

בפרק הבא נלמד על **LocalStorage** — כל מה שבנינו עד עכשיו נעלם ברענון עמוד — רשימת המשימות, ה-dark mode, כל state ב-JavaScript חוזר לברירת המחדל. ביחידת ה-DB למדנו לשמור נתונים בשרת — אבל מה אם רוצים לשמור **מקומית, בדפדפן עצמו**, בלי ש
