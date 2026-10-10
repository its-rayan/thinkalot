import RoundHeaderBadge from "./round-header-badge";

export default function RoundHeader() {
  return (
    <header className="flex items-center gap-2">
      <RoundHeaderBadge type="question">2/10</RoundHeaderBadge>
      <RoundHeaderBadge type="flame">5</RoundHeaderBadge>
      <span className="hidden text-poster text-sm uppercase tracking-[0.06em] text-indigo-200 sm:inline">
        Daily Game
      </span>
      <div className="flex-1" />
      <RoundHeaderBadge type="zap">5</RoundHeaderBadge>
      <button
        type="button"
        style={{ boxShadow: "0 3px 0 0 #16181D" }}
        className={`grid h-auto w-auto shrink-0 place-items-center rounded-lg border-3 border-black transition-[transform,box-shadow] duration-100 ease-out hover:-translate-y-0.5 active:translate-y-[3px] active:!shadow-none bg-indigo-400 text-black px-2 py-1/5 font-medium`}
      >
        Quit Game
      </button>
    </header>
  );
}
