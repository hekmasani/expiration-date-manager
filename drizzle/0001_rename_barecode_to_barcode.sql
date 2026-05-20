-- Recreate food_table to rename barecode → barcode and change type integer → text
-- SQLite requires table recreation for type changes

-- Drop the old unique index
DROP INDEX IF EXISTS `food_table_barecode_unique`;

-- Create new table with correct schema
CREATE TABLE `food_table_new` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`barcode` text NOT NULL,
	`image_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint

-- Copy data, casting barecode integer to text
INSERT INTO `food_table_new` (`id`, `name`, `barcode`, `image_url`, `created_at`, `updated_at`)
SELECT `id`, `name`, CAST(`barecode` AS TEXT), `image_url`, `created_at`, `updated_at`
FROM `food_table`;
--> statement-breakpoint

-- Drop old table
DROP TABLE `food_table`;
--> statement-breakpoint

-- Rename new table
ALTER TABLE `food_table_new` RENAME TO `food_table`;
--> statement-breakpoint

-- Recreate unique index with correct column name
CREATE UNIQUE INDEX `food_table_barcode_unique` ON `food_table` (`barcode`);