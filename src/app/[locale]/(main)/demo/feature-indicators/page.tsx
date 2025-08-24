// 'use client';

// import { useState } from 'react';
// import { useTranslations } from 'next-intl';
// import { Button } from '@/components/ui/button';
// import { FeatureWrapper, FeatureCard } from '@/components/ui/feature-wrapper';
// import { LockedFeatureBadge } from '@/components/ui/locked-feature-badge';
// import { FileText, Mail, Star, MessageSquare, Clock } from 'lucide-react';

// type PlanType = 'FREE' | 'BASIC' | 'PRO' | 'PRO_PLUS';

// export default function FeatureIndicatorsDemo() {
//   const [currentPlan, setCurrentPlan] = useState<PlanType>('FREE');
//   const t = useTranslations();

//   const features = [
//     {
//       title: "Save Job Listings",
//       description: "Save jobs to apply later and keep track of your applications.",
//       icon: Star,
//       requiredPlan: "BASIC" as const,
//     },
//     {
//       title: "Company Contact Info",
//       description: "Access direct contact information for hiring managers.",
//       icon: Mail,
//       requiredPlan: "PRO" as const,
//     },
//     {
//       title: "Resume Reviews",
//       description: "Get professional feedback on your resume from industry experts.",
//       icon: FileText,
//       requiredPlan: "PRO" as const,
//     },
//     {
//       title: "1:1 Consultation",
//       description: "Schedule a 30-minute consultation with a career advisor.",
//       icon: MessageSquare,
//       requiredPlan: "PRO_PLUS" as const,
//     },
//     {
//       title: "Priority Support",
//       description: "Get your questions answered faster with priority support.",
//       icon: Clock,
//       requiredPlan: "PRO" as const,
//     },
//   ];

//   return (
//     <div className="container mx-auto p-6 max-w-6xl">
//       <h1 className="text-3xl font-bold mb-8">Feature Indicators Demo</h1>

//       {/* Plan Selector */}
//       <div className="mb-8 p-6 bg-gray-50 rounded-xl">
//         <h2 className="text-xl font-semibold mb-4">Current Plan: {currentPlan}</h2>
//         <div className="flex flex-wrap gap-3">
//           {(['FREE', 'BASIC', 'PRO', 'PRO_PLUS'] as PlanType[]).map((plan) => (
//             <Button
//               key={plan}
//               variant={currentPlan === plan ? 'default' : 'outline'}
//               onClick={() => setCurrentPlan(plan)}
//               className="capitalize"
//             >
//               {plan}
//             </Button>
//           ))}
//         </div>
//       </div>

//       {/* Feature Grid */}
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
//         {features.map((feature, index) => (
//           <FeatureWrapper
//             key={index}
//             requiredPlan={feature.requiredPlan}
//             currentPlan={currentPlan}
//             featureName={feature.title}
//           >
//             <FeatureCard
//               title={feature.title}
//               description={feature.description}
//               icon={feature.icon}
//               requiredPlan={feature.requiredPlan}
//               currentPlan={currentPlan}
//             />
//           </FeatureWrapper>
//         ))}
//       </div>

//       {/* Example Usage in UI Elements */}
//       <div className="space-y-6">
//         <h2 className="text-2xl font-bold">UI Examples</h2>

//         {/* Example 1: Button with Locked State */}
//         <div className="border p-6 rounded-lg">
//           <h3 className="text-lg font-medium mb-4">Save Job Button</h3>
//           <FeatureWrapper
//             requiredPlan="BASIC"
//             currentPlan={currentPlan}
//             featureName="Save Job"
//             className="inline-block"
//           >
//             <Button>
//               <Star className="mr-2 h-4 w-4" />
//               Save Job
//             </Button>
//           </FeatureWrapper>
//         </div>

//         {/* Example 2: Form Field */}
//         <div className="border p-6 rounded-lg">
//           <div className="flex items-center justify-between mb-2">
//             <label className="text-sm font-medium">
//               Company Contact Email
//               <LockedFeatureBadge
//                 requiredPlan="PRO"
//                 size="sm"
//                 className="ml-2"
//               />
//             </label>
//           </div>
//           <FeatureWrapper
//             requiredPlan="PRO"
//             currentPlan={currentPlan}
//             featureName="Company Contact Information"
//           >
//             <input
//               type="email"
//               className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//               placeholder="hr@company.com"
//               disabled={currentPlan !== 'PRO' && currentPlan !== 'PRO_PLUS'}
//             />
//           </FeatureWrapper>
//         </div>
//       </div>
//     </div>
//   );
// }
