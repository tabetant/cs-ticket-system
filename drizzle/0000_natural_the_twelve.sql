CREATE TYPE "public"."status" AS ENUM('open', 'closed', 'in_progress', 'resolved');--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"tenant" text NOT NULL,
	"attachment_url" text DEFAULT '' NOT NULL,
	"status" "status" DEFAULT 'open' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"logs" text DEFAULT '' NOT NULL
);
