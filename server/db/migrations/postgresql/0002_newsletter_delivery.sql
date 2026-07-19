ALTER TABLE "newsletter_subscribers" ADD COLUMN IF NOT EXISTS "frequency" text DEFAULT 'monthly' NOT NULL;
ALTER TABLE "newsletter_subscribers" ADD COLUMN IF NOT EXISTS "consent_at" timestamp with time zone DEFAULT now() NOT NULL;
ALTER TABLE "newsletter_subscribers" ADD COLUMN IF NOT EXISTS "confirmation_token_hash" text;
ALTER TABLE "newsletter_subscribers" ADD COLUMN IF NOT EXISTS "confirmed_at" timestamp with time zone;
ALTER TABLE "newsletter_subscribers" ADD COLUMN IF NOT EXISTS "unsubscribed_at" timestamp with time zone;
ALTER TABLE "newsletter_subscribers" ADD COLUMN IF NOT EXISTS "bounced_at" timestamp with time zone;
ALTER TABLE "newsletter_subscribers" ADD COLUMN IF NOT EXISTS "complained_at" timestamp with time zone;

UPDATE "newsletter_subscribers"
SET "confirmed_at" = COALESCE("confirmed_at", "created_at"),
    "consent_at" = "created_at"
WHERE "status" = 'subscribed';

CREATE TABLE IF NOT EXISTS "newsletter_publications" (
	"id" serial PRIMARY KEY NOT NULL,
	"article_id" text NOT NULL,
	"version" integer NOT NULL,
	"title" text NOT NULL,
	"subject" text NOT NULL,
	"summary" text NOT NULL,
	"url" text NOT NULL,
	"image" text,
	"deploy_sha" text NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"digested_at" timestamp with time zone
);

CREATE UNIQUE INDEX IF NOT EXISTS "newsletter_publications_article_version_idx" ON "newsletter_publications" ("article_id", "version");
CREATE INDEX IF NOT EXISTS "newsletter_publications_digest_idx" ON "newsletter_publications" ("digested_at");

CREATE TABLE IF NOT EXISTS "newsletter_campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"subject" text NOT NULL,
	"preheader" text NOT NULL,
	"publications" jsonb NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"recipient_count" integer DEFAULT 0 NOT NULL,
	"sent_count" integer DEFAULT 0 NOT NULL,
	"failed_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone
);

CREATE UNIQUE INDEX IF NOT EXISTS "newsletter_campaigns_key_idx" ON "newsletter_campaigns" ("key");
CREATE INDEX IF NOT EXISTS "newsletter_campaigns_status_idx" ON "newsletter_campaigns" ("status");

CREATE TABLE IF NOT EXISTS "newsletter_deliveries" (
	"id" serial PRIMARY KEY NOT NULL,
	"campaign_id" integer NOT NULL REFERENCES "newsletter_campaigns"("id") ON DELETE CASCADE,
	"subscriber_id" integer NOT NULL REFERENCES "newsletter_subscribers"("id") ON DELETE CASCADE,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"next_attempt_at" timestamp with time zone DEFAULT now() NOT NULL,
	"provider_id" text,
	"last_error" text,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "newsletter_deliveries_campaign_subscriber_idx" ON "newsletter_deliveries" ("campaign_id", "subscriber_id");
CREATE INDEX IF NOT EXISTS "newsletter_deliveries_queue_idx" ON "newsletter_deliveries" ("status", "next_attempt_at");
