import { useCallback } from "react";
import { downloadRoomMap } from "../../roomMap/downloadRoomMap";
import { getErrorMessage } from "./getErrorMessage";

export const useDownloadRoomMap = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  setRenderingError: React.Dispatch<React.SetStateAction<string | null>>,
) =>
  useCallback(async () => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }
    try {
      await downloadRoomMap(canvas);
    } catch (error: unknown) {
      setRenderingError(getErrorMessage(error));
    }
  }, [canvasRef, setRenderingError]);
