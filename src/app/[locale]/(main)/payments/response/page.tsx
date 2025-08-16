"use client";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";

export default function PaymentResponsePage() {
  const [paymentData, setPaymentData] = useState<null | {
    status: string;
    referenceCode: string;
    message: string;
    description: string;
    buyerEmail: string;
    paymentMethod: string;
  }>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const referenceCode = params.get("referenceCode");
    const status = params.get("lapTransactionState");
    const message = params.get("message");
    const description = params.get("description");
    const buyerEmail = params.get("buyerEmail");
    const paymentMethod = params.get("lapPaymentMethod");

    if (referenceCode) {
      fetch(
        `/api/payments/confirmation?referenceCode=${referenceCode}&status=${status}`
      )
        .then((res) => res.json())
        .then((data) => {
          setPaymentData({
            status: data.status,
            referenceCode: referenceCode || "",
            message: message || "",
            description: description || "",
            buyerEmail: buyerEmail || "",
            paymentMethod: paymentMethod || "",
          });
        });
    }
  }, []);

  if (!paymentData)
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <p className="text-xl font-bold flex items-center justify-center gap-3">
          <Loader2Icon size={40} className="animate-spin" />
          Loading payment status...
        </p>
      </div>
    );

  return (
    <div className="flex items-center justify-center h-[100vh] ">
      <div className="bg-gray-50 p-6 rounded-lg w-[500px]">
        <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
        {paymentData.status === "APPROVED" ? (
          <h2 className="text-green-600 font-bold text-lg">
            ✅ Payment Successful!
          </h2>
        ) : paymentData.status === "DECLINED" ? (
          <h2 className="text-red-600 font-bold text-lg">
            ❌ Payment Declined
          </h2>
        ) : (
          <h2 className="text-yellow-600 font-bold text-lg">
            ⏳ Payment Pending...
          </h2>
        )}
        <p className="my-4">
          <span className="text-lg font-bold text-gray-600">
            Reference Code
          </span>{" "}
          : {paymentData.referenceCode}
        </p>
        <p className="my-4">
          <span className="text-lg font-bold text-gray-600">Message</span> :{" "}
          {paymentData.message}
        </p>
        <p className="my-4">
          <span className="text-lg font-bold text-gray-600">Description</span> :{" "}
          {paymentData.description}
        </p>
        <p className="my-4">
          <span className="text-lg font-bold text-gray-600">Buyer Email</span> :{" "}
          {paymentData.buyerEmail}
        </p>
        <p className="my-4">
          <span className="text-lg font-bold text-gray-600">
            Payment Method
          </span>{" "}
          : {paymentData.paymentMethod}
        </p>
      </div>
    </div>
  );
}
