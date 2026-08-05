export interface MentalDisease {
  id: string;
  nameAr: string;
  nameEn: string;
  symptomsAr: string[];
  symptomsEn: string[];
  treatmentsAr: string[];
  treatmentsEn: string[];
}

export const mentalDiseases: MentalDisease[] = [
  {
    id: 'depression',
    nameAr: 'الاكتئاب',
    nameEn: 'Depression',
    symptomsAr: ['الحزن المستمر', 'فقدان الاهتمام', 'اضطرابات النوم', 'التعب المزمن', 'صعوبة التركيز', 'أفكار انتحارية', 'تغير في الشهية'],
    symptomsEn: ['Persistent sadness', 'Loss of interest', 'Sleep disturbances', 'Chronic fatigue', 'Difficulty concentrating', 'Suicidal thoughts', 'Appetite changes'],
    treatmentsAr: ['العلاج النفسي السلوكي', 'مضادات الاكتئاب (سيرترالين، فلوكستين)', 'العلاج بالضوء', 'التمارين الرياضية', 'العلاج الجماعي'],
    treatmentsEn: ['Cognitive behavioral therapy', 'Antidepressants (Sertraline, Fluoxetine)', 'Light therapy', 'Exercise', 'Group therapy']
  },
  {
    id: 'anxiety',
    nameAr: 'اضطراب القلق العام',
    nameEn: 'Generalized Anxiety Disorder',
    symptomsAr: ['القلق المفرط', 'التوتر العضلي', 'صعوبة النوم', 'سرعة الانفعال', 'صعوبة التركيز', 'الأرق', 'خفقان القلب'],
    symptomsEn: ['Excessive worry', 'Muscle tension', 'Sleep difficulties', 'Irritability', 'Concentration problems', 'Restlessness', 'Heart palpitations'],
    treatmentsAr: ['العلاج السلوكي المعرفي', 'تقنيات الاسترخاء', 'أدوية مضادة للقلق (بوسبيرون)', 'التأمل واليقظة', 'تمارين التنفس'],
    treatmentsEn: ['Cognitive behavioral therapy', 'Relaxation techniques', 'Anti-anxiety medications (Buspirone)', 'Meditation and mindfulness', 'Breathing exercises']
  },
  {
    id: 'bipolar',
    nameAr: 'اضطراب ثنائي القطب',
    nameEn: 'Bipolar Disorder',
    symptomsAr: ['نوبات هوس', 'نوبات اكتئاب', 'تقلبات مزاجية حادة', 'فرط النشاط', 'قلة النوم في الهوس', 'أفكار متسارعة', 'سلوك متهور'],
    symptomsEn: ['Manic episodes', 'Depressive episodes', 'Severe mood swings', 'Hyperactivity', 'Reduced need for sleep', 'Racing thoughts', 'Impulsive behavior'],
    treatmentsAr: ['مثبتات المزاج (ليثيوم، فالبروات)', 'مضادات الذهان', 'العلاج النفسي', 'تنظيم النوم', 'العلاج الأسري'],
    treatmentsEn: ['Mood stabilizers (Lithium, Valproate)', 'Antipsychotics', 'Psychotherapy', 'Sleep regulation', 'Family therapy']
  },
  {
    id: 'ocd',
    nameAr: 'الوسواس القهري',
    nameEn: 'Obsessive-Compulsive Disorder',
    symptomsAr: ['أفكار وسواسية متكررة', 'سلوكيات قهرية', 'غسل اليدين المفرط', 'الترتيب والتنظيم القهري', 'الشك المستمر', 'أفكار مزعجة غير مرغوبة', 'طقوس تكرارية'],
    symptomsEn: ['Recurring obsessive thoughts', 'Compulsive behaviors', 'Excessive hand washing', 'Compulsive ordering', 'Persistent doubt', 'Unwanted intrusive thoughts', 'Repetitive rituals'],
    treatmentsAr: ['العلاج بالتعرض ومنع الاستجابة', 'مضادات الاكتئاب (SSRI)', 'العلاج السلوكي المعرفي', 'العلاج الجماعي', 'تقنيات إدارة القلق'],
    treatmentsEn: ['Exposure and response prevention', 'SSRIs', 'Cognitive behavioral therapy', 'Group therapy', 'Anxiety management techniques']
  },
  {
    id: 'ptsd',
    nameAr: 'اضطراب ما بعد الصدمة',
    nameEn: 'Post-Traumatic Stress Disorder',
    symptomsAr: ['استرجاع الذكريات', 'الكوابيس', 'تجنب المحفزات', 'فرط اليقظة', 'صعوبة النوم', 'الانفعال السريع', 'الشعور بالانفصال'],
    symptomsEn: ['Flashbacks', 'Nightmares', 'Avoidance of triggers', 'Hypervigilance', 'Sleep difficulties', 'Irritability', 'Feeling detached'],
    treatmentsAr: ['العلاج بالتعرض المطول', 'EMDR', 'العلاج السلوكي المعرفي', 'مضادات الاكتئاب', 'العلاج الجماعي'],
    treatmentsEn: ['Prolonged exposure therapy', 'EMDR', 'Cognitive behavioral therapy', 'Antidepressants', 'Group therapy']
  },
  {
    id: 'schizophrenia',
    nameAr: 'الفصام',
    nameEn: 'Schizophrenia',
    symptomsAr: ['الهلوسات السمعية', 'الأوهام', 'التفكير المضطرب', 'الانسحاب الاجتماعي', 'قلة التعبير العاطفي', 'صعوبة التركيز', 'سلوك غير منظم'],
    symptomsEn: ['Auditory hallucinations', 'Delusions', 'Disorganized thinking', 'Social withdrawal', 'Flat affect', 'Difficulty concentrating', 'Disorganized behavior'],
    treatmentsAr: ['مضادات الذهان (ريسبيريدون، أولانزابين)', 'العلاج النفسي الداعم', 'إعادة التأهيل', 'التدريب على المهارات الاجتماعية', 'دعم الأسرة'],
    treatmentsEn: ['Antipsychotics (Risperidone, Olanzapine)', 'Supportive psychotherapy', 'Rehabilitation', 'Social skills training', 'Family support']
  },
  {
    id: 'panic_disorder',
    nameAr: 'اضطراب الهلع',
    nameEn: 'Panic Disorder',
    symptomsAr: ['نوبات هلع مفاجئة', 'خفقان القلب', 'ضيق التنفس', 'الدوخة', 'الخوف من الموت', 'التعرق', 'الارتعاش'],
    symptomsEn: ['Sudden panic attacks', 'Heart palpitations', 'Shortness of breath', 'Dizziness', 'Fear of dying', 'Sweating', 'Trembling'],
    treatmentsAr: ['العلاج السلوكي المعرفي', 'تقنيات التنفس', 'مضادات القلق', 'SSRI', 'العلاج بالتعرض التدريجي'],
    treatmentsEn: ['Cognitive behavioral therapy', 'Breathing techniques', 'Anti-anxiety medications', 'SSRIs', 'Gradual exposure therapy']
  },
  {
    id: 'social_anxiety',
    nameAr: 'الرهاب الاجتماعي',
    nameEn: 'Social Anxiety Disorder',
    symptomsAr: ['الخوف من المواقف الاجتماعية', 'تجنب التجمعات', 'الخوف من الحكم', 'احمرار الوجه', 'التعرق في المواقف الاجتماعية', 'صعوبة التحدث أمام الناس', 'القلق الشديد'],
    symptomsEn: ['Fear of social situations', 'Avoiding gatherings', 'Fear of judgment', 'Blushing', 'Sweating in social situations', 'Difficulty speaking publicly', 'Intense anxiety'],
    treatmentsAr: ['العلاج السلوكي المعرفي', 'التدريب على المهارات الاجتماعية', 'العلاج الجماعي', 'مضادات القلق', 'تقنيات الاسترخاء'],
    treatmentsEn: ['Cognitive behavioral therapy', 'Social skills training', 'Group therapy', 'Anti-anxiety medications', 'Relaxation techniques']
  },
  {
    id: 'eating_disorder',
    nameAr: 'اضطرابات الأكل',
    nameEn: 'Eating Disorders',
    symptomsAr: ['القلق من الوزن', 'تقييد الطعام', 'الشره ثم التطهير', 'صورة جسدية مشوهة', 'الإفراط في التمارين', 'تناول الطعام سراً', 'فقدان الوزن الشديد'],
    symptomsEn: ['Weight anxiety', 'Food restriction', 'Binge and purge', 'Distorted body image', 'Excessive exercise', 'Secret eating', 'Extreme weight loss'],
    treatmentsAr: ['العلاج الغذائي', 'العلاج النفسي', 'العلاج الأسري', 'إعادة التأهيل الغذائي', 'العلاج السلوكي المعرفي'],
    treatmentsEn: ['Nutritional therapy', 'Psychotherapy', 'Family therapy', 'Nutritional rehabilitation', 'Cognitive behavioral therapy']
  },
  {
    id: 'adhd',
    nameAr: 'اضطراب فرط الحركة وتشتت الانتباه',
    nameEn: 'ADHD',
    symptomsAr: ['صعوبة التركيز', 'فرط الحركة', 'الاندفاعية', 'صعوبة إتمام المهام', 'النسيان المتكرر', 'صعوبة الانتظار', 'المقاطعة المستمرة'],
    symptomsEn: ['Difficulty concentrating', 'Hyperactivity', 'Impulsivity', 'Difficulty completing tasks', 'Frequent forgetfulness', 'Difficulty waiting', 'Constant interrupting'],
    treatmentsAr: ['الأدوية المنبهة (ميثيلفينيديت)', 'العلاج السلوكي', 'تدريب الوالدين', 'تنظيم البيئة', 'تقنيات إدارة الوقت'],
    treatmentsEn: ['Stimulant medications (Methylphenidate)', 'Behavioral therapy', 'Parent training', 'Environmental organization', 'Time management techniques']
  },
  {
    id: 'insomnia',
    nameAr: 'الأرق المزمن',
    nameEn: 'Chronic Insomnia',
    symptomsAr: ['صعوبة النوم', 'الاستيقاظ المتكرر', 'الاستيقاظ المبكر', 'عدم الشعور بالراحة', 'التعب النهاري', 'صعوبة التركيز', 'الانفعال السريع'],
    symptomsEn: ['Difficulty falling asleep', 'Frequent waking', 'Early waking', 'Unrefreshing sleep', 'Daytime fatigue', 'Difficulty concentrating', 'Irritability'],
    treatmentsAr: ['نظافة النوم', 'العلاج السلوكي المعرفي للأرق', 'تقنيات الاسترخاء', 'تجنب المنبهات', 'تنظيم مواعيد النوم'],
    treatmentsEn: ['Sleep hygiene', 'CBT for insomnia', 'Relaxation techniques', 'Avoiding stimulants', 'Regularizing sleep schedule']
  }
];
