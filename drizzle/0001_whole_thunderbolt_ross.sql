CREATE TYPE "public"."status" AS ENUM('open', 'closed', 'in_progress', 'resolved');--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"tenant" text NOT NULL,
	"attachment_url" text DEFAULT '' NOT NULL,
	"status" "status" DEFAULT 'open' NOT NULL,
	"updated_at" date DEFAULT now() NOT NULL,
	CONSTRAINT "tickets_email_unique" UNIQUE("email")
);
