# Lynx Wear

متجر إلكتروني تجريبي لملابس ومستلزمات التمرين، مع عرض تقديمي يشرح فكرة المشروع وخصائصه.

**المستودع العام:** [LYNX_WEAR-project-replit](https://github.com/omarmousa2-arch/LYNX_WEAR-project-replit)

## معلومات المشروع

- **المشرف:** دكتور Taha Mahmoud Metwally Nour El-Dein
- **التنفيذ:** عمر مصطفي عبدالله
- **السياق:** مشروع للتعلّم أُنجز ضمن منحة للتعلّم.
- **اللغة:** العربية، مع دعم واجهة متجاوبة للموبايل والكمبيوتر.

## محتويات الريبو

- `artifacts/gymwear-store/` — تطبيق متجر Lynx Wear.
- `artifacts/lynx-wear-presentation/` — العرض التقديمي ومصدر شرائحه.
- `PROJECT_IDEA.md` — وصف فكرة المشروع وأهدافه.
- `generated-artifacts/lynx-wear/` — نسخ العرض القابلة للفتح:
  - `Lynx-Wear-Presentation.pptx`
  - `Lynx-Wear-Presentation.pdf`

## تحميل العرض التقديمي

- [تحميل PDF](https://github.com/omarmousa2-arch/LYNX_WEAR-project-replit/releases/download/project-presentation/Lynx-Wear-Presentation.pdf)
- [تحميل PowerPoint](https://github.com/omarmousa2-arch/LYNX_WEAR-project-replit/releases/download/project-presentation/Lynx-Wear-Presentation.pptx)
- [صفحة إصدار العرض](https://github.com/omarmousa2-arch/LYNX_WEAR-project-replit/releases/tag/project-presentation)

ملفات التصدير متاحة على GitHub ضمن مرفقات الإصدار، وليست داخل سجل Git حتى لا يزيد حجمه. مصدر العرض وملفاته الأصلية موجودة في مجلد العرض التقديمي. لا تتضمن النسخة المنشورة مفاتيح الخدمات أو ملفات البيئة أو إعدادات الوكيل الداخلية أو مجلدات الاعتماديات.

## تشغيل المتجر

يتطلب المشروع Node.js وpnpm:

```bash
pnpm install
pnpm --filter @workspace/gymwear-store run dev
```

لتشغيل العرض التقديمي:

```bash
pnpm --filter @workspace/lynx-wear-presentation run dev
```

## ملاحظات

الأسعار والمخزون في النسخة التجريبية للمعاينة فقط. تجهيز استقبال الطلبات والمدفوعات الحقيقية يتطلب تفعيل إعدادات المتجر ووسائل الدفع المناسبة.
