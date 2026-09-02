import { useEffect, useState } from "react";
import type { useTooManyGamesData } from "../../context/useTooManyGamesData";
import { renderRoomMap } from "../../roomMap/renderRoomMap";
import { getErrorMessage } from "./getErrorMessage";

export const useRenderRoomMap = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  data: ReturnType<typeof useTooManyGamesData>["data"],
  attendeeNamesById: Map<string, string>,
) => {
  const [renderingError, setRenderingError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null || data === null) {
      return () => {};
    }

    let cancelled = false;
    setIsReady(false);
    setRenderingError(null);
    const loadAndRenderMap = async () => {
      try {
        const mapImage = new Image();
        mapImage.src = `${import.meta.env.BASE_URL}map.png`;
        await Promise.all([mapImage.decode(), document.fonts.ready]);
        if (!cancelled) {
          renderRoomMap(canvas, mapImage, data.roomAllocations, attendeeNamesById);
          setIsReady(true);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setRenderingError(getErrorMessage(error));
        }
      }
    };
    void loadAndRenderMap();

    return () => {
      cancelled = true;
    };
  }, [attendeeNamesById, canvasRef, data]);

  return { isReady, renderingError, setRenderingError };
};
