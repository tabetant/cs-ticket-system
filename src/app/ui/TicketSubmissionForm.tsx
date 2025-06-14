'use client'
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ticket } from "../support/page";


export default function TicketSubmissionForm() {
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
        reset,
    } = useForm<Inputs>({
        resolver: zodResolver(inputsSchema),
        defaultValues: {
            title: "",
            description: "",
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            tenant: "",
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
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                email: data.email,
                tenant: data.tenant,
                status: 'open' as Ticket['status'],
            }),
        });
        reset();
    }

    return (
        <form className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-8 space-y-6">
            <h1 className="text-3xl font-bold text-center text-blue-600">Submit a New Ticket</h1>

            <div className="space-y-2">
                <label className="block font-semibold">Title:</label>
                <input
                    type="text"
                    placeholder="Enter ticket title"
                    {...register("title")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="block font-semibold">Description:</label>
                <input
                    type="text"
                    placeholder="Describe your issue"
                    {...register("description")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="block font-semibold">First Name:</label>
                <input
                    type="text"
                    placeholder="Your first name"
                    {...register("firstName")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="block font-semibold">Last Name:</label>
                <input
                    type="text"
                    placeholder="Your last name"
                    {...register("lastName")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="block font-semibold">Phone:</label>
                <input
                    type="text"
                    placeholder="Your phone number"
                    {...register("phone")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="block font-semibold">Email:</label>
                <input
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="block font-semibold">Tenant:</label>
                <input
                    type="text"
                    placeholder="Tenant name"
                    {...register("tenant")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.tenant && <p className="text-red-500 text-sm">{errors.tenant.message}</p>}
            </div>

            <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            >
                Add Ticket
            </button>
        </form>
    )
}