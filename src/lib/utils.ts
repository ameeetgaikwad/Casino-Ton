import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function absoluteUrl(path: string = "/") {
  let baseUrl: string | null = null;
  if (typeof window !== "undefined") {
    baseUrl = window.location.origin;
  }
  console.log(baseUrl);
  return `${baseUrl ?? process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export const priceString = (amount: number = 0, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount / 100);

export const formatNumber = (num: number) =>
  new Intl.NumberFormat("en", { notation: "compact" }).format(num);


export const shortContractAddress = (contractAddress: string) => contractAddress.slice(0, 4) + "..." + contractAddress.slice(-4)



export const formatTwoDigit = (value: number) => Math.floor(value * 100) / 100 