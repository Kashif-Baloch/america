// "use client";
// import { Loader2Icon } from "lucide-react";
// import { useEffect, useState } from "react";

// export default function PaymentResponsePage() {
//   const [paymentData, setPaymentData] = useState<null | {
//     status: string;
//     referenceCode: string;
//     message: string;
//     description: string;
//     buyerEmail: string;
//     paymentMethod: string;
//   }>(null);

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const referenceCode = params.get("referenceCode");
//     const status = params.get("lapTransactionState");
//     const message = params.get("message");
//     const description = params.get("description");
//     const buyerEmail = params.get("buyerEmail");
//     const paymentMethod = params.get("lapPaymentMethod");

//     if (referenceCode) {
//       fetch(
//         `/api/payments/confirmation?referenceCode=${referenceCode}&status=${status}`
//       )
//         .then((res) => res.json())
//         .then((data) => {
//           setPaymentData({
//             status: data.status,
//             referenceCode: referenceCode || "",
//             message: message || "",
//             description: description || "",
//             buyerEmail: buyerEmail || "",
//             paymentMethod: paymentMethod || "",
//           });
//         });
//     }
//   }, []);

//   if (!paymentData)
//     return (
//       <div className="flex items-center justify-center h-[100vh]">
//         <p className="text-xl font-bold flex items-center justify-center gap-3">
//           <Loader2Icon size={40} className="animate-spin" />
//           Loading payment status...
//         </p>
//       </div>
//     );

//   return (
//     <div className="flex items-center justify-center h-[100vh] ">
//       <div className="bg-gray-50 p-6 rounded-lg w-[500px]">
//         <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
//         {paymentData.status === "APPROVED" ? (
//           <h2 className="text-green-600 font-bold text-lg">
//             ✅ Payment Successful!
//           </h2>
//         ) : paymentData.status === "DECLINED" ? (
//           <h2 className="text-red-600 font-bold text-lg">
//             ❌ Payment Declined
//           </h2>
//         ) : (
//           <h2 className="text-yellow-600 font-bold text-lg">
//             ⏳ Payment Pending...
//           </h2>
//         )}
//         <p className="my-4">
//           <span className="text-lg font-bold text-gray-600">
//             Reference Code
//           </span>{" "}
//           : {paymentData.referenceCode}
//         </p>
//         <p className="my-4">
//           <span className="text-lg font-bold text-gray-600">Message</span> :{" "}
//           {paymentData.message}
//         </p>
//         <p className="my-4">
//           <span className="text-lg font-bold text-gray-600">Description</span> :{" "}
//           {paymentData.description}
//         </p>
//         <p className="my-4">
//           <span className="text-lg font-bold text-gray-600">Buyer Email</span> :{" "}
//           {paymentData.buyerEmail}
//         </p>
//         <p className="my-4">
//           <span className="text-lg font-bold text-gray-600">
//             Payment Method
//           </span>{" "}
//           : {paymentData.paymentMethod}
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import { Check, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ThankYouPage() {
  const t = useTranslations("thankyou");
  const [showPage, setShowPage] = useState(true);
  const router = useRouter();

  const benefits = t.raw("benefits") as string[];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const referenceCode = params.get("referenceCode");
    const status = params.get("lapTransactionState");

    if (!referenceCode) {
      router.push("/pricing");
    } else {
      fetch(
        `/api/payments/confirmation?referenceCode=${referenceCode}&status=${status}`
      )
        .then((res) => res.json())
        .then(() => {
          setShowPage(false);
        });
    }
  }, []);

  if (showPage) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <Loader2Icon size={40} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 font-sf lg:px-8">
      <div className="max-w-3xl mx-auto overflow-hidden p-8">
        <div className="flex justify-center mb-10">
          <Image
            height={900}
            width={900}
            src="/images/logo.webp"
            alt="America Working Logo"
            className="h-24 w-auto"
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          {t("title")}
        </h1>

        <p className="text-lg text-center text-gray-600 mb-8 whitespace-pre-line">
          {t("caption")}
          <span className="fi fi-us ml-1 text-xl"></span>
          <br />
          <br />

          {t("caption2")}
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mb-12">
          <Link
            href="/"
            className="hidden md:inline-flex justify-center items-center bg-primary-blue cursor-pointer text-white w-60 md:h-14 h-12 text-lg py-2 rounded-full font-semibold hover:bg-white hover:text-primary-blue border border-primary-blue duration-300"
          >
            {t("button_job_search")}
          </Link>
          <Link
            href="/settings"
            className="hidden md:inline-flex justify-center items-center hover:bg-primary-blue cursor-pointer hover:text-white w-44 md:h-14 h-12 text-lg py-2 rounded-full font-semibold bg-white text-primary-blue border border-primary-blue duration-300"
          >
            {t("button_user_panel")}
          </Link>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {t("benefits_title")}
          </h2>
          <ul className="space-y-4">
            {benefits.map((text, index) => (
              <BenefitItem key={index} text={text} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <li className="flex items-start">
      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
      <span className="text-gray-700 text-lg">{text}</span>
    </li>
  );
}
