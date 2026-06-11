import { z } from 'zod';

export const taskSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
        description: z.string().min(1, "Description is required"),
        time: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Invalid time format"),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    })
});

export const noteSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required").max(255),
        contet: z.string().min(1, "Content is required"),
        category: z.enum(['general', 'personal', 'work', 'ideas']),
    })
});

export const userRegisterSchema = z.object({
    body: z.object({
        fullname: z.string().min(1, "Fullname is required").max(255),
        email: z.string().email("Invalid email format"),
        photoUrl: z.string().url("Invalid photo URL"),
    })
});

export const userLoginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format"),
    })
});

export const googleAuthSchema = z.object({
    body: z.object({
        idToken: z.string().min(1, "Google ID Token is required"),
    })
});
