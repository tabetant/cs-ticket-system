CREATE TYPE "public"."status" AS ENUM('open', 'closed', 'in_progress', 'resolved');--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"status" "status" DEFAULT 'open' NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;