PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_perks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`color` text,
	`icon` text
);
--> statement-breakpoint
INSERT INTO `__new_perks`("id", "title", "color", "icon") SELECT "id", "title", "color", "icon" FROM `perks`;--> statement-breakpoint
DROP TABLE `perks`;--> statement-breakpoint
ALTER TABLE `__new_perks` RENAME TO `perks`;--> statement-breakpoint
PRAGMA foreign_keys=ON;