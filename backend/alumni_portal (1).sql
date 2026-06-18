-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Mar 04, 2026 at 06:54 PM
-- Server version: 8.0.40
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `alumni_portal`
--

-- --------------------------------------------------------

--
-- Table structure for table `alumni_category`
--

CREATE TABLE `alumni_category` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `chapter_id` int NOT NULL,
  `year` year NOT NULL,
  `location` varchar(200) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `alumni_chapter`
--

CREATE TABLE `alumni_chapter` (
  `id` int NOT NULL,
  `chapter_name` varchar(150) NOT NULL,
  `location` varchar(200) NOT NULL,
  `is_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `alumni_chapter`
--

INSERT INTO `alumni_chapter` (`id`, `chapter_name`, `location`, `is_enabled`, `created_at`) VALUES
(1, 'Lagos Chapter', 'Lagos, Nigeria', 1, '2026-03-04 19:27:22'),
(2, 'Abuja Chapter', 'Abuja, Nigeria', 0, '2026-03-04 19:27:22'),
(3, 'Port Harcourt Chapter', 'Port Harcourt, Nigeria', 0, '2026-03-04 19:27:22'),
(4, 'London Chapter', 'London, UK', 0, '2026-03-04 19:27:22'),
(5, 'Houston Chapter', 'Houston, USA', 0, '2026-03-04 19:27:22');

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `type` enum('info','warning','success','event') DEFAULT 'info',
  `created_by` int NOT NULL,
  `starts_at` datetime DEFAULT NULL,
  `ends_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_table`
--

CREATE TABLE `api_table` (
  `api_id` int NOT NULL,
  `api_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `api_token` varchar(225) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `api_key` varchar(225) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `api_table`
--

INSERT INTO `api_table` (`api_id`, `api_name`, `api_token`, `api_key`) VALUES
(1, 'alumni_key', '$2b$12$NGMOi4fSbuvt0KtDMUwTQOYs8HourMqOMgxRM0eCIahcErUTy84CC', '6a909853-ef5e-402f-83b8-7acda5cfad20');

-- --------------------------------------------------------

--
-- Table structure for table `chat_groups`
--

CREATE TABLE `chat_groups` (
  `id` int NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text,
  `cover_image` varchar(255) DEFAULT NULL,
  `created_by` int NOT NULL,
  `is_private` tinyint(1) DEFAULT '0',
  `required_role` enum('member','premium','moderator','admin') DEFAULT 'member',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `chat_groups`
--

INSERT INTO `chat_groups` (`id`, `name`, `description`, `cover_image`, `created_by`, `is_private`, `required_role`, `created_at`) VALUES
(1, 'General Alumni', 'Main community group for all alumni', NULL, 1, 0, 'member', '2026-03-02 10:57:04'),
(2, 'Class of 2020', 'Dedicated group for class of 2020', NULL, 1, 0, 'member', '2026-03-02 10:57:04'),
(3, 'Career Network', 'Job opportunities and career tips', NULL, 1, 0, 'premium', '2026-03-02 10:57:04'),
(4, 'Tech Alumni Hub', 'Technology enthusiasts network', NULL, 1, 0, 'member', '2026-03-02 10:57:04'),
(5, 'class 27', 'test', NULL, 1, 0, 'member', '2026-03-02 12:38:38');

-- --------------------------------------------------------

--
-- Table structure for table `chat_group_members`
--

CREATE TABLE `chat_group_members` (
  `id` int NOT NULL,
  `group_id` int NOT NULL,
  `user_id` int NOT NULL,
  `role` enum('member','moderator','admin') DEFAULT 'member',
  `joined_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `chat_group_members`
--

INSERT INTO `chat_group_members` (`id`, `group_id`, `user_id`, `role`, `joined_at`) VALUES
(1, 1, 1, 'admin', '2026-03-02 10:57:04'),
(2, 1, 2, 'member', '2026-03-02 10:57:04'),
(3, 1, 3, 'member', '2026-03-02 10:57:04'),
(4, 2, 2, 'member', '2026-03-02 10:57:04'),
(5, 2, 3, 'member', '2026-03-02 10:57:04'),
(6, 3, 1, 'admin', '2026-03-02 10:57:04'),
(7, 3, 2, 'member', '2026-03-02 10:57:04'),
(8, 4, 1, 'admin', '2026-03-02 10:57:04'),
(9, 4, 3, 'member', '2026-03-02 10:57:04'),
(10, 2, 4, 'member', '2026-03-02 12:33:05'),
(11, 5, 1, 'admin', '2026-03-02 12:38:38'),
(12, 3, 4, 'member', '2026-03-02 12:40:38'),
(13, 5, 4, 'member', '2026-03-02 12:54:30'),
(14, 2, 1, 'member', '2026-03-02 13:37:18'),
(15, 1, 4, 'member', '2026-03-03 08:43:41');

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` int NOT NULL,
  `group_id` int NOT NULL,
  `user_id` int NOT NULL,
  `message` text NOT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `attachment_type` enum('image','file','video') DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `group_id`, `user_id`, `message`, `attachment`, `attachment_type`, `is_deleted`, `created_at`) VALUES
(1, 2, 1, 'hi', NULL, NULL, 0, '2026-03-02 13:41:13'),
(2, 2, 1, 'hello', NULL, NULL, 0, '2026-03-02 15:14:47'),
(3, 2, 4, 'hi', NULL, NULL, 0, '2026-03-03 08:42:53');

-- --------------------------------------------------------

--
-- Table structure for table `ci_sessions`
--

CREATE TABLE `ci_sessions` (
  `id` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` int UNSIGNED NOT NULL DEFAULT '0',
  `data` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ci_sessions`
--

INSERT INTO `ci_sessions` (`id`, `ip_address`, `timestamp`, `data`) VALUES
('1937rbtocqkmha7c88utm8ijh6r0a46c', '::1', 1772626554, 0x5f5f63695f6c6173745f726567656e65726174657c693a313737323632363535343b6572726f727c733a32363a22506c65617365206c6f6720696e20746f20636f6e74696e75652e223b5f5f63695f766172737c613a313a7b733a353a226572726f72223b733a333a226f6c64223b7d),
('2dbjff2vbat42b70qikfrdccf5a46alf', '::1', 1772626855, 0x5f5f63695f6c6173745f726567656e65726174657c693a313737323632363835353b6572726f727c733a32363a22506c65617365206c6f6720696e20746f20636f6e74696e75652e223b5f5f63695f766172737c613a313a7b733a353a226572726f72223b733a333a226f6c64223b7d),
('8e227cvhvuj1479ifjj5fc53b7m2u0or', '::1', 1772627214, 0x5f5f63695f6c6173745f726567656e65726174657c693a313737323632373231343b6572726f727c733a32363a22506c65617365206c6f6720696e20746f20636f6e74696e75652e223b5f5f63695f766172737c613a313a7b733a353a226572726f72223b733a333a226f6c64223b7d),
('97keei4952bmafesatdnv0gd1l7m64u5', '::1', 1772628234, 0x5f5f63695f6c6173745f726567656e65726174657c693a313737323632383233343b6572726f727c733a32363a22506c65617365206c6f6720696e20746f20636f6e74696e75652e223b5f5f63695f766172737c613a313a7b733a353a226572726f72223b733a333a226f6c64223b7d),
('ba8jtm5m1evdgq9csokhhj3qdbrslfkh', '::1', 1772625174, 0x5f5f63695f6c6173745f726567656e65726174657c693a313737323632353137343b6572726f727c733a32363a22506c65617365206c6f6720696e20746f20636f6e74696e75652e223b5f5f63695f766172737c613a313a7b733a353a226572726f72223b733a333a226f6c64223b7d),
('cborrf52c34c5o0eju501nn8k7o5hp2a', '::1', 1772627874, 0x5f5f63695f6c6173745f726567656e65726174657c693a313737323632373837343b6572726f727c733a32363a22506c65617365206c6f6720696e20746f20636f6e74696e75652e223b5f5f63695f766172737c613a313a7b733a353a226572726f72223b733a333a226f6c64223b7d),
('ckbim32ksgdehehsfgikqrru5g8iar6n', '::1', 1772626195, 0x5f5f63695f6c6173745f726567656e65726174657c693a313737323632363139353b6572726f727c733a32363a22506c65617365206c6f6720696e20746f20636f6e74696e75652e223b5f5f63695f766172737c613a313a7b733a353a226572726f72223b733a333a226e6577223b7d),
('dc8864gauv3j5o9jc67ibaujfq4ssep4', '::1', 1772631178, 0x5f5f63695f6c6173745f726567656e65726174657c693a313737323633313137383b6572726f727c733a32363a22506c65617365206c6f6720696e20746f20636f6e74696e75652e223b5f5f63695f766172737c613a313a7b733a353a226572726f72223b733a333a226f6c64223b7d),
('dm2hk2pf15eo0c3hgobbrusqt39kniu2', '::1', 1772629425, 0x5f5f63695f6c6173745f726567656e65726174657c693a313737323632393432353b6572726f727c733a32363a22506c65617365206c6f6720696e20746f20636f6e74696e75652e223b5f5f63695f766172737c613a313a7b733a353a226572726f72223b733a333a226f6c64223b7d),
('ed25qost96v1ll9r33pgedv6o5bf4s3d', '::1', 1772630199, 0x5f5f63695f6c6173745f726567656e65726174657c693a313737323633303139393b6572726f727c733a32363a22506c65617365206c6f6720696e20746f20636f6e74696e75652e223b5f5f63695f766172737c613a313a7b733a353a226572726f72223b733a333a226f6c64223b7d),
('etf1dsouvqm562jv8uvi8bp5r3lld0dm', '::1', 1772624498, 0x5f5f63695f6c6173745f726567656e65726174657c693a313737323632343439383b6572726f727c733a32363a22506c65617365206c6f6720696e20746f20636f6e74696e75652e223b5f5f63695f766172737c613a313a7b733a353a226572726f72223b733a333a226f6c64223b7d),
('h9idr635lglks003sd7vkqhdar56ja6d', '::1', 1772627515, 0x5f5f63695f6c6173745f726567656e65726174657c693a313737323632373531353b6572726f727c733a32363a22506c65617365206c6f6720696e20746f20636f6e74696e75652e223b5f5f63695f766172737c613a313a7b733a353a226572726f72223b733a333a226f6c64223b7d),
('hvqngciuejdjkostthg3amb8m57b4cfd', '::1', 1772628594, 0x5f5f63695f6c6173745f726567656e65726174657c693a313737323632383539343b6572726f727c733a32363a22506c65617365206c6f6720696e20746f20636f6e74696e75652e223b5f5f63695f766172737c613a313a7b733a353a226572726f72223b733a333a226f6c64223b7d),
('j9v5l1c6uo0q5k706fqqou7c2go8nn4u', '::1', 1772630830, 0x5f5f63695f6c6173745f726567656e65726174657c693a313737323633303833303b6572726f727c733a32363a22506c65617365206c6f6720696e20746f20636f6e74696e75652e223b5f5f63695f766172737c613a313a7b733a353a226572726f72223b733a333a226f6c64223b7d),
('ol7lmueskhkvvcam0d1eu0nv5tebt2r6', '::1', 1772624858, 0x5f5f63695f6c6173745f726567656e65726174657c693a313737323632343835383b6572726f727c733a32363a22506c65617365206c6f6720696e20746f20636f6e74696e75652e223b5f5f63695f766172737c613a313a7b733a353a226572726f72223b733a333a226f6c64223b7d),
('ro2iljv638r6kko9o85jnlnlltkukovs', '::1', 1772630514, 0x5f5f63695f6c6173745f726567656e65726174657c693a313737323633303531343b6572726f727c733a32363a22506c65617365206c6f6720696e20746f20636f6e74696e75652e223b5f5f63695f766172737c613a313a7b733a353a226572726f72223b733a333a226f6c64223b7d),
('s63k6kci8dct3v8muftkec1sla6tv6v1', '::1', 1772624138, 0x5f5f63695f6c6173745f726567656e65726174657c693a313737323632343133383b6572726f727c733a32363a22506c65617365206c6f6720696e20746f20636f6e74696e75652e223b5f5f63695f766172737c613a313a7b733a353a226572726f72223b733a333a226f6c64223b7d),
('t6sqgb0m39suqt6j1nmjqh84eetd54e0', '::1', 1772625894, 0x5f5f63695f6c6173745f726567656e65726174657c693a313737323632353839343b6572726f727c733a32363a22506c65617365206c6f6720696e20746f20636f6e74696e75652e223b5f5f63695f766172737c613a313a7b733a353a226572726f72223b733a333a226f6c64223b7d),
('ur5qadgt42klfh2gvlgbmmt8fh4fl5ig', '::1', 1772625534, 0x5f5f63695f6c6173745f726567656e65726174657c693a313737323632353533343b6572726f727c733a32363a22506c65617365206c6f6720696e20746f20636f6e74696e75652e223b5f5f63695f766172737c613a313a7b733a353a226572726f72223b733a333a226f6c64223b7d),
('v8cil50684ef01bvs524uojjqtbp948n', '::1', 1772631298, 0x5f5f63695f6c6173745f726567656e65726174657c693a313737323633313137383b6572726f727c733a32363a22506c65617365206c6f6720696e20746f20636f6e74696e75652e223b5f5f63695f766172737c613a313a7b733a353a226572726f72223b733a333a226f6c64223b7d);

-- --------------------------------------------------------

--
-- Table structure for table `direct_messages`
--

CREATE TABLE `direct_messages` (
  `id` int NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `direct_messages`
--

INSERT INTO `direct_messages` (`id`, `sender_id`, `receiver_id`, `message`, `is_read`, `is_deleted`, `created_at`) VALUES
(1, 4, 1, 'hi', 0, 0, '2026-03-02 13:32:41'),
(2, 4, 2, 'hi', 0, 0, '2026-03-03 08:44:21');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int NOT NULL,
  `title` varchar(250) NOT NULL,
  `description` text,
  `location` varchar(255) DEFAULT NULL,
  `event_date` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `color` varchar(20) DEFAULT '#4f46e5',
  `created_by` int NOT NULL,
  `visibility` enum('public','members','premium') DEFAULT 'members',
  `is_approved` tinyint(1) DEFAULT '0',
  `max_attendees` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `location`, `event_date`, `start_time`, `end_time`, `color`, `created_by`, `visibility`, `is_approved`, `max_attendees`, `created_at`) VALUES
(1, 'Annual Alumni Reunion 2026', 'Join us for our biggest annual gathering! Reconnect with old friends and make new ones.', 'University Main Hall', '2026-05-15', '10:00:00', '18:00:00', '#4f46e5', 1, 'public', 1, 0, '2026-03-02 10:57:04'),
(2, 'Career Fair 2026', 'Connect with top employers and explore opportunities', 'Business School Auditorium', '2026-04-10', '09:00:00', '17:00:00', '#059669', 1, 'members', 1, 0, '2026-03-02 10:57:04'),
(3, 'Tech Summit', 'Annual technology conference featuring alumni speakers', 'Innovation Center', '2026-04-25', '09:00:00', '16:00:00', '#dc2626', 1, 'members', 1, 0, '2026-03-02 10:57:04'),
(4, 'Networking Mixer', 'Evening networking event for premium members', 'Rooftop Lounge, Downtown', '2026-03-20', '18:00:00', '21:00:00', '#d97706', 1, 'premium', 1, 0, '2026-03-02 10:57:04'),
(5, 'test calender', 'testing calender', 'Nigeria', '2026-03-02', '15:50:00', '19:55:00', '#e548bb', 4, 'public', 1, 7, '2026-03-02 12:51:27'),
(6, 'ebuka', 'test', 'Nigeria', '2026-03-03', '17:45:00', '16:47:00', '#e548bb', 4, 'public', 1, 0, '2026-03-03 15:45:45');

-- --------------------------------------------------------

--
-- Table structure for table `event_attendees`
--

CREATE TABLE `event_attendees` (
  `id` int NOT NULL,
  `event_id` int NOT NULL,
  `user_id` int NOT NULL,
  `status` enum('going','maybe','not_going') DEFAULT 'going',
  `registered_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `event_attendees`
--

INSERT INTO `event_attendees` (`id`, `event_id`, `user_id`, `status`, `registered_at`) VALUES
(1, 5, 1, 'going', '2026-03-02 13:07:29');

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `id` mediumint UNSIGNED NOT NULL,
  `name` varchar(20) NOT NULL,
  `description` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `name`, `description`) VALUES
(1, 'admin', 'Administrator'),
(2, 'members', 'General User'),
(3, 'web', 'Web User');

-- --------------------------------------------------------

--
-- Table structure for table `marketplace_listings`
--

CREATE TABLE `marketplace_listings` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `title` varchar(250) NOT NULL,
  `description` text,
  `category` enum('jobs','housing','items','services','tutoring','other') DEFAULT 'other',
  `price` decimal(10,2) DEFAULT '0.00',
  `price_type` enum('fixed','negotiable','free') DEFAULT 'fixed',
  `images` text,
  `contact_info` varchar(255) DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  `status` enum('active','sold','expired','pending') DEFAULT 'pending',
  `is_featured` tinyint(1) DEFAULT '0',
  `views` int DEFAULT '0',
  `expires_at` date DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `marketplace_listings`
--

INSERT INTO `marketplace_listings` (`id`, `user_id`, `title`, `description`, `category`, `price`, `price_type`, `images`, `contact_info`, `location`, `status`, `is_featured`, `views`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 2, 'Senior Software Engineer Position', 'Great opportunity at a tech startup. 5+ years experience required.', 'jobs', 0.00, 'free', NULL, NULL, 'Remote', 'active', 1, 0, NULL, '2026-03-02 10:57:04', '2026-03-02 10:57:04'),
(2, 3, 'Python Tutoring Sessions', 'Expert Python tutoring for beginners and intermediate learners', 'tutoring', 50.00, 'negotiable', NULL, NULL, 'Online', 'active', 0, 0, NULL, '2026-03-02 10:57:04', '2026-03-02 10:57:04'),
(3, 2, '2-Bedroom Apartment Near Campus', 'Spacious apartment, furnished, great location near university', 'housing', 1200.00, 'fixed', NULL, NULL, 'University District', 'active', 1, 1, NULL, '2026-03-02 10:57:04', '2026-03-02 13:32:17');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `type` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `message`, `link`, `is_read`, `created_at`) VALUES
(1, 1, 'event', 'You RSVPed to an event', 'http://localhost:8888/web/calendar/event/5', 0, '2026-03-02 13:07:29');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `plan_id` int DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'NGN',
  `payment_method` varchar(50) DEFAULT NULL,
  `transaction_id` varchar(150) DEFAULT NULL,
  `status` enum('pending','success','failed') DEFAULT 'pending',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int NOT NULL,
  `role_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `description`, `created_at`, `updated_at`) VALUES
(3, 'Manager', NULL, '2025-11-13 11:50:44', '2025-11-25 08:23:09'),
(8, 'Other Staff', NULL, '2025-12-01 12:06:28', '2025-12-01 12:06:28'),
(9, 'Security', NULL, '2025-12-10 14:25:53', '2025-12-10 14:25:53');

-- --------------------------------------------------------

--
-- Table structure for table `subscription_plans`
--

CREATE TABLE `subscription_plans` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `price` decimal(10,2) DEFAULT '0.00',
  `duration_days` int DEFAULT '30',
  `features` text,
  `max_marketplace_items` int DEFAULT '0',
  `can_chat` tinyint(1) DEFAULT '1',
  `can_create_events` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `subscription_plans`
--

INSERT INTO `subscription_plans` (`id`, `name`, `slug`, `price`, `duration_days`, `features`, `max_marketplace_items`, `can_chat`, `can_create_events`, `is_active`, `created_at`) VALUES
(1, 'Free', 'free', 0.00, 36500, '[\"View alumni directory\",\"Read announcements\",\"View public events\",\"Basic profile\"]', 0, 1, 0, 1, '2026-03-02 10:57:04'),
(2, 'Standard', 'standard', 9.99, 30, '[\"All Free features\",\"Post 5 marketplace items\",\"Create events\",\"Group chat access\",\"Priority directory listing\"]', 5, 1, 1, 1, '2026-03-02 10:57:04'),
(3, 'Premium', 'premium', 24.99, 30, '[\"All Standard features\",\"Unlimited marketplace items\",\"Featured listings\",\"Private messaging\",\"Advanced analytics\",\"Badge & recognition\"]', -1, 1, 1, 1, '2026-03-02 10:57:04');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `ip_address` varchar(15) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `fullname` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT 'default.png',
  `graduation_year` int DEFAULT NULL,
  `department` varchar(200) DEFAULT NULL,
  `bio` text,
  `salt` varchar(255) DEFAULT NULL,
  
  `activation_selector` varchar(255) DEFAULT NULL,
 
  `activation_code` varchar(255) DEFAULT NULL,
  `forgotten_password_selector` varchar(255) DEFAULT NULL,
  `forgotten_password_code` varchar(255) DEFAULT NULL,
  `forgotten_password_time` int UNSIGNED DEFAULT NULL,
  `remember_selector` varchar(255) DEFAULT NULL,
  `remember_code` varchar(255) DEFAULT NULL,
  `created_on` int UNSIGNED NOT NULL,
  `last_login` int UNSIGNED DEFAULT NULL,
  `active` tinyint UNSIGNED DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
 `user_role` varchar(20) DEFAULT NULL,
 
  `is_approved` tinyint(1) DEFAULT '0',
  `email_verified` tinyint(1) DEFAULT '0',
  `verify_token` varchar(100) DEFAULT NULL,
  `reset_token` varchar(100) DEFAULT NULL,
  `reset_expires` datetime DEFAULT NULL,
  
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uc_email` (`email`),
  ADD UNIQUE KEY `uc_activation_selector` (`activation_selector`),
  ADD UNIQUE KEY `uc_remember_selector` (`remember_selector`),
  ADD UNIQUE KEY `uc_forgotten_password_selector` (`forgotten_password_selector`);

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `full_name`, `phone`, `avatar`, `graduation_year`, `department`, `bio`, `role`, `is_active`, `is_approved`, `email_verified`, `verify_token`, `reset_token`, `reset_expires`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@alumni.com', '$2y$10$RvU7FFKqwZ4Grkx70Vi9dOcSwHGt9E3AlddfY8y4g60ngVzAqtNCC', 'Admin User', '', 'avatar_1_1772455434.png', 2026, '', '', 'admin', 1, 1, 1, NULL, NULL, NULL, '2026-03-03 11:16:58', '2026-03-02 10:57:04', '2026-03-03 12:16:58'),
(2, 'john_doe', 'john@alumni.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Doe', NULL, 'default.png', NULL, NULL, NULL, 'premium', 1, 0, 1, NULL, NULL, NULL, NULL, '2026-03-02 10:57:04', '2026-03-02 10:57:04'),
(3, 'jane_smith', 'jane@alumni.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane Smith', NULL, 'default.png', NULL, NULL, NULL, 'member', 1, 0, 1, NULL, NULL, NULL, NULL, '2026-03-02 10:57:04', '2026-03-02 10:57:04'),
(4, 'kizito', 'jacknelsonxxx@gmail.com', '$2y$10$RvU7FFKqwZ4Grkx70Vi9dOcSwHGt9E3AlddfY8y4g60ngVzAqtNCC', 'CHIKA', NULL, 'default.png', 2026, 'COMPUTER', NULL, 'moderator', 1, 1, 1, '914e014e34450fde9bdc8b1da004fa377a2ef7eb94b4c1e73ccd18d28f69ab72', NULL, NULL, '2026-03-03 11:19:07', '2026-03-02 12:30:19', '2026-03-03 12:19:07');

-- --------------------------------------------------------

--
-- Table structure for table `users_groups`
--

CREATE TABLE `users_groups` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `group_id` mediumint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `users_groups`
--

INSERT INTO `users_groups` (`id`, `user_id`, `group_id`) VALUES
(1123, 2, 2),
(1124, 3, 2),
(1125, 4, 2),
(1126, 5, 2),
(1127, 6, 2),
(1128, 8, 2),
(1129, 9, 2),
(1130, 10, 2),
(1131, 11, 2),
(1132, 12, 2),
(1133, 13, 2),
(1134, 14, 2),
(1135, 15, 2),
(1136, 16, 2),
(1137, 17, 2),
(1138, 18, 2),
(1139, 19, 2),
(1140, 20, 2),
(1141, 21, 2),
(1142, 22, 2),
(1143, 23, 2),
(1144, 24, 2),
(1, 25, 2),
(1146, 26, 2),
(1147, 27, 2),
(1148, 28, 2),
(1149, 29, 2),
(1150, 30, 2),
(1151, 31, 2),
(1152, 32, 2),
(1153, 33, 2),
(1154, 34, 2),
(1155, 35, 2),
(1156, 36, 2),
(1157, 37, 2),
(1158, 38, 2),
(1159, 39, 2),
(1160, 40, 2),
(1161, 41, 2),
(1162, 42, 2),
(1163, 43, 2),
(1164, 44, 2),
(1165, 45, 2),
(1166, 46, 2),
(1167, 47, 2),
(1168, 48, 2),
(1169, 49, 2),
(1170, 50, 2),
(1171, 51, 2),
(1172, 52, 2),
(1173, 53, 2),
(1174, 54, 2),
(1175, 55, 2),
(1176, 56, 2),
(1177, 57, 2),
(1178, 58, 2),
(1179, 59, 2),
(1180, 60, 2),
(1181, 61, 2),
(1182, 62, 2),
(1183, 63, 2),
(1184, 64, 2),
(1185, 65, 2),
(1186, 66, 2),
(1187, 67, 2),
(1188, 68, 2),
(1189, 69, 2),
(1190, 70, 2),
(1191, 71, 2),
(1192, 72, 2),
(1193, 73, 2),
(1194, 74, 2),
(1195, 75, 2),
(1196, 76, 2),
(1197, 77, 2),
(1198, 78, 2),
(1199, 79, 2),
(1200, 80, 2),
(1201, 81, 2),
(1202, 82, 2),
(1203, 83, 2),
(1204, 84, 2),
(1205, 85, 2),
(1206, 86, 2),
(1207, 87, 2),
(1208, 88, 2),
(1209, 89, 2),
(1210, 90, 2),
(1211, 91, 2),
(1212, 92, 2),
(1213, 93, 2),
(1214, 94, 2),
(1215, 95, 2),
(1216, 96, 2),
(1217, 97, 2),
(1218, 98, 2),
(1219, 99, 2),
(1220, 100, 2),
(1221, 101, 2),
(1222, 102, 2),
(1223, 103, 2),
(1224, 104, 2),
(1225, 105, 2),
(1226, 106, 2),
(1227, 107, 2),
(1228, 108, 2),
(1229, 109, 2),
(1230, 110, 2),
(1231, 111, 2),
(1232, 112, 2),
(1233, 113, 2),
(1234, 114, 2),
(1235, 115, 2),
(1236, 116, 2),
(1237, 117, 2),
(1238, 118, 2),
(1239, 119, 2),
(1240, 120, 2),
(1241, 121, 2),
(1242, 122, 2),
(1243, 123, 2),
(1244, 124, 2),
(1245, 125, 2),
(1246, 126, 2),
(1247, 127, 2),
(1248, 128, 2),
(1249, 129, 2),
(1250, 130, 2),
(1251, 131, 2),
(1252, 132, 2),
(1253, 133, 2),
(1254, 134, 2),
(1255, 135, 2),
(1256, 136, 2),
(1257, 137, 2),
(1258, 138, 2),
(1259, 139, 2),
(1260, 140, 2),
(1261, 141, 2),
(1262, 142, 2),
(739, 340, 2),
(740, 340, 3),
(741, 341, 2),
(742, 341, 3),
(743, 342, 2),
(744, 342, 3),
(745, 343, 2),
(746, 343, 3),
(747, 344, 2),
(748, 344, 3),
(749, 345, 2),
(750, 345, 3),
(751, 346, 2),
(752, 346, 3),
(753, 347, 2),
(754, 347, 3),
(755, 348, 2),
(756, 348, 3),
(757, 349, 2),
(758, 349, 3),
(759, 350, 2),
(760, 350, 3),
(761, 351, 2),
(762, 351, 3),
(763, 352, 2),
(764, 352, 3),
(765, 353, 2),
(766, 353, 3),
(767, 354, 2),
(768, 354, 3),
(769, 355, 2),
(770, 355, 3),
(771, 356, 2),
(772, 356, 3),
(773, 357, 2),
(774, 357, 3),
(775, 358, 2),
(776, 358, 3),
(777, 359, 2),
(778, 359, 3),
(779, 360, 2),
(780, 360, 3),
(781, 361, 2),
(782, 361, 3),
(783, 362, 2),
(784, 362, 3),
(785, 363, 2),
(786, 363, 3),
(787, 364, 2),
(788, 364, 3),
(789, 365, 2),
(790, 365, 3),
(791, 366, 2),
(792, 366, 3),
(793, 367, 2),
(794, 367, 3),
(795, 368, 2),
(796, 368, 3),
(797, 369, 2),
(798, 369, 3),
(799, 370, 2),
(800, 370, 3),
(801, 371, 2),
(802, 371, 3),
(803, 372, 2),
(804, 372, 3),
(805, 373, 2),
(806, 373, 3),
(807, 374, 2),
(808, 374, 3),
(809, 375, 2),
(810, 375, 3),
(811, 376, 2),
(812, 376, 3),
(813, 377, 2),
(814, 377, 3),
(815, 378, 2),
(816, 378, 3),
(817, 379, 2),
(818, 379, 3),
(819, 380, 2),
(820, 380, 3),
(821, 381, 2),
(822, 381, 3),
(823, 382, 2),
(824, 382, 3),
(825, 383, 2),
(826, 383, 3),
(827, 384, 2),
(828, 384, 3),
(829, 385, 2),
(830, 385, 3),
(831, 386, 2),
(832, 386, 3),
(833, 387, 2),
(834, 387, 3),
(835, 388, 2),
(836, 388, 3),
(837, 389, 2),
(838, 389, 3),
(839, 390, 2),
(840, 390, 3),
(841, 391, 2),
(842, 391, 3),
(843, 392, 2),
(844, 392, 3),
(845, 393, 2),
(846, 393, 3),
(847, 394, 2),
(848, 394, 3),
(849, 395, 2),
(850, 395, 3),
(851, 396, 2),
(852, 396, 3),
(853, 397, 2),
(854, 397, 3),
(855, 398, 2),
(856, 398, 3),
(857, 399, 2),
(858, 399, 3),
(859, 400, 2),
(860, 400, 3),
(861, 401, 2),
(862, 401, 3),
(863, 402, 2),
(864, 402, 3),
(865, 403, 2),
(866, 403, 3),
(867, 404, 2),
(868, 404, 3),
(869, 405, 2),
(870, 405, 3),
(871, 406, 2),
(872, 406, 3),
(873, 407, 2),
(874, 407, 3),
(875, 408, 2),
(876, 408, 3),
(877, 409, 2),
(878, 409, 3),
(879, 410, 2),
(880, 410, 3),
(881, 411, 2),
(882, 411, 3),
(883, 412, 2),
(884, 412, 3),
(885, 413, 2),
(886, 413, 3),
(887, 414, 2),
(888, 414, 3),
(889, 415, 2),
(890, 415, 3),
(891, 416, 2),
(892, 416, 3),
(893, 417, 2),
(894, 417, 3),
(895, 418, 2),
(896, 418, 3),
(897, 419, 2),
(898, 419, 3),
(899, 420, 2),
(900, 420, 3),
(901, 421, 2),
(902, 421, 3),
(903, 422, 2),
(904, 422, 3),
(905, 423, 2),
(906, 423, 3),
(907, 424, 2),
(908, 424, 3),
(909, 425, 2),
(910, 425, 3),
(911, 426, 2),
(912, 426, 3),
(913, 427, 2),
(914, 427, 3),
(915, 428, 2),
(916, 428, 3),
(917, 429, 2),
(918, 429, 3),
(919, 430, 2),
(920, 430, 3),
(921, 431, 2),
(922, 431, 3),
(923, 432, 2),
(924, 432, 3),
(925, 433, 2),
(926, 433, 3),
(927, 434, 2),
(928, 434, 3),
(929, 435, 2),
(930, 435, 3),
(931, 436, 2),
(932, 436, 3),
(933, 437, 2),
(934, 437, 3),
(935, 438, 2),
(936, 438, 3),
(937, 439, 2),
(938, 439, 3),
(939, 440, 2),
(940, 440, 3),
(941, 441, 2),
(942, 441, 3),
(943, 442, 2),
(944, 442, 3),
(945, 443, 2),
(946, 443, 3),
(947, 444, 2),
(948, 444, 3),
(949, 445, 2),
(950, 445, 3),
(951, 446, 2),
(952, 446, 3),
(953, 447, 2),
(954, 447, 3),
(955, 448, 2),
(956, 448, 3),
(957, 449, 2),
(958, 449, 3),
(959, 450, 2),
(960, 450, 3),
(961, 451, 2),
(962, 451, 3),
(963, 452, 2),
(964, 452, 3),
(965, 453, 2),
(966, 453, 3),
(967, 454, 2),
(968, 454, 3),
(969, 455, 2),
(970, 455, 3),
(971, 456, 2),
(972, 456, 3),
(973, 457, 2),
(974, 457, 3),
(975, 458, 2),
(976, 458, 3),
(977, 459, 2),
(978, 459, 3),
(979, 460, 2),
(980, 460, 3),
(981, 461, 2),
(982, 461, 3),
(983, 462, 2),
(984, 462, 3),
(985, 463, 2),
(986, 463, 3),
(987, 464, 2),
(988, 464, 3),
(989, 465, 2),
(990, 465, 3),
(991, 466, 2),
(992, 466, 3),
(993, 467, 2),
(994, 467, 3),
(995, 468, 2),
(996, 468, 3),
(997, 469, 2),
(998, 469, 3),
(999, 470, 2),
(1000, 470, 3),
(1001, 471, 2),
(1002, 471, 3),
(1003, 472, 2),
(1004, 472, 3),
(1005, 473, 2),
(1006, 473, 3),
(1007, 474, 2),
(1008, 474, 3),
(1009, 475, 2),
(1010, 475, 3),
(1011, 476, 2),
(1012, 476, 3),
(1013, 477, 2),
(1014, 477, 3),
(1015, 478, 2),
(1016, 478, 3),
(1017, 479, 2),
(1018, 479, 3),
(1019, 480, 2),
(1020, 480, 3),
(1021, 481, 2),
(1022, 481, 3),
(1023, 482, 2),
(1024, 482, 3),
(1025, 483, 2),
(1026, 483, 3),
(1027, 484, 2),
(1028, 484, 3),
(1029, 485, 2),
(1030, 485, 3),
(1031, 486, 2),
(1032, 486, 3),
(1033, 487, 2),
(1034, 487, 3),
(1035, 488, 2),
(1036, 488, 3),
(1037, 489, 2),
(1038, 489, 3),
(1039, 490, 2),
(1040, 490, 3),
(1041, 491, 2),
(1042, 491, 3),
(1043, 492, 2),
(1044, 492, 3),
(1045, 493, 2),
(1046, 493, 3),
(1047, 494, 2),
(1048, 494, 3),
(1049, 495, 2),
(1050, 495, 3),
(1051, 496, 2),
(1052, 496, 3),
(1053, 497, 2),
(1054, 497, 3),
(1055, 498, 2),
(1056, 498, 3),
(1057, 499, 2),
(1058, 499, 3),
(1059, 500, 2),
(1060, 500, 3),
(1061, 501, 2),
(1062, 501, 3),
(1063, 502, 2),
(1064, 502, 3),
(1065, 503, 2),
(1066, 503, 3),
(1067, 504, 2),
(1068, 504, 3),
(1069, 505, 2),
(1070, 505, 3),
(1071, 506, 2),
(1072, 506, 3),
(1073, 507, 2),
(1074, 507, 3),
(1075, 508, 2),
(1076, 508, 3),
(1077, 509, 2),
(1078, 509, 3),
(1079, 510, 2),
(1080, 510, 3),
(1081, 511, 2),
(1082, 511, 3),
(1083, 512, 2),
(1084, 512, 3),
(1085, 513, 2),
(1086, 513, 3),
(1087, 514, 2),
(1088, 514, 3),
(1089, 515, 2),
(1090, 515, 3),
(1091, 516, 2),
(1092, 516, 3),
(1093, 517, 2),
(1094, 517, 3),
(1095, 518, 2),
(1096, 518, 3),
(1097, 519, 2),
(1098, 519, 3),
(1099, 520, 2),
(1100, 520, 3),
(1101, 521, 2),
(1102, 521, 3),
(1103, 522, 2),
(1104, 522, 3),
(1105, 523, 2),
(1106, 523, 3),
(1107, 524, 2),
(1108, 524, 3),
(1109, 525, 2),
(1110, 525, 3),
(1111, 526, 2),
(1112, 526, 3),
(1113, 527, 2),
(1114, 527, 3),
(1115, 528, 2),
(1116, 528, 3),
(1117, 529, 2),
(1118, 529, 3),
(1119, 530, 2),
(1120, 530, 3),
(1121, 531, 2),
(1122, 531, 3);

-- --------------------------------------------------------

--
-- Table structure for table `users_log`
--

CREATE TABLE `users_log` (
  `id` int NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `ip_address` varchar(50) NOT NULL,
  `location` varchar(255) NOT NULL,
  `device_type` varchar(50) NOT NULL,
  `operating_system` varchar(50) NOT NULL,
  `device_model` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `users_log`
--

INSERT INTO `users_log` (`id`, `name`, `email`, `ip_address`, `location`, `device_type`, `operating_system`, `device_model`, `created_at`) VALUES
(1, NULL, NULL, '102.89.43.151', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '0000-00-00 00:00:00'),
(2, NULL, NULL, '102.89.43.151', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '0000-00-00 00:00:00'),
(3, NULL, NULL, '102.89.43.151', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '0000-00-00 00:00:00'),
(4, NULL, NULL, '102.89.43.151', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '0000-00-00 00:00:00'),
(5, NULL, NULL, '102.89.43.151', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '0000-00-00 00:00:00'),
(6, NULL, 'samuel_obe_External@bat.com', '102.89.43.151', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-09 02:51:04'),
(7, NULL, NULL, '102.89.43.151', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-09 03:01:49'),
(8, NULL, NULL, '102.88.70.235', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-09 12:01:41'),
(9, 'Samuel Obe BAT', 'samuel_obe_External@bat.com', '102.88.70.235', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-09 12:04:35'),
(10, NULL, NULL, '52.112.49.112', 'Johor Bahru, Johor, Malaysia', 'Windows PC', 'Windows', 'Windows PC', '2025-03-09 12:05:19'),
(11, NULL, NULL, '52.112.125.8', 'Tokyo, Tokyo, Japan', 'Windows PC', 'Windows', 'Windows PC', '2025-03-09 12:08:37'),
(12, NULL, NULL, '102.88.70.235', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-09 12:18:28'),
(13, NULL, NULL, '102.88.70.235', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-09 12:18:29'),
(14, NULL, NULL, '102.88.70.235', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-09 12:18:47'),
(15, NULL, NULL, '102.88.70.235', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-09 12:19:17'),
(16, NULL, NULL, '102.88.70.235', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-09 12:19:18'),
(17, NULL, NULL, '102.88.70.235', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-09 12:19:33'),
(18, NULL, NULL, '102.88.70.235', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-09 12:19:33'),
(19, NULL, NULL, '102.88.70.235', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-09 12:19:34'),
(20, NULL, NULL, '102.88.70.235', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-09 12:19:34'),
(21, NULL, NULL, '102.89.22.233', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-10 09:35:40'),
(22, NULL, NULL, '102.89.22.233', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-10 09:35:41'),
(23, NULL, NULL, '102.89.23.21', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-10 10:35:48'),
(24, NULL, NULL, '102.89.23.21', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-10 10:35:48'),
(25, NULL, NULL, '105.112.203.87', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-10 11:19:19'),
(26, NULL, NULL, '105.112.203.87', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-10 11:19:19'),
(27, NULL, NULL, '102.89.22.233', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-10 20:01:52'),
(28, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 09:01:01'),
(29, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 09:02:15'),
(30, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 09:02:19'),
(31, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 09:02:19'),
(32, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 09:02:22'),
(33, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 09:16:16'),
(34, NULL, NULL, '169.255.124.4', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 09:16:17'),
(35, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 09:16:26'),
(36, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 09:16:27'),
(37, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 09:16:43'),
(38, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 09:16:45'),
(39, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 09:16:53'),
(40, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 09:16:54'),
(41, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 09:17:23'),
(42, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:08:55'),
(43, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:08:56'),
(44, NULL, NULL, '169.255.124.4', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:08:56'),
(45, NULL, NULL, '169.255.124.4', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:14:17'),
(46, NULL, NULL, '169.255.124.4', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:14:17'),
(47, NULL, NULL, '169.255.124.4', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:14:17'),
(48, NULL, NULL, '169.255.124.4', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:14:17'),
(49, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:29:34'),
(50, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:29:35'),
(51, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:29:44'),
(52, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:29:44'),
(53, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:30:49'),
(54, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:30:49'),
(55, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:30:49'),
(56, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:30:50'),
(57, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:30:51'),
(58, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:30:51'),
(59, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:32:09'),
(60, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:32:09'),
(61, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:32:09'),
(62, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:32:11'),
(63, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:32:11'),
(64, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:32:12'),
(65, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:42:33'),
(66, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:42:34'),
(67, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:42:37'),
(68, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:42:37'),
(69, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:42:53'),
(70, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:42:54'),
(71, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:43:03'),
(72, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:43:04'),
(73, NULL, NULL, '169.255.124.4', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:43:32'),
(74, NULL, NULL, '169.255.124.4', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:43:32'),
(75, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:43:48'),
(76, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:43:49'),
(77, NULL, NULL, '169.255.124.4', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:49:19'),
(78, NULL, NULL, '169.255.124.4', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:49:19'),
(79, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '169.255.124.4', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:49:21'),
(80, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:49:50'),
(81, NULL, NULL, '169.255.124.4', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:50:17'),
(82, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:50:18'),
(83, NULL, NULL, '169.255.124.4', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:51:35'),
(84, NULL, NULL, '169.255.124.4', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:51:36'),
(85, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '169.255.124.4', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:51:37'),
(86, NULL, NULL, '169.255.124.4', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:53:11'),
(87, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '169.255.124.4', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:53:12'),
(88, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:54:12'),
(89, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:54:13'),
(90, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:55:49'),
(91, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:55:50'),
(92, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:55:51'),
(93, NULL, NULL, '197.210.52.16', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:57:02'),
(94, NULL, NULL, '197.210.52.16', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:57:03'),
(95, NULL, NULL, '197.210.52.16', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 10:57:12'),
(96, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 12:00:05'),
(97, 'Samuel Obe BAT', 'samuel_obe_External@bat.com', '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 12:04:54'),
(98, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 12:04:57'),
(99, 'Samuel Obe BAT', 'samuel_obe_External@bat.com', '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 12:04:57'),
(100, 'Samuel Obe BAT', 'samuel_obe_External@bat.com', '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-11 12:04:57'),
(101, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '169.255.124.9', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-12 09:12:03'),
(102, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '169.255.124.9', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-12 09:12:03'),
(103, NULL, NULL, '169.255.124.3', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-12 09:13:57'),
(104, NULL, NULL, '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-12 09:14:23'),
(105, 'Oluwaseun Oyeyemi', 'oluwaseun_oyeyemi@greatbrandsng.com', '169.255.124.5', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-12 09:14:24'),
(106, 'Samuel Obe BAT', 'samuel_obe_External@bat.com', '169.255.124.9', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-12 09:15:17'),
(107, 'Samuel Obe BAT', 'samuel_obe_External@bat.com', '169.255.124.4', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-12 09:16:05'),
(108, 'Samuel Obe BAT', 'samuel_obe_External@bat.com', '169.255.124.9', 'Agege, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-12 09:19:05'),
(109, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.89.42.246', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-12 09:21:47'),
(110, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.89.42.246', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-12 09:22:08'),
(111, NULL, NULL, '102.88.70.243', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-15 06:01:12'),
(112, NULL, NULL, '102.88.70.243', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-15 06:01:46'),
(113, NULL, NULL, '102.88.70.243', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-15 06:01:54'),
(114, 'Opeyemi Busari', 'opeyemi_busari@bat.com', '102.89.33.245', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-16 08:16:16'),
(115, 'Opeyemi Busari', 'opeyemi_busari@bat.com', '102.89.33.245', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-16 08:16:17'),
(116, 'Opeyemi Busari', 'opeyemi_busari@bat.com', '102.89.33.245', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-03-16 08:16:30'),
(117, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.89.23.154', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-03 11:04:41'),
(118, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.89.23.154', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-03 11:04:41'),
(119, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.108.131', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-07 13:09:25'),
(120, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.108.131', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-07 13:09:26'),
(121, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.108.131', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-07 14:50:49'),
(122, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.108.131', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-07 14:50:50'),
(123, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.75', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 09:51:47'),
(124, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.75', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 09:51:48'),
(125, NULL, NULL, '105.112.113.88', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 11:19:17'),
(126, 'Braimah Abdulreheem', 'abdulreheem_braimah@bat.com', '105.112.113.88', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 11:19:18'),
(127, 'Braimah Abdulreheem', 'abdulreheem_braimah@bat.com', '105.112.113.88', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 11:19:19'),
(128, NULL, NULL, '105.113.70.238', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 11:57:18'),
(129, 'Olalekan Omolaja', 'omolaja_olalekan@bat.com', '105.113.70.238', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 11:57:18'),
(130, 'Olalekan Omolaja', 'omolaja_olalekan@bat.com', '105.113.70.238', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 11:57:20'),
(131, 'Uwalaka Joachin Chinomso', 'uwalaka_chinomso@bat.com', '102.90.81.113', 'Port Harcourt, Rivers State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 16:41:11'),
(132, 'Uwalaka Joachin Chinomso', 'uwalaka_chinomso@bat.com', '102.90.81.113', 'Port Harcourt, Rivers State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 16:41:12'),
(133, 'Uwalaka Joachin Chinomso', 'uwalaka_chinomso@bat.com', '102.90.81.113', 'Port Harcourt, Rivers State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 16:41:20'),
(134, 'Uwalaka Joachin Chinomso', 'uwalaka_chinomso@bat.com', '102.90.81.113', 'Port Harcourt, Rivers State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 16:42:44'),
(135, 'Uwalaka Joachin Chinomso', 'uwalaka_chinomso@bat.com', '102.90.81.113', 'Port Harcourt, Rivers State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 16:43:09'),
(136, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.69.130', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 16:47:08'),
(137, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.69.130', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 16:47:08'),
(138, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.69.130', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 16:47:19'),
(139, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.69.130', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 17:01:10'),
(140, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.69.130', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 17:01:11'),
(141, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.69.130', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 17:01:11'),
(142, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.69.130', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 17:01:12'),
(143, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.69.130', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 18:09:44'),
(144, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.69.130', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 18:09:45'),
(145, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.69.130', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 18:09:46'),
(146, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.69.130', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 18:32:00'),
(147, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.69.130', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-08 18:34:13'),
(148, 'Akeke Blessing', 'blessing_akeke@bat.com', '197.210.84.42', 'Owerri, Imo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-09 10:26:49'),
(149, 'Akeke Blessing', 'blessing_akeke@bat.com', '197.210.84.42', 'Owerri, Imo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-09 10:26:50'),
(150, 'Akeke Blessing', 'blessing_akeke@bat.com', '197.210.84.42', 'Owerri, Imo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-09 10:26:53'),
(151, NULL, NULL, '102.90.101.135', 'Awka, Anambra, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-09 10:55:52'),
(152, NULL, NULL, '102.90.101.135', 'Awka, Anambra, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-09 10:56:30'),
(153, 'Ogunfile Olanrewaju Philip', 'olanrewaju_Ogunfile@bat.com', '102.90.101.135', 'Awka, Anambra, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-09 10:56:30'),
(154, 'Ogunfile Olanrewaju Philip', 'olanrewaju_Ogunfile@bat.com', '102.90.101.135', 'Awka, Anambra, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-09 10:56:32'),
(155, 'Ogunfile Olanrewaju Philip', 'olanrewaju_Ogunfile@bat.com', '102.90.101.135', 'Awka, Anambra, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-09 10:56:45'),
(156, NULL, NULL, '102.89.68.237', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 10:11:10'),
(157, NULL, NULL, '102.89.68.237', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 10:12:27'),
(158, 'Atuluku Stephen Obaje', 'stephen_atuluku@bat.com', '102.89.68.237', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 10:12:28'),
(159, 'Atuluku Stephen Obaje', 'stephen_atuluku@bat.com', '102.89.68.237', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 10:12:31'),
(160, 'Atuluku Stephen Obaje', 'stephen_atuluku@bat.com', '102.89.68.237', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 10:13:42'),
(161, 'Ogunfile Olanrewaju Philip', 'olanrewaju_Ogunfile@bat.com', '102.90.96.9', 'Abakaliki, Ebonyi State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 10:30:32'),
(162, 'Ogunfile Olanrewaju Philip', 'olanrewaju_Ogunfile@bat.com', '102.90.96.9', 'Abakaliki, Ebonyi State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 10:30:33'),
(163, 'Ogunfile Olanrewaju Philip', 'olanrewaju_Ogunfile@bat.com', '102.90.96.9', 'Abakaliki, Ebonyi State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 10:30:35'),
(164, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '105.112.219.63', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 11:06:32'),
(165, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '105.112.219.63', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 11:06:33'),
(166, 'Ogunfile Olanrewaju Philip', 'olanrewaju_Ogunfile@bat.com', '102.90.96.9', 'Abakaliki, Ebonyi State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 11:09:38'),
(167, 'Ogunfile Olanrewaju Philip', 'olanrewaju_Ogunfile@bat.com', '102.90.96.9', 'Abakaliki, Ebonyi State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 11:09:39'),
(168, 'Ogunfile Olanrewaju Philip', 'olanrewaju_Ogunfile@bat.com', '102.90.96.9', 'Abakaliki, Ebonyi State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 11:09:39'),
(169, NULL, NULL, '102.90.79.19', 'Port Harcourt, Rivers State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 14:00:08'),
(170, 'Uwalaka Joachin Chinomso', 'uwalaka_chinomso@bat.com', '102.90.79.19', 'Port Harcourt, Rivers State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 14:00:09'),
(171, 'Uwalaka Joachin Chinomso', 'uwalaka_chinomso@bat.com', '102.90.79.19', 'Port Harcourt, Rivers State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 14:00:11'),
(172, 'Uwalaka Joachin Chinomso', 'uwalaka_chinomso@bat.com', '102.90.79.19', 'Port Harcourt, Rivers State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 14:00:56'),
(173, 'Olalekan Omolaja', 'omolaja_olalekan@bat.com', '102.89.41.98', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 14:26:26'),
(174, 'Olalekan Omolaja', 'omolaja_olalekan@bat.com', '102.89.41.98', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 14:27:52'),
(175, NULL, NULL, '105.119.17.89', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 14:41:38'),
(176, 'Taiwo Raji', 'taiwo_raji@bat.com', '105.119.17.89', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 14:41:38'),
(177, 'Taiwo Raji', 'taiwo_raji@bat.com', '105.119.17.89', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 14:41:40'),
(178, 'Taiwo Raji', 'taiwo_raji@bat.com', '105.119.17.89', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 14:43:34'),
(179, 'Taiwo Raji', 'taiwo_raji@bat.com', '105.119.17.89', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 16:08:21'),
(180, 'Taiwo Raji', 'taiwo_raji@bat.com', '105.119.17.89', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 16:08:22'),
(181, 'Taiwo Raji', 'taiwo_raji@bat.com', '105.119.17.89', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 16:09:06'),
(182, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '105.112.218.105', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 20:54:50'),
(183, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '105.112.218.105', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 20:54:51'),
(184, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '105.112.218.105', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 20:55:03'),
(185, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '105.112.215.72', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 22:14:16'),
(186, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '105.112.215.72', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 22:14:17'),
(187, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '105.112.215.72', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-10 22:14:31'),
(188, 'Olalekan Omolaja', 'omolaja_olalekan@bat.com', '197.210.29.191', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-11 03:50:24'),
(189, 'Olalekan Omolaja', 'omolaja_olalekan@bat.com', '197.210.29.191', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-11 03:50:25'),
(190, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '105.112.215.72', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-11 06:57:40'),
(191, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '105.112.215.72', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-11 06:57:40'),
(192, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '105.112.215.72', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-11 06:57:40'),
(193, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '105.112.215.72', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-11 06:57:40'),
(194, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '105.112.215.72', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-11 07:08:19'),
(195, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '105.112.215.72', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-11 07:08:19'),
(196, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '105.112.215.72', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-11 07:08:19'),
(197, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '105.112.215.72', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-11 07:08:20'),
(198, NULL, NULL, '129.222.206.152', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-11 15:11:01'),
(199, 'Sadiq Marafa', 'sadiq_marafa@bat.com', '129.222.206.152', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-11 15:11:02'),
(200, 'Sadiq Marafa', 'sadiq_marafa@bat.com', '129.222.206.152', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-11 15:11:03'),
(201, 'Sadiq Marafa', 'sadiq_marafa@bat.com', '129.222.206.152', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-11 15:11:19'),
(202, 'Olalekan Omolaja', 'omolaja_olalekan@bat.com', '102.88.110.36', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-14 11:03:41'),
(203, 'Olalekan Omolaja', 'omolaja_olalekan@bat.com', '102.88.110.36', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-14 11:03:41'),
(204, NULL, NULL, '105.112.181.59', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-14 13:44:57'),
(205, NULL, NULL, '105.112.181.59', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-14 13:56:53'),
(206, 'Haruna Hassan', 'haruna_hassan@bat.com', '105.112.181.59', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-14 13:56:53'),
(207, 'Haruna Hassan', 'haruna_hassan@bat.com', '105.112.181.59', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-14 13:56:55'),
(208, 'Haruna Hassan', 'haruna_hassan@bat.com', '105.112.181.59', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-14 14:02:27'),
(209, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.85.180', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-15 08:39:25'),
(210, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.85.180', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-15 08:39:26'),
(211, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.85.180', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-15 08:39:28'),
(212, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.85.180', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-15 08:43:18'),
(213, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.85.180', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-15 08:43:19'),
(214, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.85.180', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-15 08:43:34'),
(215, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.85.180', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-15 08:48:14'),
(216, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.85.180', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-15 08:48:15'),
(217, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.85.180', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-15 08:48:22'),
(218, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.85.180', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-15 09:03:58'),
(219, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.85.180', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-15 09:03:58'),
(220, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.85.180', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-15 09:03:59'),
(221, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.85.180', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-15 09:05:11'),
(222, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '102.89.84.208', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-22 16:05:20'),
(223, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '102.89.84.208', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-22 16:05:20'),
(224, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '102.89.84.208', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-22 16:05:24'),
(225, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.69.208', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-23 13:13:24'),
(226, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.69.208', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-23 13:13:24'),
(227, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.69.208', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-23 13:13:26'),
(228, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.83.204', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-24 20:06:20'),
(229, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.83.204', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-24 20:06:21'),
(230, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.83.204', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-24 20:06:25'),
(231, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.83.204', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-24 21:31:27'),
(232, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.83.204', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-24 21:31:27'),
(233, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.83.204', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-24 21:31:27'),
(234, 'Taiwo Raji', 'taiwo_raji@bat.com', '102.89.75.58', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-29 06:03:56'),
(235, 'Taiwo Raji', 'taiwo_raji@bat.com', '102.89.75.58', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-29 06:03:57'),
(236, 'Taiwo Raji', 'taiwo_raji@bat.com', '102.89.75.58', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-29 06:04:52'),
(237, NULL, NULL, '102.91.105.162', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-29 09:06:42'),
(238, 'AL-Sabah Ibrahim', 'al-sabah_ibrahim@bat.com', '102.91.105.162', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-29 09:06:43'),
(239, 'AL-Sabah Ibrahim', 'al-sabah_ibrahim@bat.com', '102.91.105.162', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-29 09:06:44'),
(240, 'AL-Sabah Ibrahim', 'al-sabah_ibrahim@bat.com', '102.91.105.162', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-29 09:07:41'),
(241, 'Jamil Ibrahim', 'jamil_ibrahim@bat.com', '105.115.0.250', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-29 13:48:23'),
(242, 'Jamil Ibrahim', 'jamil_ibrahim@bat.com', '105.115.0.250', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-29 13:48:24'),
(243, 'Jamil Ibrahim', 'jamil_ibrahim@bat.com', '105.115.0.250', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-29 13:48:46'),
(244, 'Taiwo Raji', 'taiwo_raji@bat.com', '102.89.33.40', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-29 13:54:37'),
(245, 'Taiwo Raji', 'taiwo_raji@bat.com', '102.89.33.40', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-29 13:54:37'),
(246, 'Taiwo Raji', 'taiwo_raji@bat.com', '102.89.33.40', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-29 13:54:37'),
(247, 'Taiwo Raji', 'taiwo_raji@bat.com', '102.89.33.40', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-29 13:54:46'),
(248, 'AL-Sabah Ibrahim', 'al-sabah_ibrahim@bat.com', '105.112.184.174', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-30 12:41:19'),
(249, 'AL-Sabah Ibrahim', 'al-sabah_ibrahim@bat.com', '105.112.184.174', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-30 12:41:19'),
(250, 'AL-Sabah Ibrahim', 'al-sabah_ibrahim@bat.com', '105.112.184.174', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-04-30 12:41:22'),
(251, 'Braimah Abdulreheem', 'abdulreheem_braimah@bat.com', '105.112.112.190', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-03 16:03:48'),
(252, 'Braimah Abdulreheem', 'abdulreheem_braimah@bat.com', '105.112.112.190', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-03 16:03:49'),
(253, 'Braimah Abdulreheem', 'abdulreheem_braimah@bat.com', '105.112.112.190', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-03 16:03:50'),
(254, 'Braimah Abdulreheem', 'abdulreheem_braimah@bat.com', '105.112.112.190', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-03 16:05:49'),
(255, 'Braimah Abdulreheem', 'abdulreheem_braimah@bat.com', '105.112.112.190', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-03 16:05:49'),
(256, 'Braimah Abdulreheem', 'abdulreheem_braimah@bat.com', '105.112.112.190', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-03 16:05:51'),
(257, 'Braimah Abdulreheem', 'abdulreheem_braimah@bat.com', '105.112.112.190', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-03 16:05:53'),
(258, NULL, NULL, '105.112.103.153', 'Minna, Niger State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-05 09:00:07'),
(259, 'Ojielo Emeka James', 'emeka_ojielo@bat.com', '105.112.103.153', 'Minna, Niger State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-05 09:00:08'),
(260, 'Ojielo Emeka James', 'emeka_ojielo@bat.com', '105.112.103.153', 'Minna, Niger State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-05 09:00:10'),
(261, 'Ojielo Emeka James', 'emeka_ojielo@bat.com', '105.112.103.153', 'Minna, Niger State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-05 09:04:56'),
(262, 'AL-Sabah Ibrahim', 'al-sabah_ibrahim@bat.com', '105.112.193.21', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-13 10:58:28'),
(263, 'AL-Sabah Ibrahim', 'al-sabah_ibrahim@bat.com', '105.112.193.21', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-13 10:58:29'),
(264, 'AL-Sabah Ibrahim', 'al-sabah_ibrahim@bat.com', '105.112.193.21', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-13 10:58:32'),
(265, 'Sadiq Marafa', 'sadiq_marafa@bat.com', '105.112.190.146', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-13 12:49:17'),
(266, 'Sadiq Marafa', 'sadiq_marafa@bat.com', '105.112.190.146', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-13 12:49:17'),
(267, 'Sadiq Marafa', 'sadiq_marafa@bat.com', '105.112.190.146', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-13 12:49:51'),
(268, NULL, NULL, '102.91.102.23', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-13 17:04:02'),
(269, 'AL-Sabah Ibrahim', 'al-sabah_ibrahim@bat.com', '102.91.102.23', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-13 17:04:04'),
(270, 'AL-Sabah Ibrahim', 'al-sabah_ibrahim@bat.com', '102.91.102.23', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-13 17:04:14'),
(271, 'AL-Sabah Ibrahim', 'al-sabah_ibrahim@bat.com', '102.91.102.23', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-13 17:04:40'),
(272, 'Ogunfile Olanrewaju Philip', 'olanrewaju_Ogunfile@bat.com', '105.112.219.37', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-14 11:14:06'),
(273, 'Ogunfile Olanrewaju Philip', 'olanrewaju_Ogunfile@bat.com', '105.112.219.37', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-14 11:14:07'),
(274, 'Ogunfile Olanrewaju Philip', 'olanrewaju_Ogunfile@bat.com', '105.112.219.37', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-14 11:14:15'),
(275, NULL, NULL, '105.112.219.37', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-14 11:19:52'),
(276, NULL, NULL, '105.112.219.37', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-14 11:22:02'),
(277, 'Ogunfile Olanrewaju Philip', 'olanrewaju_Ogunfile@bat.com', '105.112.219.37', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-14 11:22:02'),
(278, 'Ogunfile Olanrewaju Philip', 'olanrewaju_Ogunfile@bat.com', '105.112.219.37', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-14 11:22:04'),
(279, 'Ogunfile Olanrewaju Philip', 'olanrewaju_Ogunfile@bat.com', '105.112.219.37', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-14 11:22:11'),
(280, 'Ojielo Emeka James', 'emeka_ojielo@bat.com', '105.112.219.94', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-15 09:56:19'),
(281, 'Ojielo Emeka James', 'emeka_ojielo@bat.com', '105.112.219.94', 'Benin City, Edo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-15 09:56:19'),
(282, 'Taiwo Raji', 'taiwo_raji@bat.com', '102.89.84.84', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-15 16:46:17'),
(283, 'Taiwo Raji', 'taiwo_raji@bat.com', '102.89.84.84', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-15 16:46:22'),
(284, 'Oluwaseun Oyeyemi', 'oluwaseun_oyeyemi@bat.com', '102.219.153.204', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-29 14:02:32'),
(285, 'Oluwaseun Oyeyemi', 'oluwaseun_oyeyemi@bat.com', '102.219.153.204', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-29 14:02:32'),
(286, 'Oluwaseun Oyeyemi', 'oluwaseun_oyeyemi@bat.com', '102.219.153.215', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-29 14:03:08'),
(287, NULL, NULL, '102.89.32.27', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-30 11:58:30'),
(288, 'Sandra Njaka', 'sandra_njaka@bat.com', '102.89.32.27', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-30 19:59:04'),
(289, 'Sandra Njaka', 'sandra_njaka@bat.com', '102.89.32.27', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-30 19:59:52'),
(290, 'Sandra Njaka', 'sandra_njaka@bat.com', '102.89.32.27', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-30 20:04:07'),
(291, 'Sandra Njaka', 'sandra_njaka@bat.com', '102.89.32.27', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-30 20:04:32'),
(292, 'Sandra Njaka', 'sandra_njaka@bat.com', '102.89.32.27', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-30 20:46:32'),
(293, 'Sandra Njaka', 'sandra_njaka@bat.com', '102.89.32.27', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-30 20:46:33'),
(294, 'Sandra Njaka', 'sandra_njaka@bat.com', '102.89.32.27', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-30 20:47:05'),
(295, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.109.254', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-31 02:47:10'),
(296, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.109.254', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-05-31 02:47:26'),
(297, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.89.33.115', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-02 06:22:51'),
(298, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.89.33.115', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-02 06:22:52'),
(299, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.89.33.115', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-02 06:23:18'),
(300, 'Haruna Hassan', 'haruna_hassan@bat.com', '105.112.124.188', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-02 14:45:37'),
(301, 'Haruna Hassan', 'haruna_hassan@bat.com', '105.112.124.188', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-02 14:45:55'),
(302, 'Haruna Hassan', 'haruna_hassan@bat.com', '105.112.12.211', 'Ikotun, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 14:48:16'),
(303, 'Haruna Hassan', 'haruna_hassan@bat.com', '105.112.12.211', 'Ikotun, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 14:48:18'),
(304, 'Haruna Hassan', 'haruna_hassan@bat.com', '105.112.204.150', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 15:51:18'),
(305, 'Haruna Hassan', 'haruna_hassan@bat.com', '105.112.204.150', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 15:51:19'),
(306, 'Haruna Hassan', 'haruna_hassan@bat.com', '105.112.204.150', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 15:51:19'),
(307, 'Haruna Hassan', 'haruna_hassan@bat.com', '105.112.204.150', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 15:51:19'),
(308, 'Haruna Hassan', 'haruna_hassan@bat.com', '105.112.204.150', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 15:51:19'),
(309, 'Haruna Hassan', 'haruna_hassan@bat.com', '105.112.204.150', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 15:51:19'),
(310, 'Haruna Hassan', 'haruna_hassan@bat.com', '105.112.204.150', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 15:51:19'),
(311, 'Haruna Hassan', 'haruna_hassan@bat.com', '105.112.204.150', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 15:51:20'),
(312, 'Haruna Hassan', 'haruna_hassan@bat.com', '105.112.204.150', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 15:52:28'),
(313, 'Sandra Njaka', 'sandra_njaka@bat.com', '102.88.112.22', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 16:00:53'),
(314, 'Haruna Hassan', 'haruna_hassan@bat.com', '105.112.12.78', 'Ikotun, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 16:09:52'),
(315, 'Haruna Hassan', 'haruna_hassan@bat.com', '105.112.12.78', 'Ikotun, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 16:09:52'),
(316, 'Haruna Hassan', 'haruna_hassan@bat.com', '105.112.12.78', 'Ikotun, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 16:09:52'),
(317, 'Haruna Hassan', 'haruna_hassan@bat.com', '105.112.12.78', 'Ikotun, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 16:09:53'),
(318, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.89.34.94', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 16:44:10'),
(319, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.89.34.94', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 16:44:10');
INSERT INTO `users_log` (`id`, `name`, `email`, `ip_address`, `location`, `device_type`, `operating_system`, `device_model`, `created_at`) VALUES
(320, 'Sandra Njaka', 'sandra_njaka@bat.com', '102.88.112.22', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 17:09:45'),
(321, NULL, NULL, '102.88.112.22', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 17:27:53'),
(322, NULL, NULL, '102.88.112.22', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 17:28:11'),
(323, 'Sandra Njaka', 'sandra_njaka@bat.com', '102.88.112.22', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 17:28:12'),
(324, 'Sandra Njaka', 'sandra_njaka@bat.com', '102.88.112.22', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 17:28:14'),
(325, 'Sandra Njaka', 'sandra_njaka@bat.com', '102.88.112.22', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 20:00:41'),
(326, 'Sandra Njaka', 'sandra_njaka@bat.com', '102.88.112.22', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 20:00:42'),
(327, 'Sandra Njaka', 'sandra_njaka@bat.com', '102.88.112.22', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 20:01:00'),
(328, 'Sandra Njaka', 'sandra_njaka@bat.com', '102.88.112.22', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 20:57:07'),
(329, 'Sandra Njaka', 'sandra_njaka@bat.com', '102.88.112.22', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 20:57:08'),
(330, 'Sandra Njaka', 'sandra_njaka@bat.com', '102.88.112.22', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-03 20:57:21'),
(331, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.83.25', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-07 23:31:08'),
(332, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.83.25', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-07 23:31:09'),
(333, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.83.25', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-07 23:31:16'),
(334, 'Braimah Abdulreheem', 'abdulreheem_braimah@bat.com', '105.112.113.52', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-12 19:59:10'),
(335, 'Braimah Abdulreheem', 'abdulreheem_braimah@bat.com', '105.112.113.52', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-12 19:59:11'),
(336, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 11:03:31'),
(337, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 11:03:32'),
(338, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 12:26:16'),
(339, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 12:47:43'),
(340, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 12:47:50'),
(341, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 12:47:51'),
(342, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 12:47:59'),
(343, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 12:48:45'),
(344, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 12:50:27'),
(345, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 12:50:57'),
(346, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 12:51:01'),
(347, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 12:51:08'),
(348, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 12:55:20'),
(349, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 12:55:20'),
(350, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 12:57:41'),
(351, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 12:57:54'),
(352, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 12:57:55'),
(353, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 12:58:00'),
(354, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 12:58:11'),
(355, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 12:58:32'),
(356, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 12:58:45'),
(357, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 12:58:47'),
(358, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.110.143', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-19 12:58:57'),
(359, NULL, NULL, '102.88.111.65', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-20 07:57:31'),
(360, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.111.65', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-20 07:57:32'),
(361, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.111.65', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-20 07:57:33'),
(362, NULL, NULL, '102.88.111.65', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-20 08:40:59'),
(363, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.111.65', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-20 08:40:59'),
(364, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.111.65', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-20 08:41:01'),
(365, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.111.65', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-20 09:24:41'),
(366, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.111.65', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-20 09:24:41'),
(367, 'Braimah Abdulreheem', 'abdulreheem_braimah@bat.com', '102.91.103.136', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-20 17:26:32'),
(368, 'Braimah Abdulreheem', 'abdulreheem_braimah@bat.com', '102.91.103.136', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-20 17:26:33'),
(369, 'Braimah Abdulreheem', 'abdulreheem_braimah@bat.com', '102.91.103.136', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-20 17:27:10'),
(370, 'Braimah Abdulreheem', 'abdulreheem_braimah@bat.com', '197.210.53.229', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-20 18:37:30'),
(371, 'Braimah Abdulreheem', 'abdulreheem_braimah@bat.com', '197.210.53.229', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-20 18:37:30'),
(372, 'Braimah Abdulreheem', 'abdulreheem_braimah@bat.com', '197.210.53.229', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-20 18:38:03'),
(373, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.68.43', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-21 15:17:49'),
(374, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.68.43', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-21 15:17:51'),
(375, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.68.43', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-21 15:17:58'),
(376, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.69.78', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-26 09:00:02'),
(377, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.69.78', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-26 09:00:03'),
(378, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.69.78', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-26 09:00:07'),
(379, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '102.91.71.188', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-26 09:53:55'),
(380, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '102.91.71.188', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-26 09:54:04'),
(381, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '102.91.71.188', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-26 09:54:04'),
(382, 'Taiwo Raji', 'taiwo_raji@bat.com', '102.89.47.236', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-26 13:50:00'),
(383, 'Taiwo Raji', 'taiwo_raji@bat.com', '102.89.47.236', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-26 13:50:00'),
(384, 'Taiwo Raji', 'taiwo_raji@bat.com', '102.89.47.236', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-26 13:50:36'),
(385, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '197.210.70.210', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-26 20:21:26'),
(386, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '197.210.70.210', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-26 20:21:27'),
(387, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '197.210.70.210', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-26 20:21:28'),
(388, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '197.210.70.210', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-26 20:21:29'),
(389, 'Uwalaka Joachin Chinomso', 'uwalaka_chinomso@bat.com', '102.90.82.195', 'Port Harcourt, Rivers State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-26 21:32:38'),
(390, 'Uwalaka Joachin Chinomso', 'uwalaka_chinomso@bat.com', '102.90.82.195', 'Port Harcourt, Rivers State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-26 21:32:38'),
(391, 'Uwalaka Joachin Chinomso', 'uwalaka_chinomso@bat.com', '102.90.82.195', 'Port Harcourt, Rivers State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-26 21:32:48'),
(392, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '102.91.4.141', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-28 19:32:23'),
(393, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '102.91.4.141', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-28 19:32:24'),
(394, 'Tina Ejiofor', 'tina_nkeiru_ejiofor@bat.com', '102.91.4.141', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-06-28 19:32:29'),
(395, NULL, NULL, '105.112.228.20', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-02 06:17:47'),
(396, 'Auwalu Sani Umar', 'Auwalu_Sani@bat.com', '105.112.228.20', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-02 06:17:48'),
(397, 'Auwalu Sani Umar', 'Auwalu_Sani@bat.com', '105.112.228.20', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-02 06:18:08'),
(398, 'Auwalu Sani Umar', 'Auwalu_Sani@bat.com', '105.112.228.20', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-02 06:19:38'),
(399, 'Auwalu Sani Umar', 'Auwalu_Sani@bat.com', '105.112.114.41', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-02 09:06:15'),
(400, 'Auwalu Sani Umar', 'Auwalu_Sani@bat.com', '105.112.114.41', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-02 09:06:23'),
(401, 'Auwalu Sani Umar', 'Auwalu_Sani@bat.com', '105.112.226.252', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-02 09:52:21'),
(402, 'Taiwo Raji', 'taiwo_raji@bat.com', '102.89.82.119', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-04 15:25:05'),
(403, 'Taiwo Raji', 'taiwo_raji@bat.com', '102.89.82.119', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-04 15:25:05'),
(404, 'Taiwo Raji', 'taiwo_raji@bat.com', '102.89.82.119', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-04 15:25:06'),
(405, 'Sandra Njaka', 'sandra_njaka@bat.com', '102.89.23.77', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-06 15:23:04'),
(406, 'Sandra Njaka', 'sandra_njaka@bat.com', '102.89.23.77', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-06 15:23:05'),
(407, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.68.252', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-08 12:59:59'),
(408, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.68.252', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-08 12:59:59'),
(409, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.68.252', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-08 13:00:07'),
(410, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.22.187', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-08 15:13:32'),
(411, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.22.187', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-08 15:13:43'),
(412, 'Oluwaseun Oyeyemi', 'oluwaseun_oyeyemi@bat.com', '102.219.153.221', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-11 14:06:08'),
(413, 'Oluwaseun Oyeyemi', 'oluwaseun_oyeyemi@bat.com', '102.219.153.195', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-11 14:06:13'),
(414, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.69.139', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-15 13:22:19'),
(415, 'Akeke Blessing', 'blessing_akeke@bat.com', '102.89.69.139', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-15 13:22:30'),
(416, 'Taiwo Raji', 'taiwo_raji@bat.com', '102.89.46.82', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-22 20:33:26'),
(417, 'Taiwo Raji', 'taiwo_raji@bat.com', '102.89.46.82', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-22 20:33:28'),
(418, 'Auwalu Sani Umar', 'Auwalu_Sani@bat.com', '105.112.229.186', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-23 17:56:44'),
(419, 'Auwalu Sani Umar', 'Auwalu_Sani@bat.com', '105.112.229.186', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-23 17:56:44'),
(420, 'Auwalu Sani Umar', 'Auwalu_Sani@bat.com', '105.112.229.186', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-23 17:57:17'),
(421, 'Olalekan Omolaja', 'omolaja_olalekan@bat.com', '102.88.113.79', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-27 07:02:38'),
(422, 'Olalekan Omolaja', 'omolaja_olalekan@bat.com', '102.88.113.79', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-27 07:02:38'),
(423, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '105.112.179.135', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-28 07:14:12'),
(424, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '105.112.179.135', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-28 07:14:12'),
(425, 'Braimah Abdulreheem', 'abdulreheem_braimah@bat.com', '102.89.33.18', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-28 12:01:35'),
(426, 'Braimah Abdulreheem', 'abdulreheem_braimah@bat.com', '102.89.33.18', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-28 12:01:41'),
(427, 'Braimah Abdulreheem', 'abdulreheem_braimah@bat.com', '102.89.33.18', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-28 12:01:42'),
(428, 'Morenikeji Dairo', 'morenikeji_dairo@bat.com', '102.88.111.180', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-28 13:53:09'),
(429, 'Morenikeji Dairo', 'morenikeji_dairo@bat.com', '102.88.111.180', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-28 13:53:09'),
(430, 'Morenikeji Dairo', 'morenikeji_dairo@bat.com', '102.88.111.180', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-07-28 13:53:16'),
(431, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.108.221', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-01 09:03:18'),
(432, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.108.221', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-01 09:03:19'),
(433, 'Auwalu Sani Umar', 'Auwalu_Sani@bat.com', '105.112.120.103', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-01 09:21:32'),
(434, 'Auwalu Sani Umar', 'Auwalu_Sani@bat.com', '105.112.120.103', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-01 09:21:33'),
(435, 'Auwalu Sani Umar', 'Auwalu_Sani@bat.com', '105.112.120.103', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-01 09:21:39'),
(436, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.108.221', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-01 11:59:52'),
(437, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.108.221', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-01 11:59:53'),
(438, 'Auwalu Sani Umar', 'Auwalu_Sani@bat.com', '105.113.25.202', 'Kano, Kano State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-07 12:16:12'),
(439, 'Auwalu Sani Umar', 'Auwalu_Sani@bat.com', '105.113.25.202', 'Kano, Kano State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-07 12:16:13'),
(440, 'Auwalu Sani Umar', 'Auwalu_Sani@bat.com', '105.113.25.202', 'Kano, Kano State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-07 12:16:13'),
(441, 'Auwalu Sani Umar', 'Auwalu_Sani@bat.com', '105.113.25.202', 'Kano, Kano State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-07 12:16:29'),
(442, 'Oluwaseun Oyeyemi', 'oluwaseun_oyeyemi@bat.com', '102.219.153.206', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-07 17:15:02'),
(443, 'Oluwaseun Oyeyemi', 'oluwaseun_oyeyemi@bat.com', '102.219.153.222', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-07 17:15:13'),
(444, 'Atuluku Stephen Obaje', 'stephen_atuluku@bat.com', '102.89.84.39', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-10 17:45:05'),
(445, 'Atuluku Stephen Obaje', 'stephen_atuluku@bat.com', '102.89.84.39', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-10 17:45:06'),
(446, 'Atuluku Stephen Obaje', 'stephen_atuluku@bat.com', '102.91.97.146', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-10 18:26:43'),
(447, 'Atuluku Stephen Obaje', 'stephen_atuluku@bat.com', '102.91.97.146', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-10 18:26:43'),
(448, 'Atuluku Stephen Obaje', 'stephen_atuluku@bat.com', '102.91.97.146', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-10 18:26:43'),
(449, NULL, NULL, '102.91.105.106', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-17 13:57:27'),
(450, 'Victor Ayodeji', 'victor_ayodeji@bat.com', '102.91.105.106', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-17 13:57:28'),
(451, 'Victor Ayodeji', 'victor_ayodeji@bat.com', '102.91.105.106', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-17 13:57:29'),
(452, 'Victor Ayodeji', 'victor_ayodeji@bat.com', '102.91.105.106', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-17 14:00:03'),
(453, 'Victor Ayodeji', 'victor_ayodeji@bat.com', '102.91.98.173', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-17 15:15:49'),
(454, 'Victor Ayodeji', 'victor_ayodeji@bat.com', '102.91.105.193', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-18 06:17:30'),
(455, 'Victor Ayodeji', 'victor_ayodeji@bat.com', '102.91.105.193', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-18 06:17:31'),
(456, 'Victor Ayodeji', 'victor_ayodeji@bat.com', '102.91.105.193', 'Abuja, FCT, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-18 06:19:37'),
(457, 'Taiwo Raji', 'taiwo_raji@bat.com', '105.119.21.177', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-25 13:15:09'),
(458, 'Taiwo Raji', 'taiwo_raji@bat.com', '105.119.21.177', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-25 13:15:10'),
(459, 'Taiwo Raji', 'taiwo_raji@bat.com', '105.119.21.177', 'Ibadan, Oyo State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-25 13:16:54'),
(460, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.109.168', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-31 09:38:54'),
(461, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.109.168', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-31 09:38:55'),
(462, 'Magdalene Edozie', 'magdalene_edozie@nubiaville.onmicrosoft.com', '102.88.109.168', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-08-31 09:39:11'),
(463, NULL, NULL, '::1', 'Unknown', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-09-29 18:35:53'),
(464, NULL, NULL, '::1', 'Unknown', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-09-29 18:38:54'),
(465, NULL, NULL, '102.88.111.141', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-14 12:51:09'),
(466, NULL, NULL, '102.88.111.141', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-14 12:51:15'),
(467, NULL, NULL, '102.88.111.141', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-14 13:12:16'),
(468, NULL, NULL, '102.88.111.141', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-14 13:26:04'),
(469, NULL, NULL, '102.212.209.30', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-17 12:28:09'),
(470, NULL, NULL, '102.212.209.30', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-17 12:29:56'),
(471, NULL, NULL, '102.212.209.4', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-17 17:00:36'),
(472, NULL, NULL, '169.255.124.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-18 17:04:22'),
(473, NULL, NULL, '102.89.23.98', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-19 13:23:39'),
(474, NULL, NULL, '102.89.23.98', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-19 13:26:58'),
(475, NULL, NULL, '102.89.23.98', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-19 13:27:52'),
(476, NULL, NULL, '102.89.23.98', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-19 13:29:48'),
(477, NULL, NULL, '102.89.23.98', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-19 13:32:03'),
(478, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-19 13:32:38'),
(479, NULL, NULL, '169.255.124.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-19 13:48:50'),
(480, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-19 13:49:16'),
(481, NULL, NULL, '169.255.124.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-19 13:51:21'),
(482, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-19 15:18:36'),
(483, NULL, NULL, '102.89.23.98', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-19 15:42:31'),
(484, NULL, NULL, '102.89.23.98', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-19 16:20:45'),
(485, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-19 16:33:26'),
(486, NULL, NULL, '102.89.23.98', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-19 16:39:43'),
(487, NULL, NULL, '102.89.23.98', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-19 16:41:18'),
(488, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-19 16:45:16'),
(489, NULL, NULL, '102.89.47.31', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-20 11:41:56'),
(490, NULL, NULL, '169.255.124.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-20 16:40:26'),
(491, NULL, NULL, '102.212.209.30', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-21 05:06:39'),
(492, NULL, NULL, '102.89.47.102', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-21 08:16:42'),
(493, NULL, NULL, '169.255.124.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-21 08:35:01'),
(494, NULL, NULL, '102.89.47.102', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-21 09:47:39'),
(495, NULL, NULL, '102.88.105.242', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-21 10:17:31'),
(496, NULL, NULL, '102.88.105.242', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-21 10:17:32'),
(497, NULL, NULL, '102.89.47.102', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-21 10:29:25'),
(498, NULL, NULL, '102.88.108.217', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-21 11:11:44'),
(499, NULL, NULL, '102.88.108.217', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-21 11:14:40'),
(500, NULL, NULL, '169.255.124.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-21 13:59:08'),
(501, NULL, NULL, '169.255.124.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-21 15:17:48'),
(502, NULL, NULL, '169.255.124.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-21 15:48:47'),
(503, NULL, NULL, '102.212.209.17', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-23 22:07:39'),
(504, NULL, NULL, '102.212.209.30', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-24 10:52:50'),
(505, NULL, NULL, '102.212.209.30', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-24 10:53:00'),
(506, NULL, NULL, '102.212.209.17', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-24 11:06:35'),
(507, NULL, NULL, '102.212.209.17', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-24 11:19:39'),
(508, NULL, NULL, '102.212.209.21', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-24 11:31:44'),
(509, NULL, NULL, '102.212.209.21', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-24 11:58:57'),
(510, NULL, NULL, '102.212.209.17', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-24 12:00:10'),
(511, NULL, NULL, '102.212.209.17', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-24 12:17:32'),
(512, NULL, NULL, '102.212.209.21', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-24 13:57:34'),
(513, NULL, NULL, '102.212.209.30', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-24 14:11:28'),
(514, NULL, NULL, '102.212.209.21', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-24 14:28:09'),
(515, NULL, NULL, '102.212.209.17', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-24 14:30:36'),
(516, NULL, NULL, '102.88.108.83', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-24 14:38:36'),
(517, NULL, NULL, '102.212.209.21', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-24 14:42:21'),
(518, NULL, NULL, '102.88.108.83', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-24 14:44:10'),
(519, NULL, NULL, '102.212.209.30', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-24 18:26:27'),
(520, NULL, NULL, '102.212.209.17', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-24 19:12:27'),
(521, NULL, NULL, '102.212.209.17', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-24 19:13:27'),
(522, NULL, NULL, '102.212.209.17', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-24 19:20:12'),
(523, NULL, NULL, '169.255.124.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 09:20:46'),
(524, NULL, NULL, '169.255.124.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 10:16:40'),
(525, NULL, NULL, '102.88.111.98', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 11:43:44'),
(526, NULL, NULL, '102.88.111.98', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 12:11:51'),
(527, NULL, NULL, '102.88.111.98', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 12:13:27'),
(528, NULL, NULL, '102.88.111.98', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 12:14:35'),
(529, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 12:45:31'),
(530, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 13:06:33'),
(531, NULL, NULL, '169.255.124.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 16:21:16'),
(532, NULL, NULL, '169.255.124.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 16:23:01'),
(533, NULL, NULL, '102.89.32.144', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 19:23:11'),
(534, NULL, NULL, '102.89.32.144', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 19:26:18'),
(535, NULL, NULL, '102.89.32.144', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 19:35:05'),
(536, NULL, NULL, '102.89.32.144', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 19:36:03'),
(537, NULL, NULL, '102.89.32.144', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 21:29:30'),
(538, NULL, NULL, '102.89.32.144', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 21:35:36'),
(539, NULL, NULL, '102.212.209.21', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 21:44:32'),
(540, NULL, NULL, '102.89.32.144', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 21:48:15'),
(541, NULL, NULL, '102.89.32.144', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 21:51:45'),
(542, NULL, NULL, '102.89.32.144', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 22:00:30'),
(543, NULL, NULL, '102.89.32.144', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 22:07:54'),
(544, NULL, NULL, '102.89.32.144', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 22:15:53'),
(545, NULL, NULL, '102.89.32.144', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-25 22:17:57'),
(546, NULL, NULL, '102.89.32.144', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 00:03:22'),
(547, NULL, NULL, '102.212.209.17', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 00:17:38'),
(548, NULL, NULL, '102.89.42.49', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 05:06:58'),
(549, NULL, NULL, '102.89.42.49', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 05:10:10'),
(550, NULL, NULL, '102.89.42.49', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 05:21:31'),
(551, NULL, NULL, '102.89.42.49', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 05:24:58'),
(552, NULL, NULL, '102.89.42.49', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 05:31:44'),
(553, NULL, NULL, '102.89.42.49', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 05:32:46'),
(554, NULL, NULL, '102.89.42.49', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 05:37:44'),
(555, NULL, NULL, '102.89.42.49', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 05:40:29'),
(556, NULL, NULL, '102.89.42.49', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 05:51:35'),
(557, NULL, NULL, '102.89.42.49', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 05:57:13'),
(558, NULL, NULL, '102.89.42.49', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 06:24:49'),
(559, NULL, NULL, '197.210.29.171', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 07:47:39'),
(560, NULL, NULL, '197.210.29.171', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 08:40:45'),
(561, NULL, NULL, '197.210.29.171', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 09:21:59'),
(562, NULL, NULL, '197.210.29.171', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 09:38:38'),
(563, NULL, NULL, '197.210.29.171', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 10:50:21'),
(564, NULL, NULL, '197.210.29.171', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 11:02:42'),
(565, NULL, NULL, '105.113.79.218', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 11:59:39'),
(566, NULL, NULL, '102.88.114.33', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 13:03:58'),
(567, NULL, NULL, '102.89.47.166', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 13:49:21'),
(568, NULL, NULL, '102.88.114.33', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 13:51:23'),
(569, NULL, NULL, '102.88.114.33', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 13:51:52'),
(570, NULL, NULL, '169.255.124.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 13:52:11'),
(571, NULL, NULL, '197.210.29.171', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 13:56:24'),
(572, NULL, NULL, '102.88.114.33', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 14:01:16'),
(573, NULL, NULL, '169.255.124.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 14:02:08'),
(574, NULL, NULL, '102.89.47.132', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 14:07:41'),
(575, NULL, NULL, '197.210.29.171', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 14:09:55'),
(576, NULL, NULL, '102.89.47.166', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 14:10:17'),
(577, NULL, NULL, '102.88.114.33', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 14:23:14'),
(578, NULL, NULL, '102.89.47.132', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 14:27:11'),
(579, NULL, NULL, '197.210.29.171', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 14:29:14'),
(580, NULL, NULL, '105.113.79.218', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 14:47:36'),
(581, NULL, NULL, '169.255.124.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 15:02:27'),
(582, NULL, NULL, '102.89.47.166', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-26 16:23:11'),
(583, NULL, NULL, '17.84.123.163', 'Singapore, North West, Singapore', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-27 09:31:37'),
(584, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-27 12:51:36'),
(585, NULL, NULL, '102.88.111.167', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-27 13:28:12'),
(586, NULL, NULL, '102.89.22.73', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-28 13:19:13'),
(587, NULL, NULL, '169.255.124.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-28 14:49:56'),
(588, NULL, NULL, '169.255.124.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-28 15:07:21'),
(589, NULL, NULL, '102.89.33.76', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-30 16:26:31'),
(590, NULL, NULL, '102.89.33.76', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-30 16:43:25'),
(591, NULL, NULL, '102.89.33.76', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-30 16:57:25'),
(592, NULL, NULL, '102.212.209.21', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-30 17:03:17'),
(593, NULL, NULL, '102.88.112.243', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-30 18:18:09'),
(594, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-11-30 18:33:07'),
(595, NULL, NULL, '102.89.22.216', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-01 02:29:46'),
(596, NULL, NULL, '102.89.22.216', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-01 02:37:52'),
(597, NULL, NULL, '102.212.209.30', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-01 12:18:30'),
(598, NULL, NULL, '102.212.209.21', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-01 15:43:54'),
(599, NULL, NULL, '102.88.109.189', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-01 18:46:17'),
(600, NULL, NULL, '102.88.109.189', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-01 19:12:35'),
(601, NULL, NULL, '102.88.109.189', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-01 19:13:05'),
(602, NULL, NULL, '102.88.109.189', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-01 19:15:12'),
(603, NULL, NULL, '102.89.41.8', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-02 12:55:21'),
(604, NULL, NULL, '102.89.41.8', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-02 12:56:38'),
(605, NULL, NULL, '102.89.41.8', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-02 12:59:23'),
(606, NULL, NULL, '102.89.41.8', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-02 13:01:36'),
(607, NULL, NULL, '102.89.41.8', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-02 13:11:38'),
(608, NULL, NULL, '102.89.22.252', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-02 14:13:30'),
(609, NULL, NULL, '102.89.22.252', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-02 14:13:53'),
(610, NULL, NULL, '102.89.22.252', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-02 14:14:19'),
(611, NULL, NULL, '102.89.22.252', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-02 14:15:13'),
(612, NULL, NULL, '102.89.22.252', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-02 14:15:47'),
(613, NULL, NULL, '102.89.22.252', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-02 14:46:11'),
(614, NULL, NULL, '102.90.101.174', 'Port Harcourt, Rivers State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-02 15:04:50'),
(615, NULL, NULL, '102.89.22.252', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-02 15:47:22'),
(616, NULL, NULL, '102.90.101.174', 'Port Harcourt, Rivers State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-02 15:49:21'),
(617, NULL, NULL, '102.89.22.252', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-02 16:39:48'),
(618, NULL, NULL, '102.89.22.252', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-02 16:55:35'),
(619, NULL, NULL, '102.89.22.252', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-02 16:56:21'),
(620, NULL, NULL, '102.88.114.189', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-03 13:48:45'),
(621, NULL, NULL, '102.88.114.189', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-04 14:04:56'),
(622, NULL, NULL, '102.88.114.189', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-04 14:09:33'),
(623, NULL, NULL, '102.89.32.25', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-04 16:36:17'),
(624, NULL, NULL, '102.89.32.25', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-04 16:41:14'),
(625, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-05 10:31:07'),
(626, NULL, NULL, '169.255.124.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-05 13:03:45'),
(627, NULL, NULL, '102.212.209.21', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-07 22:39:53'),
(628, NULL, NULL, '102.89.47.147', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-09 14:00:23'),
(629, NULL, NULL, '102.89.47.121', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-09 14:01:25'),
(630, NULL, NULL, '102.88.109.66', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-09 14:35:16'),
(631, NULL, NULL, '102.88.109.66', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-09 14:35:34'),
(632, NULL, NULL, '102.89.47.147', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-09 14:43:09'),
(633, NULL, NULL, '102.89.23.176', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 09:52:08'),
(634, NULL, NULL, '102.89.47.69', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 09:59:14'),
(635, NULL, NULL, '105.113.56.39', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 10:01:38'),
(636, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 10:14:35'),
(637, NULL, NULL, '169.255.124.13', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 10:15:37'),
(638, NULL, NULL, '169.255.124.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 10:19:51'),
(639, NULL, NULL, '169.255.124.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 10:20:15'),
(640, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 10:22:13'),
(641, NULL, NULL, '169.255.124.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 10:22:35'),
(642, NULL, NULL, '169.255.124.13', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 10:25:41'),
(643, NULL, NULL, '169.255.124.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 10:36:57'),
(644, NULL, NULL, '169.255.124.13', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 11:12:00'),
(645, NULL, NULL, '169.255.124.13', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 11:24:49'),
(646, NULL, NULL, '169.255.124.13', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 11:30:33'),
(647, NULL, NULL, '169.255.124.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 11:37:03'),
(648, NULL, NULL, '102.89.23.179', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 12:36:46'),
(649, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 14:42:37'),
(650, NULL, NULL, '169.255.124.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 14:48:42'),
(651, NULL, NULL, '102.89.33.33', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 14:52:07'),
(652, NULL, NULL, '102.89.33.33', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 14:52:41'),
(653, NULL, NULL, '102.89.33.33', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 15:03:16'),
(654, NULL, NULL, '169.255.124.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 15:05:25'),
(655, NULL, NULL, '102.89.33.33', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 15:09:45'),
(656, NULL, NULL, '102.88.111.103', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 15:17:27'),
(657, NULL, NULL, '102.88.111.103', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 15:19:02'),
(658, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 15:20:16'),
(659, NULL, NULL, '169.255.124.13', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 15:20:58');
INSERT INTO `users_log` (`id`, `name`, `email`, `ip_address`, `location`, `device_type`, `operating_system`, `device_model`, `created_at`) VALUES
(660, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 15:21:50'),
(661, NULL, NULL, '102.89.33.33', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 15:28:26'),
(662, NULL, NULL, '169.255.124.13', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 15:33:23'),
(663, NULL, NULL, '102.89.33.33', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 15:43:40'),
(664, NULL, NULL, '102.89.33.33', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 15:46:04'),
(665, NULL, NULL, '102.89.33.33', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 15:47:22'),
(666, NULL, NULL, '169.255.124.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 15:48:28'),
(667, NULL, NULL, '169.255.124.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 15:50:41'),
(668, NULL, NULL, '102.89.33.33', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 15:51:42'),
(669, NULL, NULL, '169.255.124.13', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 15:55:42'),
(670, NULL, NULL, '102.89.33.33', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 15:55:46'),
(671, NULL, NULL, '102.89.47.171', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 16:22:33'),
(672, NULL, NULL, '102.89.47.171', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 16:30:55'),
(673, NULL, NULL, '102.89.47.171', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 16:34:59'),
(674, NULL, NULL, '102.89.47.171', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 16:38:17'),
(675, NULL, NULL, '102.89.47.171', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-10 16:41:40'),
(676, NULL, NULL, '102.88.113.37', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-12 10:22:02'),
(677, NULL, NULL, '102.212.209.22', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-13 14:56:59'),
(678, NULL, NULL, '102.212.209.30', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-13 17:05:15'),
(679, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-13 18:03:42'),
(680, NULL, NULL, '102.212.209.22', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-14 13:58:54'),
(681, NULL, NULL, '102.212.209.30', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-14 19:47:56'),
(682, NULL, NULL, '102.212.209.22', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-15 13:18:02'),
(683, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-15 13:36:20'),
(684, NULL, NULL, '102.212.209.30', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-15 13:36:58'),
(685, NULL, NULL, '105.113.76.62', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-16 17:56:56'),
(686, NULL, NULL, '102.89.46.29', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-17 16:27:41'),
(687, NULL, NULL, '169.255.124.15', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-17 18:02:12'),
(688, NULL, NULL, '169.255.124.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-17 18:05:18'),
(689, NULL, NULL, '169.255.124.15', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-17 18:13:03'),
(690, NULL, NULL, '102.88.115.115', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-18 09:36:42'),
(691, NULL, NULL, '102.88.115.115', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-18 09:37:35'),
(692, NULL, NULL, '102.88.115.115', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-18 10:29:02'),
(693, NULL, NULL, '102.88.115.115', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-18 11:05:26'),
(694, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-31 17:37:05'),
(695, NULL, NULL, '102.212.209.21', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2025-12-31 17:37:34'),
(696, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-02 13:35:48'),
(697, NULL, NULL, '102.212.209.30', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-04 14:36:20'),
(698, NULL, NULL, '102.212.209.21', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-04 17:02:47'),
(699, NULL, NULL, '102.212.209.21', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-04 17:32:54'),
(700, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-04 18:54:58'),
(701, NULL, NULL, '102.212.209.30', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-04 19:13:27'),
(702, NULL, NULL, '102.212.209.21', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-04 19:36:37'),
(703, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-04 20:11:50'),
(704, NULL, NULL, '102.212.209.30', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-05 05:00:30'),
(705, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-05 05:11:55'),
(706, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-05 05:18:48'),
(707, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-05 05:22:16'),
(708, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-05 05:24:34'),
(709, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-05 06:54:37'),
(710, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-06 05:55:46'),
(711, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-06 07:08:31'),
(712, NULL, NULL, '102.212.209.10', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-06 16:05:34'),
(713, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-06 16:23:37'),
(714, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-07 06:43:51'),
(715, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-07 07:17:07'),
(716, NULL, NULL, '102.212.209.30', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-07 07:19:19'),
(717, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-07 07:39:33'),
(718, NULL, NULL, '102.212.209.30', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-07 07:42:15'),
(719, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-07 07:50:15'),
(720, NULL, NULL, '102.212.209.30', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-07 07:55:43'),
(721, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-07 07:57:29'),
(722, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-07 07:58:39'),
(723, NULL, NULL, '102.212.209.30', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-07 08:05:14'),
(724, NULL, NULL, '102.212.209.21', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-10 05:41:31'),
(725, NULL, NULL, '102.212.209.10', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-11 04:53:03'),
(726, NULL, NULL, '102.212.209.10', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-11 12:12:24'),
(727, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-11 12:19:00'),
(728, NULL, NULL, '102.212.209.10', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-11 12:24:18'),
(729, NULL, NULL, '102.212.209.21', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-11 12:26:21'),
(730, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-11 13:33:32'),
(731, NULL, NULL, '102.212.209.21', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-11 13:37:38'),
(732, NULL, NULL, '102.212.209.21', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-11 13:53:42'),
(733, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-11 14:08:38'),
(734, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-11 16:54:29'),
(735, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-11 16:56:02'),
(736, NULL, NULL, '102.212.209.21', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-11 17:39:23'),
(737, NULL, NULL, '102.212.209.21', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-11 17:43:05'),
(738, NULL, NULL, '102.212.209.30', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-12 05:23:24'),
(739, NULL, NULL, '102.212.209.21', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-12 06:21:42'),
(740, NULL, NULL, '102.212.209.17', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-12 09:08:32'),
(741, NULL, NULL, '102.212.209.21', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-12 09:09:28'),
(742, NULL, NULL, '102.212.209.30', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-12 09:09:54'),
(743, NULL, NULL, '102.212.209.21', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-12 09:11:40'),
(744, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-15 13:29:52'),
(745, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-16 10:30:27'),
(746, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-16 10:31:04'),
(747, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-16 16:50:42'),
(748, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-17 05:36:00'),
(749, NULL, NULL, '102.212.209.23', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-18 18:03:27'),
(750, NULL, NULL, '102.212.209.23', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-18 22:02:51'),
(751, NULL, NULL, '102.212.209.23', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-18 22:21:01'),
(752, NULL, NULL, '102.212.209.9', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-18 22:24:23'),
(753, NULL, NULL, '102.212.209.23', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-18 22:28:36'),
(754, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-19 05:22:28'),
(755, NULL, NULL, '102.212.209.23', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-19 05:49:02'),
(756, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-19 07:37:11'),
(757, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-19 08:03:56'),
(758, NULL, NULL, '102.212.209.9', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-19 10:05:12'),
(759, NULL, NULL, '102.212.209.21', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-20 09:49:18'),
(760, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-20 18:20:25'),
(761, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-21 14:52:44'),
(762, NULL, NULL, '102.212.209.9', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-22 18:47:47'),
(763, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-22 19:13:45'),
(764, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-22 22:36:29'),
(765, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 04:47:34'),
(766, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 04:49:24'),
(767, NULL, NULL, '102.212.209.9', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 05:14:45'),
(768, NULL, NULL, '102.212.209.9', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 05:16:17'),
(769, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 05:39:41'),
(770, NULL, NULL, '102.212.209.9', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 05:41:49'),
(771, NULL, NULL, '102.212.209.9', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 05:43:20'),
(772, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 05:45:21'),
(773, NULL, NULL, '169.255.124.13', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 08:34:36'),
(774, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 08:54:48'),
(775, NULL, NULL, '169.255.124.13', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 08:58:17'),
(776, NULL, NULL, '169.255.124.15', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 09:08:43'),
(777, NULL, NULL, '169.255.124.15', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 09:13:05'),
(778, NULL, NULL, '169.255.124.13', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 10:50:36'),
(779, NULL, NULL, '169.255.124.15', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 10:52:24'),
(780, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 11:17:19'),
(781, NULL, NULL, '169.255.124.13', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 11:17:26'),
(782, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 11:20:29'),
(783, NULL, NULL, '169.255.124.13', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 11:22:40'),
(784, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 11:23:49'),
(785, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 11:26:07'),
(786, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 11:30:30'),
(787, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 11:37:45'),
(788, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 11:47:03'),
(789, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 11:52:00'),
(790, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 11:54:04'),
(791, NULL, NULL, '169.255.124.13', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 11:54:57'),
(792, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 12:07:15'),
(793, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 12:26:39'),
(794, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 12:28:28'),
(795, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 12:31:39'),
(796, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 12:32:08'),
(797, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 12:38:08'),
(798, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 12:47:16'),
(799, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 12:47:42'),
(800, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 12:51:19'),
(801, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 12:56:53'),
(802, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 13:08:17'),
(803, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 13:09:10'),
(804, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 13:16:01'),
(805, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 13:24:13'),
(806, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 13:25:07'),
(807, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 13:28:22'),
(808, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 13:28:41'),
(809, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 13:29:39'),
(810, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 13:35:03'),
(811, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 13:43:42'),
(812, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 13:50:45'),
(813, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 14:01:09'),
(814, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 14:01:43'),
(815, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 14:32:37'),
(816, NULL, NULL, '102.88.114.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 15:00:02'),
(817, NULL, NULL, '169.255.124.15', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 15:52:19'),
(818, NULL, NULL, '169.255.124.15', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-23 16:31:05'),
(819, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-24 05:23:37'),
(820, NULL, NULL, '102.89.44.6', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-26 14:37:30'),
(821, NULL, NULL, '102.89.44.6', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-26 16:43:01'),
(822, NULL, NULL, '102.89.44.6', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-26 18:14:31'),
(823, NULL, NULL, '169.255.124.13', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-27 10:33:02'),
(824, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-27 10:33:35'),
(825, NULL, NULL, '169.255.124.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-27 11:43:42'),
(826, NULL, NULL, '169.255.124.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-27 12:41:52'),
(827, NULL, NULL, '169.255.124.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-27 13:01:43'),
(828, NULL, NULL, '169.255.124.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-27 15:04:15'),
(829, NULL, NULL, '169.255.124.15', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-28 13:27:42'),
(830, NULL, NULL, '169.255.124.15', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-28 16:19:22'),
(831, NULL, NULL, '102.88.112.52', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-29 13:52:48'),
(832, NULL, NULL, '169.255.124.15', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-30 12:37:52'),
(833, NULL, NULL, '169.255.124.15', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-30 15:03:57'),
(834, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-31 14:46:41'),
(835, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-31 14:51:54'),
(836, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-31 15:06:01'),
(837, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-31 15:07:51'),
(838, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-31 15:43:33'),
(839, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-01-31 20:22:41'),
(840, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-01 11:58:29'),
(841, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-01 11:58:55'),
(842, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-01 12:01:41'),
(843, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-01 13:49:22'),
(844, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-01 13:50:59'),
(845, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-01 14:39:19'),
(846, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-01 14:59:51'),
(847, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-01 15:01:14'),
(848, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-01 15:04:31'),
(849, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-01 15:14:59'),
(850, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-01 21:37:33'),
(851, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 04:19:22'),
(852, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 04:51:41'),
(853, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 04:55:29'),
(854, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 11:17:15'),
(855, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 12:23:54'),
(856, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 13:22:46'),
(857, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 14:01:44'),
(858, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 14:03:33'),
(859, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 14:32:26'),
(860, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 14:40:00'),
(861, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 14:55:52'),
(862, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 15:53:24'),
(863, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 16:02:04'),
(864, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 18:09:15'),
(865, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 20:21:24'),
(866, NULL, NULL, '102.90.102.240', 'Port Harcourt, Rivers State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 20:23:59'),
(867, NULL, NULL, '102.90.102.240', 'Port Harcourt, Rivers State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 21:00:12'),
(868, NULL, NULL, '102.90.102.240', 'Port Harcourt, Rivers State, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 21:07:08'),
(869, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 22:33:20'),
(870, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 22:41:51'),
(871, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 22:44:36'),
(872, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 22:49:49'),
(873, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 23:00:34'),
(874, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 23:21:35'),
(875, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-02 23:32:08'),
(876, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-03 04:31:12'),
(877, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-03 05:01:04'),
(878, NULL, NULL, '102.88.110.163', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-03 05:19:36'),
(879, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-03 06:31:25'),
(880, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-03 07:26:30'),
(881, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-03 07:27:28'),
(882, NULL, NULL, '169.255.124.15', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-03 13:34:28'),
(883, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-03 13:40:33'),
(884, NULL, NULL, '169.255.124.15', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-03 13:45:04'),
(885, NULL, NULL, '169.255.124.13', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-03 14:57:22'),
(886, NULL, NULL, '102.89.22.85', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-04 11:00:56'),
(887, NULL, NULL, '102.89.22.85', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-04 11:02:13'),
(888, NULL, NULL, '102.89.22.85', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-04 11:03:19'),
(889, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-04 11:52:59'),
(890, NULL, NULL, '169.255.124.13', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-04 14:06:24'),
(891, NULL, NULL, '169.255.124.13', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-04 16:01:19'),
(892, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-05 13:43:18'),
(893, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-05 15:08:14'),
(894, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-05 20:53:36'),
(895, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-06 05:21:35'),
(896, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-06 08:19:39'),
(897, NULL, NULL, '169.255.124.13', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-06 08:40:55'),
(898, NULL, NULL, '169.255.124.15', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-06 08:41:41'),
(899, NULL, NULL, '169.255.124.15', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-06 08:53:35'),
(900, NULL, NULL, '169.255.124.13', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-06 09:17:43'),
(901, NULL, NULL, '169.255.124.15', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-06 14:04:58'),
(902, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-06 14:24:23'),
(903, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-06 15:57:19'),
(904, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-06 16:01:23'),
(905, NULL, NULL, '169.255.124.15', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-06 16:36:46'),
(906, NULL, NULL, '169.255.124.3', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-06 17:01:16'),
(907, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-07 11:18:27'),
(908, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-07 13:25:12'),
(909, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-07 13:29:04'),
(910, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-07 15:58:38'),
(911, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-07 16:18:17'),
(912, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-07 16:25:05'),
(913, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-07 16:27:49'),
(914, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-07 16:34:20'),
(915, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-07 16:35:01'),
(916, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-07 16:55:41'),
(917, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-07 17:06:11'),
(918, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-07 17:07:18'),
(919, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-07 17:08:18'),
(920, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-07 17:09:29'),
(921, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-07 17:11:37'),
(922, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-08 10:55:38'),
(923, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-08 17:08:47'),
(924, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-08 17:15:54'),
(925, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-08 22:30:00'),
(926, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-09 04:09:56'),
(927, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-09 06:01:53'),
(928, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-09 07:35:55'),
(929, NULL, NULL, '102.212.209.26', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-09 07:48:38'),
(930, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-09 09:02:19'),
(931, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-09 09:26:02'),
(932, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-09 11:34:43'),
(933, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-09 11:38:06'),
(934, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-09 15:53:37'),
(935, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-10 08:23:16'),
(936, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 04:45:35'),
(937, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 04:57:31'),
(938, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 05:04:16'),
(939, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 05:27:39'),
(940, NULL, NULL, '102.88.113.126', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 08:26:33'),
(941, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 08:27:46'),
(942, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 08:28:28'),
(943, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 08:29:11'),
(944, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 08:35:42'),
(945, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 08:41:07'),
(946, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 08:42:26'),
(947, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 08:51:20'),
(948, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 08:59:25'),
(949, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 09:04:32'),
(950, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 09:05:16'),
(951, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 09:15:41'),
(952, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 09:17:40'),
(953, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 09:18:22'),
(954, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 09:20:54'),
(955, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 09:25:00'),
(956, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 09:27:10'),
(957, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 09:28:59'),
(958, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 09:35:04'),
(959, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 09:39:26'),
(960, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 09:42:47'),
(961, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 09:44:13'),
(962, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 09:46:48'),
(963, NULL, NULL, '102.88.115.181', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 09:46:50'),
(964, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 10:05:53'),
(965, NULL, NULL, '102.88.115.181', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 11:03:52'),
(966, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 11:35:37'),
(967, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 11:40:02'),
(968, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 11:42:11'),
(969, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 11:48:58'),
(970, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 11:51:49'),
(971, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 12:04:36'),
(972, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 12:41:56'),
(973, NULL, NULL, '102.88.115.181', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-11 22:30:29'),
(974, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-12 04:13:58'),
(975, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-12 05:25:26'),
(976, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-12 05:29:41'),
(977, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-12 05:55:34'),
(978, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-12 08:12:43'),
(979, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-12 08:31:15'),
(980, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-12 09:05:08'),
(981, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-12 09:23:05'),
(982, NULL, NULL, '102.89.23.124', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-12 09:23:35'),
(983, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-13 04:49:43'),
(984, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-13 04:50:23'),
(985, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-13 05:47:44'),
(986, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-13 12:32:19'),
(987, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-13 18:56:13'),
(988, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-14 05:00:05'),
(989, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-14 05:04:51'),
(990, NULL, NULL, '102.88.115.18', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-14 05:12:29'),
(991, NULL, NULL, '102.88.115.18', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-14 05:14:06'),
(992, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-14 07:05:59'),
(993, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-14 14:50:19'),
(994, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-14 21:31:30'),
(995, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-15 11:33:36'),
(996, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-15 11:40:50'),
(997, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-15 11:46:09'),
(998, NULL, NULL, '102.212.209.4', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-15 11:49:31'),
(999, NULL, NULL, '102.212.209.5', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-15 14:31:08'),
(1000, NULL, NULL, '102.212.209.11', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-15 14:34:31'),
(1001, NULL, NULL, '102.212.209.9', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-15 17:04:15'),
(1002, NULL, NULL, '102.212.209.5', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-15 21:27:52'),
(1003, NULL, NULL, '102.212.209.9', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-16 08:21:19'),
(1004, NULL, NULL, '102.212.209.9', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-16 08:22:03'),
(1005, NULL, NULL, '102.212.209.11', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-16 17:45:56'),
(1006, NULL, NULL, '102.212.209.5', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-16 17:48:59'),
(1007, NULL, NULL, '102.212.209.11', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-16 17:50:22'),
(1008, NULL, NULL, '102.212.209.9', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-16 17:53:28'),
(1009, NULL, NULL, '102.212.209.9', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-16 18:25:32'),
(1010, NULL, NULL, '102.212.209.11', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-16 19:08:35'),
(1011, NULL, NULL, '102.212.209.4', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-17 04:06:42'),
(1012, NULL, NULL, '102.212.209.4', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-17 04:12:47'),
(1013, NULL, NULL, '102.212.209.4', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-17 04:13:33'),
(1014, NULL, NULL, '102.212.209.4', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-17 04:15:58'),
(1015, NULL, NULL, '102.212.209.4', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-17 04:24:26'),
(1016, NULL, NULL, '102.212.209.4', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-17 04:34:03'),
(1017, NULL, NULL, '102.212.209.4', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-17 04:57:50'),
(1018, NULL, NULL, '102.212.209.4', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-17 05:03:39'),
(1019, NULL, NULL, '169.255.124.10', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-17 08:45:23'),
(1020, NULL, NULL, '169.255.124.14', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-17 08:46:09'),
(1021, NULL, NULL, '169.255.124.14', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-17 09:17:54'),
(1022, NULL, NULL, '169.255.124.10', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-17 09:19:48'),
(1023, NULL, NULL, '169.255.124.10', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-17 09:21:17'),
(1024, NULL, NULL, '169.255.124.6', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-17 09:28:21'),
(1025, NULL, NULL, '169.255.124.10', 'Ikeja, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-17 09:42:22'),
(1026, NULL, NULL, '102.88.110.209', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-17 09:42:26'),
(1027, NULL, NULL, '102.88.110.209', 'Lagos, Lagos, Nigeria', 'Unknown Model', 'Unknown OS', 'Unknown Model', '2026-02-17 09:47:10');

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `current_company` varchar(200) DEFAULT NULL,
  `current_position` varchar(200) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `skills` text,
  `achievements` text,
  `is_visible` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_profiles`
--

INSERT INTO `user_profiles` (`id`, `user_id`, `linkedin`, `twitter`, `facebook`, `website`, `current_company`, `current_position`, `city`, `country`, `skills`, `achievements`, `is_visible`, `created_at`) VALUES
(1, 1, '', '', '', '', '', '', '', '', '', '', 1, '2026-03-02 13:43:54');

-- --------------------------------------------------------
-- ============================================================
-- JWT Refresh Tokens Table
-- Run this once in your MySQL database
-- ============================================================

CREATE TABLE IF NOT EXISTS `jwt_refresh_tokens` (
    `id`         INT(11)      NOT NULL AUTO_INCREMENT,
    `user_id`    INT(11)      NOT NULL,
    `token`      VARCHAR(64)  NOT NULL COMMENT 'SHA256 hash of the refresh token',
    `revoked`    TINYINT(1)   NOT NULL DEFAULT 0,
    `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `expires_at` DATETIME     NOT NULL,

    PRIMARY KEY (`id`),
    INDEX `idx_user_id`  (`user_id`),
    INDEX `idx_token`    (`token`),
    INDEX `idx_revoked`  (`revoked`),

    CONSTRAINT `fk_jwt_user`
        FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Optional: auto-clean expired tokens (run as cron or event)
-- ============================================================

-- MySQL Event (runs daily at midnight):
-- CREATE EVENT IF NOT EXISTS `cleanup_jwt_tokens`
--     ON SCHEDULE EVERY 1 DAY
--     STARTS '2024-01-01 00:00:00'
--     DO
--         DELETE FROM jwt_refresh_tokens
--         WHERE expires_at < NOW()
--            OR revoked = 1;
--
-- Table structure for table `user_subscriptions`
--

CREATE TABLE `user_subscriptions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `starts_at` datetime NOT NULL,
  `expires_at` datetime NOT NULL,
  `status` enum('active','expired','cancelled') DEFAULT 'active',
  `payment_ref` varchar(100) DEFAULT NULL,
  `amount_paid` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_subscriptions`
--

INSERT INTO `user_subscriptions` (`id`, `user_id`, `plan_id`, `starts_at`, `expires_at`, `status`, `payment_ref`, `amount_paid`, `created_at`) VALUES
(1, 4, 1, '2026-03-02 12:30:19', '2126-02-06 12:30:19', 'active', NULL, 0.00, '2026-03-02 12:30:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alumni_category`
--
ALTER TABLE `alumni_category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_user_chapter` (`user_id`,`chapter_id`),
  ADD KEY `fk_ac_chapter` (`chapter_id`);

--
-- Indexes for table `alumni_chapter`
--
ALTER TABLE `alumni_chapter`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_chapter_name` (`chapter_name`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `api_table`
--
ALTER TABLE `api_table`
  ADD PRIMARY KEY (`api_id`);

--
-- Indexes for table `chat_groups`
--
ALTER TABLE `chat_groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `chat_group_members`
--
ALTER TABLE `chat_group_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_group_user` (`group_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `group_id` (`group_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `ci_sessions`
--
ALTER TABLE `ci_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ci_sessions_timestamp` (`timestamp`);

--
-- Indexes for table `direct_messages`
--
ALTER TABLE `direct_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `event_attendees`
--
ALTER TABLE `event_attendees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_event_user` (`event_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `marketplace_listings`
--
ALTER TABLE `marketplace_listings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `users_groups`
--
ALTER TABLE `users_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uc_users_groups` (`user_id`,`group_id`),
  ADD KEY `fk_users_groups_users1_idx` (`user_id`),
  ADD KEY `fk_users_groups_groups1_idx` (`group_id`);

--
-- Indexes for table `users_log`
--
ALTER TABLE `users_log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `plan_id` (`plan_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alumni_category`
--
ALTER TABLE `alumni_category`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `alumni_chapter`
--
ALTER TABLE `alumni_chapter`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_table`
--
ALTER TABLE `api_table`
  MODIFY `api_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `chat_groups`
--
ALTER TABLE `chat_groups`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `chat_group_members`
--
ALTER TABLE `chat_group_members`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `direct_messages`
--
ALTER TABLE `direct_messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `event_attendees`
--
ALTER TABLE `event_attendees`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` mediumint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `marketplace_listings`
--
ALTER TABLE `marketplace_listings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users_groups`
--
ALTER TABLE `users_groups`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1263;

--
-- AUTO_INCREMENT for table `users_log`
--
ALTER TABLE `users_log`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1028;

--
-- AUTO_INCREMENT for table `user_profiles`
--
ALTER TABLE `user_profiles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alumni_category`
--
ALTER TABLE `alumni_category`
  ADD CONSTRAINT `fk_ac_chapter` FOREIGN KEY (`chapter_id`) REFERENCES `alumni_chapter` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `fk_ac_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `chat_groups`
--
ALTER TABLE `chat_groups`
  ADD CONSTRAINT `chat_groups_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `chat_group_members`
--
ALTER TABLE `chat_group_members`
  ADD CONSTRAINT `chat_group_members_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `chat_groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_group_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `chat_groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `direct_messages`
--
ALTER TABLE `direct_messages`
  ADD CONSTRAINT `direct_messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `direct_messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `event_attendees`
--
ALTER TABLE `event_attendees`
  ADD CONSTRAINT `event_attendees_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `event_attendees_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `marketplace_listings`
--
ALTER TABLE `marketplace_listings`
  ADD CONSTRAINT `marketplace_listings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  ADD CONSTRAINT `user_subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_subscriptions_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
