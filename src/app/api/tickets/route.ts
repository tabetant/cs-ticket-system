import { db } from "@/db/index";
import { tickets } from "@/db/drizzle/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
export async function GET(request: Request) {
    const allTickets = await db.select().from(tickets);
    if (allTickets.length === 0) {
        return new NextResponse("No tickets found", { status: 404 });
    }
    return NextResponse.json(allTickets, {
        status: 200,
    });
}

export async function POST(request: Request) {
    const body = await request.json();
    if (!body.title || !body.description || !body.firstName || !body.email || !body.phone || !body.tenant) {
        return new NextResponse("Missing required fields", { status: 400 });
    }
    if (typeof body.title !== 'string' || typeof body.description !== 'string' ||
        typeof body.firstName !== 'string' || typeof body.lastName !== 'string' ||
        typeof body.email !== 'string' || typeof body.phone !== 'string' ||
        typeof body.tenant !== 'string' || typeof body.status !== 'string') {
        return new NextResponse("Invalid data types", { status: 400 });
    }
    if (body.status && !['open', 'closed', 'in_progress', 'resolved'].includes(body.status)) {
        return new NextResponse("Invalid status value", { status: 400 });
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
        console.error("Ticket insert failed:", error);

        return new Response("Error creating ticket: " + (error?.message || error), { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const body = await request.json();
    if (!body.id || !body.status) {
        return new NextResponse("Missing required fields", { status: 400 });
    }
    const id = body.id;
    const status = body.status;
    try {
        await db.update(tickets).set({ status: status }).where(eq(tickets.id, id));
        return new Response('Ticket updated successfully', {
            status: 200,
        });
    } catch (error: any) {
        console.error("Ticket update failed:", error);
        return new Response("Error updating ticket: " + (error?.message || error), { status: 500 });
    }
}
