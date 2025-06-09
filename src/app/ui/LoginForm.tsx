'use client'
import { supabase } from "@/db/client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, usePathname } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { db } from "@/db/index";
import { users } from "@/db/schema";

export default function LoginForm() {
    const router = useRouter();
    const inputsSchema = z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, "Password must be at least 6 characters long"),
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
            password: '',
        }
    })
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const { error } = await supabase().auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) {
            console.error("Error logging in:", error);
        } else {
            const { data: user, error: userError } = await db.select(users).where(eq(users.email, data.email)).single();
            if (userError) {
                console.error("Error fetching user:", userError);
            } else {
                if (user.role === 'admin') {
                    router.push('/admin/admindashboard');
                }
                else {
                    router.push('/public/dashboard');
                }
            }
        }
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Login</h1>
            <div>
                <label>Email:</label>
                <input type="email" {...register("email")} />
                {errors.email && <p>{errors.email.message}</p>}
            </div>
            <div>
                <label>Password:</label>
                <input type="password" {...register("password")} />
                {errors.password && <p>{errors.password.message}</p>}
            </div>
            <button type="submit">Login</button>
            <Link href="/signup">Don't have an account? Sign up</Link>
            <Link href="/forgot-password">Forgot Password?</Link>
        </form>
    );
}