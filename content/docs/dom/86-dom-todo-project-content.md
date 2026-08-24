---
title: "Todo App Project"
slug: "86-dom-todo-project-content"
description: "פרויקט מסכם ראשון: אפליקציית משימות מלאה — הוספה, מחיקה, סימון-כבוצע ושמירה, הכל בצד הלקוח."
summary: "📖 שיעור"
date: 2026-08-09T00:00:00+02:00
lastmod: 2026-08-09T00:00:00+02:00
draft: false
weight: 861
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

זהו פרויקט מסכם ראשון ליחידת ה-DOM: מיישמים **יחד** את כל מה שנלמד — Selecting, Events, Content, classList, Creating & Removing, Traversing, Forms, Event Delegation, ו-LocalStorage — לכדי אפליקציית משימות (Todo App) עובדת ומלאה, שרצה **לגמרי בצד הלקוח**, בלי שרת.

## מילות מפתח שחשוב לזכור

• Application State (מצב האפליקציה) — הנתונים שמייצגים "מה קורה כרגע" (כאן: מערך המשימות) — המקור-האמת שממנו ה-DOM נבנה

• Render (רינדור) — הפעולה של "לצייר" את ה-state הנוכחי כ-DOM אמיתי על המסך

• Single Source of Truth (מקור אמת יחיד) — עקרון: ה-state (מערך המשימות) הוא **המקור היחיד** לאמת; ה-DOM רק "משקף" אותו, ולא להפך

• CRUD (מיחידת השרתים) — Create/Read/Update/Delete — אותם ארבעה פעולות בסיסיות, עכשיו מיושמות על מערך ב-localStorage במקום DB אמיתי

```javascript
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function render() {
  const list = document.querySelector(".task-list");
  list.innerHTML = ""; // clear and rebuild from state
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.textContent = task.title;
    li.classList.toggle("done", task.done);
    list.appendChild(li);
  });
}

function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
}
```

## הדגמה חיה

<div class="demo-live" style="direction:rtl;border:1px solid #d1d5db;border-radius:10px;padding:1.25rem;margin:1.25rem 0;background:#fafafa;color:#111827;">
<p style="font-weight:600;margin:0 0 0.9rem;color:#6b7280;font-size:0.85rem;">🔴 הדגמה חיה — Todo App מלא: הוספה, סימון-כבוצע ומחיקה, הכל עם listener אחד על הרשימה</p>
<div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;">
<input id="demo-todo-input" type="text" placeholder="משימה חדשה..." style="flex:1;padding:0.5rem;border:1px solid #d1d5db;border-radius:6px;">
<button onclick="const v=document.getElementById('demo-todo-input'); if(!v.value.trim()) return; const li=document.createElement('li'); li.style.cssText='background:#fff;border:1px solid #d1d5db;border-radius:6px;padding:0.4rem 0.6rem;margin-bottom:4px;display:flex;justify-content:space-between;align-items:center;'; const span=document.createElement('span'); span.className='demo-todo-toggle'; span.textContent=v.value; span.style.cursor='pointer'; const btn=document.createElement('button'); btn.className='demo-todo-del'; btn.textContent='מחק'; btn.style.cssText='background:#dc2626;color:#fff;border:none;border-radius:4px;padding:0.1rem 0.5rem;cursor:pointer;'; li.appendChild(span); li.appendChild(btn); document.getElementById('demo-todo-list').appendChild(li); v.value='';" style="background:#2563eb;color:#fff;border:none;border-radius:6px;padding:0.5rem 1rem;font-weight:700;cursor:pointer;">הוסף</button>
</div>
<ul id="demo-todo-list" onclick="const t=event.target; if(t.classList.contains('demo-todo-toggle')){ const done=t.style.textDecoration==='line-through'; t.style.textDecoration = done?'none':'line-through'; t.style.color = done?'#111827':'#9ca3af'; } else if(t.classList.contains('demo-todo-del')){ t.closest('li').remove(); }" style="list-style:none;padding:0;margin:0;">
<li style="background:#fff;border:1px solid #d1d5db;border-radius:6px;padding:0.4rem 0.6rem;margin-bottom:4px;display:flex;justify-content:space-between;align-items:center;"><span class="demo-todo-toggle" style="cursor:pointer;">משימה לדוגמה — לחצו לסימון כבוצע</span><button class="demo-todo-del" style="background:#dc2626;color:#fff;border:none;border-radius:4px;padding:0.1rem 0.5rem;cursor:pointer;">מחק</button></li>
</ul>
</div>

## הסבר עיקרי

State כמקור אמת יחיד — שימו לב לדפוס בדוגמה: **כל** שינוי (הוספה, מחיקה, סימון) קורה קודם על מערך `tasks` (ה-state) — **לא** ישירות על ה-DOM. אחרי כל שינוי ב-state, קוראים ל-`render()` שמוחקת את כל הרשימה הישנה ובונה אותה **מחדש** מה-state העדכני. זה שונה מהגישה שראינו קודם (Creating & Removing) של לגעת ב-DOM ישירות בכל פעולה — וזה בדיוק העיקרון שספריות כמו React (בהמשך הקורס) בונות עליו בקנה מידה גדול בהרבה.

