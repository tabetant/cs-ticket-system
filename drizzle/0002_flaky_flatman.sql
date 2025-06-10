ALTER TABLE "users" RENAME TO "support";--> statement-breakpoint
ALTER TABLE "support" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "support" ADD CONSTRAINT "support_email_unique" UNIQUE("email");