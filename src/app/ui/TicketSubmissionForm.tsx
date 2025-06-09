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
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
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
            title: "",
            description: "",
        }
    })

    const onSubmit: SubmitHandler<Inputs> = async (data) => {

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

            <button type="submit" onClick={handleSubmit(onSubmit)}>Add Ticket</button>
        </form>
    )
}