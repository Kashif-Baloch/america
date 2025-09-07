//Components
import Benefits from "@/components/pages/pricing/Benefits";
import BookAppointment from "@/components/pages/pricing/BookAppointment";
import Hero from "@/components/pages/pricing/Hero";
import Pricing from "@/components/pages/pricing/Pricing";
import GiftProSubscription from "@/components/shared/GiftProSubscription";

const SubscriptionPage = () => {
  return (
    <>
      <Hero />
      <div className="w-full flex flex-col">
        <Benefits />
        <Pricing />
      </div>
      <BookAppointment />
      <GiftProSubscription />
    </>
  );
};

export default SubscriptionPage;
