'use client'
import { supabase } from "@/db/client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, usePathname } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { db } from "@/db/index";
import { users } from "@/db/drizzle/schema";

export default function SignupForm() {
    const router = useRouter();
    const pathname = usePathname();
    const inputsSchema = z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        name: z.string().min(1, "Name is required"),
    })
    type Inputs = z.infer<typeof inputsSchema>;
    const {
        register,
        watch,
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
        const { error } = await supabase().auth.signUp({
            email: data.email,
            password: data.password,
        });
        if (error) {
            console.error("Error signing up:", error);
        } else {
            fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    name: data.name,
                    role: 'user',
                }),
            });
            router.push('/email-ver');
        }
    }

    return (
        <form>
            <h1>Sign Up</h1>
            <div>
                <label>Name:</label>
                <input type="text" {...register("name")} />
                {errors.name && <p>{errors.name.message}</p>}
            </div>
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

            <button type="submit" onClick={handleSubmit(onSubmit)}>Sign Up</button>
            <Link href="/login">Already have an account? Log in</Link>
            <Link href="/">Back to Home</Link>
            <Link href="/forgot-password">Forgot Password?</Link>
        </form>
    )
}