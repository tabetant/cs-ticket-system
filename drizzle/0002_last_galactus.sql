CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"message_text" text NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;