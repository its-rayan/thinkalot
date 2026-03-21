import RoomQuestion from "@/features/room/ui/question";
import QuestionTimer from "@/features/room/ui/question-timer";

export default function RoomPage() {
  return (
    <div className="flex flex-col w-full gap-4">
      <QuestionTimer />
      <RoomQuestion />
    </div>
  );
}
