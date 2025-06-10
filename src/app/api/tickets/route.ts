import { db } from "@/db/index";
import { tickets } from "@/db/drizzle/schema";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const allTickets = await db.select().from(tickets);
    if (allTickets.length === 0) {
        return new NextResponse("No tickets found", { status: 404 });
    }
    return NextResponse.json(allTickets, {
        status: 200,
    });
}
x
export async function POST(request: Request) {
    const body = await request.json();
    if (!body || !body.title || !body.description) {
        return new NextResponse("Invalid request body", { status: 400 });
    }

    try {
        await db.insert(tickets).values({
            title: body.title,
            description: body.description,
            firstName: body.firstName || '',
            lastName: body.lastName || '',
            email: body.email || '',
            phone: body.phone || '',
            tenant: body.tenant || '',
            attachment_url: body.attachment_url || '',
            status: body.status || 'open',
            updatedAt: new Date(),
            createdAt: new Date(),
        });

        return new Response('Ticket added successfully', {
            status: 201,
        });
    } catch (error: any) {
        return new Response("Error creating ticket: " + (error?.message || error), { status: 500 });
    }
}