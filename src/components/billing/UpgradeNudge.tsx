import { Icons } from "@/components/ui";

interface UpgradeNudgeProps {
  /** Short label describing what's locked, e.g. "Model & Tone" */
  feature?: string;
}

/**
 * Inline banner shown to free users inside gated sections.
 * Replaces the setTimeout-based toast pattern with a simple
 * always-visible nudge that links to the billing settings.
 */
export default function UpgradeNudge({ feature }: UpgradeNudgeProps) {
  return (
    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
      <Icons.Crown className="h-4 w-4 text-amber-500 flex-shrink-0" />
      <p className="text-sm text-amber-700 flex-1">
        {feature ? `${feature} is` : "This is"} a Pro feature.{" "}
        <a
          href="/settings"
          className="font-semibold underline underline-offset-2"
        >
          Upgrade in Settings
        </a>{" "}
        to unlock.
      </p>
    </div>
  );
}
