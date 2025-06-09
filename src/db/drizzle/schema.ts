import { serial, text, pgTable, pgEnum, date } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['admin', 'user']);

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    name: text('name').notNull(),
    role: roleEnum('role').notNull(),
    createdAt: date('created_at').notNull().defaultNow(),
});