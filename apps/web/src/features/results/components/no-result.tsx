import { Link } from "@tanstack/react-router";
import { formatGameDate } from "../share-score";

type NoResult =
  | { reason: "invalid-date" }
  | {
      reason: "not-played" | "not-played-today" | "in-progress";
      date: string;
    };

const BUTTON_CLASSES =
  "mt-6 flex w-full items-center justify-center whitespace-nowrap rounded-xl border-3 border-black px-7 py-3.5 text-[19px] uppercase leading-none tracking-[0.04em] transition-[transform,box-shadow] duration-100 ease-out hover:-translate-y-0.5 active:translate-y-[5px] active:!shadow-none";

function getCopy(props: NoResult) {
  switch (props.reason) {
    case "invalid-date":
      return {
        title: "Game not found",
        message: "That doesn't look like a valid game date.",
      };
    case "in-progress":
      return {
        title: "Not finished yet",
        message:
          "You're partway through today's game. Finish it to see your result!",
      };
    case "not-played-today":
      return {
        title: "No result yet",
        message: "You haven't played today's game yet.",
      };
    case "not-played":
      return {
        title: "No result",
        message: `You don't have a result for the ${formatGameDate(props.date)} game.`,
      };
  }
}

/** Shown on the results page when there's no finished game for the date. */
export default function NoResult(props: NoResult) {
  const { title, message } = getCopy(props);
  const canPlay =
    props.reason === "in-progress" || props.reason === "not-played-today";

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
            {title}
          </h1>
          <p className="mt-3 text-sm font-semibold text-black/70">{message}</p>

          {canPlay ? (
            <Link
              to="/games/daily"
              style={{ boxShadow: "0 5px 0 0 #16181D" }}
              className={`${BUTTON_CLASSES} bg-pink-500 text-white`}
            >
              <span className="font-poster">
                {props.reason === "in-progress"
                  ? "Continue game"
                  : "Play today's game"}
              </span>
            </Link>
          ) : (
            <Link
              to="/"
              style={{ boxShadow: "0 5px 0 0 #16181D" }}
              className={`${BUTTON_CLASSES} bg-pink-500 text-white`}
            >
              <span className="font-poster">Back home</span>
            </Link>
          )}
        </section>
      </main>
    </div>
  );
}
