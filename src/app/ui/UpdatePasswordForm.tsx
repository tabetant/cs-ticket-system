'use client'
import { supabase } from "@/db/client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, usePathname } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function UpdatePasswordForm() {
    const router = useRouter();
    const inputsSchema = z.object({
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
            password: '',
        }
    })
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const { error } = await supabase.auth.updateUser({ password: data.password })
        if (error) {
            console.error("Error updating password:", error);
        } else {
            console.log("Password updated successfully:", data);
            router.push('/login');
        }
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>New Password:</label>
                <input className='mx-2' placeholder='Enter new password' type="password" {...register("password")} />
                {errors.password && <p>{errors.password.message}</p>}
            </div>
            <button type="submit">Reset Password</button>
        </form>
    );
}