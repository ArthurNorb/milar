import {
  bigint,
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Chaves em snake_case para os tipos inferidos baterem com lib/types.ts.

export const projects = pgTable(
  "projects",
  {
    id: bigint("id", { mode: "number" }).generatedByDefaultAsIdentity().primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    image_url: text("image_url").notNull(),
    image_urls: text("image_urls").array().default([]),
    tags: text("tags").array(),
    display_order: integer("display_order"),
    created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("projects_display_order_idx").on(table.display_order)],
);

export const testimonials = pgTable("testimonials", {
  id: bigint("id", { mode: "number" }).generatedByDefaultAsIdentity().primaryKey(),
  client_name: text("client_name").notNull(),
  text: text("text").notNull(),
  is_approved: boolean("is_approved").notNull().default(false),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});
