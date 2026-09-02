export const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Could not render the room map";
