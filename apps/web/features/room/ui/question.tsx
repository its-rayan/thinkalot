import { Button } from "@/components/ui/button";

export default function RoomQuestion() {
  const questionIndex = 1;
  const question =
    "What is the capital of France What is the capital of France What is the capital of France?";

  const options = ["Paris", "London", "Berlin", "Madrid"];
  return (
    <div className="flex w-full justify-center">
      <div className="w-120 flex flex-col items-center gap-4">
        <p className="uppercase text-sm text-muted-foreground/80 font-semibold tracking-wide">
          Question {questionIndex} of 10
        </p>
        <h1 className="text-xl font-semibold text-center">{question}</h1>
        <div className="flex flex-col w-full gap-2">
          {options.map((option, index) => (
            <Button key={index} variant="outline" className="cursor-pointer">
              {option}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
