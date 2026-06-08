CREATE DATABASE IF NOT EXISTS PMS;
USE PMS;

CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  UserName VARCHAR(100) NOT NULL UNIQUE,
  Password VARCHAR(255) NOT NULL,
  Role ENUM('admin','staff') DEFAULT 'staff',
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Plate_Number VARCHAR(20) NOT NULL UNIQUE,
  Brand VARCHAR(100) NOT NULL,
  Model VARCHAR(100) NOT NULL,
  Year INT NOT NULL,
  Vehicle_Type VARCHAR(50) NOT NULL,
  Purchase_Price DECIMAL(12,2) NOT NULL,
  Status ENUM('Available','Rented','Sold','Under Maintenance') DEFAULT 'Available',
  RegisteredBy INT,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (RegisteredBy) REFERENCES Users(id) ON DELETE SET NULL
);

CREATE TABLE Customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  FirstName VARCHAR(100) NOT NULL,
  LastName VARCHAR(100) NOT NULL,
  Email VARCHAR(150) NOT NULL UNIQUE,
  PhoneNumber VARCHAR(20) NOT NULL,
  Status ENUM('Active','Inactive','Blocked') DEFAULT 'Active',
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Promotions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Title ENUM(
    'New Year Sale',
    'Holiday Price Slash',
    'Weekend Flash Sale',
    'Clearance Discount Offer',
    'Seasonal Price Drop'
  ) NOT NULL,
  Description TEXT,
  Discount_Type ENUM(
    'Free',
    'Percentage',
    'Flat_Rate',
    'Cashback',
    'Buy_One_Get_One',
    'Bundle',
    'Amount'
  ) NOT NULL,
  Discount_Value DECIMAL(10,2) NOT NULL DEFAULT 0,
  Start_Date DATE NOT NULL,
  End_Date DATE NOT NULL,
  Status ENUM('Active','Inactive','Expired') DEFAULT 'Active',
  CreatedBy INT,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (CreatedBy) REFERENCES Users(id) ON DELETE SET NULL
);

CREATE TABLE Promotion_Vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Promotion_id INT NOT NULL,
  Vehicle_id INT NOT NULL,
  Performance ENUM('Excellent','Good','Average','Poor') DEFAULT 'Good',
  AssignedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Promotion_id) REFERENCES Promotions(id) ON DELETE CASCADE,
  FOREIGN KEY (Vehicle_id) REFERENCES Vehicles(id) ON DELETE CASCADE,
  UNIQUE KEY unique_promo_vehicle (Promotion_id, Vehicle_id)
);
