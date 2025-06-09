import { db } from "@/db/index";
import { users } from "@/db/drizzle/schema";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const allUsers = await db.select().from(users);
    if (allUsers.length === 0) {
        return new Response("No users found", { status: 404 });
    }
    return NextResponse.json(allUsers, {
        status: 200,
    });
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
    return NextResponse("User successfully created!", {
        status: 201
    });
}

export async function DELETE(request: Request) {
    return NextResponse("This is a DELETE request to the users API route!");
}
export async function PATCH(request: Request) {
    return NextResponse("This is a PATCH request to the users API route!");
}