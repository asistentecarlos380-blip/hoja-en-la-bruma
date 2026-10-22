import { pgTable, serial, text, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";

export const gameSaves = pgTable("game_saves", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull().default("Shinjo Ren"),
  rank: text("rank").notNull().default("Mizunoto"),
  breathingStyle: text("breathing_style").notNull().default("Bruma Plateada"),
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  hp: integer("hp").notNull().default(150),
  maxHp: integer("max_hp").notNull().default(150),
  attack: integer("attack").notNull().default(35),
  defense: integer("defense").notNull().default(20),
  speed: integer("speed").notNull().default(30),
  focus: integer("focus").notNull().default(100),
  currentLocation: text("current_location").notNull().default("monte_sagiri"),
  storyChapter: integer("story_chapter").notNull().default(0),
  storyFlags: jsonb("story_flags").notNull().default({}),
  demonsSlain: integer("demons_slain").notNull().default(0),
  gachaPulls: integer("gacha_pulls").notNull().default(0),
  orbs: integer("orbs").notNull().default(5),
  inventory: jsonb("inventory").notNull().default([]),
  unlockedForms: jsonb("unlocked_forms").notNull().default([1]),
  allies: jsonb("allies").notNull().default([]),
  relationships: jsonb("relationships").notNull().default({}),
  notes: text("notes").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Una partida de mundo abierto por sesión anónima; el identificador viaja en una cookie HttpOnly.
export const openWorldSaves = pgTable("open_world_saves", {
  id: text("id").primaryKey(),
  snapshot: jsonb("snapshot").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const storyEvents = pgTable("story_events", {
  id: serial("id").primaryKey(),
  saveId: integer("save_id").notNull(),
  eventId: text("event_id").notNull(),
  seen: boolean("seen").notNull().default(true),
  choices: jsonb("choices").notNull().default({}),
  at: timestamp("at").defaultNow(),
});
