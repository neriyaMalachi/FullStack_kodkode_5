---
title: "DOM Events"
slug: "78-dom-events-content"
description: "איך קוד \"מגיב\" לפעולות משתמש — קליק, הקלדה, ריחוף — בזמן אמת."
summary: "📖 שיעור"
date: 2026-08-09T00:00:00+02:00
lastmod: 2026-08-09T00:00:00+02:00
draft: false
weight: 781
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

עד עכשיו כל מה שכתבנו רץ **פעם אחת**, כשהעמוד נטען. אבל אפליקציה אמיתית מגיבה **למשתמש** — קליק על כפתור, הקלדה בשדה. **Events** (אירועים) הם המנגנון של הדפדפן להודיע לקוד "קרה משהו" — ו-**Event Listeners** הן פונקציות שנרשמות "להאזין" לאירוע מסוים, ורצות **בכל פעם** שהוא קורה.

## מילות מפתח שחשוב לזכור

• Event (אירוע) — פעולה שקרתה בעמוד: `click`, `input`, `submit`, `keydown` ועוד

• `addEventListener(event, callback)` — רושם פונקציה שתרוץ **בכל פעם** שהאירוע קורה על האלמנט

• Event Object — האובייקט שמועבר אוטומטית ל-callback, עם מידע על האירוע (`event.target`, `event.type`...)

• `event.target` — האלמנט **המדויק** שעליו האירוע קרה (חשוב מאוד באירועים על אלמנטים מקוננים)

• `event.preventDefault()` — מבטל את התנהגות ברירת המחדל של הדפדפן לאירוע (למשל, מניעת רענון עמוד בשליחת טופס)

```javascript
const button = document.querySelector(".submit-btn");

button.addEventListener("click", (event) => {
  console.log("נלחץ!", event.target);
});
```

## הדגמה חיה

<div class="demo-live" style="direction:rtl;border:1px solid #d1d5db;border-radius:10px;padding:1.25rem;margin:1.25rem 0;background:#fafafa;color:#111827;">
<p style="font-weight:600;margin:0 0 0.9rem;color:#6b7280;font-size:0.85rem;">🔴 הדגמה חיה — כל קליק מפעיל מחדש את ה-callback שנרשם עם addEventListener</p>
<button id="demo-events-btn" onclick="this.dataset.count=(+this.dataset.count||0)+1; document.getElementById('demo-events-out').textContent='נלחץ ' + this.dataset.count + ' פעמים — event.target = <button>';" style="background:#2563eb;color:#fff;border:none;border-radius:6px;padding:0.5rem 1.2rem;font-weight:700;cursor:pointer;">לחצו עליי</button>
<p id="demo-events-out" style="margin:0.75rem 0 0;font-size:0.85rem;color:#059669;font-weight:600;">עדיין לא נלחץ</p>
</div>

## הסבר עיקרי

addEventListener כרישום, לא הרצה מיידית — `addEventListener("click", callback)` **לא** מריץ את ה-callback מיד — הוא רק **רושם** אותה, ומחכה. הפונקציה תרוץ בכל פעם שהמשתמש **בפועל** לוחץ על האלמנט — פעם, פעמיים, או אף פעם. זה בדיוק אותו דפוס callback שכבר מכירים מיחידת ה-JS.

Event Object נותן הקשר — הדפדפן מעביר אוטומטית את ה-Event Object לכל callback — לא צריך לבקש אותו במפורש, הוא פשוט "שם" כפרמטר ראשון. `event.target` הוא בדרך כלל השדה הכי שימושי — מצביע **בדיוק** על האלמנט שקיבל את הקליק, שימושי מאוד כשיש הרבה אלמנטים דומים (נראה את זה עוד יותר בשיעור Event Delegation).

preventDefault למניעת ברירת מחדל — לחלק מהאירועים יש "התנהגות ברירת מחדל" של הדפדפן: קליק על קישור (`<a>`) מנווט לעמוד חדש; שליחת טופס (`submit`) מרעננת את העמוד. `event.preventDefault()` **עוצר** את זה — קריטי כשרוצים לטפל בטופס עם JavaScript (`fetch`, בהמשך) במקום הרענון המלא של הדפדפן.

