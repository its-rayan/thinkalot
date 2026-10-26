import { Rotate01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function Results() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-rays pointer-events-none absolute inset-x-0 -top-40 h-[620px]"
      />

      <main className="relative mx-auto flex min-h-screen w-full max-w-sm flex-col gap-8 px-5 py-10 pt-25">
        <header className="flex flex-col items-center text-center">
          <p className="font-poster text-[16px] uppercase tracking-[0.06em] text-white/80">
            Game complete
          </p>
          <h1 className="text-poster-sm mt-2 text-[46px] uppercase leading-none text-white">
            Not bad!
          </h1>

          <div
            className="mt-6 rounded-xl border-3 border-black bg-pink-500 px-8 py-4"
            style={{ boxShadow: "0 6px 0 0 #16181D" }}
          >
            <p className="text-poster-2xs text-[14px] uppercase text-white">
              Score
            </p>
            <p className="text-poster mt-1 text-[64px] leading-none text-white">
              5/10
            </p>
          </div>
        </header>
        <div className="flex flex-col gap-3 items-center">
          <button
            type="button"
            className={`
                flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border-3 border-black uppercase leading-none tracking-[0.04em] 
                px-7 py-3.5 text-[19px]
                bg-pink-500 hover:-translate-y-0.5 active:translate-y-[5px] active:!shadow-none
                w-full
            `}
            style={{ boxShadow: `0 5px 0 0 #16181D` }}
          >
            <span className={`flex items-center gap-2 font-poster`}>
              <HugeiconsIcon icon={Rotate01Icon} size={16} strokeWidth={3} />
              Play again
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}
