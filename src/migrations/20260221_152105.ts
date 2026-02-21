import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "site_config_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "site_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'Kunal Gupta' NOT NULL,
  	"initials" varchar DEFAULT '{ KG.dev }' NOT NULL,
  	"title" varchar DEFAULT 'Senior Software Developer' NOT NULL,
  	"bio" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"socials_github" varchar,
  	"socials_linkedin" varchar,
  	"socials_twitter" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "resume_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "resume_experience_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "resume_experience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" varchar NOT NULL,
  	"company" varchar NOT NULL,
  	"company_url" varchar,
  	"location" varchar NOT NULL,
  	"type" varchar NOT NULL,
  	"start_date" varchar NOT NULL,
  	"end_date" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "resume_projects_tech_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "resume_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"live_url" varchar,
  	"source_url" varchar
  );

  CREATE TABLE IF NOT EXISTS "resume" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  DO $$ BEGIN
    ALTER TABLE "site_config_nav" ADD CONSTRAINT "site_config_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "resume_skills" ADD CONSTRAINT "resume_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resume"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "resume_experience_bullets" ADD CONSTRAINT "resume_experience_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resume_experience"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "resume_experience" ADD CONSTRAINT "resume_experience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resume"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "resume_projects_tech_stack" ADD CONSTRAINT "resume_projects_tech_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resume_projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "resume_projects" ADD CONSTRAINT "resume_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resume"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;
  CREATE INDEX IF NOT EXISTS "site_config_nav_order_idx" ON "site_config_nav" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "site_config_nav_parent_id_idx" ON "site_config_nav" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "resume_skills_order_idx" ON "resume_skills" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "resume_skills_parent_id_idx" ON "resume_skills" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "resume_experience_bullets_order_idx" ON "resume_experience_bullets" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "resume_experience_bullets_parent_id_idx" ON "resume_experience_bullets" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "resume_experience_order_idx" ON "resume_experience" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "resume_experience_parent_id_idx" ON "resume_experience" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "resume_projects_tech_stack_order_idx" ON "resume_projects_tech_stack" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "resume_projects_tech_stack_parent_id_idx" ON "resume_projects_tech_stack" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "resume_projects_order_idx" ON "resume_projects" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "resume_projects_parent_id_idx" ON "resume_projects" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_config_nav" CASCADE;
  DROP TABLE "site_config" CASCADE;
  DROP TABLE "resume_skills" CASCADE;
  DROP TABLE "resume_experience_bullets" CASCADE;
  DROP TABLE "resume_experience" CASCADE;
  DROP TABLE "resume_projects_tech_stack" CASCADE;
  DROP TABLE "resume_projects" CASCADE;
  DROP TABLE "resume" CASCADE;`)
}
