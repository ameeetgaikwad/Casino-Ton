import { useTransition as _useTransition, useCallback } from "react";
import { toast } from "sonner";

export const useTransition = () => {
  const [isPending, _startTransition] = _useTransition();
  const startTransition = (callback: () => Promise<any>) => {
    _startTransition(async () => {
      try {
        await callback();
      } catch (e: any) {
        toast.error(e.message);
      }
    });
  };
  return [isPending, startTransition] as const;
};