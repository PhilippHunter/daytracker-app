PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_entry_persons` (
	`entry_id` integer,
	`person_id` integer,
	PRIMARY KEY(`entry_id`, `person_id`),
	FOREIGN KEY (`entry_id`) REFERENCES `entries`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`person_id`) REFERENCES `person`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_entry_persons`("entry_id", "person_id") SELECT "entry_id", "person_id" FROM `entry_persons`;--> statement-breakpoint
DROP TABLE `entry_persons`;--> statement-breakpoint
ALTER TABLE `__new_entry_persons` RENAME TO `entry_persons`;--> statement-breakpoint
PRAGMA foreign_keys=ON;