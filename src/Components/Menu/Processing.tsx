import { useEffect, useState } from "react";

const MS_IN_SEC = 1000;
const INTERVAL = 400;

interface Props {
  ms: number;
}

export const Processing = ({ ms }: Props) => {
  const [remaining, setRemaining] = useState<number>(Math.floor(ms / MS_IN_SEC));

  useEffect(() => {
    const end = new Date(new Date().getTime() + ms).getTime();
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const updateTime = () => {
      const msRemaining = end - new Date().getTime();
      const sRemaining = Math.floor(msRemaining / MS_IN_SEC);
      setRemaining(sRemaining);
      if (sRemaining > 0) {
        timeoutId = setTimeout(updateTime, INTERVAL);
      }
    };

    updateTime();

    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [ms]);

  return (
    <dialog className="modal processing" closedby="none" open>
      <p>Computing the best possible schedule in {remaining} seconds or less</p>
    </dialog>
  );
};
