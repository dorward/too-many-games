import type { Event } from "../types";

export const eventHasParticipant = (event: Event, participantId: string) =>
  event.facilitator === participantId || event.players.includes(participantId);
