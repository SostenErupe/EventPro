-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 02, 2025 at 09:19 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eventsinfo`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `attendance_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `status` enum('Present','Absent') NOT NULL,
  `clockInTime` time DEFAULT NULL,
  `clockOutTime` time DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`attendance_id`, `student_id`, `date`, `status`, `clockInTime`, `clockOutTime`, `created_at`, `updated_at`) VALUES
(1, 1001, '2025-08-14', 'Absent', '11:40:45', '11:40:48', '2025-05-14 08:40:45', '2025-08-13 19:02:00'),
(2, 1001, '2025-05-14', 'Absent', '11:40:50', '11:40:52', '2025-05-14 08:40:50', '2025-05-14 08:40:52'),
(3, 1001, '2025-05-14', 'Absent', '11:41:03', '11:47:42', '2025-05-14 08:41:03', '2025-05-14 08:47:42'),
(4, 1001, '2025-05-14', 'Absent', '11:47:44', '10:51:41', '2025-05-14 08:47:44', '2025-07-22 07:51:41'),
(5, 1001, '2025-07-22', 'Absent', '10:51:39', '10:51:41', '2025-07-22 07:51:39', '2025-07-22 07:51:41'),
(6, 1001, '2025-07-22', 'Absent', '10:51:43', '10:51:45', '2025-07-22 07:51:43', '2025-07-22 07:51:45'),
(7, 1001, '2025-07-22', 'Absent', '10:54:02', '10:54:04', '2025-07-22 07:54:02', '2025-07-22 07:54:04'),
(8, 1001, '2025-07-30', 'Absent', '12:55:54', '22:06:03', '2025-07-30 09:55:54', '2025-08-13 19:06:03'),
(9, 1001, '2025-08-13', 'Absent', '22:05:06', '22:06:03', '2025-08-13 19:05:06', '2025-08-13 19:06:03'),
(10, 1001, '2025-08-13', 'Absent', '22:05:54', '22:06:03', '2025-08-13 19:05:54', '2025-08-13 19:06:03'),
(11, 1001, '2025-08-13', 'Absent', '22:06:04', '22:06:18', '2025-08-13 19:06:04', '2025-08-13 19:06:18'),
(12, 1001, '2025-08-13', 'Absent', '22:06:19', '22:06:21', '2025-08-13 19:06:19', '2025-08-13 19:06:21'),
(13, 1001, '2025-08-13', 'Absent', '22:06:23', '22:13:31', '2025-08-13 19:06:23', '2025-08-13 19:13:31'),
(14, 1001, '2025-08-13', 'Absent', '22:11:05', '22:13:31', '2025-08-13 19:11:05', '2025-08-13 19:13:31'),
(15, 1001, '2025-08-13', 'Absent', '22:13:28', '22:13:31', '2025-08-13 19:13:28', '2025-08-13 19:13:31'),
(16, 1001, '2025-08-13', 'Absent', '22:13:39', '22:13:41', '2025-08-13 19:13:39', '2025-08-13 19:13:41'),
(17, 12345, '2025-08-14', 'Absent', '09:19:13', '09:19:15', '2025-08-14 06:19:13', '2025-08-14 06:19:15'),
(18, 1001, '2025-08-14', 'Absent', '10:20:45', '10:23:04', '2025-08-14 07:20:45', '2025-08-14 07:23:04'),
(19, 98, '2025-08-14', 'Present', '10:24:45', NULL, '2025-08-14 07:24:45', '2025-08-14 07:24:45'),
(20, 12345, '2025-08-14', 'Present', '10:35:16', NULL, '2025-08-14 07:35:16', '2025-08-14 07:35:16'),
(21, 98, '2025-08-14', 'Present', '10:35:28', NULL, '2025-08-14 07:35:28', '2025-08-14 07:35:28'),
(22, 98, '2025-08-14', 'Present', '10:35:41', NULL, '2025-08-14 07:35:41', '2025-08-14 07:35:41'),
(23, 1001, '2025-08-14', 'Absent', '10:55:53', '10:55:54', '2025-08-14 07:55:53', '2025-08-14 07:55:54'),
(24, 1001, '2025-08-14', 'Absent', '10:56:04', '11:35:45', '2025-08-14 07:56:04', '2025-08-14 08:35:45'),
(25, 1001, '2025-08-14', 'Absent', '11:35:40', '11:35:45', '2025-08-14 08:35:40', '2025-08-14 08:35:45'),
(26, 1001, '2025-08-14', 'Present', '11:36:09', NULL, '2025-08-14 08:36:09', '2025-08-14 08:36:09');

-- --------------------------------------------------------

--
-- Table structure for table `bookingdetails`
--

