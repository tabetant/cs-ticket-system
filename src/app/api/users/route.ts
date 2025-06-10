import { db } from "@/db/index";
import { support } from "@/db/drizzle/schema";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const allSupport = await db.select().from(support);
    if (allSupport.length === 0) {
        return new NextResponse("No users found", { status: 404 });
    }
    return NextResponse.json(allSupport, {
        status: 200,
    });
}

export async function POST(request: Request) {
    const body = await request.json();
    if (!body || !body.email || !body.firstName || !body.lastName) {
        return new NextResponse("Invalid request body", { status: 400 });
    }
    await db.insert(support).values({
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
    });
    return new NextResponse("User successfully created!", {
        status: 201
    });
}

export async function DELETE(request: Request) {
    return new NextResponse("This is a DELETE request to the users API route!");
}
export async function PATCH(request: Request) {
    return new NextResponse("This is a PATCH request to the users API route!");
}