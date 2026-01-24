import { z } from "zod"

export const birthDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  timeOfBirth: z.string().min(1, "Time of birth is required"),
  placeOfBirth: z.string().min(2, "Place of birth is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  timezone: z.string().optional(),
  chartStyle: z.enum(["north", "south", "east"]).default("north"),
})

export type BirthDetailsFormData = z.infer<typeof birthDetailsSchema>
