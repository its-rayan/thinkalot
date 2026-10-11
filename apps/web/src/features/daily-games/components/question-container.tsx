interface QuestionContainer {
  prompt: string;
  children: React.ReactNode;
}

export default function QuestionContainer({
  prompt,
  children,
}: QuestionContainer) {
  return (
    <div className="grid flex-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="flex flex-col gap-7">
        <section
          className="relative rounded-2xl border-3 border-black bg-white px-5 pb-6 pt-8 text-black sm:px-7"
          style={{ boxShadow: "0 6px 0 0 #16181D" }}
        >
          <h1 className="mt-5 text-2xl font-black leading-[1.28] tracking-[-0.01em] sm:text-[30px]">
            {prompt}
          </h1>

          <div className="mt-6">{children}</div>
        </section>
      </div>
    </div>
  );
}
