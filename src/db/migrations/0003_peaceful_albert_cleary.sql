ALTER TABLE "events" ADD COLUMN "stamp_path" text DEFAULT '/stamps/default.png' NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "stamp_path" DROP DEFAULT;
