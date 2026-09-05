const INITIAL_GROUP = /^\p{Lu}+(?:-\p{Lu}+)*$/u;

export const getAttendeeInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/u)
    .map((part, index) => (index > 0 && INITIAL_GROUP.test(part) ? part : Array.from(part)[0]))
    .join("");
