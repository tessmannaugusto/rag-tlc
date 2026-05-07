import { z } from "zod";
import { config } from "../config.js";

export const documentSchema = z.object({
  file: z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string().refine((mime) => mime === "application/pdf", {
      message: "Only PDF files are allowed",
    }),
    size: z.number().max(config.uploads.maxFileSize, `File size exceeds limit of ${config.uploads.maxFileSize / (1024 * 1024)}MB`),
    destination: z.string(),
    filename: z.string(),
    path: z.string(),
  }, { required_error: "No file uploaded" }),
});
