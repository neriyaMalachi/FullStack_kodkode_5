---
title: "פרויקט מסכם — HTML"
slug: "112-html-capstone-project-content"
description: "פרויקט מסכם שבונה עמוד סמנטי מלא — מבנה, תמונות, טבלה וטופס — הכל בלי שורת CSS או JavaScript אחת."
summary: "📖 שיעור"
date: 2026-08-11T00:00:00+02:00
lastmod: 2026-08-11T00:00:00+02:00
draft: false
weight: 1121
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

זהו הפרויקט המסכם של יחידת HTML: לא תגית חדשה, אלא עמוד שלם אחד — "פרופיל מתכון" — שמשלב את כל מה שנלמד: מבנה סמנטי (`header`/`main`/`section`/`footer`), תמונה עם `alt` תקין, טבלה (ערכים תזונתיים), וטופס (השארת ביקורת). עדיין **בלי CSS ובלי JavaScript** — רק HTML נקי, קריא גם למכונה (קורא מסך, מנוע חיפוש) וגם לבן-אדם.

## מילות מפתח שחשוב לזכור

• תגיות סמנטיות — `header`/`nav`/`main`/`article`/`section`/`footer` — מתארות **תפקיד**, לא רק מראה, בניגוד ל-`div` הגנרי

• `alt` — טקסט חלופי לתמונה; קריטי לנגישות (קורא מסך) ולמצב שהתמונה לא נטענת

• מבנה טבלה — `<table>`/`<thead>`/`<tbody>`/`<tr>`/`<th>`/`<td>` — לנתונים טבלאיים אמיתיים, לא לפריסה כללית

• `<label>` מחובר לשדה — עם `for`/`id` תואמים, כדי שקליק על התווית ממקד את השדה

```html
<article>
  <header>
    <h1>עוגיות שוקולד צ'יפס</h1>
    <img src="cookies.jpg" alt="עוגיות שוקולד צ'יפס טריות על צלחת עץ">
  </header>

  <section aria-labelledby="nutrition-heading">
    <h2 id="nutrition-heading">ערכים תזונתיים (למנה)</h2>
    <table>
      <thead>
        <tr><th>רכיב</th><th>כמות</th></tr>
      </thead>
      <tbody>
        <tr><td>קלוריות</td><td>210</td></tr>
        <tr><td>שומן</td><td>9 גרם</td></tr>
      </tbody>
    </table>
  </section>

  <section aria-labelledby="review-heading">
    <h2 id="review-heading">השאירו ביקורת</h2>
    <form action="/reviews" method="POST">
      <label for="reviewer-name">שם:</label>
      <input type="text" id="reviewer-name" name="name" required>

      <label for="rating">דירוג (1–5):</label>
      <input type="number" id="rating" name="rating" min="1" max="5" required>

      <button type="submit">שליחה</button>
    </form>
  </section>
</article>
```

## הדגמה חיה

