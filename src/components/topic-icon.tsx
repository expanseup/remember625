import type { QuizCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const iconPaths: Record<QuizCategory, ReactNode> = {
  mixed: (
    <>
      <circle cx="12" cy="12" r="2.2" />
      <circle cx="6.2" cy="8" r="1.5" />
      <circle cx="17.8" cy="8" r="1.5" />
      <circle cx="7.6" cy="17" r="1.5" />
      <circle cx="16.4" cy="17" r="1.5" />
    </>
  ),
  battle: (
    <>
      <path d="M5 18.5c3.4-4.2 5.9-5.4 10.2-5.8" />
      <path d="M7.2 5.5h9.6l1.2 4.2c-2.2 1-4.1 1.3-6 1.3s-3.8-.3-6-1.3z" />
      <path d="M12 5.5v7.2" />
      <path d="M15.4 15.8h3" />
      <path d="M4.8 15.8h3" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8.2" r="3.1" />
      <path d="M5.7 18.8c1.2-3.2 3.3-4.8 6.3-4.8s5.1 1.6 6.3 4.8" />
      <path d="M8.8 18.8h6.4" />
    </>
  ),
  chronology: (
    <>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 8.2v4.1l2.8 1.7" />
      <path d="M5 12H3.5" />
      <path d="M20.5 12H19" />
      <path d="M12 3.5V5" />
    </>
  ),
  un: (
    <>
      <circle cx="12" cy="12" r="5.2" />
      <path d="M6.8 12h10.4" />
      <path d="M12 6.8c1.5 1.5 2.2 3.2 2.2 5.2s-.7 3.7-2.2 5.2" />
      <path d="M12 6.8c-1.5 1.5-2.2 3.2-2.2 5.2s.7 3.7 2.2 5.2" />
      <path d="M4.8 16.8c-1.2-2.9-1.2-6.1 0-9" />
      <path d="M19.2 16.8c1.2-2.9 1.2-6.1 0-9" />
    </>
  ),
  memorial: (
    <>
      <path d="M12 16.4v3.2" />
      <path d="M12 7.3c1.4-2.1 3.8-1.8 4.4.2.6 2-1.2 3.9-4.4 4.7" />
      <path d="M12 7.3C10.6 5.2 8.2 5.5 7.6 7.5 7 9.5 8.8 11.4 12 12.2" />
      <path d="M12 12.2c-2.6.3-4.2 2.1-3.4 4 .8 1.9 3.2 1.7 3.4-1" />
      <path d="M12 12.2c2.6.3 4.2 2.1 3.4 4-.8 1.9-3.2 1.7-3.4-1" />
    </>
  ),
};

export function TopicIcon({
  category,
  className,
}: {
  category: QuizCategory;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn("size-5", className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
    >
      {iconPaths[category]}
    </svg>
  );
}
