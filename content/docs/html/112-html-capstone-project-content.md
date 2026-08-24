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

## הגדרת הפרויקט

זהו הפרויקט המסכם של יחידת HTML: לא תגית חדשה, אלא עמוד שלם אחד — "פרופיל מתכון" — שמשלב את כל מה שנלמד: מבנה סמנטי (`header`/`main`/`section`/`footer`), תמונה עם `alt` תקין, טבלה (ערכים תזונתיים), וטופס (השארת ביקורת). עדיין **בלי CSS ובלי JavaScript** — רק HTML נקי, קריא גם למכונה (קורא מסך, מנוע חיפוש) וגם לבן-אדם. הסמנטיקה **היא** הנגישות, לא תוספת נפרדת לה — קורא מסך שנתקל ב-`<table>` יודע להכריז "טבלה", לא רק לקרוא טקסט רץ, בדרך שאף `<div>` גנרי לא נותן.

## מה צריך להיות מוכן בסוף

**דרישות:**
1. מבנה סמנטי: `header` עם כותרת ותמונה, `main` שמכיל שני `section`ים לפחות
2. תמונה עם `alt` תיאורי אמיתי (לא ריק ולא "image")
3. טבלת ערכים תזונתיים (או דומה) עם `thead`/`tbody` תקינים
4. טופס ביקורת עם לפחות 3 שדות, `label` מחובר לכל שדה (`for`/`id` תואמים), ו-`required` על שדה אחד לפחות
5. `footer` עם פרטי יצירת קשר או זכויות
6. שום CSS ושום JavaScript — HTML בלבד

**קריטריוני הצלחה:**

• בדיקת נגישות בדפדפן (Lighthouse/DevTools Accessibility) לא מציגה אזהרות על תמונות בלי `alt` או שדות בלי `label`

• קליק על כל `<label>` בטופס ממקד את השדה הנכון שלו

• ניסיון שליחת הטופס בלי למלא את השדה החובה נחסם על ידי הדפדפן, בלי אף שורת JavaScript

## דוקומנטציה רשמית מותרת

[MDN — HTML: A good basis for accessibility](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML)
