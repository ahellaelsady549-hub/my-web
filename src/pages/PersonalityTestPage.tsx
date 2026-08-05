import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PersonalityTest } from '@/components/PersonalityTest';
import { AdSlot } from '@/components/AdSlot';

const PersonalityTestPage = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <main className="pt-16">
        <AdSlot id="personality-top" format="banner" />
        <PersonalityTest />
      <AdSlot id="personality-bottom" format="inline" />
      </main>
      <Footer />
    </div>
  );
};

export default PersonalityTestPage;
