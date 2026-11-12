import { Link } from "@tanstack/react-router";

/** Shown when the question bank has no questions for today's date. */
export default function NoGameToday() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-rays pointer-events-none absolute inset-x-0 -top-40 h-[620px]"
      />

      <main className="relative mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-5 py-10">
        <section
          className="rounded-2xl border-3 border-black bg-white px-5 pb-5 pt-6 text-center text-black"
          style={{ boxShadow: "0 6px 0 0 #16181D" }}
        >
          <h1 className="font-poster text-[32px] uppercase leading-none">
            No game today
          </h1>
          <p className="mt-3 text-sm font-semibold text-black/70">
            Today's questions aren't ready yet. Check back later!
          </p>

          <Link
            to="/"
            style={{ boxShadow: "0 5px 0 0 #16181D" }}
            className="mt-6 flex w-full items-center justify-center whitespace-nowrap rounded-xl border-3 border-black bg-pink-500 px-7 py-3.5 text-[19px] uppercase leading-none tracking-[0.04em] text-white transition-[transform,box-shadow] duration-100 ease-out hover:-translate-y-0.5 active:translate-y-[5px] active:!shadow-none"
          >
            <span className="font-poster">Back home</span>
          </Link>
        </section>
      </main>
    </div>
  );
}
