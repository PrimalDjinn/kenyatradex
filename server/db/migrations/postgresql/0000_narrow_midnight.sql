CREATE TABLE "inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_name" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"service" text,
	"destination" text,
	"message" text NOT NULL,
	"fields" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
