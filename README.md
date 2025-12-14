# Smart Inventory Management System

A full-stack Inventory Management System designed to track products, manage suppliers, record sales, and monitor stock levels efficiently. Built using **Java Spring Boot** for the backend and **React.js** for the frontend.

Deployed Link : https://smart-inventory-management-281n.onrender.com

## 🚀 Features

* **Product Management:** Add, update, delete, and view inventory items.
* **Supplier & Customer Tracking:** Manage contact details for suppliers and customers.
* **Sales Processing:** Record transactions and update stock levels automatically.
* **Audit Logs:** Track system changes and user activities for security.
* **User Management:** Role-based access and user administration.

## 🛠️ Tech Stack

* **Backend:** Java, Spring Boot, Spring Data JPA, Hibernate
* **Frontend:** React.js, Node.js
* **Database:** MySQL (or PostgreSQL - *change this to whatever you are using*)
* **Tools:** Maven, VS Code

## ⚙️ Setup & Installation

Follow these steps to get the project running on your local machine.

### 1. Prerequisites
Make sure you have the following installed:
* Java JDK 17+
* Node.js & npm
* MySQL (or your preferred database)

### 2. Backend Setup (Spring Boot)
1.  Navigate to the root directory.
2.  Configure your database:
    * Rename `application.properties.example` to `application.properties`.
    * Update the database URL, username, and password inside the file.
3.  Run the application:
    ```bash
    mvn spring-boot:run
    ```
   *The backend server will start at `http://localhost:8080`*

### 3. Frontend Setup (React)
1.  Open a new terminal and navigate to the client folder:
    ```bash
    cd inventory-client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the React app:
    ```bash
    npm start
    ```
   *The frontend will launch at `http://localhost:3000`*

## 📸 Screenshots
*(You can upload screenshots of your app here later so people can see what it looks like)*

## 🤝 Contributing
1.  Fork the repository
2.  Create a new branch (`git checkout -b feature/YourFeature`)
3.  Commit your changes (`git commit -m 'Add some feature'`)
4.  Push to the branch (`git push origin feature/YourFeature`)
5.  Open a Pull Request
