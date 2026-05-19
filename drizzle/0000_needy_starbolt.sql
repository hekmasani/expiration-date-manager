CREATE TABLE `food_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`barecode` integer NOT NULL,
	`image_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `food_table_barecode_unique` ON `food_table` (`barecode`);