DROP DATABASE IF EXISTS `watch_service_log`;

CREATE DATABASE `watch_service_log`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

USE `watch_service_log`;

CREATE TABLE `watches` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `brand` VARCHAR(100) NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  `movement` VARCHAR(100),
  `year` INT,
  `purchase_date` DATE,
  `warranty_expiry` DATE,
  `last_maintenance_date` DATE,
  `maintenance_interval_months` INT DEFAULT 36,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `timekeeping_records` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `watch_id` BIGINT NOT NULL,
  `record_date` DATE NOT NULL,
  `deviation_seconds` DECIMAL(10,2) NOT NULL,
  `note` VARCHAR(500),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`watch_id`) REFERENCES `watches`(`id`) ON DELETE CASCADE,
  UNIQUE INDEX `uk_watch_record_date` (`watch_id`, `record_date`)
);

CREATE TABLE `maintenance_records` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `watch_id` BIGINT NOT NULL,
  `maintenance_date` DATE NOT NULL,
  `maintenance_type` VARCHAR(50) NOT NULL,
  `service_provider` VARCHAR(200),
  `cost` DECIMAL(12,2),
  `note` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`watch_id`) REFERENCES `watches`(`id`) ON DELETE CASCADE
);

CREATE TABLE `wearing_calendar` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `watch_id` BIGINT NOT NULL,
  `wear_date` DATE NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`watch_id`) REFERENCES `watches`(`id`) ON DELETE CASCADE,
  UNIQUE INDEX `uk_watch_wear_date` (`watch_id`, `wear_date`)
);
