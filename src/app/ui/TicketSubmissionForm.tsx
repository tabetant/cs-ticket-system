'use client'
import { supabase } from "@/db/client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, usePathname } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


export default function TicketSubmissionForm() {
    const router = useRouter();
    const pathname = usePathname();
    const inputsSchema = z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        phone: z.string().min(1, "Phone number is required"),
        email: z.string().email("Invalid email address").min(1, "Email is required"),
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
        tenant: z.string().min(1, "Tenant is required"),
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
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            tenant: "",
            status: "open",
            title: "",
            description: "",
        }
    })

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        await fetch('/api/tickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: data.title,
                description: data.description,
            }),
        });
    }

    return (
        <form>
            <h1>New Ticket</h1>
            <div>
                <label>Title:</label>
                <input type="text" {...register("title")} />
                {errors.title && <p>{errors.title.message}</p>}
            </div>
            <div>
                <label>Description:</label>
                <input type="text" {...register("description")} />
                {errors.description && <p>{errors.description.message}</p>}
            </div>
            <div>
                <label>First Name:</label>
                <input type="text" {...register("firstName")} />
                {errors.firstName && <p>{errors.firstName.message}</p>}
            </div>
            <div>
                <label>Last Name:</label>
                <input type="text" {...register("lastName")} />
                {errors.lastName && <p>{errors.lastName.message}</p>}
            </div>
            <div>
                <label>Phone:</label>
                <input type="text" {...register("phone")} />
                {errors.phone && <p>{errors.phone.message}</p>}
            </div>
            <div>
                <label>Email:</label>
                <input type="email" {...register("email")} />
                {errors.email && <p>{errors.email.message}</p>}
            </div>
            <div>
                <label>Tenant:</label>
                <input type="text" {...register("tenant")} />
                {errors.tenant && <p>{errors.tenant.message}</p>}
            </div>
            <button type="submit" onClick={handleSubmit(onSubmit)}>Add Ticket</button>
        </form >
    )
}