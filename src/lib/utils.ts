import { Rating } from "@prisma/client";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const VALID_DOMAINS = () => {
  const domains = ["gmail.com", "yahoo.com", "outlook.com"];

  if (process.env.NODE_ENV === "development") {
    domains.push("example.com")
  }

  return domains

}

export function normalizeName(name: string) {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-zA-Z\s'-]/g, "")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

type HasLanguage = { language: string };

export function getTranslation<T extends HasLanguage>(
  translations: T[],
  locale: string,
  fallback: string = "en"
): T | undefined {
  return (
    translations.find(t => t.language === locale) ??
    translations.find(t => t.language === fallback) ??
    translations[0]
  );
}

export function ratingToNumber(rating: Rating): number {
  switch (rating) {
    case "One": return 1;
    case "Two": return 2;
    case "Three": return 3;
    case "Four": return 4;
    case "Five": return 5;
  }
}
