import { db } from "@/db/index";
import { users } from "@/db/drizzle/schema";

export async function GET(request: Request) {
    return new Response("Hello, this is the users API route!");
}

export async function POST(request: Request) {
    const body = await request.json();
    if (!body || !body.email || !body.name) {
        return new Response("Invalid request body", { status: 400 });
    }
    await db.insert(users).values({
        email: body.email,
        name: body.name,
        role: body.role || 'user', // Default to 'user' if role is not provided
    });
    return new Response("User successfully created!", {
        status: 201
    });
}

export async function DELETE(request: Request) {
    return new Response("This is a DELETE request to the users API route!");
}
export async function PATCH(request: Request) {
    return new Response("This is a PATCH request to the users API route!");
}