## יתרונות

מאפשר תגובה אמיתית למשתמש בזמן אמת, בלי רענון עמוד; `event.target` נותן הקשר מדויק על מה בדיוק קרה; אפשר לרשום כמה listeners על אותו אירוע/אלמנט.

## חסרונות

הרבה `addEventListener` נפרדים על הרבה אלמנטים דומים יכולים להיות לא-יעילים (נלמד פתרון ב-Event Delegation); שכחת `preventDefault` במקומות שצריך גורמת להתנהגות ברירת מחדל לא-רצויה.

## נקודות חשובות למבחן / ראיון עבודה

• `addEventListener` רושם callback שירוץ בכל התרחשות של האירוע, לא רק פעם אחת

• Event Object מועבר אוטומטית ל-callback, כולל `event.target`

• `event.preventDefault()` מבטל התנהגות ברירת מחדל של הדפדפן (כמו רענון בשליחת טופס)

• אפשר לרשום כמה `addEventListener` שונים על אותו אלמנט/אירוע — כולם ירוצו

## טעויות נפוצות

• לקרוא לפונקציה במקום להעביר reference אליה — מריץ אותה מיד במקום לרשום אותה

• לשכוח `event.preventDefault()` על טופס שרוצים לטפל בו ב-JavaScript — העמוד מתרענן ומאבד את כל המצב

• לבלבל בין `event.target` (האלמנט המדויק שנלחץ) ל-`this`/האלמנט שעליו רשמו את ה-listener

## סיכום

Events הם המנגנון של הדפדפן להודיע על פעולות משתמש; `addEventListener` רושם callback שירוץ בכל התרחשות. Event Object (מועבר אוטומטית) נותן הקשר — `event.target` מצביע על האלמנט המדויק. `event.preventDefault()` מבטל התנהגות ברירת מחדל, קריטי לטיפול בטפסים.

## דוקומנטציה רשמית

[MDN — EventTarget.addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

---

## תרגילים

### תרגיל 1 — click בסיסי

**המשימה:** הוסיפו לכפתור `addEventListener("click", ...)` שמדפיס הודעה בקונסול.

**בדיקה:** כל קליק על הכפתור מדפיס הודעה נוספת — לא רק פעם אחת.

### תרגיל 2 — event.target

**המשימה:** הוסיפו listener על מספר כפתורים שונים (עם forEach), והדפיסו את `event.target.textContent` בכל קליק.

**בדיקה:** לחיצה על כל כפתור מדפיסה את הטקסט **שלו בדיוק**, לא של כפתור אחר.

### תרגיל 3 — preventDefault

**המשימה:** הוסיפו `addEventListener("submit", ...)` על טופס, עם `event.preventDefault()` בפנים.

**בדיקה:** לחיצה על "שלח" לא מרעננת את העמוד (בניגוד להתנהגות ברירת המחדל).

---

## פרויקט מסכם

**המשימה:** הפכו את כפתורי עמוד האודות לאינטראקטיביים.

**דרישות:**
1. כל כפתור מקבל `addEventListener("click", ...)` שמדפיס לקונסול איזה כפתור נלחץ (בעזרת `event.target`)
2. הטופס (מיחידת HTML Forms) מקבל `addEventListener("submit", ...)` עם `preventDefault`
3. הדפסה של כל ערכי הטופס לקונסול בזמן השליחה (בלי רענון עמוד)

**בדיקה:** לחיצה על כל כפתור מדפיסה זיהוי נכון שלו; שליחת הטופס לא מרעננת את העמוד ומדפיסה את הנתונים שהוזנו.

---

## מה בפרק הבא

בפרק הבא נלמד על **DOM Content** — עד עכשיו בחרנו אלמנטים (Selecting) והגבנו לאירועים (Events) — אבל איך משנים בפועל **מה מוצג** בתוך אלמנט? למשל, "0 פריטים בעגלה" שהופך ל-"3 פריטים בעגלה" אחרי קליק. `textContent` ו-`innerHTML` הן שתי 
