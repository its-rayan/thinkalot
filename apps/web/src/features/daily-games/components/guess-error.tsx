interface GuessError {
  onRetry: () => void;
}

/** Shown in place of the answer reveal when checking a guess fails. */
export default function GuessError({ onRetry }: GuessError) {
  return (
    <div
      role="alert"
      className="mt-8 overflow-hidden rounded-xl border-3 border-black bg-red-500"
      style={{ boxShadow: "0 5px 0 0 #16181D" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
        <div className="min-w-0">
          <p className="text-poster-xs text-2xl uppercase leading-none text-white">
            Something went wrong
          </p>
          <p className="mt-1.5 text-sm font-semibold text-white/90">
            We couldn't check your answer. Please try again.
          </p>
        </div>

        <button
          type="button"
          onClick={onRetry}
          style={{ boxShadow: "0 4px 0 0 #16181D" }}
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border-3 border-black bg-white px-4 py-2.5 text-[15px] uppercase leading-none tracking-[0.04em] text-black transition-[transform,box-shadow] duration-100 ease-out hover:-translate-y-0.5 active:translate-y-[5px] active:!shadow-none"
        >
          <span className="font-poster">Try again</span>
        </button>
      </div>
    </div>
  );
}
