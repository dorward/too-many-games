import type { PrintOrientation } from "./printPageOrientations";

interface PrintPageOrientationProps {
  orientation: PrintOrientation;
}

export const PrintPageOrientation = ({ orientation }: PrintPageOrientationProps) => (
  <style media="print">{`@page { size: ${orientation}; }`}</style>
);
