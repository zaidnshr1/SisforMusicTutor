import z from "zod";

export const registerSchema = z.object({
    fullName: z.string().min(3, "nama lengkap minimal 3 karakter"),
    email: z.string().email("format email tidak valid"),
    password: z.string().min(8, "password minimal 8 karakter"),
    confirmPassword: z.string(),
    role: z.enum(["GURU", "MURID"], "peran tidak valid"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "password tidak cocok",
    path: ["confirmPassword"]
})

export const login = z.object({
    email: z.string().email("format email tidak valid"),
    password: z.string().min(1, "password tidak boleh kosong")
})