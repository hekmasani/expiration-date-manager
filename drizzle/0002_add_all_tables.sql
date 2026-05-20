CREATE TABLE `food_alert_setting_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`food_id` integer NOT NULL,
	`days_before` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`food_id`) REFERENCES `food_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `food_instance_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`food_id` integer NOT NULL,
	`expiration_date` text NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`consumed_at` integer,
	`discarded_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`food_id`) REFERENCES `food_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `global_alert_setting_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`days_before` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `recipe_ingredient_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recipe_id` integer NOT NULL,
	`food_id` integer NOT NULL,
	`quantity` real,
	`unit` text,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipe_table`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`food_id`) REFERENCES `food_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recipe_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`instructions` text,
	`prep_time_minutes` integer,
	`image_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
