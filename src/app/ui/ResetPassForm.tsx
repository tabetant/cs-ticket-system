'use client'
import { supabase } from "@/db/client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, usePathname } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

export default function ResetPassForm() {
    const router = useRouter();
    const inputsSchema = z.object({
        email: z.string().email('Invalid email address'),
    })
    type Inputs = z.infer<typeof inputsSchema>;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(inputsSchema),
        defaultValues: {
            email: '',
        }
    })
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const { data: user, error: userError } = supabase.select(users).eq(email, data.email).single();
        if (userError) {
            console.error("Error fetching user:", userError);
        } else {
            supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'https://localhost:3000/reset-password'
            })
            if (user) {
                console.log("Password reset email sent to:", data.email);
                router.push('/forgot-pass-email');
            } else {
                console.error("User not found with email:", data.email);
            }
        }
    }
}


return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Enter Email</h1>
        <div>
            <label>Email:</label>
            <input type="email" {...register("email")} />
            {errors.email && <p>{errors.email.message}</p>}
        </div>
        <button type="submit">Reset Password</button>
    </form>
);
}