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

## العرض التقديمي

- [صفحة إصدار العرض](https://github.com/omarmousa2-arch/LYNX_WEAR-project-replit/releases/tag/project-presentation)

مصدر الشرائح الكامل موجود في `artifacts/lynx-wear-presentation/`. نسختا PDF وPowerPoint المصدّرتان جاهزتان في مساحة Replit وفي مجلد الملفات الناتجة المذكور أعلاه، لكنهما **غير مرفقتين بإصدار GitHub بعد**. يمكن إرفاقهما من صفحة تعديل الإصدار، دون إضافتهما إلى سجل Git.

لا تتضمن النسخة المنشورة مفاتيح الخدمات أو ملفات البيئة أو إعدادات الوكيل الداخلية أو مجلدات الاعتماديات.

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
