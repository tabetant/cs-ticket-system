import { serial, text, pgTable, timestamp, pgEnum, integer } from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', ['open', 'closed', 'in_progress', 'resolved']);

export const support = pgTable('support', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const tickets = pgTable('tickets', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email').notNull(),
    phone: text('phone').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    tenant: text('tenant').notNull(),
    attachment_url: text('attachment_url').notNull().default(''),
    status: statusEnum('status').notNull().default('open'),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

