CREATE TABLE `agents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`tagline` text NOT NULL,
	`description` text NOT NULL,
	`category` varchar(255) NOT NULL,
	`pricing_model` varchar(255) NOT NULL,
	`price_per_task_ore` int,
	`price_monthly_ore` int,
	`risk_class` varchar(255) NOT NULL,
	`security_level` varchar(255) NOT NULL,
	`capabilities` json,
	`benchmark_score` float,
	`avg_response_time_sec` float,
	`status` varchar(255) NOT NULL,
	`is_official` boolean NOT NULL DEFAULT true,
	`purchase_count` int NOT NULL DEFAULT 0,
	`icon_name` varchar(255) NOT NULL,
	`accent_color` varchar(255) NOT NULL,
	`is_enterprise` boolean NOT NULL DEFAULT false,
	`agent_type` varchar(255) NOT NULL DEFAULT 'ai-agent',
	CONSTRAINT `agents_id` PRIMARY KEY(`id`),
	CONSTRAINT `agents_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`author` varchar(255) NOT NULL,
	`read_time` int NOT NULL,
	`published_at` varchar(255) NOT NULL,
	`category` varchar(255) NOT NULL,
	`image_url` text NOT NULL,
	`featured` boolean NOT NULL DEFAULT false,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `ledger_assets` (
	`id` varchar(255) NOT NULL,
	`filename` varchar(255) NOT NULL,
	`data` json NOT NULL,
	`created_at` varchar(255) NOT NULL,
	CONSTRAINT `ledger_assets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marketplace_listings` (
	`id` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`industry` varchar(255) NOT NULL,
	`price_ore` int NOT NULL,
	`data_points` int NOT NULL,
	`seller` varchar(255) NOT NULL,
	`verification` varchar(255) NOT NULL,
	CONSTRAINT `marketplace_listings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `opportunities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`amount` varchar(255) NOT NULL,
	`deadline` varchar(255) NOT NULL,
	`category` varchar(255) NOT NULL,
	`tags` json,
	`status` varchar(255) NOT NULL,
	`description` text NOT NULL,
	CONSTRAINT `opportunities_id` PRIMARY KEY(`id`)
);
