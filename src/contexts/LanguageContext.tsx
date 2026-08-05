import React, { createContext, useContext, useEffect, useState } from 'react';

export type Lang = 'ar' | 'en';

interface LanguageContextType {
  language: Lang;
  setLanguage: (l: Lang) => void;
  toggleLanguage: () => void;
  dir: 'rtl' | 'ltr';
  t: (key: string) => string;
}

const ar: Record<string, string> = {
  // Brand
  'brand.name': 'إسعفني',

  // Navigation
  'nav.home': 'الرئيسية',
  'nav.firstAid': 'الإسعافات الأولية',
  'nav.treatments': 'العلاجات',
  'nav.dailyTip': 'نصائح صحية',
  'nav.dietPlan': 'النظام الغذائي',
  'nav.nearestHospitals': 'أقرب المرافق الصحية',
  'nav.emergency': 'الطوارئ',
  'nav.mentalHealth': 'الصحة النفسية',
  'nav.gym': 'الجيم والتغذية',
  'nav.physiotherapy': 'العلاج الطبيعي',
  'nav.findDoctor': 'ابحث عن طبيب',
  'nav.diagnose': 'شخصني',
  'nav.community': 'المجتمع',
  'nav.dashboard': 'لوحة التحكم',
  'nav.articles': 'مقالات صحية',
  'nav.goals': 'أهدافي الغذائية',
  'nav.settings': 'إعداداتي',
  'nav.login': 'تسجيل الدخول',
  'nav.menu': 'القائمة',

  // Emergency
  'emergency.title': 'أرقام الطوارئ',
  'emergency.police': 'الشرطة',
  'emergency.ambulance': 'الإسعاف',
  'emergency.fire': 'الإطفاء',

  // Hero
  'hero.title': 'إسعفني - رفيقك الصحي',
  'hero.subtitle': 'إرشادات طبية سريعة ونصائح للإسعافات الأولية ودعم الطوارئ في متناول يدك',
  'hero.searchPlaceholder': 'ابحث عن الأعراض أو الأمراض...',
  'hero.searchButton': 'بحث',

  // Search
  'search.bySymptoms': 'ابحث عن المرض بالأعراض',
  'search.byDisease': 'ابحث عن الأعراض بالمرض',
  'search.symptomsPlaceholder': 'صف أعراضك...',
  'search.diseasePlaceholder': 'أدخل اسم المرض...',

  'firstAid.title': 'نصائح الإسعافات الأولية',
  'firstAid.viewAll': 'عرض جميع النصائح',
  'firstAid.searchPlaceholder': 'ابحث عن نصائح الإسعافات الأولية...',

  'treatments.title': 'العلاجات الشائعة',
  'treatments.search': 'ابحث عن العلاجات',
  'treatments.searchPlaceholder': 'ابحث عن دواء...',
  'treatments.viewAll': 'عرض جميع العلاجات',
  'treatments.headache': 'الصداع',
  'treatments.bonePain': 'آلام العظام والمفاصل',
  'treatments.fever': 'الحمى',
  'treatments.cough': 'الكحة',
  'treatments.flu': 'الإنفلونزا',
  'treatments.covid19': 'كوفيد-19',
  'treatments.diabetes': 'السكري',
  'treatments.hypertension': 'ضغط الدم المرتفع',
  'treatments.asthma': 'الربو',
  'treatments.anemia': 'الأنيميا',
  'treatments.migraine': 'الصداع النصفي',
  'treatments.gastritis': 'التهاب المعدة والحموضة',
  'treatments.arthritis': 'التهاب المفاصل',
  'treatments.bronchitis': 'التهاب الشعب الهوائية',
  'treatments.sinusitis': 'التهاب الجيوب الأنفية',
  'treatments.urinaryInfection': 'التهاب المسالك البولية',
  'treatments.thyroidDisorder': 'اضطرابات الغدة الدرقية',
  'treatments.anxiety': 'القلق والتوتر',
  'treatments.allergicRhinitis': 'حساسية الأنف',

  'location.title': 'ابحث عن الأقرب',
  'location.hospitals': 'المستشفيات',
  'location.pharmacies': 'الصيدليات',
  'location.healthCenters': 'المراكز الصحية',
  'location.mentalHealthCenters': 'مراكز الصحة النفسية',
  'location.findNow': 'ابحث الآن',

  'dailyTip.title': 'نصيحة اليوم الصحية',
  'dailyTip.enable': 'تفعيل الإشعارات اليومية',
  'dailyTip.disable': 'إيقاف الإشعارات',

  'diet.title': 'نظام غذائي مخصص',
  'diet.subtitle': 'احصل على نظام غذائي مخصص بناءً على طولك ووزنك وعمرك',
  'diet.height': 'الطول',
  'diet.weight': 'الوزن',
  'diet.age': 'العمر',
  'diet.calculate': 'احسب نظامي الغذائي',
  'diet.bmi': 'مؤشر كتلة الجسم',
  'diet.category': 'التصنيف',
  'diet.calories': 'السعرات اليومية',
  'diet.planTitle': 'نظامك الغذائي المخصص',
  'diet.breakfast': 'الإفطار',
  'diet.lunch': 'الغداء',
  'diet.dinner': 'العشاء',
  'diet.snacks': 'الوجبات الخفيفة',
  'diet.disclaimer': 'هذا نظام غذائي عام. يرجى استشارة أخصائي رعاية صحية أو أخصائي تغذية للحصول على نصائح مخصصة.',

  'theme.toggle': 'تبديل المظهر',
  'lang.toggle': 'تغيير اللغة',

  // Settings
  'settings.title': 'إعداداتي',
  'settings.subtitle': 'إدارة حسابك وبياناتك وتفضيلاتك.',
  'settings.account': 'الحساب',
  'settings.email': 'البريد الإلكتروني',
  'settings.newEmail': 'البريد الإلكتروني الجديد',
  'settings.changeEmail': 'تغيير البريد الإلكتروني',
  'settings.password': 'كلمة المرور',
  'settings.newPassword': 'كلمة المرور الجديدة',
  'settings.confirmPassword': 'تأكيد كلمة المرور',
  'settings.changePassword': 'تغيير كلمة المرور',
  'settings.preferences': 'التفضيلات',
  'settings.logout': 'تسجيل الخروج',
  'settings.logoutConfirm': 'هل تريد تسجيل الخروج من حسابك؟',
  'settings.dangerZone': 'منطقة الخطر',
  'settings.deleteAccount': 'حذف الحساب نهائياً',
  'settings.deleteConfirm': 'سيتم حذف حسابك وكل بياناتك نهائياً ولا يمكن استرجاعها. هل أنت متأكد؟',
  'settings.confirm': 'تأكيد',
  'settings.cancel': 'إلغاء',
  'settings.saved': 'تم الحفظ',

  // Terms
  'terms.title': 'الشروط والأحكام',
  'terms.accept': 'أوافق على الشروط',
  'terms.decline': 'لا أوافق',
  'terms.declined': 'لا يمكن استخدام الموقع بدون الموافقة على الشروط والأحكام.',
  'terms.reconsider': 'العودة والموافقة',

  // Gym / nutrition
  'gym.title': 'الجيم والتغذية',
  'gym.programs': 'التمارين',
  'gym.food': 'الأكل',
  'gym.video': 'تحليل الفيديو',
  'gym.weeklyPlan': 'الخطة الأسبوعية',
  'goals.title': 'أهدافي الغذائية',

  'articles.title': 'مقالات صحية',
  'common.back': 'رجوع',
  'common.export': 'تصدير',
  'common.save': 'حفظ',
  'common.loading': 'جاري التحميل...',
};

