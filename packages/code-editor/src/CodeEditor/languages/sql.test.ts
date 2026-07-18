/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { getColumnNames, getTablesNames } from "./sql";

const dbSchema = `
CREATE DATABASE OnlineStore;

CREATE TABLE "My, test @ test test Customers" (
    "Customer ID" INT PRIMARY KEY AUTO_INCREMENT,
    [First Name] VARCHAR(50) NOT NULL,
    \`Last Name\` VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    DateOfBirth DATE,
    Gender CHAR(1) CHECK (Gender IN ('M', 'F')),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE [Products 123] (
    ProductID INT PRIMARY KEY AUTO_INCREMENT,
    ProductName VARCHAR(100) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL CHECK (Price >= 0),
    StockQuantity INT NOT NULL CHECK (StockQuantity >= 0),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE \`Orders @ test\` (
    OrderID INT PRIMARY KEY AUTO_INCREMENT,
    CustomerID INT NOT NULL,
    OrderDate DATE NOT NULL,
    TotalAmount DECIMAL(10, 2) NOT NULL CHECK (TotalAmount >= 0),
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

CREATE TABLE @OrderItems (
    OrderItemID INT PRIMARY KEY AUTO_INCREMENT,
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    UnitPrice DECIMAL(10, 2) NOT NULL CHECK (UnitPrice >= 0),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

CREATE TABLE OrderItems (
    OrderItemID INT PRIMARY KEY AUTO_INCREMENT,
    OrderID INT NOT NULL
);
`;

describe("SQL", () => {
  it("should return the table names with and without enclosing delimiters", () => {
    const result = getTablesNames(dbSchema);
    expect(result).toEqual([
      "My, test @ test test Customers",
      "Products 123",
      "Orders @ test",
      "@OrderItems",
      "OrderItems",
    ]);
  });

  it("should return the column names with and without enclosing delimiters", () => {
    const result = getColumnNames(dbSchema);
    expect(result).toEqual([
      "My, test @ test test Customers.Customer ID",
      "My, test @ test test Customers.First Name",
      "My, test @ test test Customers.Last Name",
      "My, test @ test test Customers.Email",
      "My, test @ test test Customers.DateOfBirth",
      "My, test @ test test Customers.Gender",
      "My, test @ test test Customers.CreatedAt",
      "Products 123.ProductID",
      "Products 123.ProductName",
      "Products 123.Price",
      "Products 123.StockQuantity",
      "Products 123.CreatedAt",
      "Orders @ test.OrderID",
      "Orders @ test.CustomerID",
      "Orders @ test.OrderDate",
      "Orders @ test.TotalAmount",
      "@OrderItems.OrderItemID",
      "@OrderItems.OrderID",
      "@OrderItems.ProductID",
      "@OrderItems.Quantity",
      "@OrderItems.UnitPrice",
      "OrderItems.OrderItemID",
      "OrderItems.OrderID",
    ]);
  });
});
