'use client'
import { supabase } from "@/db/client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, usePathname } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

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
    const onSubmit: SubmitHandler<Inputs> = async (formData) => {
        const { error: loginError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        });

        if (loginError) {
            console.error("Error logging in:", loginError);
            return;
        }

        const { data: userRow, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('email', formData.email)
            .single();

        if (userError) {
            console.error("Error fetching user:", userError);
        } else {
            if (userRow.role === 'admin') {
                router.push('/admin/admindashboard');
            } else {
                router.push('/public/dashboard');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className='text-4xl my-2 text-center'>Login</h1>
            <div>
                <label>Email:</label>
                <input className='mx-2' placeholder='Enter email address' type="email" {...register("email")} />
                {errors.email && <p>{errors.email.message}</p>}
            </div>
            <div>
                <label>Password:</label>
                <input className='mx-2' placeholder='Enter password' type="password" {...register("password")} />
                {errors.password && <p>{errors.password.message}</p>}
            </div>
            <div className='flex flex-col items-center justify-center gap-2'>
                <button type="submit">Login</button>
                <Link href="/signup">Don't have an account? Sign up</Link>
                <Link href="/forgot-password">Forgot Password?</Link>
            </div>
        </form>
    );
}