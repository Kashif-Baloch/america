import OverView from "./_components/OverView";
import SubscriptionSection from "./_components/SubscriptionSection";
import UserSection from "./_components/UserSection";
import DownloadSection from "./_components/DownloadSection";

const Hero = () => {
  return (
    <div className="flex flex-col mx-auto max-w-7xl font-sf">
      <div className="flex-1 space-y-4 p-4 md:p-8">
        {/* Overview Section */}

        <OverView />
        {/* Subscription Analytics Section */}
        <SubscriptionSection />

        {/* User Activity Section */}
        <UserSection />

        {/* Downloads Section */}
        <DownloadSection />
      </div>
    </div>
  );
};

export default Hero;
