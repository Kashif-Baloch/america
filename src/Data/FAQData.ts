import { useTranslations } from "next-intl";

type T = ReturnType<typeof useTranslations>;

export const getFAQData = (t: T) => [
  {
    label: t("faq.tabs.general"),
    value: "general",
    faqs: [
      {
        question: t("faq.general.q1.question"),
        answer: t("faq.general.q1.answer"),
      },
      {
        question: t("faq.general.q2.question"),
        answer: t("faq.general.q2.answer"),
      },
      {
        question: t("faq.general.q3.question"),
        answer: t("faq.general.q3.answer"),
      },
      {
        question: t("faq.general.q4.question"),
        answer: t("faq.general.q4.answer"),
      },
      {
        question: t("faq.general.q5.question"),
        answer: t("faq.general.q5.answer"),
      },
      {
        question: t("faq.general.q6.question"),
        answer: t("faq.general.q6.answer"),
      },
      {
        question: t("faq.general.q7.question"),
        answer: t("faq.general.q7.answer"),
      },
      {
        question: t("faq.general.q8.question"),
        answer: t("faq.general.q8.answer"),
      },
      {
        question: t("faq.general.q9.question"),
        answer: t("faq.general.q9.answer"),
      },
    ],
  },
  {
    label: t("faq.tabs.timeline"),
    value: "timeline",
    faqs: [
      {
        question: t("faq.timeline.q1.question"),
        answer: t("faq.timeline.q1.answer"),
      },
      {
        question: t("faq.timeline.q2.question"),
        answer: t("faq.timeline.q2.answer"),
      },
      {
        question: t("faq.timeline.q3.question"),
        answer: t("faq.timeline.q3.answer"),
      },
      {
        question: t("faq.timeline.q4.question"),
        answer: t("faq.timeline.q4.answer"),
      },
      {
        question: t("faq.timeline.q5.question"),
        answer: t("faq.timeline.q5.answer"),
      },
      {
        question: t("faq.timeline.q6.question"),
        answer: t("faq.timeline.q6.answer"),
      },
      {
        question: t("faq.timeline.q7.question"),
        answer: t("faq.timeline.q7.answer"),
      },
      {
        question: t("faq.timeline.q8.question"),
        answer: t("faq.timeline.q8.answer"),
      },
    ],
  },
  {
    label: t("faq.tabs.workerRequirements"),
    value: "worker-requirements",
    faqs: [
      {
        question: t("faq.workerRequirements.q1.question"),
        answer: t("faq.workerRequirements.q1.answer"),
      },
      {
        question: t("faq.workerRequirements.q2.question"),
        answer: t("faq.workerRequirements.q2.answer"),
      },
      {
        question: t("faq.workerRequirements.q3.question"),
        answer: t("faq.workerRequirements.q3.answer"),
      },
      {
        question: t("faq.workerRequirements.q4.question"),
        answer: t("faq.workerRequirements.q4.answer"),
      },
      {
        question: t("faq.workerRequirements.q5.question"),
        answer: t("faq.workerRequirements.q5.answer"),
      },
      {
        question: t("faq.workerRequirements.q6.question"),
        answer: t("faq.workerRequirements.q6.answer"),
      },
      {
        question: t("faq.workerRequirements.q7.question"),
        answer: t("faq.workerRequirements.q7.answer"),
      },
      {
        question: t("faq.workerRequirements.q8.question"),
        answer: t("faq.workerRequirements.q8.answer"),
      },
      {
        question: t("faq.workerRequirements.q9.question"),
        answer: t("faq.workerRequirements.q9.answer"),
      },
    ],
  },

  {
    label: t("faq.tabs.contacts"),
    value: "contacts",
    faqs: [
      {
        question: t("faq.contracts.q1.question"),
        answer: t("faq.contracts.q1.answer"),
      },
      {
        question: t("faq.contracts.q2.question"),
        answer: t("faq.contracts.q2.answer"),
      },
      {
        question: t("faq.contracts.q3.question"),
        answer: t("faq.contracts.q3.answer"),
      },
      {
        question: t("faq.contracts.q4.question"),
        answer: t("faq.contracts.q4.answer"),
      },
      {
        question: t("faq.contracts.q5.question"),
        answer: t("faq.contracts.q5.answer"),
      },
      {
        question: t("faq.contracts.q6.question"),
        answer: t("faq.contracts.q6.answer"),
      },
      {
        question: t("faq.contracts.q7.question"),
        answer: t("faq.contracts.q7.answer"),
      },
      {
        question: t("faq.contracts.q8.question"),
        answer: t("faq.contracts.q8.answer"),
      },
    ],
  },
  {
    label: t("faq.tabs.consularProcess"),
    value: "consular-process",
    faqs: [
      {
        question: t("faq.consularProcess.q1.question"),
        answer: t("faq.consularProcess.q1.answer"),
      },
      {
        question: t("faq.consularProcess.q2.question"),
        answer: t("faq.consularProcess.q2.answer"),
      },
      {
        question: t("faq.consularProcess.q3.question"),
        answer: t("faq.consularProcess.q3.answer"),
      },
      {
        question: t("faq.consularProcess.q4.question"),
        answer: t("faq.consularProcess.q4.answer"),
      },
      {
        question: t("faq.consularProcess.q5.question"),
        answer: t("faq.consularProcess.q5.answer"),
      },
      {
        question: t("faq.consularProcess.q6.question"),
        answer: t("faq.consularProcess.q6.answer"),
      },
      {
        question: t("faq.consularProcess.q7.question"),
        answer: t("faq.consularProcess.q7.answer"),
      },
    ],
  },
  {
    label: t("faq.tabs.extensions"),
    value: "extensions",
    faqs: [
      {
        question: t("faq.extensions.q1.question"),
        answer: t("faq.extensions.q1.answer"),
      },
      {
        question: t("faq.extensions.q2.question"),
        answer: t("faq.extensions.q2.answer"),
      },
      {
        question: t("faq.extensions.q3.question"),
        answer: t("faq.extensions.q3.answer"),
      },
      {
        question: t("faq.extensions.q4.question"),
        answer: t("faq.extensions.q4.answer"),
      },
      {
        question: t("faq.extensions.q5.question"),
        answer: t("faq.extensions.q5.answer"),
      },
      {
        question: t("faq.extensions.q6.question"),
        answer: t("faq.extensions.q6.answer"),
      },
      {
        question: t("faq.extensions.q7.question"),
        answer: t("faq.extensions.q7.answer"),
      },
      {
        question: t("faq.extensions.q8.question"),
        answer: t("faq.extensions.q8.answer"),
      },
    ],
  },
  {
    label: t("faq.tabs.laborRights"),
    value: "labor-rights",
    faqs: [
      {
        question: t("faq.laborRights.q1.question"),
        answer: t("faq.laborRights.q1.answer"),
      },
      {
        question: t("faq.laborRights.q2.question"),
        answer: t("faq.laborRights.q2.answer"),
      },
      {
        question: t("faq.laborRights.q3.question"),
        answer: t("faq.laborRights.q3.answer"),
      },
      {
        question: t("faq.laborRights.q4.question"),
        answer: t("faq.laborRights.q4.answer"),
      },
      {
        question: t("faq.laborRights.q5.question"),
        answer: t("faq.laborRights.q5.answer"),
      },
      {
        question: t("faq.laborRights.q6.question"),
        answer: t("faq.laborRights.q6.answer"),
      },
      {
        question: t("faq.laborRights.q7.question"),
        answer: t("faq.laborRights.q7.answer"),
      },
      {
        question: t("faq.laborRights.q8.question"),
        answer: t("faq.laborRights.q8.answer"),
      },
      {
        question: t("faq.laborRights.q9.question"),
        answer: t("faq.laborRights.q9.answer"),
      },
    ],
  },
  {
    label: t("faq.tabs.salaryPayment"),
    value: "salary-payment",
    faqs: [
      {
        question: t("faq.salaryPayment.q1.question"),
        answer: t("faq.salaryPayment.q1.answer"),
      },
      {
        question: t("faq.salaryPayment.q2.question"),
        answer: t("faq.salaryPayment.q2.answer"),
      },
      {
        question: t("faq.salaryPayment.q3.question"),
        answer: t("faq.salaryPayment.q3.answer"),
      },
      {
        question: t("faq.salaryPayment.q4.question"),
        answer: t("faq.salaryPayment.q4.answer"),
      },
      {
        question: t("faq.salaryPayment.q5.question"),
        answer: t("faq.salaryPayment.q5.answer"),
      },
      {
        question: t("faq.salaryPayment.q6.question"),
        answer: t("faq.salaryPayment.q6.answer"),
      },
      {
        question: t("faq.salaryPayment.q7.question"),
        answer: t("faq.salaryPayment.q7.answer"),
      },
      {
        question: t("faq.salaryPayment.q8.question"),
        answer: t("faq.salaryPayment.q8.answer"),
      },
      {
        question: t("faq.salaryPayment.q9.question"),
        answer: t("faq.salaryPayment.q9.answer"),
      },
    ],
  },
  {
    label: t("faq.tabs.lifeInUs"),
    value: "life-in-us",
    faqs: [
      {
        question: t("faq.lifeInUs.q1.question"),
        answer: t("faq.lifeInUs.q1.answer"),
      },
      {
        question: t("faq.lifeInUs.q2.question"),
        answer: t("faq.lifeInUs.q2.answer"),
      },
      {
        question: t("faq.lifeInUs.q3.question"),
        answer: t("faq.lifeInUs.q3.answer"),
      },
      {
        question: t("faq.lifeInUs.q4.question"),
        answer: t("faq.lifeInUs.q4.answer"),
      },
      {
        question: t("faq.lifeInUs.q5.question"),
        answer: t("faq.lifeInUs.q5.answer"),
      },
      {
        question: t("faq.lifeInUs.q6.question"),
        answer: t("faq.lifeInUs.q6.answer"),
      },
      {
        question: t("faq.lifeInUs.q7.question"),
        answer: t("faq.lifeInUs.q7.answer"),
      },
      {
        question: t("faq.lifeInUs.q8.question"),
        answer: t("faq.lifeInUs.q8.answer"),
      },
      {
        question: t("faq.lifeInUs.q9.question"),
        answer: t("faq.lifeInUs.q9.answer"),
      },
    ],
  },
  {
    label: t("faq.tabs.safetyRisks"),
    value: "safety-risks",
    faqs: [
      {
        question: t("faq.safetyRisks.q1.question"),
        answer: t("faq.safetyRisks.q1.answer"),
      },
      {
        question: t("faq.safetyRisks.q2.question"),
        answer: t("faq.safetyRisks.q2.answer"),
      },
      {
        question: t("faq.safetyRisks.q3.question"),
        answer: t("faq.safetyRisks.q3.answer"),
      },
      {
        question: t("faq.safetyRisks.q4.question"),
        answer: t("faq.safetyRisks.q4.answer"),
      },
      {
        question: t("faq.safetyRisks.q5.question"),
        answer: t("faq.safetyRisks.q5.answer"),
      },
      {
        question: t("faq.safetyRisks.q6.question"),
        answer: t("faq.safetyRisks.q6.answer"),
      },
    ],
  },
];