const en: Record<string, string> = {
  'brand.name': 'Es3efny',

  'nav.home': 'Home',
  'nav.firstAid': 'First Aid',
  'nav.treatments': 'Treatments',
  'nav.dailyTip': 'Health Tips',
  'nav.dietPlan': 'Diet Plan',
  'nav.nearestHospitals': 'Nearby Facilities',
  'nav.emergency': 'Emergency',
  'nav.mentalHealth': 'Mental Health',
  'nav.gym': 'Gym & Nutrition',
  'nav.physiotherapy': 'Physiotherapy',
  'nav.findDoctor': 'Find a Doctor',
  'nav.diagnose': 'Check My Symptoms',
  'nav.community': 'Community',
  'nav.dashboard': 'Dashboard',
  'nav.articles': 'Health Articles',
  'nav.goals': 'My Nutrition Goals',
  'nav.settings': 'My Settings',
  'nav.login': 'Sign in',
  'nav.menu': 'Menu',

  'emergency.title': 'Emergency Numbers',
  'emergency.police': 'Police',
  'emergency.ambulance': 'Ambulance',
  'emergency.fire': 'Fire Department',

  'hero.title': 'Es3efny — Your Health Companion',
  'hero.subtitle': 'Quick medical guidance, first-aid tips and emergency support at your fingertips',
  'hero.searchPlaceholder': 'Search symptoms or conditions...',
  'hero.searchButton': 'Search',

  'search.bySymptoms': 'Find a condition by symptoms',
  'search.byDisease': 'Find symptoms by condition',
  'search.symptomsPlaceholder': 'Describe your symptoms...',
  'search.diseasePlaceholder': 'Enter a condition name...',

  'firstAid.title': 'First Aid Tips',
  'firstAid.viewAll': 'View all tips',
  'firstAid.searchPlaceholder': 'Search first-aid tips...',

  'treatments.title': 'Common Treatments',
  'treatments.search': 'Search treatments',
  'treatments.searchPlaceholder': 'Search a medicine...',
  'treatments.viewAll': 'View all treatments',
  'treatments.headache': 'Headache',
  'treatments.bonePain': 'Bone & Joint Pain',
  'treatments.fever': 'Fever',
  'treatments.cough': 'Cough',
  'treatments.flu': 'Flu',
  'treatments.covid19': 'COVID-19',
  'treatments.diabetes': 'Diabetes',
  'treatments.hypertension': 'High Blood Pressure',
  'treatments.asthma': 'Asthma',
  'treatments.anemia': 'Anemia',
  'treatments.migraine': 'Migraine',
  'treatments.gastritis': 'Gastritis & Acidity',
  'treatments.arthritis': 'Arthritis',
  'treatments.bronchitis': 'Bronchitis',
  'treatments.sinusitis': 'Sinusitis',
  'treatments.urinaryInfection': 'Urinary Tract Infection',
  'treatments.thyroidDisorder': 'Thyroid Disorders',
  'treatments.anxiety': 'Anxiety & Stress',
  'treatments.allergicRhinitis': 'Allergic Rhinitis',

  'location.title': 'Find the nearest',
  'location.hospitals': 'Hospitals',
  'location.pharmacies': 'Pharmacies',
  'location.healthCenters': 'Health Centers',
  'location.mentalHealthCenters': 'Mental Health Centers',
  'location.findNow': 'Search now',

  'dailyTip.title': 'Health Tip of the Day',
  'dailyTip.enable': 'Enable daily notifications',
  'dailyTip.disable': 'Disable notifications',

  'diet.title': 'Personalized Diet Plan',
  'diet.subtitle': 'Get a plan based on your height, weight and age',
  'diet.height': 'Height',
  'diet.weight': 'Weight',
  'diet.age': 'Age',
  'diet.calculate': 'Calculate my plan',
  'diet.bmi': 'Body Mass Index',
  'diet.category': 'Category',
  'diet.calories': 'Daily calories',
  'diet.planTitle': 'Your personalized plan',
  'diet.breakfast': 'Breakfast',
  'diet.lunch': 'Lunch',
  'diet.dinner': 'Dinner',
  'diet.snacks': 'Snacks',
  'diet.disclaimer': 'This is a general plan. Please consult a healthcare professional or dietitian for personalized advice.',

  'theme.toggle': 'Toggle theme',
  'lang.toggle': 'Change language',

  'settings.title': 'My Settings',
  'settings.subtitle': 'Manage your account, data and preferences.',
  'settings.account': 'Account',
  'settings.email': 'Email',
  'settings.newEmail': 'New email',
  'settings.changeEmail': 'Change email',
  'settings.password': 'Password',
  'settings.newPassword': 'New password',
  'settings.confirmPassword': 'Confirm password',
  'settings.changePassword': 'Change password',
  'settings.preferences': 'Preferences',
  'settings.logout': 'Sign out',
  'settings.logoutConfirm': 'Do you want to sign out of your account?',
  'settings.dangerZone': 'Danger zone',
  'settings.deleteAccount': 'Delete account permanently',
  'settings.deleteConfirm': 'Your account and all your data will be permanently deleted and cannot be recovered. Are you sure?',
  'settings.confirm': 'Confirm',
  'settings.cancel': 'Cancel',
  'settings.saved': 'Saved',

  'terms.title': 'Terms & Conditions',
  'terms.accept': 'I accept the terms',
  'terms.decline': 'I do not accept',
  'terms.declined': 'You cannot use the site without accepting the terms and conditions.',
  'terms.reconsider': 'Go back and accept',

  'gym.title': 'Gym & Nutrition',
  'gym.programs': 'Workouts',
  'gym.food': 'Food',
  'gym.video': 'Video Review',
  'gym.weeklyPlan': 'Weekly Plan',
  'goals.title': 'My Nutrition Goals',

  'articles.title': 'Health Articles',
  'common.back': 'Back',
  'common.export': 'Export',
  'common.save': 'Save',
  'common.loading': 'Loading...',
};

const dictionaries: Record<Lang, Record<string, string>> = { ar, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'es3efny_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Lang>(() => {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    return stored === 'en' ? 'en' : 'ar';
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    localStorage.setItem(STORAGE_KEY, language);
  }, [language, dir]);

  const setLanguage = (l: Lang) => setLanguageState(l);
  const toggleLanguage = () => setLanguageState((p) => (p === 'ar' ? 'en' : 'ar'));

  const t = (key: string): string => dictionaries[language][key] ?? ar[key] ?? key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
