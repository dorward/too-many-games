const canvasToBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob === null) {
        reject(new Error("Could not create the room map PNG"));
      } else {
        resolve(blob);
      }
    }, "image/png");
  });

export const downloadRoomMap = async (canvas: HTMLCanvasElement) => {
  const blob = await canvasToBlob(canvas);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "room-allocations.png";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
