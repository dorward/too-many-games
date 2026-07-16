import { useContext } from "react";
import { autoSolve } from "../../scheduler/autoSolve";
import { TooManyGamesContext } from "../../context/TooManyGamesContext";

export const useUploadData = () => {
  const context = useContext(TooManyGamesContext);
  const onSave = () => {
    if (context === null) {
      throw new Error("Unexpected missing context");
    }
    const json = JSON.stringify(context.data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "eventData.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const onLoad = () => {
    if (context === null) {
      throw new Error("Unexpected missing context");
    }
    if (confirm("Discard all data and return to the load screen?")) {
      context.setData(null);
    }
  };

  const onSchedule = () => {
    if (context === null) {
      throw new Error("Unexpected missing context");
    }

    if (!context.data) {
      alert("Missing event information. Cannot schedule");
      return;
    }

    if (confirm("Run auto-scheduler?")) {
      const events = autoSolve(context.data);
      context.setData({ ...context.data, events });
    }
  };

  return { onLoad, onSave, onSchedule };
};
