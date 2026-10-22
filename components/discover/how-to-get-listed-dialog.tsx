"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mainAppUrl } from "@/lib/main-app";

/**
 * Dialog explaining how builders get listed in the directory. Triggered from
 * the stats banner header or the empty state message. Lists the three criteria
 * (complete profile, public profile, real work) and provides a link to the
 * main app's profile settings.
 */
export function HowToGetListedDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How to get listed</DialogTitle>
          <DialogDescription>
            Builders appear in the directory when they meet these requirements:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-sm text-foreground">
          <div className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-600">
              1
            </div>
            <p>
              Complete profile with a username, photo, and at least one skill
            </p>
          </div>

          <div className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-600">
              2
            </div>
            <p>Public profile</p>
          </div>

          <div className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-600">
              3
            </div>
            <p>
              Real work on Boundless: a published project you created or joined,
              a hackathon entry, a bounty submission, or a bounty, quest, or
              grant award
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button asChild intent="primary" className="flex-1" type="button">
            <a href={mainAppUrl("/settings/profile")}>Go to profile settings</a>
          </Button>
          <DialogClose asChild>
            <Button
              intent="secondary"
              appearance="outline"
              className="flex-1"
              type="button"
            >
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
