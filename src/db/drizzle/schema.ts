import { serial, text, pgTable, pgEnum, date, integer } from 'drizzle-orm/pg-core';
import { title } from 'process';

export const roleEnum = pgEnum('role', ['admin', 'user']);
export const statusEnum = pgEnum('status', ['open', 'closed', 'in_progress', 'resolved']);
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    name: text('name').notNull(),
    role: roleEnum('role').notNull(),
    createdAt: date('created_at').notNull().defaultNow(),
});

export const tickets = pgTable('tickets', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    status: statusEnum('status').notNull().default('open'),
    createdAt: date('created_at').notNull().defaultNow(),
    updatedAt: date('updated_at').notNull().defaultNow(),
    userId: integer('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
});

