import { useEffect, useRef } from "react";

interface QuitGameDialog {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Asks the player to confirm before quitting, since quitting deletes their
 * progress. Uses the native <dialog> element for focus trapping, Escape to
 * close and the backdrop. showModal() focuses the first button in the DOM,
 * "Keep playing", so an accidental Enter doesn't quit.
 */
export default function QuitGameDialog({
  open,
  onCancel,
  onConfirm,
}: QuitGameDialog) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    // Backdrop clicks close the dialog; keyboard users get the same via
    // Escape, which <dialog> handles natively.
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape is the keyboard equivalent
    <dialog
      ref={dialogRef}
      aria-labelledby="quit-game-title"
      aria-describedby="quit-game-description"
      // Fires on Escape as well as dialog.close().
      onClose={() => {
        if (open) onCancel();
      }}
      // Clicking the backdrop (outside the card) dismisses the dialog.
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
      className="m-auto w-[calc(100%-2.5rem)] max-w-sm overflow-visible bg-transparent p-0 backdrop:bg-black/60"
    >
      <div
        className="rounded-2xl border-3 border-black bg-white px-5 pb-5 pt-6 text-black"
        style={{ boxShadow: "0 6px 0 0 #16181D" }}
      >
        <h2
          id="quit-game-title"
          className="font-poster text-[28px] uppercase leading-none"
        >
          Quit game?
        </h2>
        <p
          id="quit-game-description"
          className="mt-3 text-sm font-semibold text-black/70"
        >
          Your progress for today's game will be lost.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            style={{ boxShadow: "0 4px 0 0 #16181D" }}
            className="flex flex-1 items-center justify-center whitespace-nowrap rounded-xl border-3 border-black bg-white px-4 py-2.5 text-[15px] uppercase leading-none tracking-[0.04em] text-black transition-[transform,box-shadow] duration-100 ease-out hover:-translate-y-0.5 active:translate-y-[4px] active:!shadow-none"
          >
            <span className="font-poster">Keep playing</span>
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{ boxShadow: "0 4px 0 0 #16181D" }}
            className="flex flex-1 items-center justify-center whitespace-nowrap rounded-xl border-3 border-black bg-red-500 px-4 py-2.5 text-[15px] uppercase leading-none tracking-[0.04em] text-white transition-[transform,box-shadow] duration-100 ease-out hover:-translate-y-0.5 active:translate-y-[4px] active:!shadow-none"
          >
            <span className="font-poster">Quit</span>
          </button>
        </div>
      </div>
    </dialog>
  );
}
