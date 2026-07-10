'use client';

import type { ReactNode } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

type DetailDrawerProps = {
  open: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  onOpenChange: (open: boolean) => void;
};

export function DetailDrawer({
  open,
  title,
  description,
  children,
  onOpenChange,
}: DetailDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full border-white/10 bg-douyin-dark text-white sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="text-white">{title}</SheetTitle>
          {description ? (
            <SheetDescription className="text-slate-400">{description}</SheetDescription>
          ) : null}
        </SheetHeader>
        <div className="mt-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
