import { z } from 'zod';
import {
    MAX_FILE_SIZE,
    ACCEPTED_PDF_TYPES,
    MAX_IMAGE_SIZE,
    ACCEPTED_IMAGE_TYPES,
} from './constants';

export const UploadSchema = z.object({
    pdf: z
        .instanceof(File, { message: 'Please upload a PDF file' })
        .refine(f => f.size <= MAX_FILE_SIZE, 'PDF must be under 50MB')
        .refine(f => ACCEPTED_PDF_TYPES.includes(f.type), 'File must be a PDF'),
    coverImage: z
        .instanceof(File)
        .refine(f => f.size <= MAX_IMAGE_SIZE, 'Cover image must be under 10MB')
        .refine(f => ACCEPTED_IMAGE_TYPES.includes(f.type), 'Must be JPEG, PNG, or WebP')
        .optional(),
    title: z.string().min(1, 'Title is required'),
    author: z.string().min(1, 'Author name is required'),
    voice: z.string().min(1, 'Please select a voice'),
});
