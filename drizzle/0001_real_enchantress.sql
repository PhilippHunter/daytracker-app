PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_entry_perks` (
	`entry_id` integer,
	`perk_id` integer,
	PRIMARY KEY(`entry_id`, `perk_id`),
	FOREIGN KEY (`entry_id`) REFERENCES `entries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`perk_id`) REFERENCES `perks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_entry_perks`("entry_id", "perk_id") SELECT "entry_id", "perk_id" FROM `entry_perks`;--> statement-breakpoint
DROP TABLE `entry_perks`;--> statement-breakpoint
ALTER TABLE `__new_entry_perks` RENAME TO `entry_perks`;--> statement-breakpoint
PRAGMA foreign_keys=ON;