import { db } from "@/db/index";
import { tickets } from "@/db/drizzle/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import StatusUpdateEmail from '@/app/ui/StatusUpdateEmail';
import { Resend } from 'resend';
import { render } from '@react-email/render';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    const allowedStatuses = ['open', 'closed', 'in_progress', 'resolved'] as const;
    type Status = typeof allowedStatuses[number];

    try {
        const results = status && status !== 'all' && allowedStatuses.includes(status as Status)
            ? await db.select().from(tickets).where(eq(tickets.status, status as Status))
            : await db.select().from(tickets);

        return NextResponse.json({ tickets: results }, { status: 200 });
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    const requiredFields = ['title', 'description', 'firstName', 'lastName', 'email', 'phone', 'tenant'];
    const missing = requiredFields.filter(field => !body[field]);

    if (missing.length > 0) {
        return NextResponse.json({ error: `Missing required fields: ${missing.join(', ')}` }, { status: 400 });
    }

    if (!['open', 'closed', 'in_progress', 'resolved'].includes(body.status)) {
        return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    try {
        const result = await db.insert(tickets).values({
            title: body.title,
            description: body.description,
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            phone: body.phone,
            tenant: body.tenant,
            attachment_url: body.attachment_url ?? '',
            status: body.status ?? 'open',
            updatedAt: new Date(),
            createdAt: new Date(),
        });

        return NextResponse.json({ message: "Ticket added successfully" }, { status: 201 });
    } catch (error: any) {
        console.error("Ticket insert failed:", error);
        return NextResponse.json({ error: error.message || "Error creating ticket" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const body = await request.json();
    if (!body.id || !body.status) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        await db.update(tickets).set({ status: body.status }).where(eq(tickets.id, body.id));

        const [ticket] = await db.select().from(tickets).where(eq(tickets.id, body.id));
        const resend = new Resend(process.env.RESEND_API_KEY);

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
        });

        return NextResponse.json({ message: "Ticket updated and email sent successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Ticket update failed:", error);
        return NextResponse.json({ error: error.message || "Error updating ticket" }, { status: 500 });
    }
}
