import { FlameIcon, ZapIcon } from "@hugeicons/core-free-icons";
import type { IconSvgObject } from "@hugeicons/core-free-icons/types";
import { HugeiconsIcon } from "@hugeicons/react";

const IconType = {
  flame: "flame",
  zap: "zap",
  question: "question",
};

const ICON_TYPE: { [key in keyof typeof IconType]: IconSvgObject | string } = {
  flame: FlameIcon,
  zap: ZapIcon,
  question: "?",
};

const BADGE_BG_COLOR: {
  [key in keyof typeof IconType]: IconSvgObject | string;
} = {
  flame: "bg-yellow-400",
  zap: "bg-cyan-500",
  question: "bg-pink-500",
};

interface RoundHeaderBadge {
  type: keyof typeof IconType;
  children: React.ReactNode;
}

export default function RoundHeaderBadge({ type, children }: RoundHeaderBadge) {
  return (
    <span
      className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 bg-indigo-800`}
    >
      <span aria-hidden="true" className="flex">
        <span
          className={`grid h-5 w-5 place-items-center rounded-[5px] border-2 border-black text-black ${[BADGE_BG_COLOR[type]]}`}
        >
          {typeof ICON_TYPE[type] === "string" ? (
            <span className="font-poster text-xs">{ICON_TYPE[type]}</span>
          ) : (
            <HugeiconsIcon
              icon={ICON_TYPE[type]}
              className="h-4 w-4"
              strokeWidth={2}
            />
          )}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="text-poster-2xs text-[16px] leading-none text-white"
      >
        {children}
      </span>
    </span>
  );
}
