// 'use client';

// import { useState } from 'react';
// import { useTranslations } from 'next-intl';
// import { Button } from '@/components/ui/button';
// import { UpgradePrompt } from '@/components/ui/upgrade-prompt';

// type PlanType = 'FREE' | 'BASIC' | 'PRO' | 'PRO_PLUS';

// export default function UpgradeDemoPage() {
//   const [currentPlan, setCurrentPlan] = useState<PlanType>('FREE');
//   const t = useTranslations();

//   const handleUpgrade = (plan: PlanType) => {
//     console.log(`Upgrading to ${plan} plan`);
//     // In a real app, this would redirect to the checkout page
//     // or open a payment modal
//     setCurrentPlan(plan);
//   };

//   return (
//     <div className="container mx-auto p-6 max-w-4xl">
//       <h1 className="text-3xl font-bold mb-6">Upgrade Demo</h1>

//       <div className="mb-8 p-4 border rounded-lg bg-gray-50">
//         <h2 className="text-xl font-semibold mb-4">Current Plan: {currentPlan}</h2>
//         <div className="flex gap-4">
//           {(['FREE', 'BASIC', 'PRO', 'PRO_PLUS'] as PlanType[]).map((plan) => (
//             <Button
//               key={plan}
//               variant={currentPlan === plan ? 'default' : 'outline'}
//               onClick={() => setCurrentPlan(plan)}
//             >
//               {plan}
//             </Button>
//           ))}
//         </div>
//       </div>

//       <div className="space-y-6">
//         <div className="p-6 border rounded-lg">
//           <h2 className="text-xl font-semibold mb-4">Feature 1: Save Jobs</h2>
//           <p className="mb-4">This feature requires at least a BASIC plan.</p>
//           <UpgradePrompt
//             requiredPlan="BASIC"
//             currentPlan={currentPlan}
//             featureName="Save Jobs"
//             onUpgrade={handleUpgrade}
//           >
//             <Button disabled={currentPlan === 'FREE'}>
//               {currentPlan === 'FREE' ? 'Upgrade to Save' : 'Save Job'}
//             </Button>
//           </UpgradePrompt>
//         </div>

//         <div className="p-6 border rounded-lg">
//           <h2 className="text-xl font-semibold mb-4">Feature 2: Company Contact Info</h2>
//           <p className="mb-4">This feature requires a PRO plan.</p>
//           <UpgradePrompt
//             requiredPlan="PRO"
//             currentPlan={currentPlan}
//             featureName="Company Contact Information"
//             onUpgrade={handleUpgrade}
//           >
//             <Button disabled={currentPlan !== 'PRO' && currentPlan !== 'PRO_PLUS'}>
//               {currentPlan === 'PRO' || currentPlan === 'PRO_PLUS'
//                 ? 'View Contact Info'
//                 : 'Upgrade to View'}
//             </Button>
//           </UpgradePrompt>
//         </div>

//         <div className="p-6 border rounded-lg">
//           <h2 className="text-xl font-semibold mb-4">Feature 3: Direct Employer Contact</h2>
//           <p className="mb-4">This feature requires a PRO+ plan.</p>
//           <UpgradePrompt
//             requiredPlan="PRO_PLUS"
//             currentPlan={currentPlan}
//             featureName="Direct Employer Contact"
//             onUpgrade={handleUpgrade}
//           >
//             <Button disabled={currentPlan !== 'PRO_PLUS'}>
//               {currentPlan === 'PRO_PLUS'
//                 ? 'Contact Employer'
//                 : 'Upgrade to PRO+'}
//             </Button>
//           </UpgradePrompt>
//         </div>
//       </div>
//     </div>
//   );
// }
