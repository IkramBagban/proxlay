import { z } from "zod";

export const uploadVideoSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters.")
    .max(100, "Title can't exceed 100 characters."),

  description: z
    .string()
    .max(5000, "Description can't exceed 5000 characters.")
    .optional(),

  tags: z
    .array(z.string())
    // .max(10, "You can add up to 10 tags only.")
    .optional(),

privacyStatus: z.enum(["public", "unlisted", "private"]),

  categoryId: z.string().min(1, "Category is required.").optional(),

  madeForKids: z.boolean(),

  ageRestriction: z.boolean(),

  currentStep: z.number().min(1).max(4),

  thumbnail: z.union([
    z.object({
      file: z.any()
    }),
    z.object({
      url: z.string().url("Please enter a valid URL")
    }).optional()
  ]).optional()
});

export type UploadVideoFormData = z.infer<typeof uploadVideoSchema>;