import type { Dispatch, SetStateAction } from "react";
import { type FromSchema } from "json-schema-to-ts";

const attendeeSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    id: { type: "string" },
  },
  required: ["name", "id"],
  additionalProperties: false,
} as const;

const locationSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    autoAllocation: { type: "boolean" },
    id: { type: "string" },
  },
  required: ["name", "autoAllocation", "id"],
  additionalProperties: false,
} as const;

const gameSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    notes: { type: "string" },
    length: { type: "number" },
    facilitator: { type: "string" },
    preferredSpace: {
      type: "array",
      items: { type: "string" },
    },
    playerCount: {
      type: "object",
      properties: {
        min: { type: "number" },
        desirable: { type: "number" },
        max: { type: "number" },
      },
      required: ["min", "desirable", "max"],
      additionalProperties: false,
    },
    players: {
      type: "array",
      items: { type: "string" },
    },
    waitList: {
      type: "array",
      items: { type: "string" },
    },
    startSlot: {
      type: "string",
      pattern: "^\\d{4}-\\d{2}-\\d{2}-[1-3]$",
    },
    location: { type: "string" },
    id: { type: "string" },
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
  additionalProperties: false,
} as const;

const datesSchema = {
  type: "object",
  properties: {
    start: { type: "string", format: "date-time" },
    end: { type: "string", format: "date-time" },
  },
  required: ["start", "end"],
  additionalProperties: false,
} as const;

export const appDataSchema = {
  type: "object",
  properties: {
    attendees: {
      type: "array",
      items: attendeeSchema,
    },
    locations: {
      type: "array",
      items: locationSchema,
    },
    events: {
      type: "array",
      items: gameSchema,
    },
    dates: datesSchema,
  },
  required: ["attendees", "locations", "events", "dates"],
  additionalProperties: false,
} as const;

export type Attendee = FromSchema<typeof attendeeSchema>;
export type Location = FromSchema<typeof locationSchema>;
export type Game = FromSchema<typeof gameSchema>;
export type Dates = {
  start: Date;
  end: Date;
};
export type AppData = Omit<FromSchema<typeof appDataSchema>, "dates"> & {
  dates: Dates;
};

export type SlotId = Exclude<Game["startSlot"], undefined>;

export type ContextValue = {
  data: null | AppData;
  setData: Dispatch<SetStateAction<AppData | null>>;
};

export type View = "attendees" | "event-list" | "event-grid";
