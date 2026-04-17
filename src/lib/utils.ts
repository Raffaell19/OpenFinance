import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatDate = (date: string | Date) => {
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(date)) {
    // If it's a YYYY-MM-DD string (optionally with time), parse components
    const [year, month, day] = date.split('T')[0].split('-').map(Number);
    return new Intl.DateTimeFormat("pt-BR").format(new Date(year, month - 1, day));
  }
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
};