<div class="demo-live" style="direction:rtl;border:1px solid #d1d5db;border-radius:10px;padding:1.25rem;margin:1.25rem 0;background:#fafafa;color:#111827;">
<p style="font-weight:600;margin:0 0 0.9rem;color:#6b7280;font-size:0.85rem;">🔴 הדגמה חיה — בדיוק ה-HTML למעלה, בלי שום CSS — כך זה נראה "גולמי", לפני יחידת CSS הבאה</p>
<article>
  <header style="border-bottom:1px solid #d1d5db;padding-bottom:0.5rem;margin-bottom:0.75rem;">
    <h3 style="margin:0 0 0.5rem;">עוגיות שוקולד צ'יפס</h3>
    <div style="width:100%;max-width:280px;height:140px;background:#e5e7eb;display:flex;align-items:center;justify-content:center;color:#6b7280;font-size:0.85rem;border-radius:6px;">🍪 תמונת עוגיות (alt: "עוגיות שוקולד צ'יפס טריות על צלחת עץ")</div>
  </header>
  <section style="margin-bottom:1rem;">
    <h4>ערכים תזונתיים (למנה)</h4>
    <table style="border-collapse:collapse;">
      <thead><tr><th style="border:1px solid #d1d5db;padding:0.3rem 0.6rem;">רכיב</th><th style="border:1px solid #d1d5db;padding:0.3rem 0.6rem;">כמות</th></tr></thead>
      <tbody>
        <tr><td style="border:1px solid #d1d5db;padding:0.3rem 0.6rem;">קלוריות</td><td style="border:1px solid #d1d5db;padding:0.3rem 0.6rem;">210</td></tr>
        <tr><td style="border:1px solid #d1d5db;padding:0.3rem 0.6rem;">שומן</td><td style="border:1px solid #d1d5db;padding:0.3rem 0.6rem;">9 גרם</td></tr>
      </tbody>
    </table>
  </section>
  <section>
    <h4>השאירו ביקורת</h4>
    <form onsubmit="event.preventDefault(); this.querySelector('.demo-html-sent').hidden=false;" style="display:flex;flex-direction:column;gap:0.5rem;max-width:300px;">
      <label for="demo-html-name">שם:</label>
      <input type="text" id="demo-html-name" required style="padding:0.4rem;border:1px solid #d1d5db;border-radius:4px;">
      <label for="demo-html-rating">דירוג (1–5):</label>
      <input type="number" id="demo-html-rating" min="1" max="5" required style="padding:0.4rem;border:1px solid #d1d5db;border-radius:4px;">
      <button type="submit" style="background:#2563eb;color:#fff;border:none;border-radius:6px;padding:0.5rem;cursor:pointer;">שליחה</button>
      <span class="demo-html-sent" hidden style="color:#16a34a;font-size:0.85rem;">✓ נשלח (הדגמה בלבד — נסו לשלוח בלי למלא שדה חובה ותראו את ולידציית הדפדפן)</span>
    </form>
  </section>
</article>
</div>

## הסבר עיקרי

כל חלק בעמוד "מסביר את עצמו" למכונה — קורא מסך שנתקל ב-`<header>` יודע שזו כותרת העמוד; שנתקל ב-`<table>` יודע להכריז "טבלה עם 2 עמודות" ולא רק לקרוא טקסט רץ; שנתקל ב-`<label for="rating">` יודע לקשר את המילה "דירוג" לשדה הספציפי הזה. אף אחד מהדברים האלה לא היה קורה עם `<div>` גנרי בכל מקום — הסמנטיקה **היא** הנגישות, לא תוספת נפרדת לה.

`aria-labelledby` מחבר כותרת לאזור שהיא שייכת לו — `<section aria-labelledby="nutrition-heading">` אומר במפורש "האזור הזה מתואר על ידי האלמנט עם ה-`id` הזה" — קורא מסך שמכריז על מעבר בין sections יכול להקריא את הכותרת הרלוונטית, לא רק "section, section" בלי הקשר.

טופס תקין מתחיל עוד לפני JavaScript — `required`, `type="number"` עם `min`/`max`, ו-`<label>` מחוברים נכון נותנים **שכבת בדיקה ראשונה** שהדפדפן אוכף לבד — עוד לפני שכתבנו שורת JavaScript אחת, ועוד הרבה לפני שיש בכלל שרת שמקבל את הבקשה.

## יתרונות

עמוד סמנטי נגיש מטבעו לקוראי מסך ולמנועי חיפוש, בלי מאמץ נוסף; מבנה ברור (header/section/footer) קל לתחזוקה ולסטיילינג עתידי עם CSS; ולידציית טופס בסיסית (`required`, `type`, `min`/`max`) עובדת בלי אף שורת JavaScript.

## חסרונות

בלי CSS, העמוד נראה "גולמי" — זה תקין ומכוון בשלב הזה של הקורס, אבל לא מוצג-סופי; ולידציית HTML בלבד לא מספיקה לביטחון אמיתי (תמיד צריך גם ולידציה בצד שרת, שנלמד ביחידת Server).

