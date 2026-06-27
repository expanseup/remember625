"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Brand } from "@/components/brand";

const links = [
  { href: "/quiz", label: "퀴즈" },
  { href: "/wall", label: "감사의 벽" },
  { href: "/about", label: "소개" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-navy/10 bg-warm-white/88 sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="page-shell flex h-16 items-center justify-between">
        <Brand compact />
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="주요 메뉴"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-navy/68 hover:text-navy hover:bg-navy/5 rounded-full px-4 py-2 text-[14px] font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="text-navy hover:bg-navy/5 flex size-11 items-center justify-center rounded-xl md:hidden"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <nav
          className="border-navy/8 bg-warm-white/96 border-t px-4 py-3 shadow-lg shadow-navy/5 md:hidden"
          aria-label="모바일 메뉴"
        >
          <div className="mx-auto flex max-w-md flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="hover:bg-navy/5 flex min-h-11 items-center rounded-xl px-3 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
