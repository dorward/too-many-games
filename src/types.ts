import type { Dispatch, SetStateAction } from "react";
import { type FromSchema } from "json-schema-to-ts";

const attendeeSchema = {
  additionalProperties: false,
  properties: {
    id: { type: "string" },
    name: { type: "string" },
  },
  required: ["name", "id"],
  type: "object",
} as const;

const locationSchema = {
  additionalProperties: false,
  properties: {
    autoAllocation: { type: "boolean" },
    id: { type: "string" },
    name: { type: "string" },
  },
  required: ["name", "autoAllocation", "id"],
  type: "object",
} as const;

const eventSchema = {
  additionalProperties: false,
  properties: {
    facilitator: { type: "string" },
    id: { type: "string" },
    length: { type: "number" },
    location: { type: "string" },
    name: { type: "string" },
    notes: { type: "string" },
    playerCount: {
      additionalProperties: false,
      properties: {
        desirable: { type: "number" },
        max: { type: "number" },
        min: { type: "number" },
      },
      required: ["min", "desirable", "max"],
      type: "object",
    },
    players: {
      items: { type: "string" },
      type: "array",
    },
    preferredSpace: {
      items: { type: "string" },
      type: "array",
    },
    startSlot: {
      pattern: "^\\d{4}-\\d{2}-\\d{2}-[1-3]$",
      type: "string",
    },
    waitList: {
      items: { type: "string" },
      type: "array",
    },
  },
  required: [
    "name",
    "notes",
    "length",
    "facilitator",
    "preferredSpace",
    "playerCount",
    "players",
    "waitList",
    "id",
  ],
  type: "object",
} as const;

const datesSchema = {
  additionalProperties: false,
  properties: {
    end: { format: "date-time", type: "string" },
    start: { format: "date-time", type: "string" },
  },
  required: ["start", "end"],
  type: "object",
} as const;

export const appDataSchema = {
  additionalProperties: false,
  properties: {
    attendees: {
      items: attendeeSchema,
      type: "array",
    },
    dates: datesSchema,
    events: {
      items: eventSchema,
      type: "array",
    },
    locations: {
      items: locationSchema,
      type: "array",
    },
  },
  required: ["attendees", "locations", "events", "dates"],
  type: "object",
} as const;

export type Attendee = FromSchema<typeof attendeeSchema>;
export type Location = FromSchema<typeof locationSchema>;
export type Event = FromSchema<typeof eventSchema>;
export interface Dates {
  start: Date;
  end: Date;
}
export type AppData = Omit<FromSchema<typeof appDataSchema>, "dates"> & {
  dates: Dates;
};

export type SlotId = Exclude<Event["startSlot"], undefined>;

export interface ContextValue {
  data: null | AppData;
  setData: Dispatch<SetStateAction<AppData | null>>;
  updateEvent: (eventId: string, update: Partial<Event>) => void;
}

export type View = "attendees" | "event-list" | "event-grid" | "schedules";
const views: View[] = ["attendees", "event-list", "event-grid", "schedules"];
export const isView = (potential: string): potential is View =>
  (views as readonly string[]).includes(potential);

export type OrganisedScheduleSlots = Record<string, (Event | null | undefined)[]>;
export type OrganisedScheduleDays = Record<string, OrganisedScheduleSlots>;

export interface EventWithScheduleHelpers {
  candidateStartIndexes: number[];
  fallbackLocs: LocationChoice[];
  event: Event;
  isRequired: boolean;
  length: number;
  participantCount: number;
  participantMask: bigint;
  preferredLocs: LocationChoice[];
}

export interface LocationChoice {
  id: string;
  mask: bigint;
}

export interface Store {
  assignments: Map<
    string,
    {
      startSlot: string;
      location: string;
    }
  >;
  slotLocationMasks: bigint[];
  slotPlayerMasks: bigint[];
}

export type Assignment = Pick<Event, "startSlot" | "location">;

export interface Limits {
  startTime: number;
  timeLimit: number;
}
