import z from "zod";

export const createUserSchema = z.object({
   name: z.string(),
   email: z.email("Invalid email"),
   password: z.string().min(6, "Password must be of 6 characters"),
   role: z.enum(["Super Admin", "Admin", "User"])
})