CREATE TABLE `bookingdetails` (
  `BookingDetail_ID` int(11) NOT NULL,
  `Booking_ID` int(11) DEFAULT NULL,
  `Ticket_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookingdetails`
--

INSERT INTO `bookingdetails` (`BookingDetail_ID`, `Booking_ID`, `Ticket_ID`) VALUES
(1, 1, 1),
(2, 3, 2),
(3, 4, 3),
(4, 5, 4),
(5, 6, 5),
(6, 7, 6),
(7, 8, 7),
(8, 9, 8),
(9, 10, 9),
(10, 11, 10),
(11, 12, 11),
(12, 15, 12);

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `Booking_ID` int(11) NOT NULL,
  `User_ID` int(11) DEFAULT NULL,
  `Event_ID` int(11) DEFAULT NULL,
  `Booking_Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`Booking_ID`, `User_ID`, `Event_ID`, `Booking_Date`) VALUES
(1, 7, 9, '2025-08-01'),
(3, 1, 9, '2025-08-01'),
(4, 1, 9, '2025-08-01'),
(5, 1, 9, '2025-08-01'),
(6, 1, 9, '2025-08-01'),
(7, 1, 10, '2025-08-01'),
(8, 7, 9, '2025-08-02'),
(9, 1, 10, '2025-08-02'),
(10, 1, 9, '2025-08-02'),
(11, 10, 9, '2025-08-02'),
(12, 10, 9, '2025-08-03'),
(15, 7, 9, '2025-08-05');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `Event_ID` int(11) NOT NULL,
  `Event_Name` varchar(255) DEFAULT NULL,
  `Event_Date` varchar(10) DEFAULT NULL,
  `Event_Start_Time` varchar(10) DEFAULT NULL,
  `Event_End_Time` varchar(10) DEFAULT NULL,
  `Organizer` varchar(255) DEFAULT NULL,
  `Tickets_Count` int(11) DEFAULT NULL,
  `Ticket_Price` int(11) DEFAULT NULL,
  `Available_Tickets` int(11) DEFAULT NULL,
  `Venue_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`Event_ID`, `Event_Name`, `Event_Date`, `Event_Start_Time`, `Event_End_Time`, `Organizer`, `Tickets_Count`, `Ticket_Price`, `Available_Tickets`, `Venue_ID`) VALUES
(9, 'First Event', '2025-07-29', '11:08', '11:12', 'Kilel', 100, 10, 60, 1),
(10, 'Trial', '2025-07-30', '11:20', '11:21', 'Kilel', 100, 10, 78, 2);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `Payment_ID` int(11) NOT NULL,
  `Booking_ID` int(11) DEFAULT NULL,
  `Payment_Method` varchar(50) DEFAULT NULL,
  `Amount` decimal(10,2) DEFAULT NULL,
  `Payment_Status` varchar(50) DEFAULT NULL,
  `Verification_Status` enum('Pending','Verified','Rejected') DEFAULT 'Pending',
  `Verification_Date` datetime DEFAULT NULL,
  `Verified_By` int(11) DEFAULT NULL,
  `Verification_Notes` text DEFAULT NULL,
  `Payment_Date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`Payment_ID`, `Booking_ID`, `Payment_Method`, `Amount`, `Payment_Status`, `Verification_Status`, `Verification_Date`, `Verified_By`, `Verification_Notes`, `Payment_Date`) VALUES
(1, 1, 'mpesa', 10.00, 'Success', 'Pending', NULL, NULL, NULL, '2025-08-02 11:22:28'),
(2, 3, 'credit_card', 100.00, 'Success', 'Pending', NULL, NULL, NULL, '2025-08-02 11:22:28'),
(3, 4, 'mpesa', 10.00, 'Success', 'Pending', NULL, NULL, NULL, '2025-08-02 11:22:28'),
(4, 5, 'credit_card', 100.00, 'Success', 'Pending', NULL, NULL, NULL, '2025-08-02 11:22:28'),
(5, 6, 'mpesa', 10.00, 'Success', 'Pending', NULL, NULL, NULL, '2025-08-02 11:22:28'),
(6, 7, 'credit_card', 120.00, 'Success', 'Pending', NULL, NULL, NULL, '2025-08-02 11:22:28'),
(7, 8, 'bank_transfer', 10.00, 'Success', 'Pending', NULL, NULL, NULL, '2025-08-02 11:22:28'),
(8, 9, 'credit_card', 100.00, 'Success', 'Pending', NULL, NULL, NULL, '2025-08-02 11:22:28'),
(9, 10, 'credit_card', 120.00, 'Success', 'Rejected', '2025-08-03 14:17:47', 1, 'Rejected', '2025-08-02 11:29:19'),
(10, 11, 'mpesa', 10.00, 'Success', 'Pending', NULL, NULL, NULL, '2025-08-02 11:45:37'),
(11, 12, 'bank_transfer', 120.00, 'Refunded', 'Verified', '2025-08-03 14:17:30', 1, 'Test note', '2025-08-03 13:02:45'),
(12, 15, 'credit_card', 150.00, 'Success', 'Verified', '2025-08-05 08:48:04', 1, 'Approved', '2025-08-05 08:47:12');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `student_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `course` varchar(100) NOT NULL,
  `department` varchar(100) NOT NULL,
  `year_of_study` int(11) NOT NULL,
  `total_classes` int(11) NOT NULL,
  `classes_attended` int(11) NOT NULL,
  `attendance_percentage` decimal(5,2) GENERATED ALWAYS AS (`classes_attended` / `total_classes` * 100) STORED,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`student_id`, `name`, `email`, `course`, `department`, `year_of_study`, `total_classes`, `classes_attended`, `created_at`, `updated_at`) VALUES