## נקודות חשובות למבחן / ראיון עבודה

• תגיות סמנטיות מתארות תפקיד, לא רק מראה — משפרות נגישות ו-SEO בלי מאמץ נוסף

• `alt` חובה בכל תמונה משמעותית — נגישות, לא רק "תיאור נחמד"

• `<label for="id">` חייב להצביע על `id` תואם באלמנט הקלט, אחרת הקליק לא ממקד כלום

• ולידציית HTML (`required`/`min`/`max`) היא נוחות למשתמש, לא הגנת אבטחה — תמיד צריך גם ולידציה בשרת

## טעויות נפוצות

• שימוש ב-`<div>` בכל מקום במקום תגיות סמנטיות מתאימות — מאבדים נגישות בחינם

• תמונה בלי `alt` בכלל, או עם `alt=""` על תמונה שהיא **כן** משמעותית לתוכן

• `<label>` בלי `for` תואם ל-`id` של השדה — נראה מחובר חזותית, אבל לא ממוקד בקליק

• לסמוך רק על `required` ולחשוב שזו הגנה מספקת — היא בדיקת UX, לא אבטחה

## סיכום

הפרויקט המסכם בונה עמוד HTML שלם וסמנטי — מבנה ברור עם תגיות שמתארות תפקיד, תמונה נגישה עם `alt`, טבלת נתונים אמיתית, וטופס עם `label`ים מחוברים וולידציה בסיסית — הכל בלי CSS או JavaScript. זה בדיוק השלד שעליו יחידת CSS הבאה תוסיף עיצוב.

## דוקומנטציה רשמית

[MDN — HTML: A good basis for accessibility](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML)

---

## תרגילים

### תרגיל 1 — מבנה סמנטי בלבד

**המשימה:** קחו עמוד עם `<div>` גנריים בלבד, והחליפו אותם בתגיות סמנטיות מתאימות (`header`/`main`/`section`/`footer`).

**בדיקה:** מבנה ה-DOM (ב-DevTools) מציג את התגיות הסמנטיות החדשות, לא `div` בכל מקום.

### תרגיל 2 — טופס עם label מחובר

**המשימה:** בנו שדה קלט בודד עם `<label>` שאינו מחובר (`for`/`id` לא תואמים), ואז תקנו אותו.

**בדיקה:** לפני התיקון, קליק על התווית לא ממקד את השדה; אחרי התיקון, כן.

---

## פרויקט מסכם

**המשימה:** בנו עמוד "פרופיל מתכון" סמנטי מלא, המשלב את כל מושגי היחידה.

**דרישות:**
1. מבנה סמנטי: `header` עם כותרת ותמונה, `main` שמכיל שני `section`ים לפחות
2. תמונה עם `alt` תיאורי אמיתי (לא ריק ולא "image")
3. טבלת ערכים תזונתיים (או דומה) עם `thead`/`tbody` תקינים
4. טופס ביקורת עם לפחות 3 שדות, `label` מחובר לכל שדה, ו-`required` על שדה אחד לפחות
5. `footer` עם פרטי יצירת קשר או זכויות

**בדיקה:** בדיקת נגישות בדפדפן (Lighthouse/DevTools Accessibility) לא מציגה אזהרות על תמונות בלי `alt` או שדות בלי `label`; קליק על כל `<label>` בטופס ממקד את השדה הנכון; ניסיון שליחת הטופס בלי למלא את השדה החובה נחסם על ידי הדפדפן.

## מה בפרק הבא

בפרק הבא נתחיל יחידה חדשה — **CSS**. עד עכשיו כתבנו רק מבנה — HTML "גולמי" בלי שום עיצוב. ביחידת CSS נלמד להלביש את אותו מבנה בדיוק בעיצוב — צבעים, פריסה, ותגובתיות למסכים שונים — בלי לגעת ב-HTML עצמו.
