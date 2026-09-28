import { CircleCheckIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@thinkalot/ui/components/button";
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>Count: {count}</p>
      <Button className="mt-2" onClick={() => setCount((prev) => prev + 1)}>
        <HugeiconsIcon icon={CircleCheckIcon} />
        Button
      </Button>
    </>
  );
}

export default App;
