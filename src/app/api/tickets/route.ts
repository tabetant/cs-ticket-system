import { db } from "@/db/index";
import { tickets } from "@/db/drizzle/schema";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const allTickets = await db.select().from(tickets);
    if (allTickets.length === 0) {
        return NextResponse("No tickets found", { status: 404 });
    }
    return NextResponse.json(allTickets, {
        status: 200,
    });
}
x
export async function POST(request: Request) {
    const body = await request.json();
    if (!body || !body.title || !body.description) {
        return new Response("Invalid request body", { status: 400 });
    }

    const { data, error } = await db.insert(tickets).values({
        title: body.title,
        description: body.description,
    });

    if (error) {
        return new Response("Error creating ticket: " + error.message, { status: 500 });
    }

    return new Response('Ticket added successfully', {
        status: 201,
    });
}