(9876, 'Salim Ahmed', 'ahmed3@gmail.com', 'IT', 'Computer Science', 2, 10, 0, '2025-08-14 07:15:20', '2025-08-14 07:15:20'),
(12345, 'Samuel John', 'john2@gmail.com', 'Civil Engineering', 'Engineering', 3, 15, 0, '2025-08-13 18:56:18', '2025-08-13 18:56:18'),
(21343, 'Jacob Musa', 'Musa2@gmail.com', 'Procurement', 'Business', 1, 10, 0, '2025-08-13 18:48:07', '2025-08-13 18:48:07'),
(34547, 'Barisa Dae', 'dae3@gmail.com', 'IT', 'Computer Science', 2, 10, 0, '2025-08-13 19:20:53', '2025-08-13 19:20:53'),
(34567, 'Faridah Hamisi', 'hamisi3@gmail.com', 'IT', 'Computer Science', 2, 15, 0, '2025-08-14 07:34:31', '2025-08-14 07:34:31'),
(41237, 'Salim Hassan', 'hasaan2@gmail.com', 'IT', 'Computer Science', 2, 5, 0, '2025-08-13 18:36:12', '2025-08-13 18:36:12'),
(98766, 'Faith Mwai', 'mwai3@gmail.com', 'Procurement', 'Business', 2, 15, 0, '2025-08-14 07:28:46', '2025-08-14 07:28:46');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `Ticket_ID` int(11) NOT NULL,
  `Event_ID` int(11) DEFAULT NULL,
  `User_ID` int(11) NOT NULL,
  `Purchase_Date` datetime NOT NULL DEFAULT current_timestamp(),
  `Quantity` int(11) NOT NULL,
  `Total_Price` decimal(10,2) NOT NULL,
  `Status` enum('Pending','Confirmed','Cancelled') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`Ticket_ID`, `Event_ID`, `User_ID`, `Purchase_Date`, `Quantity`, `Total_Price`, `Status`) VALUES