saveAndRender כ"שכפול פעולות" — כל פעולה שמשנה את `tasks` (הוספה, מחיקה, toggle) צריכה **גם** לשמור ל-localStorage **וגם** לרנדר מחדש — לכן קריאה משותפת ל-`saveAndRender()` אחרי כל שינוי state מבטיחה שה-DOM וה-localStorage **תמיד** מסונכרנים עם ה-state, בלי לשכוח אחד מהם באיזו פעולה.

CRUD מלא, בלי DB — Create (הוספת משימה), Read (הצגת הרשימה ב-`render`), Update (סימון כבוצע), Delete (מחיקה) — בדיוק אותם 4 מושגי CRUD מיחידת ה-DB, אבל מיושמים כאן על מערך JavaScript רגיל שנשמר ב-localStorage, בלי שרת או מסד נתונים אמיתי בכלל.

## יתרונות

State כמקור אמת יחיד מונע חוסר-סנכרון בין מה שרואים למה שבאמת "קרה"; שילוב כל מושגי ה-DOM לכדי אפליקציה שלמה ועובדת; localStorage נותן persistence אמיתי בלי צורך בשרת.

## חסרונות

מחיקה ובנייה מחדש של כל ה-DOM (`innerHTML = ""` + לולאת `createElement`) בכל שינוי קטן פחות יעילה מעדכון ממוקד — בפרויקטים גדולים, זו בדיוק הבעיה שספריות כמו React פותרות; אין שיתוף בין מכשירים (localStorage מקומי בלבד).

## נקודות חשובות

• State הוא מקור האמת; ה-DOM הוא רק "השתקפות" חזותית שלו, לא להפך

• `render()` בונה מחדש את ה-DOM מה-state העדכני, בכל שינוי

• כל שינוי state צריך גם לעדכן localStorage וגם לרנדר — שתי הפעולות ביחד

• זה בדיוק הרעיון ש-React (בהמשך הקורס) בונה עליו — state קובע UI, לא להפך

## טעויות נפוצות

• לשנות DOM ישירות (למשל להסיר אלמנט) בלי לעדכן את מערך ה-state בהתאם — ה-DOM וה-state "מתפצלים", וייבנו לא-נכון ברענון הבא

• לשכוח לקרוא `saveAndRender` (או שקול) אחרי שינוי state — ה-DOM לא מתעדכן, או ה-localStorage לא נשמר

• לבנות מחדש את כל הרשימה גם כשלא היה שום שינוי — בזבוז מיותר

## סיכום

Todo App הוא פרויקט מסכם שמיישם State כמקור אמת יחיד: כל פעולה (Create/Update/Delete) משנה את מערך `tasks` תחילה, ואז `render()` בונה מחדש את ה-DOM מה-state העדכני, ו-`localStorage` שומר אותו לצמיתות. זה משלב את כל מושגי יחידת ה-DOM לכדי אפליקציה שלמה — ומבשר את העיקרון המרכזי מאחורי React.

## דוקומנטציה רשמית

[MDN — Introduction to the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)

---

## תרגילים

### תרגיל 1 — פונקציית render בסיסית

**המשימה:** כתבו `render()` שמנקה רשימה קיימת ובונה אותה מחדש ממערך `tasks` קבוע (בלי טופס/כפתורים עדיין).

**בדיקה:** קריאה ל-`render()` מציגה את כל פריטי המערך כ-`<li>` ברשימה, בסדר הנכון.

### תרגיל 2 — הוספת משימה משנה state

**המשימה:** הוסיפו טופס שבשליחתו מוסיף אובייקט חדש למערך `tasks`, ואז קורא ל-`render()` מחדש.

**בדיקה:** הוספת משימה חדשה מציגה אותה ברשימה מיד; המערך `tasks` (בדקו בקונסול) כולל את הפריט החדש.

### תרגיל 3 — persist מלא

**המשימה:** הוסיפו `saveAndRender()` שקוראים לו בכל שינוי state, ווודאו שהרשימה נשמרת ברענון עמוד.

**בדיקה:** אחרי הוספת כמה משימות ורענון (F5), הרשימה עדיין מוצגת כמו שהייתה — לא מתאפסת.

---

## פרויקט מסכם

**המשימה:** בנו אפליקציית Todo מלאה, המשלבת את כל מושגי יחידת ה-DOM.

**דרישות:**
1. State כמערך `tasks` (`{ title, done }`), נטען מ-localStorage בעליית העמוד
2. טופס להוספת משימה חדשה (עם Validation בסיסי — לא ריק)
3. `render()` שבונה את הרשימה מחדש מה-state בכל שינוי
4. Event Delegation (listener יחיד) לטיפול בסימון-כבוצע ומחיקה, לא listener לכל פריט
5. שמירה ל-localStorage אחרי כל שינוי state

**בדיקה:** רענון מלא של העמוד (F5) שומר את כל המשימות ומצבן (בוצע/לא); הוספה, סימון ומחיקה עובדים נכון גם על פריטים שנוצרו אחרי טעינת העמוד; אין אף `addEventListener` נפרד לכל פריט ברשימה.

---

## מה בפרק הבא

בפרק הבא נלמד על **Notes App Project** — בפרויקט הקודם (Todo App) בנינו CRUD בסיסי עם State יחיד. **Notes App** מרחיב את זה: פתקים שאפשר **לערוך ישירות** (לא רק להוסיף/למחוק), עם עדכון State בזמן אמת תוך כדי הקלדה — תרגול נוסף לאותו דפוס Sta
