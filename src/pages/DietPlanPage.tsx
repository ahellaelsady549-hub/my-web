import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DietPlan } from '@/components/DietPlan';
import { AdSlot } from '@/components/AdSlot';

const DietPlanPage = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <main className="pt-16">
        <AdSlot id="diet-top" format="banner" />
        <DietPlan />
      <AdSlot id="diet-bottom" format="inline" />
      </main>
      <Footer />
    </div>
  );
};

export default DietPlanPage;
