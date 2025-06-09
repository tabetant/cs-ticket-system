
export async function POST(request: Request) {
    const body = await request.json();
    if (!body || !body.title || !body.description) {
        return new Response("Invalid request body", { status: 400 });
    }

    // Assuming you have a tickets table in your database
    const { data, error } = await db.insert('tickets').values({
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