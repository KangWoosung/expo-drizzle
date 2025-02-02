CREATE TABLE `artist_credits` (
	`recording_id` text,
	`artist_id` text,
	`join_phrase` text,
	`name` text,
	PRIMARY KEY(`recording_id`, `artist_id`),
	FOREIGN KEY (`recording_id`) REFERENCES `recordings`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `artist_tags` (
	`artist_id` text,
	`tag_id` integer,
	`count` integer DEFAULT 1,
	PRIMARY KEY(`artist_id`, `tag_id`),
	FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `artists` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`sort_name` text,
	`type` text,
	`country` text,
	`disambiguation` text,
	`begin_date` text,
	`end_date` text
);
--> statement-breakpoint
CREATE TABLE `recording_tags` (
	`recording_id` text,
	`tag_id` integer,
	`count` integer DEFAULT 1,
	PRIMARY KEY(`recording_id`, `tag_id`),
	FOREIGN KEY (`recording_id`) REFERENCES `recordings`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recordings` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`length` integer,
	`disambiguation` text,
	`artist_id` text,
	FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `release_recordings` (
	`release_id` text,
	`recording_id` text,
	`track_position` integer,
	`disc_number` integer DEFAULT 1,
	PRIMARY KEY(`release_id`, `recording_id`),
	FOREIGN KEY (`release_id`) REFERENCES `releases`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recording_id`) REFERENCES `recordings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `release_tags` (
	`release_id` text,
	`tag_id` integer,
	`count` integer DEFAULT 1,
	PRIMARY KEY(`release_id`, `tag_id`),
	FOREIGN KEY (`release_id`) REFERENCES `releases`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `releases` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`status` text,
	`release_date` text,
	`country` text,
	`disambiguation` text,
	`packaging` text,
	`artist_id` text,
	FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);