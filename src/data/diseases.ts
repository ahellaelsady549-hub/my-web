export interface Disease {
  id: string;
  nameEn: string;
  nameAr: string;
  symptomsEn: string[];
  symptomsAr: string[];
}

export const diseases: Disease[] = [
  {
    id: 'flu',
    nameEn: 'Influenza (Flu)',
    nameAr: 'الإنفلونزا',
    symptomsEn: ['High fever', 'Body aches', 'Headache', 'Fatigue', 'Dry cough', 'Sore throat', 'Runny or stuffy nose'],
    symptomsAr: ['حمى شديدة', 'آلام في الجسم', 'صداع', 'إرهاق', 'سعال جاف', 'التهاب الحلق', 'سيلان أو انسداد الأنف']
  },
  {
    id: 'covid19',
    nameEn: 'COVID-19',
    nameAr: 'كوفيد-19',
    symptomsEn: ['Fever or chills', 'Cough', 'Shortness of breath', 'Fatigue', 'Loss of taste or smell', 'Sore throat', 'Muscle or body aches'],
    symptomsAr: ['حمى أو قشعريرة', 'سعال', 'ضيق في التنفس', 'إرهاق', 'فقدان حاسة الشم أو التذوق', 'التهاب الحلق', 'آلام في العضلات أو الجسم']
  },
  {
    id: 'diabetes',
    nameEn: 'Diabetes',
    nameAr: 'السكري',
    symptomsEn: ['Increased thirst', 'Frequent urination', 'Extreme hunger', 'Unexplained weight loss', 'Fatigue', 'Blurred vision', 'Slow-healing sores'],
    symptomsAr: ['زيادة العطش', 'كثرة التبول', 'الجوع الشديد', 'فقدان الوزن غير المبرر', 'إرهاق', 'رؤية ضبابية', 'بطء التئام الجروح']
  },
  {
    id: 'hypertension',
    nameEn: 'Hypertension (High Blood Pressure)',
    nameAr: 'ارتفاع ضغط الدم',
    symptomsEn: ['Headaches', 'Shortness of breath', 'Nosebleeds', 'Chest pain', 'Visual changes', 'Irregular heartbeat', 'Fatigue'],
    symptomsAr: ['صداع', 'ضيق في التنفس', 'نزيف الأنف', 'ألم في الصدر', 'تغيرات في الرؤية', 'عدم انتظام ضربات القلب', 'إرهاق']
  },
  {
    id: 'asthma',
    nameEn: 'Asthma',
    nameAr: 'الربو',
    symptomsEn: ['Shortness of breath', 'Chest tightness', 'Wheezing', 'Coughing especially at night', 'Difficulty breathing', 'Rapid breathing'],
    symptomsAr: ['ضيق في التنفس', 'ضيق في الصدر', 'صفير عند التنفس', 'سعال خاصة في الليل', 'صعوبة في التنفس', 'تنفس سريع']
  },
  {
    id: 'anemia',
    nameEn: 'Anemia',
    nameAr: 'فقر الدم',
    symptomsEn: ['Fatigue', 'Weakness', 'Pale skin', 'Irregular heartbeat', 'Shortness of breath', 'Dizziness', 'Cold hands and feet', 'Headaches'],
    symptomsAr: ['إرهاق', 'ضعف', 'شحوب الجلد', 'عدم انتظام ضربات القلب', 'ضيق في التنفس', 'دوخة', 'برودة اليدين والقدمين', 'صداع']
  },
  {
    id: 'migraine',
    nameEn: 'Migraine',
    nameAr: 'الصداع النصفي',
    symptomsEn: ['Severe headache on one side', 'Nausea', 'Vomiting', 'Sensitivity to light', 'Sensitivity to sound', 'Visual disturbances', 'Throbbing pain'],
    symptomsAr: ['صداع شديد في جانب واحد', 'غثيان', 'قيء', 'حساسية للضوء', 'حساسية للصوت', 'اضطرابات بصرية', 'ألم نابض']
  },
  {
    id: 'gastritis',
    nameEn: 'Gastritis',
    nameAr: 'التهاب المعدة',
    symptomsEn: ['Burning stomach pain', 'Nausea', 'Vomiting', 'Feeling of fullness', 'Loss of appetite', 'Indigestion', 'Bloating'],
    symptomsAr: ['ألم حارق في المعدة', 'غثيان', 'قيء', 'الشعور بالامتلاء', 'فقدان الشهية', 'عسر الهضم', 'انتفاخ']
  },
  {
    id: 'arthritis',
    nameEn: 'Arthritis',
    nameAr: 'التهاب المفاصل',
    symptomsEn: ['Joint pain', 'Stiffness', 'Swelling', 'Redness', 'Decreased range of motion', 'Morning stiffness', 'Warmth around joints'],
    symptomsAr: ['ألم في المفاصل', 'تيبس', 'تورم', 'احمرار', 'انخفاض نطاق الحركة', 'تيبس صباحي', 'دفء حول المفاصل']
  },
  {
    id: 'bronchitis',
    nameEn: 'Bronchitis',
    nameAr: 'التهاب الشعب الهوائية',
    symptomsEn: ['Persistent cough', 'Mucus production', 'Fatigue', 'Shortness of breath', 'Chest discomfort', 'Mild fever', 'Wheezing'],
    symptomsAr: ['سعال مستمر', 'إنتاج المخاط', 'إرهاق', 'ضيق في التنفس', 'عدم راحة في الصدر', 'حمى خفيفة', 'صفير']
  },
  {
    id: 'sinusitis',
    nameEn: 'Sinusitis',
    nameAr: 'التهاب الجيوب الأنفية',
    symptomsEn: ['Facial pain or pressure', 'Nasal congestion', 'Thick nasal discharge', 'Reduced sense of smell', 'Headache', 'Cough', 'Fatigue'],
    symptomsAr: ['ألم أو ضغط في الوجه', 'احتقان الأنف', 'إفرازات أنفية سميكة', 'انخفاض حاسة الشم', 'صداع', 'سعال', 'إرهاق']
  },
  {
    id: 'urinary_infection',
    nameEn: 'Urinary Tract Infection (UTI)',
    nameAr: 'التهاب المسالك البولية',
    symptomsEn: ['Burning sensation when urinating', 'Frequent urination', 'Urgent need to urinate', 'Cloudy urine', 'Pelvic pain', 'Blood in urine', 'Strong-smelling urine'],
    symptomsAr: ['إحساس بالحرقة عند التبول', 'كثرة التبول', 'حاجة ملحة للتبول', 'بول عكر', 'ألم في الحوض', 'دم في البول', 'بول ذو رائحة قوية']
  },
  {
    id: 'thyroid_disorder',
    nameEn: 'Thyroid Disorder',
    nameAr: 'اضطراب الغدة الدرقية',
    symptomsEn: ['Fatigue', 'Weight changes', 'Mood swings', 'Hair loss', 'Irregular heartbeat', 'Sensitivity to temperature', 'Muscle weakness'],
    symptomsAr: ['إرهاق', 'تغيرات في الوزن', 'تقلبات مزاجية', 'تساقط الشعر', 'عدم انتظام ضربات القلب', 'حساسية لدرجة الحرارة', 'ضعف العضلات']
  },
  {
    id: 'anxiety',
    nameEn: 'Anxiety Disorder',
    nameAr: 'اضطراب القلق',
    symptomsEn: ['Excessive worry', 'Restlessness', 'Rapid heartbeat', 'Sweating', 'Trembling', 'Difficulty concentrating', 'Sleep problems', 'Fatigue'],
    symptomsAr: ['قلق مفرط', 'عدم الراحة', 'تسارع ضربات القلب', 'تعرق', 'ارتعاش', 'صعوبة في التركيز', 'مشاكل في النوم', 'إرهاق']
  },
  {
    id: 'allergic_rhinitis',
    nameEn: 'Allergic Rhinitis',
    nameAr: 'التهاب الأنف التحسسي',
    symptomsEn: ['Sneezing', 'Runny nose', 'Itchy eyes', 'Nasal congestion', 'Watery eyes', 'Itchy nose or throat', 'Postnasal drip'],
    symptomsAr: ['عطس', 'سيلان الأنف', 'حكة في العينين', 'احتقان الأنف', 'عيون دامعة', 'حكة في الأنف أو الحلق', 'تنقيط أنفي خلفي']
  },
  {
    id: 'cholesterol',
    nameEn: 'High Cholesterol',
    nameAr: 'ارتفاع الكوليسترول',
    symptomsEn: ['Chest pain', 'Numbness in extremities', 'Fatigue', 'Shortness of breath', 'Yellow deposits around eyes', 'Heart palpitations'],
    symptomsAr: ['ألم في الصدر', 'تنميل في الأطراف', 'إرهاق', 'ضيق في التنفس', 'ترسبات صفراء حول العينين', 'خفقان القلب']
  },
  {
    id: 'kidney_stones',
    nameEn: 'Kidney Stones',
    nameAr: 'حصى الكلى',
    symptomsEn: ['Severe back pain', 'Blood in urine', 'Nausea and vomiting', 'Frequent urination', 'Burning sensation', 'Fever and chills'],
    symptomsAr: ['ألم شديد في الظهر', 'دم في البول', 'غثيان وقيء', 'كثرة التبول', 'إحساس بالحرقة', 'حمى وقشعريرة']
  },
  {
    id: 'gout',
    nameEn: 'Gout',
    nameAr: 'النقرس',
    symptomsEn: ['Intense joint pain', 'Swelling and redness', 'Limited range of motion', 'Tenderness', 'Warmth in joints'],
    symptomsAr: ['ألم شديد في المفاصل', 'تورم واحمرار', 'محدودية الحركة', 'حساسية عند اللمس', 'دفء في المفاصل']
  },
  {
    id: 'hepatitis',
    nameEn: 'Hepatitis',
    nameAr: 'التهاب الكبد',
    symptomsEn: ['Jaundice', 'Fatigue', 'Abdominal pain', 'Dark urine', 'Nausea', 'Loss of appetite', 'Fever'],
    symptomsAr: ['اصفرار الجلد', 'إرهاق', 'ألم في البطن', 'بول داكن', 'غثيان', 'فقدان الشهية', 'حمى']
  },
  {
    id: 'tuberculosis',
    nameEn: 'Tuberculosis',
    nameAr: 'السل',
    symptomsEn: ['Persistent cough', 'Coughing up blood', 'Chest pain', 'Night sweats', 'Weight loss', 'Fever', 'Fatigue'],
    symptomsAr: ['سعال مستمر', 'سعال مصحوب بالدم', 'ألم في الصدر', 'تعرق ليلي', 'فقدان الوزن', 'حمى', 'إرهاق']
  },
  {
    id: 'ulcer',
    nameEn: 'Stomach Ulcer',
    nameAr: 'قرحة المعدة',
    symptomsEn: ['Burning stomach pain', 'Bloating', 'Heartburn', 'Nausea', 'Dark stools', 'Vomiting', 'Weight loss'],
    symptomsAr: ['ألم حارق في المعدة', 'انتفاخ', 'حرقة المعدة', 'غثيان', 'براز داكن', 'قيء', 'فقدان الوزن']
  },
  {
    id: 'eczema',
    nameEn: 'Eczema',
    nameAr: 'الإكزيما',
    symptomsEn: ['Dry itchy skin', 'Red patches', 'Cracked skin', 'Swelling', 'Skin discoloration'],
    symptomsAr: ['جلد جاف ومثير للحكة', 'بقع حمراء', 'تشقق الجلد', 'تورم', 'تغير لون الجلد']
  },
  {
    id: 'psoriasis',
    nameEn: 'Psoriasis',
    nameAr: 'الصدفية',
    symptomsEn: ['Red scaly patches', 'Dry cracked skin', 'Itching', 'Burning sensation', 'Thickened nails'],
    symptomsAr: ['بقع حمراء متقشرة', 'جلد جاف ومتشقق', 'حكة', 'إحساس بالحرقة', 'سماكة الأظافر']
  },
  {
    id: 'varicose_veins',
    nameEn: 'Varicose Veins',
    nameAr: 'الدوالي',
    symptomsEn: ['Swollen twisted veins', 'Leg pain', 'Heavy feeling in legs', 'Muscle cramps', 'Itching around veins'],
    symptomsAr: ['أوردة منتفخة وملتوية', 'ألم في الساقين', 'شعور بالثقل في الساقين', 'تشنجات عضلية', 'حكة حول الأوردة']
  },
  {
    id: 'ibs',
    nameEn: 'Irritable Bowel Syndrome',
    nameAr: 'متلازمة القولون العصبي',
    symptomsEn: ['Abdominal pain', 'Bloating', 'Diarrhea', 'Constipation', 'Gas', 'Mucus in stool'],
    symptomsAr: ['ألم في البطن', 'انتفاخ', 'إسهال', 'إمساك', 'غازات', 'مخاط في البراز']
  },
  {
    id: 'pneumonia',
    nameEn: 'Pneumonia',
    nameAr: 'الالتهاب الرئوي',
    symptomsEn: ['High fever', 'Cough with phlegm', 'Chest pain when breathing', 'Shortness of breath', 'Fatigue', 'Sweating and chills', 'Rapid breathing'],
    symptomsAr: ['حمى شديدة', 'سعال مصحوب بالبلغم', 'ألم في الصدر عند التنفس', 'ضيق في التنفس', 'إرهاق', 'تعرق وقشعريرة', 'تنفس سريع']
  },
  {
    id: 'appendicitis',
    nameEn: 'Appendicitis',
    nameAr: 'التهاب الزائدة الدودية',
    symptomsEn: ['Sudden pain in lower right abdomen', 'Pain around navel', 'Loss of appetite', 'Nausea and vomiting', 'Fever', 'Inability to pass gas', 'Abdominal swelling'],
    symptomsAr: ['ألم مفاجئ في أسفل البطن الأيمن', 'ألم حول السرة', 'فقدان الشهية', 'غثيان وقيء', 'حمى', 'عدم القدرة على إخراج الغازات', 'انتفاخ في البطن']
  },
  {
    id: 'tonsillitis',
    nameEn: 'Tonsillitis',
    nameAr: 'التهاب اللوزتين',
    symptomsEn: ['Severe sore throat', 'Difficulty swallowing', 'Swollen tonsils', 'White or yellow coating on tonsils', 'Fever', 'Swollen lymph nodes', 'Bad breath'],
    symptomsAr: ['ألم شديد في الحلق', 'صعوبة في البلع', 'تورم اللوزتين', 'طبقة بيضاء أو صفراء على اللوزتين', 'حمى', 'تورم الغدد الليمفاوية', 'رائحة كريهة للفم']
  },
  {
    id: 'conjunctivitis',
    nameEn: 'Conjunctivitis (Pink Eye)',
    nameAr: 'التهاب الملتحمة',
    symptomsEn: ['Red or pink eyes', 'Itching or burning sensation', 'Excessive tearing', 'Eye discharge', 'Crusting of eyelids', 'Sensitivity to light', 'Blurred vision'],
    symptomsAr: ['احمرار أو وردية العينين', 'حكة أو إحساس بالحرقة', 'دموع مفرطة', 'إفرازات من العين', 'تقشر الجفون', 'حساسية للضوء', 'رؤية ضبابية']
  },
  {
    id: 'hemorrhoids',
    nameEn: 'Hemorrhoids',
    nameAr: 'البواسير',
    symptomsEn: ['Bleeding during bowel movements', 'Itching or irritation in anal area', 'Pain or discomfort', 'Swelling around anus', 'A lump near anus', 'Anal leakage'],
    symptomsAr: ['نزيف أثناء حركة الأمعاء', 'حكة أو تهيج في منطقة الشرج', 'ألم أو عدم راحة', 'تورم حول الشرج', 'كتلة بالقرب من الشرج', 'تسرب شرجي']
  },
  {
    id: 'osteoporosis',
    nameEn: 'Osteoporosis',
    nameAr: 'هشاشة العظام',
    symptomsEn: ['Back pain from fractured vertebrae', 'Loss of height over time', 'Stooped posture', 'Bones that break easily', 'Weak grip strength', 'Brittle fingernails'],
    symptomsAr: ['ألم في الظهر نتيجة كسر الفقرات', 'فقدان الطول مع مرور الوقت', 'وضعية منحنية', 'عظام سهلة الكسر', 'ضعف قوة القبضة', 'أظافر هشة']
  },
  {
    id: 'sciatica',
    nameEn: 'Sciatica',
    nameAr: 'عرق النسا',
    symptomsEn: ['Pain radiating from lower back to leg', 'Numbness in affected leg', 'Tingling sensation', 'Muscle weakness', 'Pain worsens when sitting', 'Sharp burning sensation'],
    symptomsAr: ['ألم ينتشر من أسفل الظهر إلى الساق', 'تنميل في الساق المصابة', 'إحساس بالوخز', 'ضعف في العضلات', 'الألم يزداد عند الجلوس', 'إحساس حارق حاد']
  },
  {
    id: 'vertigo',
    nameEn: 'Vertigo',
    nameAr: 'الدوار',
    symptomsEn: ['Spinning sensation', 'Loss of balance', 'Nausea and vomiting', 'Sweating', 'Abnormal eye movements', 'Headache', 'Ringing in ears'],
    symptomsAr: ['إحساس بالدوران', 'فقدان التوازن', 'غثيان وقيء', 'تعرق', 'حركات غير طبيعية في العين', 'صداع', 'طنين في الأذن']
  },
  {
    id: 'acid_reflux',
    nameEn: 'Acid Reflux (GERD)',
    nameAr: 'ارتجاع المريء',
    symptomsEn: ['Heartburn after eating', 'Chest pain', 'Difficulty swallowing', 'Regurgitation of food', 'Sensation of lump in throat', 'Chronic cough', 'Sour taste in mouth'],
    symptomsAr: ['حرقة المعدة بعد الأكل', 'ألم في الصدر', 'صعوبة في البلع', 'ارتجاع الطعام', 'الإحساس بكتلة في الحلق', 'سعال مزمن', 'طعم حامض في الفم']
  },
  {
    id: 'gallstones',
    nameEn: 'Gallstones',
    nameAr: 'حصوات المرارة',
    symptomsEn: ['Sudden intense pain in upper right abdomen', 'Pain between shoulder blades', 'Right shoulder pain', 'Nausea or vomiting', 'Indigestion', 'Jaundice', 'Clay-colored stools'],
    symptomsAr: ['ألم شديد ومفاجئ في أعلى البطن الأيمن', 'ألم بين لوحي الكتف', 'ألم في الكتف الأيمن', 'غثيان أو قيء', 'عسر الهضم', 'اصفرار', 'براز بلون الطين']
  },
  {
    id: 'pneumonia',
    nameEn: 'Pneumonia',
    nameAr: 'الالتهاب الرئوي',
    symptomsEn: ['Cough with phlegm', 'Fever and chills', 'Shortness of breath', 'Chest pain when breathing', 'Fatigue', 'Nausea and vomiting', 'Confusion in elderly'],
    symptomsAr: ['سعال مع بلغم', 'حمى وقشعريرة', 'ضيق في التنفس', 'ألم في الصدر عند التنفس', 'إرهاق', 'غثيان وقيء', 'ارتباك عند كبار السن']
  },
  {
    id: 'kidney_disease',
    nameEn: 'Chronic Kidney Disease',
    nameAr: 'أمراض الكلى المزمنة',
    symptomsEn: ['Fatigue and weakness', 'Swelling in legs and ankles', 'Difficulty breathing', 'Nausea and vomiting', 'Loss of appetite', 'Foamy urine', 'Muscle cramps'],
    symptomsAr: ['إرهاق وضعف', 'تورم في الساقين والكاحلين', 'صعوبة في التنفس', 'غثيان وقيء', 'فقدان الشهية', 'بول رغوي', 'تشنجات عضلية']
  },
  {
    id: 'cirrhosis',
    nameEn: 'Liver Cirrhosis',
    nameAr: 'تليف الكبد',
    symptomsEn: ['Fatigue', 'Easy bruising and bleeding', 'Jaundice', 'Itchy skin', 'Swelling in legs', 'Weight loss', 'Confusion and drowsiness'],
    symptomsAr: ['إرهاق', 'سهولة الكدمات والنزيف', 'اصفرار الجلد', 'حكة في الجلد', 'تورم في الساقين', 'فقدان الوزن', 'ارتباك ونعاس']
  },
  {
    id: 'copd',
    nameEn: 'COPD (Chronic Obstructive Pulmonary Disease)',
    nameAr: 'مرض الانسداد الرئوي المزمن',
    symptomsEn: ['Chronic cough', 'Shortness of breath', 'Wheezing', 'Chest tightness', 'Excess mucus', 'Frequent respiratory infections', 'Fatigue'],
    symptomsAr: ['سعال مزمن', 'ضيق في التنفس', 'صفير', 'ضيق في الصدر', 'مخاط زائد', 'التهابات تنفسية متكررة', 'إرهاق']
  },
  {
    id: 'celiac_disease',
    nameEn: 'Celiac Disease',
    nameAr: 'مرض السيلياك',
    symptomsEn: ['Diarrhea', 'Bloating and gas', 'Abdominal pain', 'Fatigue', 'Weight loss', 'Nausea', 'Anemia'],
    symptomsAr: ['إسهال', 'انتفاخ وغازات', 'ألم في البطن', 'إرهاق', 'فقدان الوزن', 'غثيان', 'فقر الدم']
  },
  {
    id: 'endometriosis',
    nameEn: 'Endometriosis',
    nameAr: 'انتباذ بطانة الرحم',
    symptomsEn: ['Painful periods', 'Chronic pelvic pain', 'Pain during intercourse', 'Pain with bowel movements', 'Excessive bleeding', 'Infertility', 'Fatigue'],
    symptomsAr: ['دورات شهرية مؤلمة', 'ألم مزمن في الحوض', 'ألم أثناء العلاقة الزوجية', 'ألم عند التبرز', 'نزيف مفرط', 'عقم', 'إرهاق']
  },
  {
    id: 'sleep_apnea',
    nameEn: 'Sleep Apnea',
    nameAr: 'انقطاع النفس النومي',
    symptomsEn: ['Loud snoring', 'Gasping for air during sleep', 'Morning headache', 'Excessive daytime sleepiness', 'Difficulty concentrating', 'Irritability', 'High blood pressure'],
    symptomsAr: ['شخير عالٍ', 'اللهاث للحصول على الهواء أثناء النوم', 'صداع صباحي', 'نعاس نهاري مفرط', 'صعوبة في التركيز', 'سرعة الغضب', 'ارتفاع ضغط الدم']
  },
  {
    id: 'lupus',
    nameEn: 'Systemic Lupus Erythematosus (SLE)',
    nameAr: 'الذئبة الحمراء',
    symptomsEn: ['Butterfly-shaped rash on face', 'Joint pain and swelling', 'Fatigue', 'Fever', 'Photosensitivity', 'Hair loss', 'Raynaud\'s phenomenon'],
    symptomsAr: ['طفح جلدي على شكل فراشة على الوجه', 'ألم وتورم المفاصل', 'إرهاق', 'حمى', 'حساسية للضوء', 'تساقط الشعر', 'ظاهرة رينود']
  },
  {
    id: 'parkinsons',
    nameEn: 'Parkinson\'s Disease',
    nameAr: 'مرض باركنسون',
    symptomsEn: ['Tremor in hands', 'Slowed movement', 'Rigid muscles', 'Impaired balance', 'Loss of automatic movements', 'Speech changes', 'Writing changes'],
    symptomsAr: ['رعشة في اليدين', 'حركة بطيئة', 'عضلات متصلبة', 'ضعف التوازن', 'فقدان الحركات التلقائية', 'تغيرات في الكلام', 'تغيرات في الكتابة']
  },
  {
    id: 'multiple_sclerosis',
    nameEn: 'Multiple Sclerosis (MS)',
    nameAr: 'التصلب المتعدد',
    symptomsEn: ['Numbness or weakness', 'Vision problems', 'Tingling', 'Electric shock sensations', 'Tremor', 'Lack of coordination', 'Fatigue'],
    symptomsAr: ['تنميل أو ضعف', 'مشاكل في الرؤية', 'وخز', 'أحاسيس صدمة كهربائية', 'رعشة', 'نقص التنسيق', 'إرهاق']
  },
  {
    id: 'fibromyalgia',
    nameEn: 'Fibromyalgia',
    nameAr: 'الفيبروميالجيا',
    symptomsEn: ['Widespread musculoskeletal pain', 'Fatigue', 'Sleep problems', 'Memory issues', 'Mood issues', 'Headaches', 'Irritable bowel syndrome'],
    symptomsAr: ['ألم عضلي هيكلي واسع الانتشار', 'إرهاق', 'مشاكل في النوم', 'مشاكل في الذاكرة', 'مشاكل مزاجية', 'صداع', 'متلازمة القولون العصبي']
  },
  {
    id: 'crohns_disease',
    nameEn: 'Crohn\'s Disease',
    nameAr: 'مرض كرون',
    symptomsEn: ['Diarrhea', 'Abdominal pain and cramping', 'Blood in stool', 'Fatigue', 'Weight loss', 'Reduced appetite', 'Fever'],
    symptomsAr: ['إسهال', 'ألم وتقلصات في البطن', 'دم في البراز', 'إرهاق', 'فقدان الوزن', 'انخفاض الشهية', 'حمى']
  },
  {
    id: 'depression',
    nameEn: 'Depression',
    nameAr: 'الاكتئاب',
    symptomsEn: ['Persistent sadness', 'Loss of interest in activities', 'Sleep problems', 'Fatigue', 'Changes in appetite', 'Difficulty concentrating', 'Feelings of worthlessness', 'Thoughts of death'],
    symptomsAr: ['حزن مستمر', 'فقدان الاهتمام بالأنشطة', 'مشاكل في النوم', 'إرهاق', 'تغيرات في الشهية', 'صعوبة في التركيز', 'الشعور بانعدام القيمة', 'أفكار عن الموت']
  },
  {
    id: 'bipolar',
    nameEn: 'Bipolar Disorder',
    nameAr: 'الاضطراب ثنائي القطب',
    symptomsEn: ['Extreme mood swings', 'Manic episodes with high energy', 'Depressive episodes', 'Impulsive behavior', 'Decreased need for sleep', 'Racing thoughts', 'Irritability'],
    symptomsAr: ['تقلبات مزاجية شديدة', 'نوبات هوس مع طاقة عالية', 'نوبات اكتئاب', 'سلوك متهور', 'قلة الحاجة للنوم', 'أفكار متسارعة', 'سرعة الغضب']
  },
  {
    id: 'schizophrenia',
    nameEn: 'Schizophrenia',
    nameAr: 'الفصام',
    symptomsEn: ['Hallucinations', 'Delusions', 'Disorganized speech', 'Lack of motivation', 'Social withdrawal', 'Cognitive difficulties', 'Emotional flatness'],
    symptomsAr: ['هلوسات', 'أوهام', 'كلام غير منظم', 'نقص الحافز', 'انسحاب اجتماعي', 'صعوبات معرفية', 'خمول عاطفي']
  },
  {
    id: 'ocd',
    nameEn: 'Obsessive-Compulsive Disorder (OCD)',
    nameAr: 'الوسواس القهري',
    symptomsEn: ['Intrusive thoughts', 'Repetitive behaviors', 'Excessive cleaning', 'Need for symmetry', 'Fear of contamination', 'Checking rituals', 'Mental compulsions'],
    symptomsAr: ['أفكار تطفلية', 'سلوكيات متكررة', 'تنظيف مفرط', 'الحاجة للتماثل', 'الخوف من التلوث', 'طقوس التحقق', 'قهريات عقلية']
  },
  {
    id: 'ptsd',
    nameEn: 'Post-Traumatic Stress Disorder (PTSD)',
    nameAr: 'اضطراب ما بعد الصدمة',
    symptomsEn: ['Flashbacks', 'Nightmares', 'Severe anxiety', 'Avoidance of trauma reminders', 'Negative changes in thinking', 'Hypervigilance', 'Emotional numbness'],
    symptomsAr: ['استرجاع الأحداث', 'كوابيس', 'قلق شديد', 'تجنب تذكيرات الصدمة', 'تغيرات سلبية في التفكير', 'يقظة مفرطة', 'خدر عاطفي']
  },
  {
    id: 'panic_disorder',
    nameEn: 'Panic Disorder',
    nameAr: 'اضطراب الهلع',
    symptomsEn: ['Sudden panic attacks', 'Racing heartbeat', 'Shortness of breath', 'Chest pain', 'Sweating', 'Trembling', 'Fear of losing control', 'Dizziness'],
    symptomsAr: ['نوبات هلع مفاجئة', 'تسارع ضربات القلب', 'ضيق في التنفس', 'ألم في الصدر', 'تعرق', 'ارتعاش', 'الخوف من فقدان السيطرة', 'دوخة']
  },
  {
    id: 'social_anxiety',
    nameEn: 'Social Anxiety Disorder',
    nameAr: 'اضطراب القلق الاجتماعي',
    symptomsEn: ['Fear of social situations', 'Fear of judgment', 'Avoidance of social events', 'Physical symptoms in social settings', 'Difficulty making eye contact', 'Fear of embarrassment'],
    symptomsAr: ['الخوف من المواقف الاجتماعية', 'الخوف من الحكم', 'تجنب الفعاليات الاجتماعية', 'أعراض جسدية في الإعدادات الاجتماعية', 'صعوبة في التواصل البصري', 'الخوف من الإحراج']
  },
  {
    id: 'eating_disorder',
    nameEn: 'Eating Disorders',
    nameAr: 'اضطرابات الأكل',
    symptomsEn: ['Extreme concern about weight', 'Restrictive eating', 'Binge eating', 'Purging behaviors', 'Distorted body image', 'Fear of gaining weight', 'Social withdrawal'],
    symptomsAr: ['قلق شديد بشأن الوزن', 'أكل مقيد', 'الإفراط في الأكل', 'سلوكيات التطهير', 'صورة جسم مشوهة', 'الخوف من زيادة الوزن', 'انسحاب اجتماعي']
  },
  {
    id: 'adhd',
    nameEn: 'ADHD (Attention-Deficit Hyperactivity Disorder)',
    nameAr: 'اضطراب نقص الانتباه وفرط الحركة',
    symptomsEn: ['Difficulty focusing', 'Hyperactivity', 'Impulsiveness', 'Disorganization', 'Forgetfulness', 'Difficulty completing tasks', 'Restlessness'],
    symptomsAr: ['صعوبة في التركيز', 'فرط النشاط', 'الاندفاع', 'عدم التنظيم', 'النسيان', 'صعوبة في إكمال المهام', 'قلق الحركة']
  },
  {
    id: 'autism',
    nameEn: 'Autism Spectrum Disorder',
    nameAr: 'اضطراب طيف التوحد',
    symptomsEn: ['Social communication difficulties', 'Repetitive behaviors', 'Sensory sensitivities', 'Difficulty with change', 'Intense interests', 'Difficulty reading social cues'],
    symptomsAr: ['صعوبات في التواصل الاجتماعي', 'سلوكيات متكررة', 'حساسية حسية', 'صعوبة مع التغيير', 'اهتمامات مكثفة', 'صعوبة في قراءة الإشارات الاجتماعية']
  },
  {
    id: 'personality_disorder',
    nameEn: 'Borderline Personality Disorder',
    nameAr: 'اضطراب الشخصية الحدية',
    symptomsEn: ['Unstable relationships', 'Intense emotions', 'Fear of abandonment', 'Impulsive behavior', 'Self-harm', 'Identity disturbance', 'Chronic emptiness'],
    symptomsAr: ['علاقات غير مستقرة', 'مشاعر شديدة', 'الخوف من الهجر', 'سلوك متهور', 'إيذاء الذات', 'اضطراب الهوية', 'فراغ مزمن']
  },
  {
    id: 'substance_abuse',
    nameEn: 'Substance Abuse Disorder',
    nameAr: 'اضطراب تعاطي المخدرات',
    symptomsEn: ['Compulsive drug use', 'Inability to stop', 'Withdrawal symptoms', 'Neglecting responsibilities', 'Tolerance', 'Relationship problems', 'Financial difficulties'],
    symptomsAr: ['تعاطي قهري للمخدرات', 'عدم القدرة على التوقف', 'أعراض انسحاب', 'إهمال المسؤوليات', 'التحمل', 'مشاكل في العلاقات', 'صعوبات مالية']
  },
  {
    id: 'insomnia',
    nameEn: 'Chronic Insomnia',
    nameAr: 'الأرق المزمن',
    symptomsEn: ['Difficulty falling asleep', 'Waking up during night', 'Early morning awakening', 'Daytime fatigue', 'Irritability', 'Difficulty concentrating', 'Worry about sleep'],
    symptomsAr: ['صعوبة في النوم', 'الاستيقاظ أثناء الليل', 'الاستيقاظ المبكر', 'تعب نهاري', 'سرعة الغضب', 'صعوبة في التركيز', 'القلق بشأن النوم']
  },
  {
    id: 'phobia',
    nameEn: 'Specific Phobias',
    nameAr: 'الرهاب المحدد',
    symptomsEn: ['Intense fear of specific object or situation', 'Avoidance behavior', 'Physical symptoms when exposed', 'Panic attacks', 'Recognition that fear is excessive'],
    symptomsAr: ['خوف شديد من شيء أو موقف محدد', 'سلوك تجنبي', 'أعراض جسدية عند التعرض', 'نوبات هلع', 'إدراك أن الخوف مفرط']
  },
  {
    id: 'dissociative',
    nameEn: 'Dissociative Disorders',
    nameAr: 'الاضطرابات الانفصامية',
    symptomsEn: ['Memory gaps', 'Feeling detached from self', 'Identity confusion', 'Derealization', 'Amnesia', 'Multiple identities', 'Out-of-body experiences'],
    symptomsAr: ['فجوات في الذاكرة', 'الشعور بالانفصال عن الذات', 'ارتباك الهوية', 'عدم الواقعية', 'فقدان الذاكرة', 'هويات متعددة', 'تجارب خارج الجسد']
  },
  {
    id: 'generalized_anxiety',
    nameEn: 'Generalized Anxiety Disorder (GAD)',
    nameAr: 'اضطراب القلق العام',
    symptomsEn: ['Excessive worry', 'Restlessness', 'Easily fatigued', 'Difficulty concentrating', 'Irritability', 'Muscle tension', 'Sleep disturbance'],
    symptomsAr: ['قلق مفرط', 'قلق دائم', 'سهولة الإرهاق', 'صعوبة في التركيز', 'سرعة الغضب', 'توتر العضلات', 'اضطراب النوم']
  },
  {
    id: 'seasonal_depression',
    nameEn: 'Seasonal Affective Disorder (SAD)',
    nameAr: 'الاكتئاب الموسمي',
    symptomsEn: ['Depression in winter months', 'Low energy', 'Oversleeping', 'Weight gain', 'Craving carbohydrates', 'Social withdrawal', 'Loss of interest'],
    symptomsAr: ['اكتئاب في أشهر الشتاء', 'طاقة منخفضة', 'النوم الزائد', 'زيادة الوزن', 'الرغبة في الكربوهيدرات', 'انسحاب اجتماعي', 'فقدان الاهتمام']
  },
  {
    id: 'hoarding_disorder',
    nameEn: 'Hoarding Disorder',
    nameAr: 'اضطراب الاكتناز',
    symptomsEn: ['Difficulty discarding items', 'Cluttered living spaces', 'Distress when discarding', 'Excessive acquisition', 'Impaired functioning', 'Social isolation', 'Safety hazards'],
    symptomsAr: ['صعوبة في التخلص من الأشياء', 'مساحات معيشة مزدحمة', 'ضيق عند التخلص', 'اقتناء مفرط', 'ضعف في الأداء', 'عزلة اجتماعية', 'مخاطر سلامة']
  },
  {
    id: 'body_dysmorphia',
    nameEn: 'Body Dysmorphic Disorder',
    nameAr: 'اضطراب تشوه الجسم',
    symptomsEn: ['Preoccupation with appearance flaws', 'Excessive mirror checking', 'Seeking reassurance', 'Excessive grooming', 'Camouflaging body parts', 'Social anxiety', 'Repetitive behaviors'],
    symptomsAr: ['انشغال بعيوب المظهر', 'فحص المرآة بشكل مفرط', 'البحث عن الطمأنينة', 'العناية المفرطة', 'إخفاء أجزاء الجسم', 'قلق اجتماعي', 'سلوكيات متكررة']
  },
  {
    id: 'intermittent_explosive',
    nameEn: 'Intermittent Explosive Disorder',
    nameAr: 'اضطراب الانفجار المتقطع',
    symptomsEn: ['Sudden episodes of rage', 'Aggressive impulses', 'Verbal outbursts', 'Physical aggression', 'Property destruction', 'Feeling out of control', 'Remorse after episodes'],
    symptomsAr: ['نوبات غضب مفاجئة', 'دوافع عدوانية', 'انفجارات لفظية', 'عدوان جسدي', 'تدمير الممتلكات', 'الشعور بفقدان السيطرة', 'ندم بعد النوبات']
  },
  {
    id: 'trichotillomania',
    nameEn: 'Trichotillomania (Hair-Pulling Disorder)',
    nameAr: 'اضطراب نتف الشعر',
    symptomsEn: ['Recurrent hair pulling', 'Visible hair loss', 'Tension before pulling', 'Relief after pulling', 'Attempts to stop', 'Distress or impairment', 'Playing with pulled hair'],
    symptomsAr: ['نتف الشعر المتكرر', 'تساقط شعر واضح', 'توتر قبل النتف', 'راحة بعد النتف', 'محاولات للتوقف', 'ضيق أو ضعف', 'اللعب بالشعر المنتوف']
  },
  {
    id: 'dermatillomania',
    nameEn: 'Excoriation Disorder (Skin-Picking)',
    nameAr: 'اضطراب تقشير الجلد',
    symptomsEn: ['Recurrent skin picking', 'Skin lesions', 'Repeated attempts to stop', 'Significant distress', 'Impaired functioning', 'Scarring', 'Infection risk'],
    symptomsAr: ['تقشير الجلد المتكرر', 'آفات جلدية', 'محاولات متكررة للتوقف', 'ضيق كبير', 'ضعف في الأداء', 'ندوب', 'خطر العدوى']
  },
  
  // New Physical Diseases
  {
    id: 'lupus',
    nameEn: 'Lupus (Systemic Lupus Erythematosus)',
    nameAr: 'الذئبة الحمراء',
    symptomsEn: ['Butterfly rash on face', 'Joint pain and swelling', 'Extreme fatigue', 'Fever', 'Hair loss', 'Sensitivity to sunlight', 'Mouth ulcers'],
    symptomsAr: ['طفح جلدي على الوجه', 'ألم وتورم المفاصل', 'إرهاق شديد', 'حمى', 'تساقط الشعر', 'حساسية للشمس', 'تقرحات الفم']
  },
  {
    id: 'fibromyalgia',
    nameEn: 'Fibromyalgia',
    nameAr: 'الفيبروميالجيا',
    symptomsEn: ['Widespread muscle pain', 'Chronic fatigue', 'Sleep problems', 'Memory issues', 'Headaches', 'Tingling in hands and feet', 'Jaw pain'],
    symptomsAr: ['ألم عضلي منتشر', 'تعب مزمن', 'مشاكل في النوم', 'مشاكل في الذاكرة', 'صداع', 'وخز في اليدين والقدمين', 'ألم الفك']
  },
  {
    id: 'crohns_disease',
    nameEn: "Crohn's Disease",
    nameAr: 'مرض كرون',
    symptomsEn: ['Abdominal pain', 'Severe diarrhea', 'Fatigue', 'Weight loss', 'Blood in stool', 'Fever', 'Reduced appetite'],
    symptomsAr: ['ألم في البطن', 'إسهال شديد', 'إرهاق', 'فقدان الوزن', 'دم في البراز', 'حمى', 'قلة الشهية']
  },
  {
    id: 'multiple_sclerosis',
    nameEn: 'Multiple Sclerosis (MS)',
    nameAr: 'التصلب المتعدد',
    symptomsEn: ['Numbness or weakness', 'Vision problems', 'Tingling sensations', 'Electric shock sensations', 'Tremors', 'Fatigue', 'Difficulty walking'],
    symptomsAr: ['تنميل أو ضعف', 'مشاكل في الرؤية', 'إحساس بالوخز', 'إحساس بصدمة كهربائية', 'رعشة', 'إرهاق', 'صعوبة في المشي']
  },
  {
    id: 'parkinsons',
    nameEn: "Parkinson's Disease",
    nameAr: 'مرض باركنسون',
    symptomsEn: ['Tremors', 'Slowed movement', 'Rigid muscles', 'Impaired balance', 'Loss of automatic movements', 'Speech changes', 'Writing changes'],
    symptomsAr: ['رعشة', 'بطء الحركة', 'تصلب العضلات', 'ضعف التوازن', 'فقدان الحركات التلقائية', 'تغيرات في الكلام', 'تغيرات في الكتابة']
  },
  {
    id: 'epilepsy',
    nameEn: 'Epilepsy',
    nameAr: 'الصرع',
    symptomsEn: ['Seizures', 'Temporary confusion', 'Staring spells', 'Uncontrollable jerking', 'Loss of consciousness', 'Anxiety', 'Déjà vu feelings'],
    symptomsAr: ['نوبات صرع', 'ارتباك مؤقت', 'نوبات تحديق', 'حركات لا إرادية', 'فقدان الوعي', 'قلق', 'شعور بالديجافو']
  },
  {
    id: 'pancreatitis',
    nameEn: 'Pancreatitis',
    nameAr: 'التهاب البنكرياس',
    symptomsEn: ['Upper abdominal pain', 'Pain radiating to back', 'Nausea', 'Vomiting', 'Tenderness when touching abdomen', 'Fever', 'Rapid pulse'],
    symptomsAr: ['ألم في أعلى البطن', 'ألم ينتشر للظهر', 'غثيان', 'قيء', 'حساسية عند لمس البطن', 'حمى', 'نبض سريع']
  },
  {
    id: 'endocarditis',
    nameEn: 'Endocarditis',
    nameAr: 'التهاب الشغاف',
    symptomsEn: ['Fever and chills', 'Night sweats', 'Fatigue', 'Muscle and joint aches', 'Shortness of breath', 'Swelling in legs or abdomen', 'Heart murmur'],
    symptomsAr: ['حمى وقشعريرة', 'تعرق ليلي', 'إرهاق', 'آلام العضلات والمفاصل', 'ضيق التنفس', 'تورم في الساقين أو البطن', 'نفخة قلبية']
  },
  {
    id: 'diverticulitis',
    nameEn: 'Diverticulitis',
    nameAr: 'التهاب الرتج',
    symptomsEn: ['Severe abdominal pain', 'Fever', 'Nausea', 'Change in bowel habits', 'Bloating', 'Bloody stool', 'Tenderness on left side'],
    symptomsAr: ['ألم شديد في البطن', 'حمى', 'غثيان', 'تغير في عادات الأمعاء', 'انتفاخ', 'دم في البراز', 'حساسية في الجانب الأيسر']
  },
  {
    id: 'meningitis',
    nameEn: 'Meningitis',
    nameAr: 'التهاب السحايا',
    symptomsEn: ['Sudden high fever', 'Stiff neck', 'Severe headache', 'Sensitivity to light', 'Nausea or vomiting', 'Confusion', 'Skin rash'],
    symptomsAr: ['حمى مفاجئة مرتفعة', 'تصلب الرقبة', 'صداع شديد', 'حساسية للضوء', 'غثيان أو قيء', 'ارتباك', 'طفح جلدي']
  },
  
  // New Mental Health Diseases
  {
    id: 'agoraphobia',
    nameEn: 'Agoraphobia',
    nameAr: 'رهاب الخلاء',
    symptomsEn: ['Fear of open or crowded spaces', 'Avoiding public transportation', 'Fear of leaving home alone', 'Panic attacks', 'Feeling trapped', 'Dependence on others', 'Avoidance behavior'],
    symptomsAr: ['الخوف من الأماكن المفتوحة أو المزدحمة', 'تجنب وسائل النقل العام', 'الخوف من مغادرة المنزل وحيداً', 'نوبات هلع', 'الشعور بالحصار', 'الاعتماد على الآخرين', 'سلوك تجنبي']
  },
  {
    id: 'adjustment_disorder',
    nameEn: 'Adjustment Disorder',
    nameAr: 'اضطراب التكيف',
    symptomsEn: ['Feeling sad or hopeless', 'Anxiety', 'Trouble sleeping', 'Difficulty concentrating', 'Feeling overwhelmed', 'Withdrawal from activities', 'Physical complaints'],
    symptomsAr: ['الشعور بالحزن أو اليأس', 'قلق', 'صعوبة في النوم', 'صعوبة في التركيز', 'الشعور بالإرهاق', 'الانسحاب من الأنشطة', 'شكاوى جسدية']
  },
  {
    id: 'somatoform',
    nameEn: 'Somatic Symptom Disorder',
    nameAr: 'اضطراب الأعراض الجسدية',
    symptomsEn: ['Physical symptoms without medical cause', 'Excessive worry about health', 'Frequent medical visits', 'High anxiety about symptoms', 'Disability despite no findings', 'Multiple complaints'],
    symptomsAr: ['أعراض جسدية بدون سبب طبي', 'قلق مفرط على الصحة', 'زيارات طبية متكررة', 'قلق شديد من الأعراض', 'إعاقة رغم عدم وجود نتائج', 'شكاوى متعددة']
  },
  {
    id: 'avoidant_personality',
    nameEn: 'Avoidant Personality Disorder',
    nameAr: 'اضطراب الشخصية التجنبية',
    symptomsEn: ['Extreme shyness', 'Fear of criticism', 'Avoiding social activities', 'Low self-esteem', 'Hypersensitivity to rejection', 'Feeling inadequate', 'Reluctance to try new things'],
    symptomsAr: ['خجل شديد', 'الخوف من النقد', 'تجنب الأنشطة الاجتماعية', 'تدني احترام الذات', 'حساسية مفرطة للرفض', 'الشعور بعدم الكفاءة', 'التردد في تجربة أشياء جديدة']
  },
  {
    id: 'narcissistic_personality',
    nameEn: 'Narcissistic Personality Disorder',
    nameAr: 'اضطراب الشخصية النرجسية',
    symptomsEn: ['Grandiose sense of self-importance', 'Need for excessive admiration', 'Lack of empathy', 'Sense of entitlement', 'Exploiting others', 'Arrogant behavior', 'Envious of others'],
    symptomsAr: ['إحساس مبالغ بأهمية الذات', 'الحاجة للإعجاب المفرط', 'قلة التعاطف', 'الشعور بالاستحقاق', 'استغلال الآخرين', 'سلوك متكبر', 'الحسد من الآخرين']
  },
  {
    id: 'dependent_personality',
    nameEn: 'Dependent Personality Disorder',
    nameAr: 'اضطراب الشخصية الاعتمادية',
    symptomsEn: ['Difficulty making decisions alone', 'Needing others to assume responsibility', 'Fear of abandonment', 'Difficulty disagreeing', 'Going to excessive lengths for support', 'Feeling helpless alone'],
    symptomsAr: ['صعوبة اتخاذ القرارات بمفرده', 'الحاجة لأن يتحمل الآخرون المسؤولية', 'الخوف من الهجر', 'صعوبة في الاختلاف', 'بذل جهود مفرطة للحصول على الدعم', 'الشعور بالعجز وحيداً']
  },
  {
    id: 'paranoid_personality',
    nameEn: 'Paranoid Personality Disorder',
    nameAr: 'اضطراب الشخصية المرتابة',
    symptomsEn: ['Distrust of others', 'Suspicion without evidence', 'Perceiving attacks on character', 'Holding grudges', 'Quick to feel attacked', 'Reluctance to confide', 'Reading hidden meanings'],
    symptomsAr: ['عدم الثقة بالآخرين', 'شك بدون دليل', 'إدراك هجمات على الشخصية', 'حمل الضغائن', 'الشعور السريع بالهجوم', 'التردد في البوح', 'قراءة معاني خفية']
  },
  
  // 13 مرض جسدي جديد
  {
    id: 'heart_failure',
    nameEn: 'Heart Failure',
    nameAr: 'فشل القلب',
    symptomsEn: ['Shortness of breath', 'Fatigue', 'Swelling in legs', 'Rapid heartbeat', 'Persistent cough', 'Reduced exercise ability', 'Sudden weight gain'],
    symptomsAr: ['ضيق التنفس', 'إرهاق', 'تورم في الساقين', 'تسارع ضربات القلب', 'سعال مستمر', 'انخفاض القدرة على التمرين', 'زيادة مفاجئة في الوزن']
  },
  {
    id: 'prostate_enlargement',
    nameEn: 'Prostate Enlargement (BPH)',
    nameAr: 'تضخم البروستاتا',
    symptomsEn: ['Frequent urination', 'Difficulty starting urination', 'Weak urine stream', 'Dribbling after urination', 'Incomplete bladder emptying', 'Urge to urinate at night'],
    symptomsAr: ['كثرة التبول', 'صعوبة بدء التبول', 'ضعف تيار البول', 'تقطير بعد التبول', 'عدم إفراغ المثانة بالكامل', 'الحاجة للتبول ليلاً']
  },
  {
    id: 'pancreatitis',
    nameEn: 'Pancreatitis',
    nameAr: 'التهاب البنكرياس',
    symptomsEn: ['Severe upper abdominal pain', 'Pain radiating to back', 'Nausea and vomiting', 'Fever', 'Rapid pulse', 'Tenderness when touching abdomen', 'Oily foul-smelling stools'],
    symptomsAr: ['ألم شديد في أعلى البطن', 'ألم يمتد للظهر', 'غثيان وقيء', 'حمى', 'نبض سريع', 'ألم عند لمس البطن', 'براز دهني كريه الرائحة']
  },
  {
    id: 'diverticulitis',
    nameEn: 'Diverticulitis',
    nameAr: 'التهاب الردب',
    symptomsEn: ['Lower left abdominal pain', 'Fever', 'Nausea', 'Constipation', 'Diarrhea', 'Bloating', 'Blood in stool'],
    symptomsAr: ['ألم في أسفل البطن الأيسر', 'حمى', 'غثيان', 'إمساك', 'إسهال', 'انتفاخ', 'دم في البراز']
  },
  {
    id: 'glaucoma',
    nameEn: 'Glaucoma',
    nameAr: 'المياه الزرقاء',
    symptomsEn: ['Gradual loss of peripheral vision', 'Tunnel vision', 'Eye pain', 'Headache', 'Halos around lights', 'Nausea with eye pain', 'Redness in eye'],
    symptomsAr: ['فقدان تدريجي للرؤية المحيطية', 'رؤية نفقية', 'ألم في العين', 'صداع', 'هالات حول الأضواء', 'غثيان مع ألم العين', 'احمرار في العين']
  },
  {
    id: 'cataracts',
    nameEn: 'Cataracts',
    nameAr: 'المياه البيضاء',
    symptomsEn: ['Clouded or blurred vision', 'Difficulty with night vision', 'Light sensitivity', 'Seeing halos', 'Fading of colors', 'Double vision in one eye', 'Frequent prescription changes'],
    symptomsAr: ['رؤية ضبابية', 'صعوبة الرؤية الليلية', 'حساسية للضوء', 'رؤية هالات', 'بهتان الألوان', 'رؤية مزدوجة في عين واحدة', 'تغييرات متكررة في النظارات']
  },
  {
    id: 'carpal_tunnel',
    nameEn: 'Carpal Tunnel Syndrome',
    nameAr: 'متلازمة النفق الرسغي',
    symptomsEn: ['Numbness in hand', 'Tingling in fingers', 'Weakness in thumb', 'Pain in wrist', 'Dropping objects', 'Night symptoms', 'Pain radiating up arm'],
    symptomsAr: ['تنميل في اليد', 'وخز في الأصابع', 'ضعف في الإبهام', 'ألم في الرسغ', 'سقوط الأشياء', 'أعراض ليلية', 'ألم يمتد للذراع']
  },
  {
    id: 'fibromyalgia',
    nameEn: 'Fibromyalgia',
    nameAr: 'الفيبروميالجيا',
    symptomsEn: ['Widespread muscle pain', 'Fatigue', 'Sleep disturbances', 'Memory problems', 'Mood swings', 'Headaches', 'Irritable bowel symptoms'],
    symptomsAr: ['ألم عضلي منتشر', 'إرهاق', 'اضطرابات النوم', 'مشاكل الذاكرة', 'تقلبات المزاج', 'صداع', 'أعراض القولون العصبي']
  },
  {
    id: 'lupus',
    nameEn: 'Lupus',
    nameAr: 'الذئبة الحمراء',
    symptomsEn: ['Butterfly-shaped facial rash', 'Joint pain', 'Fatigue', 'Fever', 'Skin lesions', 'Shortness of breath', 'Chest pain'],
    symptomsAr: ['طفح على الوجه بشكل الفراشة', 'ألم في المفاصل', 'إرهاق', 'حمى', 'آفات جلدية', 'ضيق التنفس', 'ألم في الصدر']
  },
  {
    id: 'sleep_apnea',
    nameEn: 'Sleep Apnea',
    nameAr: 'انقطاع النفس النومي',
    symptomsEn: ['Loud snoring', 'Stopping breathing during sleep', 'Gasping during sleep', 'Morning headache', 'Excessive daytime sleepiness', 'Difficulty concentrating', 'Irritability'],
    symptomsAr: ['شخير عالي', 'توقف التنفس أثناء النوم', 'اللهاث أثناء النوم', 'صداع صباحي', 'نعاس نهاري مفرط', 'صعوبة التركيز', 'عصبية']
  },
  {
    id: 'shingles',
    nameEn: 'Shingles (Herpes Zoster)',
    nameAr: 'الحزام الناري',
    symptomsEn: ['Painful rash on one side', 'Burning or tingling', 'Sensitivity to touch', 'Fluid-filled blisters', 'Itching', 'Fever', 'Headache'],
    symptomsAr: ['طفح مؤلم على جانب واحد', 'حرقة أو وخز', 'حساسية للمس', 'بثور مملوءة بالسوائل', 'حكة', 'حمى', 'صداع']
  },
  {
    id: 'celiac_intolerance',
    nameEn: 'Lactose Intolerance',
    nameAr: 'عدم تحمل اللاكتوز',
    symptomsEn: ['Bloating after dairy', 'Diarrhea', 'Gas', 'Stomach cramps', 'Nausea', 'Rumbling stomach', 'Vomiting'],
    symptomsAr: ['انتفاخ بعد منتجات الألبان', 'إسهال', 'غازات', 'تقلصات المعدة', 'غثيان', 'قرقرة في البطن', 'قيء']
  },
  {
    id: 'meniere_disease',
    nameEn: 'Meniere\'s Disease',
    nameAr: 'مرض مينيير',
    symptomsEn: ['Recurring vertigo', 'Hearing loss', 'Ringing in ear', 'Feeling of fullness in ear', 'Nausea', 'Balance problems', 'Headache'],
    symptomsAr: ['دوار متكرر', 'فقدان السمع', 'طنين في الأذن', 'شعور بامتلاء الأذن', 'غثيان', 'مشاكل التوازن', 'صداع']
  },

  // 11 مرض نفسي جديد
  {
    id: 'borderline_personality',
    nameEn: 'Borderline Personality Disorder',
    nameAr: 'اضطراب الشخصية الحدية',
    symptomsEn: ['Intense mood swings', 'Fear of abandonment', 'Unstable relationships', 'Impulsive behavior', 'Self-harm', 'Chronic emptiness', 'Intense anger'],
    symptomsAr: ['تقلبات مزاجية شديدة', 'الخوف من الهجر', 'علاقات غير مستقرة', 'سلوك متهور', 'إيذاء النفس', 'فراغ مزمن', 'غضب شديد']
  },
  {
    id: 'cyclothymia',
    nameEn: 'Cyclothymic Disorder',
    nameAr: 'اضطراب المزاج الدوري',
    symptomsEn: ['Mood swings over years', 'Periods of depression', 'Periods of elevated mood', 'Unstable mood', 'Sleep changes', 'Energy fluctuations', 'Irritability'],
    symptomsAr: ['تقلبات مزاجية لسنوات', 'فترات اكتئاب', 'فترات ارتفاع المزاج', 'مزاج غير مستقر', 'تغيرات النوم', 'تذبذب الطاقة', 'عصبية']
  },
  {
    id: 'selective_mutism',
    nameEn: 'Selective Mutism',
    nameAr: 'الصمت الانتقائي',
    symptomsEn: ['Inability to speak in certain situations', 'Speaking normally at home', 'Social anxiety', 'Shyness', 'Fear of embarrassment', 'Frozen appearance', 'Avoiding eye contact'],
    symptomsAr: ['عدم القدرة على الكلام في مواقف معينة', 'التحدث بشكل طبيعي في المنزل', 'قلق اجتماعي', 'خجل', 'الخوف من الإحراج', 'مظهر متجمد', 'تجنب التواصل البصري']
  },
  {
    id: 'reactive_attachment',
    nameEn: 'Reactive Attachment Disorder',
    nameAr: 'اضطراب التعلق التفاعلي',
    symptomsEn: ['Withdrawal from caregivers', 'Lack of positive emotions', 'Unexplained irritability', 'Sad appearance', 'Not seeking comfort', 'Reduced social responsiveness', 'Episodes of sadness'],
    symptomsAr: ['الانسحاب من مقدمي الرعاية', 'قلة المشاعر الإيجابية', 'عصبية غير مبررة', 'مظهر حزين', 'عدم طلب الراحة', 'انخفاض الاستجابة الاجتماعية', 'نوبات حزن']
  },
  {
    id: 'excoriation',
    nameEn: 'Excoriation (Skin Picking) Disorder',
    nameAr: 'اضطراب قطف الجلد',
    symptomsEn: ['Recurrent skin picking', 'Skin lesions', 'Repeated attempts to stop', 'Distress about picking', 'Social impairment', 'Scarring', 'Infection'],
    symptomsAr: ['قطف الجلد المتكرر', 'آفات جلدية', 'محاولات متكررة للتوقف', 'ضيق من القطف', 'ضعف اجتماعي', 'تندب', 'التهاب']
  },
  {
    id: 'gambling_disorder',
    nameEn: 'Gambling Disorder',
    nameAr: 'اضطراب القمار',
    symptomsEn: ['Preoccupation with gambling', 'Increasing bet amounts', 'Failed attempts to stop', 'Restlessness when stopping', 'Gambling to escape problems', 'Lying about gambling', 'Risking relationships'],
    symptomsAr: ['الانشغال بالقمار', 'زيادة مبالغ الرهان', 'محاولات فاشلة للتوقف', 'قلق عند التوقف', 'القمار للهروب من المشاكل', 'الكذب حول القمار', 'تعريض العلاقات للخطر']
  },
  {
    id: 'illness_anxiety',
    nameEn: 'Illness Anxiety Disorder',
    nameAr: 'اضطراب قلق المرض',
    symptomsEn: ['Preoccupation with having illness', 'Mild or no symptoms', 'High anxiety about health', 'Easily alarmed about health', 'Checking body repeatedly', 'Avoiding doctors or frequent visits', 'Talking about health constantly'],
    symptomsAr: ['الانشغال بوجود مرض', 'أعراض خفيفة أو معدومة', 'قلق شديد على الصحة', 'القلق بسهولة على الصحة', 'فحص الجسم باستمرار', 'تجنب الأطباء أو زيارات متكررة', 'التحدث عن الصحة باستمرار']
  },
  {
    id: 'binge_eating',
    nameEn: 'Binge Eating Disorder',
    nameAr: 'اضطراب نهم الطعام',
    symptomsEn: ['Eating large amounts rapidly', 'Eating until uncomfortably full', 'Eating when not hungry', 'Eating alone due to embarrassment', 'Feeling disgusted after eating', 'Guilt about eating', 'No purging behaviors'],
    symptomsAr: ['تناول كميات كبيرة بسرعة', 'الأكل حتى الشبع المزعج', 'الأكل دون جوع', 'الأكل وحيداً بسبب الإحراج', 'الشعور بالاشمئزاز بعد الأكل', 'الشعور بالذنب من الأكل', 'لا سلوكيات تطهير']
  },
  {
    id: 'rumination',
    nameEn: 'Rumination Disorder',
    nameAr: 'اضطراب الاجترار',
    symptomsEn: ['Regurgitation of food', 'Re-chewing food', 'Re-swallowing food', 'Weight loss', 'Bad breath', 'Stomach problems', 'Dental problems'],
    symptomsAr: ['ارتجاع الطعام', 'إعادة مضغ الطعام', 'إعادة بلع الطعام', 'فقدان الوزن', 'رائحة الفم الكريهة', 'مشاكل المعدة', 'مشاكل الأسنان']
  },
  {
    id: 'separation_anxiety',
    nameEn: 'Separation Anxiety Disorder',
    nameAr: 'اضطراب قلق الانفصال',
    symptomsEn: ['Excessive distress when separated', 'Worry about losing loved ones', 'Fear of being alone', 'Nightmares about separation', 'Physical symptoms before separation', 'Refusal to go to school', 'Clinging behavior'],
    symptomsAr: ['ضيق شديد عند الانفصال', 'قلق من فقدان الأحباء', 'الخوف من البقاء وحيداً', 'كوابيس عن الانفصال', 'أعراض جسدية قبل الانفصال', 'رفض الذهاب للمدرسة', 'سلوك التشبث']
  },
  {
    id: 'conversion_disorder',
    nameEn: 'Conversion Disorder',
    nameAr: 'اضطراب التحويل',
    symptomsEn: ['Weakness or paralysis', 'Abnormal movements', 'Swallowing problems', 'Speech problems', 'Seizure-like episodes', 'Sensory loss', 'Vision problems'],
    symptomsAr: ['ضعف أو شلل', 'حركات غير طبيعية', 'مشاكل البلع', 'مشاكل النطق', 'نوبات تشبه الصرع', 'فقدان الإحساس', 'مشاكل الرؤية']
  },
  // 19 مرض جسدي جديد
  {
    id: 'meningitis',
    nameEn: 'Meningitis',
    nameAr: 'التهاب السحايا',
    symptomsEn: ['Severe headache', 'Stiff neck', 'High fever', 'Sensitivity to light', 'Nausea and vomiting', 'Confusion', 'Skin rash'],
    symptomsAr: ['صداع شديد', 'تيبس الرقبة', 'حمى شديدة', 'حساسية للضوء', 'غثيان وقيء', 'ارتباك', 'طفح جلدي']
  },
  {
    id: 'pancreatitis',
    nameEn: 'Pancreatitis',
    nameAr: 'التهاب البنكرياس',
    symptomsEn: ['Upper abdominal pain', 'Pain radiating to back', 'Nausea and vomiting', 'Fever', 'Rapid pulse', 'Tender abdomen', 'Weight loss'],
    symptomsAr: ['ألم في أعلى البطن', 'ألم ينتشر للظهر', 'غثيان وقيء', 'حمى', 'نبض سريع', 'بطن حساس للمس', 'فقدان الوزن']
  },
  {
    id: 'diverticulitis',
    nameEn: 'Diverticulitis',
    nameAr: 'التهاب الرتج',
    symptomsEn: ['Lower left abdominal pain', 'Fever', 'Nausea', 'Change in bowel habits', 'Bloating', 'Constipation or diarrhea', 'Rectal bleeding'],
    symptomsAr: ['ألم في أسفل البطن الأيسر', 'حمى', 'غثيان', 'تغير في عادات الأمعاء', 'انتفاخ', 'إمساك أو إسهال', 'نزيف شرجي']
  },
  {
    id: 'hernia',
    nameEn: 'Hernia',
    nameAr: 'الفتق',
    symptomsEn: ['Visible bulge', 'Pain when lifting', 'Aching at bulge site', 'Feeling of heaviness', 'Weakness in groin', 'Pain when coughing', 'Burning sensation'],
    symptomsAr: ['انتفاخ مرئي', 'ألم عند الرفع', 'وجع في موقع الانتفاخ', 'شعور بالثقل', 'ضعف في الفخذ', 'ألم عند السعال', 'إحساس بالحرقة']
  },
  {
    id: 'lupus',
    nameEn: 'Systemic Lupus Erythematosus',
    nameAr: 'الذئبة الحمراء',
    symptomsEn: ['Butterfly facial rash', 'Fatigue', 'Joint pain', 'Fever', 'Photosensitivity', 'Hair loss', 'Kidney problems'],
    symptomsAr: ['طفح الفراشة على الوجه', 'إرهاق', 'ألم في المفاصل', 'حمى', 'حساسية للشمس', 'تساقط الشعر', 'مشاكل في الكلى']
  },
  {
    id: 'fibromyalgia',
    nameEn: 'Fibromyalgia',
    nameAr: 'الألم العضلي الليفي',
    symptomsEn: ['Widespread muscle pain', 'Fatigue', 'Sleep problems', 'Memory issues', 'Mood problems', 'Headaches', 'Tingling in hands'],
    symptomsAr: ['ألم عضلي منتشر', 'إرهاق', 'مشاكل النوم', 'مشاكل الذاكرة', 'مشاكل المزاج', 'صداع', 'تنميل في اليدين']
  },
  {
    id: 'bells_palsy',
    nameEn: 'Bell\'s Palsy',
    nameAr: 'شلل الوجه النصفي',
    symptomsEn: ['Sudden facial weakness', 'Drooping on one side', 'Drooling', 'Difficulty closing eye', 'Loss of taste', 'Pain around jaw', 'Sensitivity to sound'],
    symptomsAr: ['ضعف مفاجئ في الوجه', 'ترهل في جانب واحد', 'سيلان اللعاب', 'صعوبة إغلاق العين', 'فقدان التذوق', 'ألم حول الفك', 'حساسية للصوت']
  },
  {
    id: 'carpal_tunnel',
    nameEn: 'Carpal Tunnel Syndrome',
    nameAr: 'متلازمة النفق الرسغي',
    symptomsEn: ['Numbness in fingers', 'Tingling sensation', 'Weakness in hand', 'Pain radiating up arm', 'Dropping objects', 'Nighttime symptoms', 'Wrist pain'],
    symptomsAr: ['تنميل في الأصابع', 'إحساس بالوخز', 'ضعف في اليد', 'ألم ينتشر للذراع', 'إسقاط الأشياء', 'أعراض ليلية', 'ألم في الرسغ']
  },
  {
    id: 'plantar_fasciitis',
    nameEn: 'Plantar Fasciitis',
    nameAr: 'التهاب اللفافة الأخمصية',
    symptomsEn: ['Heel pain', 'Pain worse in morning', 'Pain after standing', 'Stabbing sensation', 'Pain after exercise', 'Arch pain', 'Swelling'],
    symptomsAr: ['ألم في الكعب', 'ألم أسوأ صباحاً', 'ألم بعد الوقوف', 'إحساس بالطعن', 'ألم بعد التمرين', 'ألم في قوس القدم', 'تورم']
  },
  {
    id: 'tendinitis',
    nameEn: 'Tendinitis',
    nameAr: 'التهاب الأوتار',
    symptomsEn: ['Pain at tendon site', 'Tenderness', 'Mild swelling', 'Stiffness', 'Pain with movement', 'Weakness', 'Warmth at site'],
    symptomsAr: ['ألم في موقع الوتر', 'حساسية للمس', 'تورم خفيف', 'تيبس', 'ألم مع الحركة', 'ضعف', 'دفء في الموقع']
  },
  {
    id: 'bursitis',
    nameEn: 'Bursitis',
    nameAr: 'التهاب الجراب',
    symptomsEn: ['Joint pain', 'Stiffness', 'Swelling', 'Redness', 'Pain with movement', 'Limited range of motion', 'Warmth over joint'],
    symptomsAr: ['ألم في المفصل', 'تيبس', 'تورم', 'احمرار', 'ألم مع الحركة', 'محدودية الحركة', 'دفء فوق المفصل']
  },
  {
    id: 'shingles',
    nameEn: 'Shingles (Herpes Zoster)',
    nameAr: 'الحزام الناري',
    symptomsEn: ['Painful rash', 'Burning sensation', 'Blisters', 'Itching', 'Sensitivity to touch', 'Fever', 'Headache'],
    symptomsAr: ['طفح مؤلم', 'إحساس بالحرقة', 'بثور', 'حكة', 'حساسية للمس', 'حمى', 'صداع']
  },
  {
    id: 'rosacea',
    nameEn: 'Rosacea',
    nameAr: 'الوردية',
    symptomsEn: ['Facial redness', 'Visible blood vessels', 'Bumps and pimples', 'Eye problems', 'Burning sensation', 'Thickened skin', 'Flushing'],
    symptomsAr: ['احمرار الوجه', 'أوعية دموية مرئية', 'نتوءات وحبوب', 'مشاكل في العين', 'إحساس بالحرقة', 'سماكة الجلد', 'توهج']
  },
  {
    id: 'vitiligo',
    nameEn: 'Vitiligo',
    nameAr: 'البهاق',
    symptomsEn: ['White patches on skin', 'Premature graying of hair', 'Loss of color in mouth', 'Color loss around eyes', 'Patches spreading', 'Sensitive to sunburn', 'No pain or itching'],
    symptomsAr: ['بقع بيضاء على الجلد', 'شيب مبكر للشعر', 'فقدان اللون في الفم', 'فقدان اللون حول العينين', 'انتشار البقع', 'حساسية لحروق الشمس', 'لا ألم أو حكة']
  },
  {
    id: 'glaucoma',
    nameEn: 'Glaucoma',
    nameAr: 'الجلوكوما',
    symptomsEn: ['Gradual vision loss', 'Tunnel vision', 'Eye pain', 'Seeing halos', 'Red eyes', 'Headache', 'Nausea'],
    symptomsAr: ['فقدان تدريجي للبصر', 'رؤية نفقية', 'ألم في العين', 'رؤية هالات', 'احمرار العين', 'صداع', 'غثيان']
  },
  {
    id: 'cataracts',
    nameEn: 'Cataracts',
    nameAr: 'إعتام عدسة العين',
    symptomsEn: ['Cloudy vision', 'Difficulty with night vision', 'Sensitivity to light', 'Seeing halos', 'Fading colors', 'Double vision', 'Frequent prescription changes'],
    symptomsAr: ['رؤية ضبابية', 'صعوبة الرؤية الليلية', 'حساسية للضوء', 'رؤية هالات', 'بهتان الألوان', 'رؤية مزدوجة', 'تغيير متكرر في النظارات']
  },
  {
    id: 'macular_degeneration',
    nameEn: 'Macular Degeneration',
    nameAr: 'التنكس البقعي',
    symptomsEn: ['Blurred central vision', 'Difficulty reading', 'Need for brighter light', 'Colors appear dull', 'Distorted vision', 'Difficulty recognizing faces', 'Blind spots'],
    symptomsAr: ['ضبابية الرؤية المركزية', 'صعوبة القراءة', 'الحاجة لإضاءة أقوى', 'ألوان باهتة', 'رؤية مشوهة', 'صعوبة التعرف على الوجوه', 'بقع عمياء']
  },
  {
    id: 'otitis_media',
    nameEn: 'Otitis Media (Ear Infection)',
    nameAr: 'التهاب الأذن الوسطى',
    symptomsEn: ['Ear pain', 'Fever', 'Hearing loss', 'Fluid drainage', 'Loss of balance', 'Trouble sleeping', 'Irritability'],
    symptomsAr: ['ألم في الأذن', 'حمى', 'فقدان السمع', 'تصريف سوائل', 'فقدان التوازن', 'صعوبة النوم', 'انفعالية']
  },
  {
    id: 'tinnitus',
    nameEn: 'Tinnitus',
    nameAr: 'طنين الأذن',
    symptomsEn: ['Ringing in ears', 'Buzzing sounds', 'Hissing sounds', 'Clicking sounds', 'Hearing loss', 'Difficulty concentrating', 'Sleep problems'],
    symptomsAr: ['رنين في الأذن', 'أصوات طنين', 'أصوات هسهسة', 'أصوات نقر', 'فقدان السمع', 'صعوبة التركيز', 'مشاكل النوم']
  },
  // 11 مرض نفسي جديد
  {
    id: 'reactive_attachment',
    nameEn: 'Reactive Attachment Disorder',
    nameAr: 'اضطراب التعلق التفاعلي',
    symptomsEn: ['Withdrawing from caregivers', 'Not seeking comfort', 'Reduced positive emotions', 'Unexplained irritability', 'Episodes of sadness', 'Difficulty with social interactions', 'Fearfulness'],
    symptomsAr: ['الانسحاب من مقدمي الرعاية', 'عدم طلب الراحة', 'انخفاض المشاعر الإيجابية', 'انفعالية غير مفسرة', 'نوبات حزن', 'صعوبة التفاعل الاجتماعي', 'الخوف']
  },
  {
    id: 'selective_mutism',
    nameEn: 'Selective Mutism',
    nameAr: 'الخرس الانتقائي',
    symptomsEn: ['Not speaking in specific situations', 'Speaking freely at home', 'Anxiety in social settings', 'Stiffness or expressionless', 'Avoiding eye contact', 'Clinging behavior', 'Fear of embarrassment'],
    symptomsAr: ['عدم التحدث في مواقف محددة', 'التحدث بحرية في المنزل', 'قلق في المواقف الاجتماعية', 'تيبس أو عدم تعبير', 'تجنب التواصل البصري', 'سلوك التشبث', 'الخوف من الإحراج']
  },
  {
    id: 'depersonalization',
    nameEn: 'Depersonalization-Derealization Disorder',
    nameAr: 'اضطراب تبدد الشخصية',
    symptomsEn: ['Feeling detached from self', 'Feeling like observer of life', 'Emotional numbness', 'Distorted sense of time', 'Feeling robotic', 'World seems unreal', 'Memory problems'],
    symptomsAr: ['الشعور بالانفصال عن الذات', 'الشعور كمراقب للحياة', 'خدر عاطفي', 'إحساس مشوه بالوقت', 'الشعور كآلة', 'العالم يبدو غير حقيقي', 'مشاكل الذاكرة']
  },
  {
    id: 'psychogenic_amnesia',
    nameEn: 'Dissociative Amnesia',
    nameAr: 'فقدان الذاكرة الانفصالي',
    symptomsEn: ['Memory gaps', 'Forgetting personal information', 'Confusion about identity', 'Feeling detached', 'Unable to recall traumatic events', 'Depression', 'Anxiety'],
    symptomsAr: ['فجوات في الذاكرة', 'نسيان المعلومات الشخصية', 'ارتباك حول الهوية', 'الشعور بالانفصال', 'عدم تذكر الأحداث الصادمة', 'اكتئاب', 'قلق']
  },
  {
    id: 'factitious_disorder',
    nameEn: 'Factitious Disorder',
    nameAr: 'اضطراب افتعالي',
    symptomsEn: ['Faking illness symptoms', 'Seeking medical attention', 'Extensive medical history', 'Worsening symptoms in hospital', 'Reluctance to be discharged', 'Multiple surgeries', 'Contradictory test results'],
    symptomsAr: ['تزييف أعراض المرض', 'طلب الرعاية الطبية', 'تاريخ طبي مكثف', 'تفاقم الأعراض في المستشفى', 'عدم الرغبة في الخروج', 'عمليات جراحية متعددة', 'نتائج اختبارات متناقضة']
  },
  {
    id: 'brief_psychotic',
    nameEn: 'Brief Psychotic Disorder',
    nameAr: 'اضطراب ذهاني قصير',
    symptomsEn: ['Sudden onset of delusions', 'Hallucinations', 'Disorganized speech', 'Disorganized behavior', 'Confusion', 'Memory problems', 'Mood swings'],
    symptomsAr: ['ظهور مفاجئ للأوهام', 'هلوسات', 'كلام مفكك', 'سلوك مفكك', 'ارتباك', 'مشاكل الذاكرة', 'تقلبات مزاجية']
  },
  {
    id: 'acute_stress',
    nameEn: 'Acute Stress Disorder',
    nameAr: 'اضطراب الإجهاد الحاد',
    symptomsEn: ['Intrusive memories', 'Flashbacks', 'Nightmares', 'Emotional numbness', 'Avoidance behavior', 'Heightened arousal', 'Difficulty concentrating'],
    symptomsAr: ['ذكريات متطفلة', 'استرجاعات', 'كوابيس', 'خدر عاطفي', 'سلوك تجنبي', 'يقظة مفرطة', 'صعوبة التركيز']
  },
  {
    id: 'pyromania',
    nameEn: 'Pyromania',
    nameAr: 'هوس إشعال الحرائق',
    symptomsEn: ['Fascination with fire', 'Deliberate fire setting', 'Tension before setting fire', 'Relief after setting fire', 'Interest in firefighting', 'Regular fire watching', 'Pleasure from destruction'],
    symptomsAr: ['افتتان بالنار', 'إشعال حرائق متعمد', 'توتر قبل إشعال النار', 'ارتياح بعد إشعال النار', 'اهتمام بالإطفاء', 'مشاهدة الحرائق بانتظام', 'متعة من التدمير']
  },
  {
    id: 'kleptomania',
    nameEn: 'Kleptomania',
    nameAr: 'هوس السرقة',
    symptomsEn: ['Urge to steal unneeded items', 'Tension before stealing', 'Relief after stealing', 'Guilt and shame', 'Fear of being caught', 'Unable to resist urges', 'Items not for personal use'],
    symptomsAr: ['دافع لسرقة أشياء غير مطلوبة', 'توتر قبل السرقة', 'ارتياح بعد السرقة', 'ذنب وخجل', 'خوف من الإمساك', 'عدم مقاومة الدوافع', 'أشياء ليست للاستخدام الشخصي']
  },
  {
    id: 'excoriation',
    nameEn: 'Excoriation Disorder (Skin Picking)',
    nameAr: 'اضطراب نتف الجلد',
    symptomsEn: ['Recurrent skin picking', 'Skin lesions', 'Attempts to stop', 'Significant distress', 'Tissue damage', 'Scarring', 'Shame about behavior'],
    symptomsAr: ['نتف الجلد المتكرر', 'آفات جلدية', 'محاولات للتوقف', 'ضيق كبير', 'تلف الأنسجة', 'ندوب', 'خجل من السلوك']
  },
  {
    id: 'pica',
    nameEn: 'Pica',
    nameAr: 'بيكا (أكل غير الطعام)',
    symptomsEn: ['Eating non-food items', 'Craving non-nutritive substances', 'Eating dirt or clay', 'Eating ice', 'Eating paper', 'Nutritional deficiencies', 'Stomach problems'],
    symptomsAr: ['أكل مواد غير غذائية', 'اشتهاء مواد غير مغذية', 'أكل التراب أو الطين', 'أكل الثلج', 'أكل الورق', 'نقص التغذية', 'مشاكل المعدة']
  }
];
