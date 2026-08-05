export interface PhysicalDisease {
  id: string;
  nameAr: string;
  nameEn: string;
  symptomsAr: string[];
  symptomsEn: string[];
  treatmentsAr: string[];
  treatmentsEn: string[];
}

export const physicalDiseases: PhysicalDisease[] = [
  {
    id: 'diabetes',
    nameAr: 'السكري',
    nameEn: 'Diabetes',
    symptomsAr: ['العطش الشديد', 'كثرة التبول', 'فقدان الوزن', 'التعب', 'بطء التئام الجروح', 'زغللة العين', 'الجوع المفرط'],
    symptomsEn: ['Excessive thirst', 'Frequent urination', 'Weight loss', 'Fatigue', 'Slow wound healing', 'Blurred vision', 'Excessive hunger'],
    treatmentsAr: ['الإنسولين', 'ميتفورمين', 'غليبنكلاميد', 'تنظيم الغذاء', 'التمارين الرياضية', 'مراقبة السكر يومياً'],
    treatmentsEn: ['Insulin', 'Metformin', 'Glibenclamide', 'Diet regulation', 'Exercise', 'Daily blood sugar monitoring']
  },
  {
    id: 'hypertension',
    nameAr: 'ارتفاع ضغط الدم',
    nameEn: 'Hypertension',
    symptomsAr: ['الصداع', 'ضيق التنفس', 'نزيف الأنف', 'الدوخة', 'ألم الصدر', 'خفقان القلب', 'عدم وضوح الرؤية'],
    symptomsEn: ['Headache', 'Shortness of breath', 'Nosebleeds', 'Dizziness', 'Chest pain', 'Heart palpitations', 'Blurred vision'],
    treatmentsAr: ['أملوديبين', 'لوسارتان', 'هيدروكلوروثيازيد', 'تقليل الملح', 'ممارسة الرياضة', 'تجنب التوتر'],
    treatmentsEn: ['Amlodipine', 'Losartan', 'Hydrochlorothiazide', 'Reducing salt', 'Exercise', 'Stress management']
  },
  {
    id: 'asthma',
    nameAr: 'الربو',
    nameEn: 'Asthma',
    symptomsAr: ['ضيق التنفس', 'صفير الصدر', 'السعال الليلي', 'ضيق الصدر', 'صعوبة التنفس عند المجهود', 'السعال الجاف'],
    symptomsEn: ['Shortness of breath', 'Wheezing', 'Night cough', 'Chest tightness', 'Exercise-induced breathing difficulty', 'Dry cough'],
    treatmentsAr: ['بخاخ سالبوتامول', 'بخاخ كورتيزون', 'مونتيلوكاست', 'تجنب المحفزات', 'خطة طوارئ الربو'],
    treatmentsEn: ['Salbutamol inhaler', 'Corticosteroid inhaler', 'Montelukast', 'Avoiding triggers', 'Asthma action plan']
  },
  {
    id: 'heart_disease',
    nameAr: 'أمراض القلب',
    nameEn: 'Heart Disease',
    symptomsAr: ['ألم الصدر', 'ضيق التنفس', 'خفقان القلب', 'الإرهاق', 'تورم القدمين', 'الدوخة', 'ألم في الذراع الأيسر'],
    symptomsEn: ['Chest pain', 'Shortness of breath', 'Heart palpitations', 'Fatigue', 'Swollen feet', 'Dizziness', 'Left arm pain'],
    treatmentsAr: ['أسبرين', 'ستاتينات', 'حاصرات بيتا', 'مميعات الدم', 'تغيير نمط الحياة', 'جراحة القلب عند الحاجة'],
    treatmentsEn: ['Aspirin', 'Statins', 'Beta-blockers', 'Blood thinners', 'Lifestyle changes', 'Heart surgery if needed']
  },
  {
    id: 'gastritis',
    nameAr: 'التهاب المعدة',
    nameEn: 'Gastritis',
    symptomsAr: ['ألم المعدة', 'الغثيان', 'القيء', 'الانتفاخ', 'حرقة المعدة', 'فقدان الشهية', 'الشعور بالامتلاء'],
    symptomsEn: ['Stomach pain', 'Nausea', 'Vomiting', 'Bloating', 'Heartburn', 'Loss of appetite', 'Feeling full'],
    treatmentsAr: ['أوميبرازول', 'رانيتيدين', 'مضادات الحموضة', 'تجنب الأطعمة الحارة', 'تنظيم الوجبات', 'علاج جرثومة المعدة'],
    treatmentsEn: ['Omeprazole', 'Ranitidine', 'Antacids', 'Avoiding spicy foods', 'Meal regulation', 'H. pylori treatment']
  },
  {
    id: 'kidney_disease',
    nameAr: 'أمراض الكلى',
    nameEn: 'Kidney Disease',
    symptomsAr: ['تورم القدمين', 'التعب', 'تغير لون البول', 'قلة التبول', 'الغثيان', 'الحكة', 'ضيق التنفس'],
    symptomsEn: ['Swollen feet', 'Fatigue', 'Urine color change', 'Decreased urination', 'Nausea', 'Itching', 'Shortness of breath'],
    treatmentsAr: ['غسيل الكلى', 'أدوية الضغط', 'تنظيم البروتين', 'تقليل الصوديوم', 'زراعة الكلى', 'مراقبة السوائل'],
    treatmentsEn: ['Dialysis', 'Blood pressure medications', 'Protein regulation', 'Sodium reduction', 'Kidney transplant', 'Fluid monitoring']
  },
  {
    id: 'liver_disease',
    nameAr: 'أمراض الكبد',
    nameEn: 'Liver Disease',
    symptomsAr: ['اصفرار الجلد', 'ألم البطن', 'تورم البطن', 'الحكة', 'البول الداكن', 'التعب', 'فقدان الشهية'],
    symptomsEn: ['Jaundice', 'Abdominal pain', 'Abdominal swelling', 'Itching', 'Dark urine', 'Fatigue', 'Loss of appetite'],
    treatmentsAr: ['علاج السبب', 'تجنب الكحول', 'أدوية حماية الكبد', 'تنظيم الغذاء', 'زراعة الكبد', 'علاج الفيروسات الكبدية'],
    treatmentsEn: ['Treating the cause', 'Avoiding alcohol', 'Liver protection medications', 'Diet regulation', 'Liver transplant', 'Hepatitis treatment']
  },
  {
    id: 'arthritis',
    nameAr: 'التهاب المفاصل',
    nameEn: 'Arthritis',
    symptomsAr: ['ألم المفاصل', 'تورم المفاصل', 'تيبس صباحي', 'صعوبة الحركة', 'احمرار', 'دفء المفصل', 'ضعف العضلات'],
    symptomsEn: ['Joint pain', 'Joint swelling', 'Morning stiffness', 'Difficulty moving', 'Redness', 'Joint warmth', 'Muscle weakness'],
    treatmentsAr: ['مسكنات الألم', 'مضادات الالتهاب', 'العلاج الطبيعي', 'الكمادات', 'حقن الكورتيزون', 'جراحة المفاصل'],
    treatmentsEn: ['Pain relievers', 'Anti-inflammatories', 'Physical therapy', 'Compresses', 'Cortisone injections', 'Joint surgery']
  },
  {
    id: 'migraine',
    nameAr: 'الصداع النصفي',
    nameEn: 'Migraine',
    symptomsAr: ['صداع شديد في جانب واحد', 'الغثيان', 'الحساسية للضوء', 'الحساسية للصوت', 'اضطرابات بصرية', 'القيء', 'ألم نابض'],
    symptomsEn: ['Severe one-sided headache', 'Nausea', 'Light sensitivity', 'Sound sensitivity', 'Visual disturbances', 'Vomiting', 'Throbbing pain'],
    treatmentsAr: ['تريبتانات', 'مسكنات الألم', 'أدوية وقائية', 'تجنب المحفزات', 'الراحة في غرفة مظلمة', 'بوتوكس للصداع المزمن'],
    treatmentsEn: ['Triptans', 'Pain relievers', 'Preventive medications', 'Avoiding triggers', 'Rest in dark room', 'Botox for chronic migraine']
  },
  {
    id: 'anemia',
    nameAr: 'فقر الدم',
    nameEn: 'Anemia',
    symptomsAr: ['التعب والإرهاق', 'شحوب الجلد', 'ضيق التنفس', 'الدوخة', 'برودة الأطراف', 'خفقان القلب', 'الصداع'],
    symptomsEn: ['Fatigue', 'Pale skin', 'Shortness of breath', 'Dizziness', 'Cold extremities', 'Heart palpitations', 'Headache'],
    treatmentsAr: ['مكملات الحديد', 'فيتامين ب12', 'حمض الفوليك', 'نظام غذائي غني بالحديد', 'نقل الدم', 'علاج السبب'],
    treatmentsEn: ['Iron supplements', 'Vitamin B12', 'Folic acid', 'Iron-rich diet', 'Blood transfusion', 'Treating the cause']
  },
  {
    id: 'thyroid_disorder',
    nameAr: 'اضطرابات الغدة الدرقية',
    nameEn: 'Thyroid Disorders',
    symptomsAr: ['تغير الوزن', 'التعب', 'تساقط الشعر', 'عدم انتظام ضربات القلب', 'الحساسية للحرارة أو البرودة', 'تغير المزاج', 'اضطراب الدورة الشهرية'],
    symptomsEn: ['Weight changes', 'Fatigue', 'Hair loss', 'Irregular heartbeat', 'Temperature sensitivity', 'Mood changes', 'Menstrual irregularities'],
    treatmentsAr: ['ليفوثيروكسين', 'أدوية مضادة للدرقية', 'اليود المشع', 'استئصال الغدة', 'مراقبة مستويات الهرمونات'],
    treatmentsEn: ['Levothyroxine', 'Anti-thyroid medications', 'Radioactive iodine', 'Thyroidectomy', 'Hormone level monitoring']
  },
  {
    id: 'pneumonia',
    nameAr: 'الالتهاب الرئوي',
    nameEn: 'Pneumonia',
    symptomsAr: ['السعال مع البلغم', 'الحمى', 'ضيق التنفس', 'ألم الصدر', 'القشعريرة', 'التعب', 'فقدان الشهية'],
    symptomsEn: ['Cough with phlegm', 'Fever', 'Shortness of breath', 'Chest pain', 'Chills', 'Fatigue', 'Loss of appetite'],
    treatmentsAr: ['المضادات الحيوية', 'خافضات الحرارة', 'الراحة والسوائل', 'الأكسجين', 'أدوية السعال', 'العلاج في المستشفى للحالات الشديدة'],
    treatmentsEn: ['Antibiotics', 'Fever reducers', 'Rest and fluids', 'Oxygen', 'Cough medications', 'Hospitalization for severe cases']
  },
  {
    id: 'ibs',
    nameAr: 'القولون العصبي',
    nameEn: 'Irritable Bowel Syndrome',
    symptomsAr: ['ألم البطن', 'الانتفاخ', 'الإسهال أو الإمساك', 'الغازات', 'تغير شكل البراز', 'الشعور بعدم إفراغ الأمعاء', 'المغص'],
    symptomsEn: ['Abdominal pain', 'Bloating', 'Diarrhea or constipation', 'Gas', 'Change in stool form', 'Incomplete evacuation', 'Cramping'],
    treatmentsAr: ['تعديل النظام الغذائي', 'الألياف', 'مضادات التشنج', 'البروبيوتيك', 'إدارة التوتر', 'تجنب الأطعمة المهيجة'],
    treatmentsEn: ['Diet modification', 'Fiber', 'Antispasmodics', 'Probiotics', 'Stress management', 'Avoiding trigger foods']
  },
  {
    id: 'urinary_infection',
    nameAr: 'التهاب المسالك البولية',
    nameEn: 'Urinary Tract Infection',
    symptomsAr: ['حرقة عند التبول', 'كثرة التبول', 'ألم أسفل البطن', 'بول عكر', 'دم في البول', 'رائحة كريهة للبول', 'الحمى'],
    symptomsEn: ['Burning urination', 'Frequent urination', 'Lower abdominal pain', 'Cloudy urine', 'Blood in urine', 'Foul-smelling urine', 'Fever'],
    treatmentsAr: ['المضادات الحيوية', 'شرب السوائل بكثرة', 'مسكنات الألم', 'تجنب المهيجات', 'فحص البول الدوري'],
    treatmentsEn: ['Antibiotics', 'Drinking plenty of fluids', 'Pain relievers', 'Avoiding irritants', 'Periodic urine tests']
  },
  {
    id: 'back_pain',
    nameAr: 'آلام الظهر',
    nameEn: 'Back Pain',
    symptomsAr: ['ألم أسفل الظهر', 'تيبس العضلات', 'صعوبة الحركة', 'ألم يمتد للساق', 'ضعف العضلات', 'تنميل', 'ألم يزداد مع الجلوس'],
    symptomsEn: ['Lower back pain', 'Muscle stiffness', 'Difficulty moving', 'Pain radiating to leg', 'Muscle weakness', 'Numbness', 'Pain worsening with sitting'],
    treatmentsAr: ['العلاج الطبيعي', 'مسكنات الألم', 'الكمادات الدافئة', 'تمارين التقوية', 'تصحيح الوضعية', 'الجراحة للحالات الشديدة'],
    treatmentsEn: ['Physical therapy', 'Pain relievers', 'Warm compresses', 'Strengthening exercises', 'Posture correction', 'Surgery for severe cases']
  },
  {
    id: 'allergy',
    nameAr: 'الحساسية',
    nameEn: 'Allergies',
    symptomsAr: ['العطس', 'سيلان الأنف', 'حكة العينين', 'الطفح الجلدي', 'صعوبة التنفس', 'تورم الوجه', 'السعال'],
    symptomsEn: ['Sneezing', 'Runny nose', 'Itchy eyes', 'Skin rash', 'Difficulty breathing', 'Facial swelling', 'Cough'],
    treatmentsAr: ['مضادات الهيستامين', 'بخاخات الأنف', 'قطرات العين', 'تجنب المحفزات', 'العلاج المناعي', 'حقنة الإبينفرين للحالات الشديدة'],
    treatmentsEn: ['Antihistamines', 'Nasal sprays', 'Eye drops', 'Avoiding triggers', 'Immunotherapy', 'Epinephrine for severe cases']
  },
  {
    id: 'flu',
    nameAr: 'الإنفلونزا',
    nameEn: 'Influenza',
    symptomsAr: ['الحمى', 'السعال', 'آلام الجسم', 'الصداع', 'التعب', 'التهاب الحلق', 'سيلان الأنف'],
    symptomsEn: ['Fever', 'Cough', 'Body aches', 'Headache', 'Fatigue', 'Sore throat', 'Runny nose'],
    treatmentsAr: ['الراحة والسوائل', 'خافضات الحرارة', 'مضادات الفيروسات', 'مسكنات الألم', 'تطعيم الإنفلونزا السنوي'],
    treatmentsEn: ['Rest and fluids', 'Fever reducers', 'Antivirals', 'Pain relievers', 'Annual flu vaccination']
  },
  {
    id: 'skin_infection',
    nameAr: 'التهابات الجلد',
    nameEn: 'Skin Infections',
    symptomsAr: ['احمرار الجلد', 'الحكة', 'التورم', 'الألم', 'الحرارة الموضعية', 'الإفرازات', 'تقشر الجلد'],
    symptomsEn: ['Skin redness', 'Itching', 'Swelling', 'Pain', 'Local warmth', 'Discharge', 'Skin peeling'],
    treatmentsAr: ['المضادات الحيوية الموضعية', 'مضادات الفطريات', 'كريمات الكورتيزون', 'تنظيف الجلد', 'المضادات الحيوية الفموية'],
    treatmentsEn: ['Topical antibiotics', 'Antifungals', 'Cortisone creams', 'Skin cleansing', 'Oral antibiotics']
  },
  {
    id: 'osteoporosis',
    nameAr: 'هشاشة العظام',
    nameEn: 'Osteoporosis',
    symptomsAr: ['الكسور السهلة', 'ألم الظهر', 'انحناء الظهر', 'قصر القامة', 'ضعف العظام', 'آلام المفاصل'],
    symptomsEn: ['Easy fractures', 'Back pain', 'Stooped posture', 'Height loss', 'Weak bones', 'Joint pain'],
    treatmentsAr: ['مكملات الكالسيوم', 'فيتامين د', 'البيسفوسفونات', 'التمارين الرياضية', 'تجنب السقوط', 'فحص كثافة العظام'],
    treatmentsEn: ['Calcium supplements', 'Vitamin D', 'Bisphosphonates', 'Exercise', 'Fall prevention', 'Bone density testing']
  }
];
