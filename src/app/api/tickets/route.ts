import { db } from "@/db/index";
import { tickets } from "@/db/drizzle/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import StatusUpdateEmail from '@/app/ui/StatusUpdateEmail';
import { Resend } from 'resend';
import { render } from '@react-email/render'

export async function GET(request: Request) {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    const allowedStatuses = ['open', 'closed', 'in_progress', 'resolved'] as const;
    type Status = typeof allowedStatuses[number];

    const results = status && status !== 'all' && allowedStatuses.includes(status as Status)
        ? await db.select().from(tickets).where(eq(tickets.status, status as Status))
        : await db.select().from(tickets);

    return NextResponse.json(results);
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
        const resend = new Resend(process.env.RESEND_API_KEY);
        const [ticket] = await db.select().from(tickets).where(eq(tickets.id, body.id))

        const emailHtml = await render(StatusUpdateEmail({
            customerName: `${ticket.firstName} ${ticket.lastName}`,
            ticketTitle: ticket.title,
            newStatus: ticket.status,
            supportEmail: request.headers.get('user-email') ?? 'support@yourapp.com'
        }));

        await resend.emails.send({
            from: 'Support Team <support@yourdomain.com>',
            to: ticket.email,
            subject: 'Your Ticket Status Has Been Updated',
            html: emailHtml
        })
        return new Response('Ticket updated successfully', {
            status: 200,
        });
    } catch (error: any) {
        console.error("Ticket update failed:", error);
        return new Response("Error updating ticket: " + (error?.message || error), { status: 500 });
    }
}