(1, 9, 7, '2025-08-01 14:28:06', 1, 10.00, 'Pending'),
(2, 9, 1, '2025-08-01 14:39:42', 10, 100.00, 'Pending'),
(3, 9, 1, '2025-08-01 15:30:00', 1, 10.00, 'Pending'),
(4, 9, 1, '2025-08-01 15:30:13', 10, 100.00, 'Pending'),
(5, 9, 1, '2025-08-01 15:53:44', 1, 10.00, 'Pending'),
(6, 10, 1, '2025-08-01 15:54:01', 12, 120.00, 'Pending'),
(7, 9, 7, '2025-08-02 08:55:05', 1, 10.00, 'Pending'),
(8, 10, 1, '2025-08-02 08:58:35', 10, 100.00, 'Pending'),
(9, 9, 1, '2025-08-02 11:29:19', 12, 120.00, 'Pending'),
(10, 9, 10, '2025-08-02 11:45:37', 1, 10.00, 'Pending'),
(11, 9, 10, '2025-08-03 13:02:45', 12, 120.00, 'Pending'),
(12, 9, 7, '2025-08-05 08:47:12', 15, 150.00, 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `userroles`
--

CREATE TABLE `userroles` (
  `Role_ID` int(11) NOT NULL,
  `Role_Name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userroles`
--

INSERT INTO `userroles` (`Role_ID`, `Role_Name`) VALUES
(1, 'Admin'),
(2, 'User');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `User_ID` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `Role_ID` int(11) DEFAULT NULL,
  `ContactInfo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`User_ID`, `Username`, `Password`, `Name`, `Email`, `Role_ID`, `ContactInfo`) VALUES
(1, 'kilel', '$2b$10$Azj.FcN9iCDaOQwxfk.1F./9gdRcQoKO44c0v8ZiuK6.Q5vzIMB8y', 'Deelan Kilel', 'kileldylan@gmail.com', 1, '0758715788'),
(2, 'test', '$2b$10$lUrh8DoMU8Narl6M27hmHO93j77z3O2A3dkYq/dAVlCXc2hzGQ8qG', 'test', 'test@gmail.com', 2, '0758715788'),
(5, 'kileldylan', '$2b$10$50/63oYeoBRyWED1XU4biuqWvO7yFI8HvxTLxhADtyBFLVEYwJIle', 'Deelan Kilel', 'example@gmail.com', 2, '0758715788'),
(6, 'John', '$2b$10$aypZUzdXXjc6.743spqfKeVoNc3P/lAoa5E4S4eKpujmWyG0Vzzb6', 'John Doe', 'johndoe@gmail.com', 2, '0758715788'),
(7, 'Winny', '$2b$10$bVW3HyFuh0DYwPqTloWWP.bbZ0yCsI76J6ECvTaY2C3.tHLSUTHXW', 'Winny Chepchumba ', 'winny@gmail.com', 2, '0758715788'),
(8, 'dennis', '$2b$10$jMFfAMf9w26RN5nRpQiG8uymTO3SrTp0UZ9VdoyCTOjL7N7r9IZhK', 'Dennis Kilel', 'kileldenis254@gmail.com', 1, '0700271877'),
(9, 'deno', '$2b$10$wqZq/vMZIsvVXydHnt7pg.lc/xPtzKLs5rWdKUjKb5WhukhbQMYCi', 'Deno', 'deno@gmail.com', 1, '0758715788'),
(10, 'Resh', '$2b$10$9Jwrx/wLjgZJ1huHte4NQuIHoNw8yOLeMVaX7V3iaq4rmyu2z3Vl2', 'Rehema', 'rehema@gmail.com', 2, '0758715788');

-- --------------------------------------------------------

--
-- Table structure for table `venues`
--

CREATE TABLE `venues` (
  `Venue_ID` int(11) NOT NULL,
  `Venue_Name` varchar(255) DEFAULT NULL,
  `Street` varchar(255) DEFAULT NULL,
  `City` varchar(255) DEFAULT NULL,
  `District` varchar(255) DEFAULT NULL,
  `State` varchar(255) DEFAULT NULL,
  `Pincode` varchar(6) DEFAULT NULL,
  `Capacity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `venues`
--

INSERT INTO `venues` (`Venue_ID`, `Venue_Name`, `Street`, `City`, `District`, `State`, `Pincode`, `Capacity`) VALUES
(1, 'Test Venue', '123 Main Street', 'Nairobi', 'Westlands', 'Nairobi County', '00100', 500),
(2, 'Art Place', 'Kimumu', 'Eldoret', 'Eldoret', 'Uasin Gishu', '30100', 300),
(3, 'Madfun', 'Kiambu', 'Kiambu', 'Kiambu', 'Kiambu', '30100', 200),
(4, 'Ubuntu', '', 'Mombasa', '', '', '', 2000);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookingdetails`
--
ALTER TABLE `bookingdetails`
  ADD PRIMARY KEY (`BookingDetail_ID`),
  ADD KEY `Booking_ID` (`Booking_ID`),
  ADD KEY `Ticket_ID` (`Ticket_ID`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`Booking_ID`),
  ADD KEY `User_ID` (`User_ID`),
  ADD KEY `Event_ID` (`Event_ID`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`Event_ID`),
  ADD KEY `Venue_ID` (`Venue_ID`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`Payment_ID`),
  ADD KEY `Booking_ID` (`Booking_ID`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`Ticket_ID`),
  ADD KEY `Event_ID` (`Event_ID`),
  ADD KEY `fk_user` (`User_ID`);

--
-- Indexes for table `userroles`
--
ALTER TABLE `userroles`
  ADD PRIMARY KEY (`Role_ID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`User_ID`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD KEY `Role_ID` (`Role_ID`);

--
-- Indexes for table `venues`
--
ALTER TABLE `venues`
  ADD PRIMARY KEY (`Venue_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookingdetails`
--
ALTER TABLE `bookingdetails`
  MODIFY `BookingDetail_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `Booking_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `Event_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `Payment_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `Ticket_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `User_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `venues`
--
ALTER TABLE `venues`
  MODIFY `Venue_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookingdetails`
--
ALTER TABLE `bookingdetails`
  ADD CONSTRAINT `bookingdetails_ibfk_1` FOREIGN KEY (`Booking_ID`) REFERENCES `bookings` (`Booking_ID`),
  ADD CONSTRAINT `bookingdetails_ibfk_2` FOREIGN KEY (`Ticket_ID`) REFERENCES `tickets` (`Ticket_ID`);

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`Event_ID`) REFERENCES `events` (`Event_ID`);

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`Venue_ID`) REFERENCES `venues` (`Venue_ID`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`Booking_ID`) REFERENCES `bookings` (`Booking_ID`);

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`Event_ID`) REFERENCES `events` (`Event_ID`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`Role_ID`) REFERENCES `userroles` (`Role_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
