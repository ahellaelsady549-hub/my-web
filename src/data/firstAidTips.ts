export interface FirstAidTip {
  id: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  stepsEn: string[];
  stepsAr: string[];
  category?: string;
  videoUrl?: string;
}

export const firstAidTips: FirstAidTip[] = [
  {
    id: 1,
    titleEn: "CPR (Cardiopulmonary Resuscitation)",
    titleAr: "الإنعاش القلبي الرئوي",
    descriptionEn: "Life-saving technique for cardiac arrest victims",
    descriptionAr: "تقنية منقذة للحياة لضحايا السكتة القلبية",
    stepsEn: [
      "Call emergency services (123) immediately",
      "Place person on firm surface, check breathing",
      "Position hands on center of chest",
      "Push hard and fast at 100-120 compressions/minute",
      "Continue until help arrives"
    ],
    stepsAr: [
      "اتصل بالإسعاف (123) فوراً",
      "ضع الشخص على سطح صلب وتحقق من التنفس",
      "ضع يديك على منتصف الصدر",
      "اضغط بقوة وسرعة 100-120 ضغطة/دقيقة",
      "استمر حتى وصول المساعدة"
    ],
    videoUrl: "https://www.youtube.com/watch?v=cosVBV96E2g"
  },
  {
    id: 2,
    titleEn: "Choking Emergency",
    titleAr: "الاختناق",
    descriptionEn: "Heimlich maneuver for airway obstruction",
    descriptionAr: "مناورة هيمليك لانسداد مجرى الهواء",
    stepsEn: [
      "Stand behind the person",
      "Make a fist above navel, below ribcage",
      "Grasp fist with other hand",
      "Give quick upward thrusts",
      "Repeat until object is expelled"
    ],
    stepsAr: [
      "قف خلف الشخص",
      "اصنع قبضة فوق السرة تحت القفص الصدري",
      "امسك القبضة باليد الأخرى",
      "قم بدفعات سريعة للأعلى",
      "كرر حتى خروج الجسم الغريب"
    ],
    videoUrl: "https://www.youtube.com/watch?v=7CgtIgSyAiU"
  },
  {
    id: 3,
    titleEn: "Severe Bleeding Control",
    titleAr: "السيطرة على النزيف الشديد",
    descriptionEn: "Stop life-threatening bleeding",
    descriptionAr: "إيقاف النزيف المهدد للحياة",
    stepsEn: [
      "Apply direct pressure with clean cloth",
      "Maintain pressure for 10-15 minutes",
      "Add more cloth if blood soaks through",
      "Elevate injured area above heart if possible",
      "Call emergency services if bleeding doesn't stop"
    ],
    stepsAr: [
      "اضغط مباشرة بقماش نظيف",
      "حافظ على الضغط لمدة 10-15 دقيقة",
      "أضف قماش آخر إذا تشرب الدم",
      "ارفع المنطقة المصابة فوق القلب إن أمكن",
      "اتصل بالإسعاف إذا لم يتوقف النزيف"
    ],
    videoUrl: "https://www.youtube.com/watch?v=NxO5LvgqZe0"
  },
  {
    id: 4,
    titleEn: "Burns Treatment",
    titleAr: "علاج الحروق",
    descriptionEn: "First aid for thermal burns",
    descriptionAr: "الإسعافات الأولية للحروق الحرارية",
    stepsEn: [
      "Remove from heat source immediately",
      "Cool burn with running water for 10-20 minutes",
      "Remove jewelry/tight items before swelling",
      "Cover with sterile, non-stick dressing",
      "Seek medical help for serious burns"
    ],
    stepsAr: [
      "أبعد عن مصدر الحرارة فوراً",
      "برّد الحرق بالماء الجاري لمدة 10-20 دقيقة",
      "أزل المجوهرات والأشياء الضيقة قبل التورم",
      "غطِّ بضمادة معقمة غير لاصقة",
      "اطلب المساعدة الطبية للحروق الخطيرة"
    ],
    videoUrl: "https://www.youtube.com/watch?v=EaJmzB8YgS0"
  },
  {
    id: 5,
    titleEn: "Fracture Management",
    titleAr: "التعامل مع الكسور",
    descriptionEn: "Immobilize suspected bone fractures",
    descriptionAr: "تثبيت الكسور المشتبه بها",
    stepsEn: [
      "Don't move injured area",
      "Apply ice pack to reduce swelling",
      "Immobilize with splint if trained",
      "Support injured limb",
      "Get immediate medical attention"
    ],
    stepsAr: [
      "لا تحرك المنطقة المصابة",
      "ضع كمادة ثلج لتقليل التورم",
      "ثبّت بجبيرة إذا كنت مدرباً",
      "ادعم الطرف المصاب",
      "احصل على عناية طبية فورية"
    ],
    videoUrl: "https://www.youtube.com/watch?v=2v8vlXgGXwE"
  },
  {
    id: 6,
    titleEn: "Shock Management",
    titleAr: "التعامل مع الصدمة",
    descriptionEn: "Recognize and treat medical shock",
    descriptionAr: "التعرف على الصدمة الطبية وعلاجها",
    stepsEn: [
      "Lay person down, elevate legs",
      "Keep warm with blanket",
      "Don't give food or water",
      "Monitor breathing and pulse",
      "Call emergency services immediately"
    ],
    stepsAr: [
      "أضجع الشخص وارفع ساقيه",
      "حافظ على الدفء ببطانية",
      "لا تعطِ طعاماً أو ماءً",
      "راقب التنفس والنبض",
      "اتصل بالإسعاف فوراً"
    ],
    videoUrl: "https://www.youtube.com/watch?v=DXoSxpbXCJw"
  },
  {
    id: 7,
    titleEn: "Stroke Recognition (FAST)",
    titleAr: "التعرف على السكتة الدماغية",
    descriptionEn: "Quick stroke assessment",
    descriptionAr: "التقييم السريع للسكتة الدماغية",
    stepsEn: [
      "Face: Ask to smile, check for drooping",
      "Arms: Raise both arms, watch for drift",
      "Speech: Check for slurred speech",
      "Time: Call 123 immediately if any signs",
      "Note time symptoms started"
    ],
    stepsAr: [
      "الوجه: اطلب الابتسام، تحقق من الترهل",
      "الذراعان: ارفع كلا الذراعين، راقب الانجراف",
      "الكلام: تحقق من تداخل الكلام",
      "الوقت: اتصل بـ 123 فوراً عند أي علامة",
      "سجل وقت بدء الأعراض"
    ],
    videoUrl: "https://www.youtube.com/watch?v=mkpS4wbKFXw"
  },
  {
    id: 8,
    titleEn: "Seizure Response",
    titleAr: "التعامل مع النوبات",
    descriptionEn: "Protect person during seizure",
    descriptionAr: "حماية الشخص أثناء النوبة",
    stepsEn: [
      "Clear area of hard/sharp objects",
      "Cushion head with soft material",
      "Time the seizure",
      "Don't restrain or put anything in mouth",
      "Turn on side after seizure ends"
    ],
    stepsAr: [
      "أزل الأشياء الصلبة والحادة من المنطقة",
      "ضع وسادة تحت الرأس",
      "احسب مدة النوبة",
      "لا تمسك الشخص أو تضع شيئاً في فمه",
      "اقلب الشخص على جانبه بعد انتهاء النوبة"
    ],
    videoUrl: "https://www.youtube.com/watch?v=Ovsw7tdneqE"
  },
  {
    id: 9,
    titleEn: "Nosebleed Control",
    titleAr: "إيقاف نزيف الأنف",
    descriptionEn: "Stop nasal bleeding safely",
    descriptionAr: "إيقاف نزيف الأنف بأمان",
    stepsEn: [
      "Sit upright, lean slightly forward",
      "Pinch soft part of nose for 10 minutes",
      "Breathe through mouth",
      "Apply cold compress to bridge of nose",
      "Seek help if bleeding continues over 20 minutes"
    ],
    stepsAr: [
      "اجلس منتصباً ومِل قليلاً للأمام",
      "اضغط على الجزء اللين من الأنف لمدة 10 دقائق",
      "تنفس من الفم",
      "ضع كمادة باردة على جسر الأنف",
      "اطلب المساعدة إذا استمر النزيف أكثر من 20 دقيقة"
    ],
    videoUrl: "https://www.youtube.com/watch?v=xEwQjOeXszM"
  },
  {
    id: 10,
    titleEn: "Eye Injury Care",
    titleAr: "العناية بإصابات العين",
    descriptionEn: "Protect injured eyes",
    descriptionAr: "حماية العيون المصابة",
    stepsEn: [
      "Don't rub or touch the eye",
      "Flush with clean water for chemicals",
      "Cover both eyes with clean cloth",
      "Don't remove embedded objects",
      "Get immediate medical attention"
    ],
    stepsAr: [
      "لا تفرك أو تلمس العين",
      "اغسل بالماء النظيف للمواد الكيميائية",
      "غطِّ كلتا العينين بقماش نظيف",
      "لا تزل الأجسام الغريبة العالقة",
      "احصل على عناية طبية فورية"
    ],
    videoUrl: "https://www.youtube.com/watch?v=PvLsRCzog5A"
  },
  {
    id: 11,
    titleEn: "Diabetic Emergency",
    titleAr: "طوارئ السكري",
    descriptionEn: "Low blood sugar response",
    descriptionAr: "التعامل مع انخفاض السكر",
    stepsEn: [
      "Give conscious person sugar/juice",
      "15 grams fast-acting carbohydrates",
      "Recheck blood sugar in 15 minutes",
      "Call 123 if unconscious",
      "Don't give insulin during low sugar"
    ],
    stepsAr: [
      "أعطِ الشخص الواعي سكراً أو عصيراً",
      "15 جرام كربوهيدرات سريعة المفعول",
      "أعد فحص السكر بعد 15 دقيقة",
      "اتصل بـ 123 إذا كان فاقداً للوعي",
      "لا تعطِ الإنسولين عند انخفاض السكر"
    ],
    videoUrl: "https://www.youtube.com/watch?v=nZQ-Bm3wiRQ"
  },
  {
    id: 12,
    titleEn: "Heat Stroke",
    titleAr: "ضربة الشمس",
    descriptionEn: "Cool overheated body rapidly",
    descriptionAr: "تبريد الجسم المحموم بسرعة",
    stepsEn: [
      "Move to cool, shaded area",
      "Remove excess clothing",
      "Cool with water/ice packs",
      "Fan to increase cooling",
      "Call 123 if symptoms worsen"
    ],
    stepsAr: [
      "انقل إلى منطقة باردة ومظللة",
      "أزل الملابس الزائدة",
      "برّد بالماء وكمادات الثلج",
      "استخدم مروحة لزيادة التبريد",
      "اتصل بـ 123 إذا ساءت الأعراض"
    ],
    videoUrl: "https://www.youtube.com/watch?v=AzBTTaRM1H0"
  },
  {
    id: 13,
    titleEn: "Hypothermia Treatment",
    titleAr: "علاج انخفاض حرارة الجسم",
    descriptionEn: "Warm cold body gradually",
    descriptionAr: "تدفئة الجسم البارد تدريجياً",
    stepsEn: [
      "Move to warm location",
      "Remove wet clothing",
      "Wrap in warm blankets",
      "Give warm non-alcoholic drinks",
      "Seek medical help immediately"
    ],
    stepsAr: [
      "انقل إلى مكان دافئ",
      "أزل الملابس المبللة",
      "غطِّ ببطانيات دافئة",
      "أعطِ مشروبات دافئة غير كحولية",
      "اطلب المساعدة الطبية فوراً"
    ],
    videoUrl: "https://www.youtube.com/watch?v=OOCFqnoLhLw"
  },
  {
    id: 14,
    titleEn: "Allergic Reaction",
    titleAr: "رد الفعل التحسسي",
    descriptionEn: "Respond to severe allergies",
    descriptionAr: "الاستجابة للحساسية الشديدة",
    stepsEn: [
      "Use epinephrine auto-injector if available",
      "Call emergency services immediately",
      "Help person lie down",
      "Monitor breathing carefully",
      "Be prepared to perform CPR"
    ],
    stepsAr: [
      "استخدم حقنة الإبينفرين الذاتية إن توفرت",
      "اتصل بالإسعاف فوراً",
      "ساعد الشخص على الاستلقاء",
      "راقب التنفس بعناية",
      "كن مستعداً لإجراء الإنعاش القلبي"
    ],
    videoUrl: "https://www.youtube.com/watch?v=C6IfNPDf7x0"
  },
  {
    id: 15,
    titleEn: "Poisoning Emergency",
    titleAr: "طوارئ التسمم",
    descriptionEn: "First response to poisoning",
    descriptionAr: "الاستجابة الأولى للتسمم",
    stepsEn: [
      "Call poison control immediately",
      "Don't induce vomiting unless instructed",
      "Keep poison container for reference",
      "Monitor breathing and consciousness",
      "Follow poison control instructions exactly"
    ],
    stepsAr: [
      "اتصل بمركز السموم فوراً",
      "لا تحث على التقيؤ إلا بتعليمات",
      "احتفظ بعبوة السم للمرجعية",
      "راقب التنفس والوعي",
      "اتبع تعليمات مركز السموم تماماً"
    ],
    videoUrl: "https://www.youtube.com/watch?v=B9NXZF8vnMQ"
  },
  {
    id: 16,
    titleEn: "Sprain/Strain Care (RICE)",
    titleAr: "علاج الالتواء والشد",
    descriptionEn: "Reduce swelling and pain",
    descriptionAr: "تقليل التورم والألم",
    stepsEn: [
      "Rest: Avoid using injured area",
      "Ice: Apply for 20 minutes every 2 hours",
      "Compression: Wrap with elastic bandage",
      "Elevation: Raise above heart level",
      "Seek medical care if severe"
    ],
    stepsAr: [
      "راحة: تجنب استخدام المنطقة المصابة",
      "ثلج: ضع لمدة 20 دقيقة كل ساعتين",
      "ضغط: لف بضمادة مرنة",
      "رفع: ارفع فوق مستوى القلب",
      "اطلب الرعاية الطبية إذا كان شديداً"
    ],
    videoUrl: "https://www.youtube.com/watch?v=kP8Xhne8X1c"
  },
  {
    id: 17,
    titleEn: "Asthma Attack",
    titleAr: "نوبة الربو",
    descriptionEn: "Help during breathing difficulty",
    descriptionAr: "المساعدة أثناء صعوبة التنفس",
    stepsEn: [
      "Help use rescue inhaler",
      "Sit upright, loosen tight clothing",
      "Stay calm, breathe slowly",
      "Call 123 if no improvement in 5-10 minutes",
      "Don't leave person alone"
    ],
    stepsAr: [
      "ساعد في استخدام البخاخ",
      "اجلس منتصباً، فك الملابس الضيقة",
      "ابقَ هادئاً، تنفس ببطء",
      "اتصل بـ 123 إذا لم يتحسن في 5-10 دقائق",
      "لا تترك الشخص وحده"
    ],
    videoUrl: "https://www.youtube.com/watch?v=1LuAo-7V9Qw"
  },
  {
    id: 18,
    titleEn: "Head Injury Care",
    titleAr: "العناية بإصابات الرأس",
    descriptionEn: "Monitor head trauma carefully",
    descriptionAr: "مراقبة صدمات الرأس بعناية",
    stepsEn: [
      "Apply ice to reduce swelling",
      "Keep person still and calm",
      "Watch for confusion, vomiting, drowsiness",
      "Don't give medication without doctor approval",
      "Call 123 for severe symptoms"
    ],
    stepsAr: [
      "ضع ثلجاً لتقليل التورم",
      "أبقِ الشخص ساكناً وهادئاً",
      "راقب الارتباك والقيء والنعاس",
      "لا تعطِ دواء دون موافقة طبيب",
      "اتصل بـ 123 للأعراض الشديدة"
    ],
    videoUrl: "https://www.youtube.com/watch?v=eT1W10bPRPw"
  },
  {
    id: 19,
    titleEn: "Insect Sting/Bite",
    titleAr: "لدغة ولسعة الحشرات",
    descriptionEn: "Treat insect reactions",
    descriptionAr: "علاج ردود فعل الحشرات",
    stepsEn: [
      "Remove stinger by scraping (don't pinch)",
      "Wash with soap and water",
      "Apply cold compress",
      "Take antihistamine if needed",
      "Watch for allergic reaction signs"
    ],
    stepsAr: [
      "أزل الإبرة بالكشط (لا تضغط)",
      "اغسل بالصابون والماء",
      "ضع كمادة باردة",
      "تناول مضاد هيستامين إذا لزم",
      "راقب علامات رد الفعل التحسسي"
    ],
    videoUrl: "https://www.youtube.com/watch?v=5Z7bv0b6Qrg"
  },
  {
    id: 20,
    titleEn: "Dehydration Prevention",
    titleAr: "الوقاية من الجفاف",
    descriptionEn: "Recognize and treat dehydration",
    descriptionAr: "التعرف على الجفاف وعلاجه",
    stepsEn: [
      "Drink water regularly, especially in heat",
      "Watch for dry mouth, dark urine, dizziness",
      "Sip electrolyte drinks for severe cases",
      "Rest in cool place",
      "Seek medical help if symptoms persist"
    ],
    stepsAr: [
      "اشرب الماء بانتظام، خاصة في الحر",
      "راقب جفاف الفم والبول الداكن والدوار",
      "ارتشف مشروبات الإلكتروليت للحالات الشديدة",
      "استرح في مكان بارد",
      "اطلب المساعدة الطبية إذا استمرت الأعراض"
    ],
    videoUrl: "https://www.youtube.com/watch?v=9iMGFqMmUFs"
  },
  {
    id: 21,
    titleEn: "Electric Shock",
    titleAr: "الصعقة الكهربائية",
    descriptionEn: "Respond to electrical injuries safely",
    descriptionAr: "الاستجابة لإصابات الكهرباء بأمان",
    stepsEn: [
      "Don't touch person if still in contact with electricity",
      "Turn off power source if possible",
      "Call emergency services (123)",
      "Check breathing and pulse",
      "Perform CPR if needed"
    ],
    stepsAr: [
      "لا تلمس الشخص إذا كان لا يزال متصلاً بالكهرباء",
      "أطفئ مصدر الطاقة إن أمكن",
      "اتصل بالإسعاف (123)",
      "تحقق من التنفس والنبض",
      "أجرِ الإنعاش القلبي إذا لزم"
    ],
    category: "injuries",
    videoUrl: "https://www.youtube.com/watch?v=Eo3hzRIQCPI"
  },
  {
    id: 22,
    titleEn: "Drowning Rescue",
    titleAr: "إنقاذ الغرق",
    descriptionEn: "Help drowning victim safely",
    descriptionAr: "مساعدة ضحية الغرق بأمان",
    stepsEn: [
      "Call for help immediately",
      "Throw flotation device if available",
      "Pull victim to safety",
      "Check breathing and start CPR if needed",
      "Keep warm and monitor until help arrives"
    ],
    stepsAr: [
      "اطلب المساعدة فوراً",
      "ارمِ جهاز طفو إن توفر",
      "اسحب الضحية للأمان",
      "تحقق من التنفس وابدأ الإنعاش إذا لزم",
      "حافظ على الدفء وراقب حتى وصول المساعدة"
    ],
    category: "breathing",
    videoUrl: "https://www.youtube.com/watch?v=T8xsrkHwqvc"
  },
  {
    id: 23,
    titleEn: "Fainting",
    titleAr: "الإغماء",
    descriptionEn: "Help someone who fainted",
    descriptionAr: "مساعدة شخص أغمي عليه",
    stepsEn: [
      "Catch person if possible to prevent fall",
      "Lay person flat on back",
      "Elevate legs above heart level",
      "Loosen tight clothing",
      "Check breathing and call 123 if unconscious over 1 minute"
    ],
    stepsAr: [
      "أمسك الشخص إن أمكن لمنع السقوط",
      "أضجع الشخص على ظهره",
      "ارفع الساقين فوق مستوى القلب",
      "فك الملابس الضيقة",
      "تحقق من التنفس واتصل بـ 123 إذا استمر فقدان الوعي أكثر من دقيقة"
    ],
    category: "general",
    videoUrl: "https://www.youtube.com/watch?v=2k9v7TY_bMk"
  },
  {
    id: 24,
    titleEn: "Chemical Burns",
    titleAr: "الحروق الكيميائية",
    descriptionEn: "Treat chemical skin exposure",
    descriptionAr: "علاج تعرض الجلد للمواد الكيميائية",
    stepsEn: [
      "Remove contaminated clothing",
      "Flush with large amounts of water for 20+ minutes",
      "Don't neutralize chemical with other chemicals",
      "Cover with sterile dressing",
      "Seek immediate medical attention"
    ],
    stepsAr: [
      "أزل الملابس الملوثة",
      "اغسل بكميات كبيرة من الماء لمدة 20+ دقيقة",
      "لا تحيّد المادة الكيميائية بمواد أخرى",
      "غطِّ بضمادة معقمة",
      "اطلب العناية الطبية فوراً"
    ],
    category: "burns",
    videoUrl: "https://www.youtube.com/watch?v=n5R1e9r6X3c"
  },
  {
    id: 25,
    titleEn: "Tooth Knocked Out",
    titleAr: "سقوط السن",
    descriptionEn: "Save and preserve knocked out tooth",
    descriptionAr: "حفظ السن المخلوع",
    stepsEn: [
      "Handle tooth by crown only, not root",
      "Rinse gently with milk or water",
      "Try to reinsert in socket if possible",
      "If not possible, store in milk",
      "See dentist within 30 minutes"
    ],
    stepsAr: [
      "أمسك السن من التاج فقط وليس الجذر",
      "اشطفه برفق بالحليب أو الماء",
      "حاول إعادته للتجويف إن أمكن",
      "إذا لم يمكن، احفظه في الحليب",
      "راجع طبيب الأسنان خلال 30 دقيقة"
    ],
    category: "injuries",
    videoUrl: "https://www.youtube.com/watch?v=vFZ5AUqVHzk"
  },
  {
    id: 26,
    titleEn: "Panic Attack",
    titleAr: "نوبة الهلع",
    descriptionEn: "Help during panic attack",
    descriptionAr: "المساعدة أثناء نوبة الهلع",
    stepsEn: [
      "Stay calm and speak reassuringly",
      "Guide slow, deep breathing",
      "Move to quiet, safe space",
      "Ask what helps them",
      "Stay with person until attack passes"
    ],
    stepsAr: [
      "ابقَ هادئاً وتحدث بطريقة مطمئنة",
      "أرشد للتنفس البطيء والعميق",
      "انتقل لمكان هادئ وآمن",
      "اسأل ما الذي يساعدهم",
      "ابقَ مع الشخص حتى تمر النوبة"
    ],
    category: "general",
    videoUrl: "https://www.youtube.com/watch?v=tybOi4hjZFQ"
  },
  {
    id: 27,
    titleEn: "Broken Tooth",
    titleAr: "كسر السن",
    descriptionEn: "Care for broken or chipped tooth",
    descriptionAr: "العناية بالسن المكسور",
    stepsEn: [
      "Rinse mouth with warm water",
      "Apply cold compress to reduce swelling",
      "Save any tooth fragments",
      "Cover sharp edges with dental wax if available",
      "See dentist as soon as possible"
    ],
    stepsAr: [
      "اشطف الفم بماء دافئ",
      "ضع كمادة باردة لتقليل التورم",
      "احفظ أي شظايا من السن",
      "غطِّ الحواف الحادة بالشمع السني إن توفر",
      "راجع طبيب الأسنان في أقرب وقت"
    ],
    category: "injuries",
    videoUrl: "https://www.youtube.com/watch?v=T5yDfMZS_wk"
  },
  {
    id: 28,
    titleEn: "Animal Bite",
    titleAr: "عضة حيوان",
    descriptionEn: "Treat animal bites properly",
    descriptionAr: "علاج عضات الحيوانات بشكل صحيح",
    stepsEn: [
      "Wash wound with soap and water for 5 minutes",
      "Apply pressure to stop bleeding",
      "Apply antibiotic cream",
      "Cover with sterile bandage",
      "Seek medical attention for tetanus and rabies evaluation"
    ],
    stepsAr: [
      "اغسل الجرح بالصابون والماء لمدة 5 دقائق",
      "اضغط لإيقاف النزيف",
      "ضع كريم مضاد حيوي",
      "غطِّ بضمادة معقمة",
      "اطلب العناية الطبية لتقييم الكزاز وداء الكلب"
    ],
    category: "injuries",
    videoUrl: "https://www.youtube.com/watch?v=8TlqjLw_m0w"
  },
  {
    id: 29,
    titleEn: "Foreign Object in Nose",
    titleAr: "جسم غريب في الأنف",
    descriptionEn: "Remove object from nose safely",
    descriptionAr: "إزالة الجسم الغريب من الأنف بأمان",
    stepsEn: [
      "Keep calm and don't panic",
      "Try gentle nose blowing while closing other nostril",
      "Don't push object deeper",
      "Don't use tweezers or other tools",
      "See doctor if object won't come out"
    ],
    stepsAr: [
      "ابقَ هادئاً ولا تفزع",
      "حاول النفخ برفق مع إغلاق الفتحة الأخرى",
      "لا تدفع الجسم للداخل",
      "لا تستخدم ملاقط أو أدوات أخرى",
      "راجع الطبيب إذا لم يخرج الجسم"
    ],
    category: "general",
    videoUrl: "https://www.youtube.com/watch?v=6W_lUcXS3Zw"
  },
  {
    id: 30,
    titleEn: "Back Injury",
    titleAr: "إصابة الظهر",
    descriptionEn: "Care for suspected back or spine injury",
    descriptionAr: "العناية بإصابة الظهر أو العمود الفقري المشتبه بها",
    stepsEn: [
      "Don't move the person",
      "Call emergency services (123)",
      "Keep person still and calm",
      "Support head and neck in current position",
      "Wait for professional medical help"
    ],
    stepsAr: [
      "لا تحرك الشخص",
      "اتصل بالإسعاف (123)",
      "أبقِ الشخص ساكناً وهادئاً",
      "ادعم الرأس والرقبة في الوضع الحالي",
      "انتظر المساعدة الطبية المتخصصة"
    ],
    category: "injuries",
    videoUrl: "https://www.youtube.com/watch?v=rLoWMU4GxnY"
  },
  {
    id: 31,
    titleEn: "Sunburn Treatment",
    titleAr: "علاج حروق الشمس",
    descriptionEn: "Soothe and treat sunburn",
    descriptionAr: "تهدئة وعلاج حروق الشمس",
    stepsEn: [
      "Get out of the sun immediately",
      "Apply cool water or cool compresses",
      "Apply aloe vera or moisturizer",
      "Drink plenty of water",
      "Take pain reliever if needed"
    ],
    stepsAr: [
      "ابتعد عن الشمس فوراً",
      "ضع ماء بارد أو كمادات باردة",
      "ضع الصبار أو مرطب",
      "اشرب الكثير من الماء",
      "تناول مسكن ألم إذا لزم"
    ],
    category: "burns",
    videoUrl: "https://www.youtube.com/watch?v=tpBjtIBFq9o"
  },
  {
    id: 32,
    titleEn: "Muscle Cramp",
    titleAr: "تشنج العضلات",
    descriptionEn: "Relieve painful muscle cramps",
    descriptionAr: "تخفيف تشنجات العضلات المؤلمة",
    stepsEn: [
      "Gently stretch the cramped muscle",
      "Massage the area",
      "Apply heat to tense muscles",
      "Apply ice for tender muscles",
      "Drink water or electrolyte beverages"
    ],
    stepsAr: [
      "مدد العضلة المتشنجة برفق",
      "دلّك المنطقة",
      "ضع حرارة للعضلات المتوترة",
      "ضع ثلج للعضلات الحساسة",
      "اشرب ماء أو مشروبات إلكتروليت"
    ],
    category: "injuries",
    videoUrl: "https://www.youtube.com/watch?v=P_jIXU4Kp0Q"
  },
  {
    id: 33,
    titleEn: "Foreign Object in Eye",
    titleAr: "جسم غريب في العين",
    descriptionEn: "Remove small objects from eye",
    descriptionAr: "إزالة الأجسام الصغيرة من العين",
    stepsEn: [
      "Don't rub the eye",
      "Let tears flow naturally",
      "Try to flush with clean water",
      "Pull upper lid over lower lid",
      "Seek medical help if object remains"
    ],
    stepsAr: [
      "لا تفرك العين",
      "دع الدموع تتدفق طبيعياً",
      "حاول الغسل بماء نظيف",
      "اسحب الجفن العلوي فوق السفلي",
      "اطلب المساعدة الطبية إذا بقي الجسم"
    ],
    category: "general",
    videoUrl: "https://www.youtube.com/watch?v=xWWOhZ8nMGQ"
  },
  {
    id: 34,
    titleEn: "Hyperventilation",
    titleAr: "فرط التنفس",
    descriptionEn: "Help with rapid breathing",
    descriptionAr: "المساعدة في التنفس السريع",
    stepsEn: [
      "Stay calm and reassuring",
      "Encourage slow breathing",
      "Breathe through pursed lips",
      "Cup hands over mouth and nose",
      "Focus on exhaling slowly"
    ],
    stepsAr: [
      "ابقَ هادئاً ومطمئناً",
      "شجع التنفس البطيء",
      "تنفس من خلال الشفاه المضمومة",
      "ضع اليدين على الفم والأنف",
      "ركز على الزفير البطيء"
    ],
    category: "breathing",
    videoUrl: "https://www.youtube.com/watch?v=0qXcU2n4lBQ"
  },
  {
    id: 35,
    titleEn: "Heart Attack Warning",
    titleAr: "تحذير النوبة القلبية",
    descriptionEn: "Recognize and respond to heart attack",
    descriptionAr: "التعرف على النوبة القلبية والاستجابة لها",
    stepsEn: [
      "Call 123 immediately",
      "Chew aspirin if not allergic",
      "Loosen tight clothing",
      "Help person sit or lie down",
      "Be prepared for CPR"
    ],
    stepsAr: [
      "اتصل بـ 123 فوراً",
      "امضغ أسبرين إذا لم يكن هناك حساسية",
      "فك الملابس الضيقة",
      "ساعد الشخص على الجلوس أو الاستلقاء",
      "كن مستعداً للإنعاش القلبي"
    ],
    category: "cardiac",
    videoUrl: "https://www.youtube.com/watch?v=gDwt7dD3awc"
  },
  {
    id: 36,
    titleEn: "Chest Pain Response",
    titleAr: "التعامل مع ألم الصدر",
    descriptionEn: "Respond to chest pain emergencies",
    descriptionAr: "الاستجابة لحالات ألم الصدر الطارئة",
    stepsEn: [
      "Call 123 immediately",
      "Help person sit in comfortable position",
      "Loosen tight clothing",
      "Give aspirin if not allergic",
      "Monitor breathing and be ready for CPR"
    ],
    stepsAr: [
      "اتصل بـ 123 فوراً",
      "ساعد الشخص على الجلوس بوضع مريح",
      "فك الملابس الضيقة",
      "أعطِ أسبرين إذا لم يكن هناك حساسية",
      "راقب التنفس وكن مستعداً للإنعاش"
    ],
    category: "cardiac",
    videoUrl: "https://www.youtube.com/watch?v=n4F1AZ8bV2s"
  },
  {
    id: 37,
    titleEn: "Foreign Object in Ear",
    titleAr: "جسم غريب في الأذن",
    descriptionEn: "Remove foreign objects from ear safely",
    descriptionAr: "إزالة الأجسام الغريبة من الأذن بأمان",
    stepsEn: [
      "Do not insert anything into ear",
      "Tilt head to affected side",
      "Gently pull earlobe",
      "For insects, use flashlight to lure out",
      "Seek medical help if object remains"
    ],
    stepsAr: [
      "لا تدخل أي شيء في الأذن",
      "أمِل الرأس للجانب المصاب",
      "اسحب شحمة الأذن برفق",
      "للحشرات، استخدم ضوء لجذبها",
      "اطلب المساعدة الطبية إذا بقي الجسم"
    ],
    category: "injuries",
    videoUrl: "https://www.youtube.com/watch?v=2Wv_Sx9Xh0Q"
  },
  {
    id: 38,
    titleEn: "Abdominal Pain Emergency",
    titleAr: "طوارئ ألم البطن",
    descriptionEn: "Respond to severe abdominal pain",
    descriptionAr: "الاستجابة لألم البطن الشديد",
    stepsEn: [
      "Help person lie in comfortable position",
      "Do not give food or water",
      "Apply warm compress if not appendicitis",
      "Note location and type of pain",
      "Call 123 if pain is severe"
    ],
    stepsAr: [
      "ساعد الشخص على الاستلقاء بوضع مريح",
      "لا تعطِ طعاماً أو ماءً",
      "ضع كمادة دافئة إذا لم تكن الزائدة",
      "لاحظ موقع ونوع الألم",
      "اتصل بـ 123 إذا كان الألم شديداً"
    ],
    category: "medical",
    videoUrl: "https://www.youtube.com/watch?v=W_pDz_2k7pA"
  },
  {
    id: 39,
    titleEn: "Frostbite Treatment",
    titleAr: "علاج عضة الصقيع",
    descriptionEn: "Treat cold-related tissue damage",
    descriptionAr: "علاج تلف الأنسجة الناتج عن البرد",
    stepsEn: [
      "Move to warm area",
      "Remove wet clothing",
      "Warm affected area in warm water 37-39°C",
      "Do not rub or massage",
      "Seek medical attention"
    ],
    stepsAr: [
      "انتقل إلى منطقة دافئة",
      "أزل الملابس المبللة",
      "دفئ المنطقة في ماء دافئ 37-39 درجة",
      "لا تفرك أو تدلك",
      "اطلب الرعاية الطبية"
    ],
    category: "environmental",
    videoUrl: "https://www.youtube.com/watch?v=Kc5h0S4nNlw"
  },
  {
    id: 40,
    titleEn: "Snake Bite Response",
    titleAr: "التعامل مع لدغة الثعبان",
    descriptionEn: "First aid for snake bites",
    descriptionAr: "الإسعافات الأولية للدغات الثعابين",
    stepsEn: [
      "Move away from snake",
      "Keep victim calm and still",
      "Immobilize bitten limb",
      "Remove jewelry before swelling",
      "Call 123 immediately"
    ],
    stepsAr: [
      "ابتعد عن الثعبان",
      "أبقِ الضحية هادئاً وساكناً",
      "ثبت الطرف الملدوغ",
      "أزل المجوهرات قبل التورم",
      "اتصل بـ 123 فوراً"
    ],
    category: "bites",
    videoUrl: "https://www.youtube.com/watch?v=T1vpJbB7Rpo"
  },
  {
    id: 41,
    titleEn: "Dog Bite Treatment",
    titleAr: "علاج عضة الكلب",
    descriptionEn: "First aid for dog bites",
    descriptionAr: "الإسعافات الأولية لعضات الكلاب",
    stepsEn: [
      "Clean wound with soap and water",
      "Apply pressure to stop bleeding",
      "Apply antibiotic ointment",
      "Cover with sterile bandage",
      "Seek medical care for rabies evaluation"
    ],
    stepsAr: [
      "نظف الجرح بالصابون والماء",
      "اضغط لإيقاف النزيف",
      "ضع مرهم مضاد حيوي",
      "غطِّ بضمادة معقمة",
      "اطلب رعاية طبية لتقييم داء الكلب"
    ],
    category: "bites",
    videoUrl: "https://www.youtube.com/watch?v=K2oG8U6qp3M"
  },
  {
    id: 42,
    titleEn: "Jellyfish Sting",
    titleAr: "لسعة قنديل البحر",
    descriptionEn: "Treat jellyfish stings",
    descriptionAr: "علاج لسعات قناديل البحر",
    stepsEn: [
      "Rinse with seawater, not fresh water",
      "Remove tentacles with tweezers",
      "Apply vinegar for 30 seconds",
      "Immerse in hot water 40-45°C",
      "Seek medical help for severe reactions"
    ],
    stepsAr: [
      "اشطف بماء البحر لا الماء العذب",
      "أزل المجسات بملقط",
      "ضع الخل لمدة 30 ثانية",
      "اغمر في ماء ساخن 40-45 درجة",
      "اطلب المساعدة الطبية للتفاعلات الشديدة"
    ],
    category: "bites",
    videoUrl: "https://www.youtube.com/watch?v=4TnJN7cZLR8"
  },
  {
    id: 43,
    titleEn: "Scorpion Sting",
    titleAr: "لدغة العقرب",
    descriptionEn: "First aid for scorpion stings",
    descriptionAr: "الإسعافات الأولية للدغات العقارب",
    stepsEn: [
      "Wash area with soap and water",
      "Apply cold compress for 10 minutes",
      "Keep affected limb below heart level",
      "Take pain reliever if needed",
      "Seek immediate medical attention"
    ],
    stepsAr: [
      "اغسل المنطقة بالصابون والماء",
      "ضع كمادة باردة لمدة 10 دقائق",
      "أبقِ الطرف المصاب أسفل مستوى القلب",
      "تناول مسكن ألم إذا لزم",
      "اطلب العناية الطبية فوراً"
    ],
    category: "bites",
    videoUrl: "https://www.youtube.com/watch?v=7QkKH1dpX-k"
  },
  {
    id: 44,
    titleEn: "Splinter Removal",
    titleAr: "إزالة الشظية",
    descriptionEn: "Safely remove splinters from skin",
    descriptionAr: "إزالة الشظايا من الجلد بأمان",
    stepsEn: [
      "Clean area with soap and water",
      "Sterilize tweezers with alcohol",
      "Grip splinter close to skin",
      "Pull out in same direction it entered",
      "Apply antibiotic cream and bandage"
    ],
    stepsAr: [
      "نظف المنطقة بالصابون والماء",
      "عقّم الملقط بالكحول",
      "أمسك الشظية قريباً من الجلد",
      "اسحب في نفس اتجاه الدخول",
      "ضع كريم مضاد حيوي وضمادة"
    ],
    category: "injuries",
    videoUrl: "https://www.youtube.com/watch?v=Ly-6FfjN46U"
  },
  {
    id: 45,
    titleEn: "Finger Dislocation",
    titleAr: "خلع الإصبع",
    descriptionEn: "Care for dislocated finger",
    descriptionAr: "العناية بالإصبع المخلوع",
    stepsEn: [
      "Do not try to pop it back",
      "Apply ice to reduce swelling",
      "Splint the finger in current position",
      "Elevate the hand",
      "Seek medical attention immediately"
    ],
    stepsAr: [
      "لا تحاول إعادته لمكانه",
      "ضع ثلجاً لتقليل التورم",
      "ثبت الإصبع في وضعه الحالي",
      "ارفع اليد",
      "اطلب العناية الطبية فوراً"
    ],
    category: "injuries",
    videoUrl: "https://www.youtube.com/watch?v=pZtf6r9g0Dk"
  },
  {
    id: 46,
    titleEn: "Nausea and Vomiting",
    titleAr: "الغثيان والقيء",
    descriptionEn: "Manage nausea and vomiting",
    descriptionAr: "التعامل مع الغثيان والقيء",
    stepsEn: [
      "Sit upright or lie on side",
      "Sip clear fluids slowly",
      "Avoid solid foods initially",
      "Use anti-nausea medications if available",
      "Seek help if vomiting blood or lasting 24+ hours"
    ],
    stepsAr: [
      "اجلس منتصباً أو استلقِ على الجانب",
      "ارتشف السوائل الصافية ببطء",
      "تجنب الأطعمة الصلبة في البداية",
      "استخدم أدوية مضادة للغثيان إن توفرت",
      "اطلب المساعدة إذا كان هناك دم أو استمر أكثر من 24 ساعة"
    ],
    category: "medical",
    videoUrl: "https://www.youtube.com/watch?v=FqvP8cMTYFo"
  },
  {
    id: 47,
    titleEn: "Diarrhea Management",
    titleAr: "التعامل مع الإسهال",
    descriptionEn: "Treat acute diarrhea",
    descriptionAr: "علاج الإسهال الحاد",
    stepsEn: [
      "Stay hydrated with clear fluids",
      "Use oral rehydration solution",
      "Avoid dairy and fatty foods",
      "Eat bland foods when hungry",
      "Seek help if bloody or lasting 48+ hours"
    ],
    stepsAr: [
      "حافظ على الترطيب بالسوائل الصافية",
      "استخدم محلول الإماهة الفموي",
      "تجنب منتجات الألبان والأطعمة الدهنية",
      "تناول أطعمة خفيفة عند الجوع",
      "اطلب المساعدة إذا كان دموياً أو استمر أكثر من 48 ساعة"
    ],
    category: "medical",
    videoUrl: "https://www.youtube.com/watch?v=tDVMt3rDp5k"
  },
  {
    id: 48,
    titleEn: "High Fever Management",
    titleAr: "التعامل مع الحمى الشديدة",
    descriptionEn: "Reduce high body temperature",
    descriptionAr: "خفض درجة حرارة الجسم المرتفعة",
    stepsEn: [
      "Remove excess clothing",
      "Apply cool damp cloths",
      "Give fever-reducing medication",
      "Encourage fluid intake",
      "Seek help if fever exceeds 39.4°C"
    ],
    stepsAr: [
      "أزل الملابس الزائدة",
      "ضع قماشاً بارداً ورطباً",
      "أعطِ دواء خافض للحرارة",
      "شجع شرب السوائل",
      "اطلب المساعدة إذا تجاوزت الحرارة 39.4 درجة"
    ],
    category: "medical",
    videoUrl: "https://www.youtube.com/watch?v=0Wp5tTvJ1Zs"
  },
  {
    id: 49,
    titleEn: "Severe Headache",
    titleAr: "الصداع الشديد",
    descriptionEn: "Manage severe headache",
    descriptionAr: "التعامل مع الصداع الشديد",
    stepsEn: [
      "Rest in dark, quiet room",
      "Apply cold compress to forehead",
      "Take pain medication as directed",
      "Stay hydrated",
      "Seek help if sudden severe onset or with other symptoms"
    ],
    stepsAr: [
      "استرح في غرفة مظلمة وهادئة",
      "ضع كمادة باردة على الجبهة",
      "تناول مسكن الألم حسب التوجيهات",
      "حافظ على الترطيب",
      "اطلب المساعدة إذا كان مفاجئاً شديداً أو مع أعراض أخرى"
    ],
    category: "medical",
    videoUrl: "https://www.youtube.com/watch?v=qQzL7H9VyHQ"
  },
  {
    id: 50,
    titleEn: "Croup in Children",
    titleAr: "الخانوق عند الأطفال",
    descriptionEn: "Help child with croup cough",
    descriptionAr: "مساعدة الطفل المصاب بسعال الخانوق",
    stepsEn: [
      "Keep child calm",
      "Take to bathroom with hot shower steam",
      "Or take outside to cool night air",
      "Offer warm fluids",
      "Seek help if breathing becomes difficult"
    ],
    stepsAr: [
      "أبقِ الطفل هادئاً",
      "خذه للحمام مع بخار الماء الساخن",
      "أو خذه للخارج للهواء البارد",
      "قدم سوائل دافئة",
      "اطلب المساعدة إذا أصبح التنفس صعباً"
    ],
    category: "breathing",
    videoUrl: "https://www.youtube.com/watch?v=S_fhH1jlF-A"
  },
  {
    id: 51,
    titleEn: "Bee Sting",
    titleAr: "لسعة النحلة",
    descriptionEn: "Treat bee stings properly",
    descriptionAr: "علاج لسعات النحل بشكل صحيح",
    stepsEn: [
      "Scrape out stinger with flat edge",
      "Wash with soap and water",
      "Apply ice for 10 minutes",
      "Take antihistamine for swelling",
      "Watch for allergic reactions"
    ],
    stepsAr: [
      "اكشط الإبرة بحافة مسطحة",
      "اغسل بالصابون والماء",
      "ضع ثلجاً لمدة 10 دقائق",
      "تناول مضاد هيستامين للتورم",
      "راقب ردود الفعل التحسسية"
    ],
    category: "bites",
    videoUrl: "https://www.youtube.com/watch?v=h3eFQMVFt4I"
  },
  {
    id: 52,
    titleEn: "Tick Removal",
    titleAr: "إزالة القراد",
    descriptionEn: "Safely remove ticks from skin",
    descriptionAr: "إزالة القراد من الجلد بأمان",
    stepsEn: [
      "Use fine-tipped tweezers",
      "Grasp tick close to skin surface",
      "Pull upward with steady pressure",
      "Clean area with alcohol",
      "Save tick for identification if possible"
    ],
    stepsAr: [
      "استخدم ملقط دقيق الطرف",
      "أمسك القراد قريباً من سطح الجلد",
      "اسحب للأعلى بضغط ثابت",
      "نظف المنطقة بالكحول",
      "احفظ القراد للتعرف عليه إن أمكن"
    ],
    category: "bites",
    videoUrl: "https://www.youtube.com/watch?v=SMz1LY8zy-0"
  },
  {
    id: 53,
    titleEn: "Minor Cut Care",
    titleAr: "العناية بالجروح الصغيرة",
    descriptionEn: "Clean and dress minor cuts",
    descriptionAr: "تنظيف وتضميد الجروح الصغيرة",
    stepsEn: [
      "Wash hands before treating",
      "Clean wound with water",
      "Apply antibiotic ointment",
      "Cover with sterile bandage",
      "Change bandage daily or when wet"
    ],
    stepsAr: [
      "اغسل يديك قبل العلاج",
      "نظف الجرح بالماء",
      "ضع مرهم مضاد حيوي",
      "غطِّ بضمادة معقمة",
      "غيّر الضمادة يومياً أو عند البلل"
    ],
    category: "injuries",
    videoUrl: "https://www.youtube.com/watch?v=P_jIXU4Kp0Q"
  },
  {
    id: 54,
    titleEn: "Blister Care",
    titleAr: "العناية بالبثور",
    descriptionEn: "Treat blisters properly",
    descriptionAr: "علاج البثور بشكل صحيح",
    stepsEn: [
      "Don't pop the blister",
      "Cover with bandage",
      "If it pops, clean area gently",
      "Apply antibiotic ointment",
      "Keep covered until healed"
    ],
    stepsAr: [
      "لا تفقع البثرة",
      "غطِّ بضمادة",
      "إذا انفقعت، نظف المنطقة برفق",
      "ضع مرهم مضاد حيوي",
      "أبقِ مغطاة حتى الشفاء"
    ],
    category: "injuries",
    videoUrl: "https://www.youtube.com/watch?v=ZPF7tD2yQ_4"
  },
  {
    id: 55,
    titleEn: "Ingrown Toenail",
    titleAr: "ظفر الرجل الناشب",
    descriptionEn: "Care for ingrown toenail",
    descriptionAr: "العناية بالظفر الناشب",
    stepsEn: [
      "Soak foot in warm water",
      "Place cotton under nail edge",
      "Apply antibiotic ointment",
      "Wear comfortable shoes",
      "See doctor if infected"
    ],
    stepsAr: [
      "انقع القدم في ماء دافئ",
      "ضع قطناً تحت حافة الظفر",
      "ضع مرهم مضاد حيوي",
      "ارتدِ حذاءً مريحاً",
      "راجع الطبيب إذا كان ملتهباً"
    ],
    category: "injuries",
    videoUrl: "https://www.youtube.com/watch?v=q6oLlNfRntc"
  },
  {
    id: 56,
    titleEn: "Bloody Nose from Injury",
    titleAr: "نزيف الأنف من إصابة",
    descriptionEn: "Handle traumatic nosebleed",
    descriptionAr: "التعامل مع نزيف الأنف الناتج عن إصابة",
    stepsEn: [
      "Sit upright and lean forward",
      "Pinch nose for 15 minutes",
      "Apply ice to bridge of nose",
      "Check for broken nose signs",
      "Seek help if bleeding won't stop"
    ],
    stepsAr: [
      "اجلس منتصباً ومِل للأمام",
      "اضغط على الأنف لمدة 15 دقيقة",
      "ضع ثلجاً على جسر الأنف",
      "تحقق من علامات كسر الأنف",
      "اطلب المساعدة إذا لم يتوقف النزيف"
    ],
    category: "injuries",
    videoUrl: "https://www.youtube.com/watch?v=J8eNcYTSh1c"
  },
  {
    id: 57,
    titleEn: "Knocked Wind Out",
    titleAr: "انقطاع النفس من ضربة",
    descriptionEn: "Help when wind knocked out",
    descriptionAr: "المساعدة عند انقطاع النفس من ضربة",
    stepsEn: [
      "Stay calm and reassure person",
      "Have them sit upright",
      "Loosen any tight clothing",
      "Encourage slow deep breaths",
      "Breathing usually returns in 1-2 minutes"
    ],
    stepsAr: [
      "ابقَ هادئاً وطمئن الشخص",
      "اجعله يجلس منتصباً",
      "فك أي ملابس ضيقة",
      "شجع التنفس البطيء العميق",
      "التنفس يعود عادة في 1-2 دقيقة"
    ],
    category: "breathing",
    videoUrl: "https://www.youtube.com/watch?v=dHeHlXN9zco"
  },
  {
    id: 58,
    titleEn: "Dislocated Shoulder",
    titleAr: "خلع الكتف",
    descriptionEn: "Care for dislocated shoulder",
    descriptionAr: "العناية بالكتف المخلوع",
    stepsEn: [
      "Do not try to move shoulder back",
      "Immobilize arm against body",
      "Apply ice to reduce swelling",
      "Take pain medication",
      "Get immediate medical help"
    ],
    stepsAr: [
      "لا تحاول إعادة الكتف لمكانه",
      "ثبت الذراع على الجسم",
      "ضع ثلجاً لتقليل التورم",
      "تناول مسكن ألم",
      "احصل على مساعدة طبية فورية"
    ],
    category: "injuries",
    videoUrl: "https://www.youtube.com/watch?v=d_gP9AyxRvI"
  },
  {
    id: 59,
    titleEn: "Whiplash",
    titleAr: "إصابة الرقبة السوطية",
    descriptionEn: "Care for neck whiplash injury",
    descriptionAr: "العناية بإصابة الرقبة السوطية",
    stepsEn: [
      "Apply ice for first 24 hours",
      "Then apply heat",
      "Take pain medication as needed",
      "Rest but avoid bed rest",
      "Seek medical evaluation"
    ],
    stepsAr: [
      "ضع ثلجاً أول 24 ساعة",
      "ثم ضع حرارة",
      "تناول مسكن ألم حسب الحاجة",
      "استرح ولكن تجنب الراحة في السرير",
      "اطلب تقييماً طبياً"
    ],
    category: "injuries",
    videoUrl: "https://www.youtube.com/watch?v=K0O_cT8xYx8"
  },
  {
    id: 60,
    titleEn: "Spinal Injury Suspicion",
    titleAr: "الاشتباه بإصابة العمود الفقري",
    descriptionEn: "Handle suspected spinal injury",
    descriptionAr: "التعامل مع إصابة العمود الفقري المشتبه بها",
    stepsEn: [
      "Do not move the person",
      "Call 123 immediately",
      "Stabilize head and neck",
      "Keep person calm",
      "Monitor breathing until help arrives"
    ],
    stepsAr: [
      "لا تحرك الشخص",
      "اتصل بـ 123 فوراً",
      "ثبت الرأس والرقبة",
      "أبقِ الشخص هادئاً",
      "راقب التنفس حتى وصول المساعدة"
    ],
    category: "injuries",
    videoUrl: "https://www.youtube.com/watch?v=7TFjE6U_Vrw"
  },
  {
    id: 61,
    titleEn: "Carbon Monoxide Poisoning",
    titleAr: "التسمم بأول أكسيد الكربون",
    descriptionEn: "Respond to CO poisoning",
    descriptionAr: "الاستجابة للتسمم بأول أكسيد الكربون",
    stepsEn: [
      "Get everyone out of the area immediately",
      "Move to fresh air",
      "Call 123",
      "Do not re-enter building",
      "Seek medical attention"
    ],
    stepsAr: [
      "أخرج الجميع من المنطقة فوراً",
      "انتقل للهواء النقي",
      "اتصل بـ 123",
      "لا تدخل المبنى مجدداً",
      "اطلب العناية الطبية"
    ],
    category: "poisoning",
    videoUrl: "https://www.youtube.com/watch?v=Fg_cwg-sVro"
  },
  {
    id: 62,
    titleEn: "Food Poisoning",
    titleAr: "التسمم الغذائي",
    descriptionEn: "Manage food poisoning symptoms",
    descriptionAr: "التعامل مع أعراض التسمم الغذائي",
    stepsEn: [
      "Stay hydrated with clear fluids",
      "Rest and avoid solid food initially",
      "Gradually introduce bland foods",
      "Avoid dairy and caffeine",
      "Seek help if symptoms are severe"
    ],
    stepsAr: [
      "حافظ على الترطيب بالسوائل الصافية",
      "استرح وتجنب الأطعمة الصلبة في البداية",
      "أدخل الأطعمة الخفيفة تدريجياً",
      "تجنب منتجات الألبان والكافيين",
      "اطلب المساعدة إذا كانت الأعراض شديدة"
    ],
    category: "poisoning",
    videoUrl: "https://www.youtube.com/watch?v=C_TnQ0SAEQU"
  },
  {
    id: 63,
    titleEn: "Alcohol Poisoning",
    titleAr: "التسمم الكحولي",
    descriptionEn: "Respond to alcohol overdose",
    descriptionAr: "الاستجابة للجرعة الزائدة من الكحول",
    stepsEn: [
      "Call 123 immediately",
      "Keep person awake and sitting up",
      "Give water if conscious",
      "Keep warm",
      "If vomiting, turn on side to prevent choking"
    ],
    stepsAr: [
      "اتصل بـ 123 فوراً",
      "أبقِ الشخص مستيقظاً وجالساً",
      "أعطِ ماء إذا كان واعياً",
      "حافظ على الدفء",
      "إذا تقيأ، اقلبه على جانبه لمنع الاختناق"
    ],
    category: "poisoning",
    videoUrl: "https://www.youtube.com/watch?v=2Z4m4lnjxkY"
  },
  {
    id: 64,
    titleEn: "Drug Overdose",
    titleAr: "الجرعة الزائدة من الأدوية",
    descriptionEn: "Respond to drug overdose",
    descriptionAr: "الاستجابة للجرعة الزائدة",
    stepsEn: [
      "Call 123 immediately",
      "Check breathing and pulse",
      "Perform CPR if needed",
      "Keep person on their side",
      "Don't leave them alone"
    ],
    stepsAr: [
      "اتصل بـ 123 فوراً",
      "تحقق من التنفس والنبض",
      "أجرِ الإنعاش القلبي إذا لزم",
      "أبقِ الشخص على جانبه",
      "لا تتركه وحده"
    ],
    category: "poisoning",
    videoUrl: "https://www.youtube.com/watch?v=HBzAQD4WnlI"
  },
  {
    id: 65,
    titleEn: "Smoke Inhalation",
    titleAr: "استنشاق الدخان",
    descriptionEn: "Help with smoke inhalation",
    descriptionAr: "المساعدة في حالة استنشاق الدخان",
    stepsEn: [
      "Get to fresh air immediately",
      "Call 123",
      "Loosen tight clothing",
      "Monitor breathing",
      "Perform CPR if needed"
    ],
    stepsAr: [
      "انتقل للهواء النقي فوراً",
      "اتصل بـ 123",
      "فك الملابس الضيقة",
      "راقب التنفس",
      "أجرِ الإنعاش القلبي إذا لزم"
    ],
    category: "breathing",
    videoUrl: "https://www.youtube.com/watch?v=kWz7wLpXDjs"
  },
  {
    id: 66,
    titleEn: "Asphyxiation",
    titleAr: "الاختناق",
    descriptionEn: "Respond to suffocation emergency",
    descriptionAr: "الاستجابة لحالة الاختناق الطارئة",
    stepsEn: [
      "Remove cause of suffocation",
      "Call 123",
      "Check for breathing",
      "Perform CPR if needed",
      "Keep airway clear"
    ],
    stepsAr: [
      "أزل سبب الاختناق",
      "اتصل بـ 123",
      "تحقق من التنفس",
      "أجرِ الإنعاش القلبي إذا لزم",
      "أبقِ مجرى الهواء واضحاً"
    ],
    category: "breathing",
    videoUrl: "https://www.youtube.com/watch?v=R7gTqL5fR6o"
  },
  {
    id: 67,
    titleEn: "Hiccups Persistent",
    titleAr: "الحازوقة المستمرة",
    descriptionEn: "Stop persistent hiccups",
    descriptionAr: "إيقاف الحازوقة المستمرة",
    stepsEn: [
      "Hold breath for 20 seconds",
      "Drink cold water slowly",
      "Breathe into paper bag briefly",
      "Try swallowing sugar",
      "See doctor if lasting over 48 hours"
    ],
    stepsAr: [
      "احبس نفسك لمدة 20 ثانية",
      "اشرب ماء بارد ببطء",
      "تنفس في كيس ورقي لفترة قصيرة",
      "حاول ابتلاع السكر",
      "راجع الطبيب إذا استمرت أكثر من 48 ساعة"
    ],
    category: "general",
    videoUrl: "https://www.youtube.com/watch?v=5O5QXp3oVmQ"
  },
  {
    id: 68,
    titleEn: "Black Eye",
    titleAr: "العين السوداء (كدمة العين)",
    descriptionEn: "Treat black eye injury",
    descriptionAr: "علاج كدمة العين",
    stepsEn: [
      "Apply ice for 15-20 minutes",
      "Avoid pressing on the eye",
      "Keep head elevated",
      "Take pain medication if needed",
      "See doctor if vision problems occur"
    ],
    stepsAr: [
      "ضع ثلجاً لمدة 15-20 دقيقة",
      "تجنب الضغط على العين",
      "أبقِ الرأس مرتفعاً",
      "تناول مسكن ألم إذا لزم",
      "راجع الطبيب إذا حدثت مشاكل في الرؤية"
    ],
    category: "injuries",
    videoUrl: "https://www.youtube.com/watch?v=J_CwTxSw0Lw"
  },
  {
    id: 69,
    titleEn: "Concussion",
    titleAr: "الارتجاج",
    descriptionEn: "Recognize and respond to concussion",
    descriptionAr: "التعرف على الارتجاج والاستجابة له",
    stepsEn: [
      "Watch for confusion or disorientation",
      "Check for unequal pupils",
      "Monitor for vomiting or headache",
      "Rest and avoid screens",
      "Seek medical evaluation"
    ],
    stepsAr: [
      "راقب الارتباك أو فقدان الاتجاه",
      "تحقق من تفاوت حجم البؤبؤين",
      "راقب القيء أو الصداع",
      "استرح وتجنب الشاشات",
      "اطلب تقييماً طبياً"
    ],
    category: "injuries",
    videoUrl: "https://www.youtube.com/watch?v=vdVfvV2bKYQ"
  },
  {
    id: 70,
    titleEn: "Rib Fracture",
    titleAr: "كسر الضلع",
    descriptionEn: "Care for suspected rib fracture",
    descriptionAr: "العناية بكسر الضلع المشتبه به",
    stepsEn: [
      "Apply ice to reduce swelling",
      "Take pain medication as needed",
      "Take shallow breaths if painful",
      "Avoid wrapping chest tightly",
      "Seek medical attention"
    ],
    stepsAr: [
      "ضع ثلجاً لتقليل التورم",
      "تناول مسكن ألم حسب الحاجة",
      "خذ أنفاساً ضحلة إذا كان مؤلماً",
      "تجنب لف الصدر بإحكام",
      "اطلب العناية الطبية"
    ],
    category: "injuries",
    videoUrl: "https://www.youtube.com/watch?v=qKJv4S5peNc"
  },
  {
    id: 71,
    titleEn: "Finger Caught in Door",
    titleAr: "انحشار الإصبع في الباب",
    descriptionEn: "Treat finger caught in door",
    descriptionAr: "علاج الإصبع المنحشر في الباب",
    stepsEn: [
      "Apply ice immediately",
      "Elevate the hand",
      "Check for deformity or inability to move",
      "Take pain medication",
      "See doctor if bruising under nail or fracture suspected"
    ],
    stepsAr: [
      "ضع ثلجاً فوراً",
      "ارفع اليد",
      "تحقق من التشوه أو عدم القدرة على الحركة",
      "تناول مسكن ألم",
      "راجع الطبيب إذا كان هناك كدمة تحت الظفر أو اشتباه بكسر"
    ],
    category: "injuries",
    videoUrl: "https://www.youtube.com/watch?v=A_tAOiTGvwo"
  },
  {
    id: 72,
    titleEn: "Bruise Care",
    titleAr: "العناية بالكدمات",
    descriptionEn: "Treat bruises properly",
    descriptionAr: "علاج الكدمات بشكل صحيح",
    stepsEn: [
      "Apply ice for 20 minutes",
      "Elevate injured area",
      "After 48 hours, apply heat",
      "Take pain medication if needed",
      "See doctor if bruise grows or is very painful"
    ],
    stepsAr: [
      "ضع ثلجاً لمدة 20 دقيقة",
      "ارفع المنطقة المصابة",
      "بعد 48 ساعة، ضع حرارة",
      "تناول مسكن ألم إذا لزم",
      "راجع الطبيب إذا كبرت الكدمة أو كانت مؤلمة جداً"
    ],
    category: "injuries",
    videoUrl: "https://www.youtube.com/watch?v=wKl_N8dMzLI"
  },
  {
    id: 73,
    titleEn: "Swallowed Object",
    titleAr: "ابتلاع جسم غريب",
    descriptionEn: "Handle swallowed foreign object",
    descriptionAr: "التعامل مع ابتلاع جسم غريب",
    stepsEn: [
      "If breathing normally, stay calm",
      "Small smooth objects usually pass",
      "Don't induce vomiting",
      "Monitor for pain or difficulty swallowing",
      "Seek help for sharp objects or batteries"
    ],
    stepsAr: [
      "إذا كان التنفس طبيعياً، ابقَ هادئاً",
      "الأجسام الصغيرة الناعمة تمر عادة",
      "لا تحث على التقيؤ",
      "راقب الألم أو صعوبة البلع",
      "اطلب المساعدة للأجسام الحادة أو البطاريات"
    ],
    category: "general",
    videoUrl: "https://www.youtube.com/watch?v=V7uMy1kFfKk"
  },
  {
    id: 74,
    titleEn: "Nosebleed from High Altitude",
    titleAr: "نزيف الأنف من الارتفاع",
    descriptionEn: "Handle altitude-related nosebleed",
    descriptionAr: "التعامل مع نزيف الأنف الناتج عن الارتفاع",
    stepsEn: [
      "Sit upright and lean forward",
      "Pinch nose for 10-15 minutes",
      "Apply saline spray",
      "Use humidifier if available",
      "Descend if bleeding continues"
    ],
    stepsAr: [
      "اجلس منتصباً ومِل للأمام",
      "اضغط على الأنف لمدة 10-15 دقيقة",
      "استخدم رذاذ ملحي",
      "استخدم جهاز ترطيب إن توفر",
      "انزل للأسفل إذا استمر النزيف"
    ],
    category: "environmental",
    videoUrl: "https://www.youtube.com/watch?v=xEwQjOeXszM"
  },
  {
    id: 75,
    titleEn: "Motion Sickness",
    titleAr: "دوار الحركة",
    descriptionEn: "Manage motion sickness",
    descriptionAr: "التعامل مع دوار الحركة",
    stepsEn: [
      "Look at stable horizon",
      "Get fresh air if possible",
      "Avoid reading or screens",
      "Try ginger or peppermint",
      "Take motion sickness medication before travel"
    ],
    stepsAr: [
      "انظر للأفق الثابت",
      "احصل على هواء نقي إن أمكن",
      "تجنب القراءة أو الشاشات",
      "جرب الزنجبيل أو النعناع",
      "تناول دواء دوار الحركة قبل السفر"
    ],
    category: "general",
    videoUrl: "https://www.youtube.com/watch?v=GVT7bF5pTig"
  }
];
