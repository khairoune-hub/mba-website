import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_page_activities_items_key" AS ENUM('awareness', 'trips', 'export', 'establishment', 'fairs');
  CREATE TABLE "home_page_activities_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" "enum_home_page_activities_items_key" NOT NULL,
  	"title" varchar NOT NULL
  );
  
  ALTER TABLE "home_page_pillars" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_icon_meaning_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_vision_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_model_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_timeline" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_page_pillars" CASCADE;
  DROP TABLE "home_page_icon_meaning_items" CASCADE;
  DROP TABLE "home_page_stats" CASCADE;
  DROP TABLE "about_page_vision_points" CASCADE;
  DROP TABLE "about_page_model_points" CASCADE;
  DROP TABLE "about_page_timeline" CASCADE;
  -- Old and new value keys do not overlap enough to cast between the enums; the rows are content,
  -- so clear them and let the site fall back to the code defaults until the seed runs.
  DELETE FROM "values_items";
  ALTER TABLE "values_items" ALTER COLUMN "key" SET DATA TYPE text;
  DROP TYPE "public"."enum_values_items_key";
  CREATE TYPE "public"."enum_values_items_key" AS ENUM('trust', 'cooperation', 'excellence');
  ALTER TABLE "values_items" ALTER COLUMN "key" SET DATA TYPE "public"."enum_values_items_key" USING "key"::"public"."enum_values_items_key";
  ALTER TABLE "contact_submissions" ALTER COLUMN "message" DROP NOT NULL;
  ALTER TABLE "contact_submissions" ADD COLUMN "sector" varchar;
  ALTER TABLE "home_page" ADD COLUMN "sections_activities" boolean DEFAULT true;
  ALTER TABLE "home_page_locales" ADD COLUMN "mission_title" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "mission_body" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "vision_title" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "vision_body" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "activities_title" varchar;
  ALTER TABLE "home_page_activities_items" ADD CONSTRAINT "home_page_activities_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_activities_items_order_idx" ON "home_page_activities_items" USING btree ("_order");
  CREATE INDEX "home_page_activities_items_parent_id_idx" ON "home_page_activities_items" USING btree ("_parent_id");
  CREATE INDEX "home_page_activities_items_locale_idx" ON "home_page_activities_items" USING btree ("_locale");
  ALTER TABLE "home_page" DROP COLUMN "sections_stats";
  ALTER TABLE "home_page" DROP COLUMN "sections_pillars";
  ALTER TABLE "home_page" DROP COLUMN "sections_icon_meaning";
  ALTER TABLE "home_page_locales" DROP COLUMN "who_highlight";
  ALTER TABLE "home_page_locales" DROP COLUMN "icon_meaning_closing";
  ALTER TABLE "values_items" DROP COLUMN "before";
  ALTER TABLE "values_items" DROP COLUMN "after";
  ALTER TABLE "values_items" DROP COLUMN "motto";
  ALTER TABLE "about_page_locales" DROP COLUMN "story_title";
  ALTER TABLE "about_page_locales" DROP COLUMN "story_body";
  ALTER TABLE "about_page_locales" DROP COLUMN "heritage_title";
  ALTER TABLE "about_page_locales" DROP COLUMN "heritage_body";
  ALTER TABLE "about_page_locales" DROP COLUMN "logo_title";
  ALTER TABLE "about_page_locales" DROP COLUMN "logo_body";
  ALTER TABLE "about_page_locales" DROP COLUMN "vision_title";
  ALTER TABLE "about_page_locales" DROP COLUMN "vision_body";
  ALTER TABLE "about_page_locales" DROP COLUMN "model_title";
  ALTER TABLE "about_page_locales" DROP COLUMN "model_body";
  DROP TYPE "public"."enum_home_page_pillars_key";
  DROP TYPE "public"."enum_home_page_icon_meaning_items_shape";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_page_pillars_key" AS ENUM('industry', 'trade', 'services');
  CREATE TYPE "public"."enum_home_page_icon_meaning_items_shape" AS ENUM('m', 'a', 'summit');
  CREATE TABLE "home_page_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" "enum_home_page_pillars_key" NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "home_page_icon_meaning_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"shape" "enum_home_page_icon_meaning_items_shape" NOT NULL,
  	"keyword" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "home_page_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric NOT NULL,
  	"prefix" varchar,
  	"suffix" varchar,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_vision_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_model_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  ALTER TABLE "home_page_activities_items" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_page_activities_items" CASCADE;
  -- Old and new value keys do not overlap enough to cast between the enums; the rows are content,
  -- so clear them and let the site fall back to the code defaults until the seed runs.
  DELETE FROM "values_items";
  ALTER TABLE "values_items" ALTER COLUMN "key" SET DATA TYPE text;
  DROP TYPE "public"."enum_values_items_key";
  CREATE TYPE "public"."enum_values_items_key" AS ENUM('integrity', 'trust', 'prudence', 'solidarity');
  ALTER TABLE "values_items" ALTER COLUMN "key" SET DATA TYPE "public"."enum_values_items_key" USING "key"::"public"."enum_values_items_key";
  ALTER TABLE "contact_submissions" ALTER COLUMN "message" SET NOT NULL;
  ALTER TABLE "home_page" ADD COLUMN "sections_stats" boolean DEFAULT true;
  ALTER TABLE "home_page" ADD COLUMN "sections_pillars" boolean DEFAULT true;
  ALTER TABLE "home_page" ADD COLUMN "sections_icon_meaning" boolean DEFAULT true;
  ALTER TABLE "home_page_locales" ADD COLUMN "who_highlight" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "icon_meaning_closing" varchar;
  ALTER TABLE "values_items" ADD COLUMN "before" varchar NOT NULL;
  ALTER TABLE "values_items" ADD COLUMN "after" varchar NOT NULL;
  ALTER TABLE "values_items" ADD COLUMN "motto" varchar NOT NULL;
  ALTER TABLE "about_page_locales" ADD COLUMN "story_title" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "story_body" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "heritage_title" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "heritage_body" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "logo_title" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "logo_body" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "vision_title" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "vision_body" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "model_title" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "model_body" varchar;
  ALTER TABLE "home_page_pillars" ADD CONSTRAINT "home_page_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_icon_meaning_items" ADD CONSTRAINT "home_page_icon_meaning_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_stats" ADD CONSTRAINT "home_page_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_vision_points" ADD CONSTRAINT "about_page_vision_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_model_points" ADD CONSTRAINT "about_page_model_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_timeline" ADD CONSTRAINT "about_page_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_pillars_order_idx" ON "home_page_pillars" USING btree ("_order");
  CREATE INDEX "home_page_pillars_parent_id_idx" ON "home_page_pillars" USING btree ("_parent_id");
  CREATE INDEX "home_page_pillars_locale_idx" ON "home_page_pillars" USING btree ("_locale");
  CREATE INDEX "home_page_icon_meaning_items_order_idx" ON "home_page_icon_meaning_items" USING btree ("_order");
  CREATE INDEX "home_page_icon_meaning_items_parent_id_idx" ON "home_page_icon_meaning_items" USING btree ("_parent_id");
  CREATE INDEX "home_page_icon_meaning_items_locale_idx" ON "home_page_icon_meaning_items" USING btree ("_locale");
  CREATE INDEX "home_page_stats_order_idx" ON "home_page_stats" USING btree ("_order");
  CREATE INDEX "home_page_stats_parent_id_idx" ON "home_page_stats" USING btree ("_parent_id");
  CREATE INDEX "home_page_stats_locale_idx" ON "home_page_stats" USING btree ("_locale");
  CREATE INDEX "about_page_vision_points_order_idx" ON "about_page_vision_points" USING btree ("_order");
  CREATE INDEX "about_page_vision_points_parent_id_idx" ON "about_page_vision_points" USING btree ("_parent_id");
  CREATE INDEX "about_page_vision_points_locale_idx" ON "about_page_vision_points" USING btree ("_locale");
  CREATE INDEX "about_page_model_points_order_idx" ON "about_page_model_points" USING btree ("_order");
  CREATE INDEX "about_page_model_points_parent_id_idx" ON "about_page_model_points" USING btree ("_parent_id");
  CREATE INDEX "about_page_model_points_locale_idx" ON "about_page_model_points" USING btree ("_locale");
  CREATE INDEX "about_page_timeline_order_idx" ON "about_page_timeline" USING btree ("_order");
  CREATE INDEX "about_page_timeline_parent_id_idx" ON "about_page_timeline" USING btree ("_parent_id");
  CREATE INDEX "about_page_timeline_locale_idx" ON "about_page_timeline" USING btree ("_locale");
  ALTER TABLE "contact_submissions" DROP COLUMN "sector";
  ALTER TABLE "home_page" DROP COLUMN "sections_activities";
  ALTER TABLE "home_page_locales" DROP COLUMN "mission_title";
  ALTER TABLE "home_page_locales" DROP COLUMN "mission_body";
  ALTER TABLE "home_page_locales" DROP COLUMN "vision_title";
  ALTER TABLE "home_page_locales" DROP COLUMN "vision_body";
  ALTER TABLE "home_page_locales" DROP COLUMN "activities_title";
  DROP TYPE "public"."enum_home_page_activities_items_key";`)
}
