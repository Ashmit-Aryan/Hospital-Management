# Hospital Management System

The **Hospital Management System** is a web-based application designed to facilitate the efficient management of hospital operations. This system provides a comprehensive solution for healthcare facilities, enabling them to manage patient records, appointments, billing, and staff information seamlessly.

## Key Features

- **Patient Management**: Easily manage patient information, including personal details, medical history, and treatment records.
- **Appointment Scheduling**: Allow patients to book appointments with doctors, view available slots, and receive reminders.
- **Billing System**: Streamline the billing process with automated invoicing and payment tracking.
- **Staff Management**: Manage healthcare staff information, including roles, schedules, and performance tracking.
- **Reporting**: Generate reports on various aspects of hospital operations for better decision-making.

*Note:- More Feature will be addded in the future

## Technologies Used

- **Frontend**: Built using modern React JS, providing a responsive and user-friendly interface.
- **Backend**: Developed with Node.js and Express, ensuring a robust server-side application.
- **Database**: Utilizes MongoDB for efficient data storage and retrieval.

# How to Run BackEnd

## MongoDB Local Installation Guide

This guide provides step-by-step instructions to install MongoDB as a local database on your machine.

## 1. Download MongoDB Community Server

1. Visit the [MongoDB Download Center](https://www.mongodb.com/try/download/community).
2. Select your operating system:
   - **Windows**
   - **macOS**
   - **Linux**
3. Choose the latest stable version.
4. Click **Download** to start downloading the installer.

---

## 2. Install MongoDB

### Windows

1. Run the downloaded `.msi` installer file.
2. Follow the installation prompts:
   - Select "Complete" setup type.
   - Ensure "Install MongoDB as a Service" is checked.
3. Click **Install** to complete the process.

### macOS

1. Open the Terminal and use **Homebrew**:

   ```bash
   brew tap mongodb/brew
   brew install mongodb-community@6.0
   ```

2. Start MongoDB as a service:

   ```bash
   brew services start mongodb/brew/mongodb-community
   ```

### Linux

1. Import the MongoDB public GPG Key:

   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   ```

2. Add MongoDB to your package list:

   ```bash
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   ```

3. Update your local package database:

   ```bash
   sudo apt update
   ```

4. Install MongoDB:

   ```bash
   sudo apt install -y mongodb-org
   ```

5. Start MongoDB:

   ```bash
   sudo systemctl start mongod
   ```

---

## 3. Verify the Installation

Run the following command to verify MongoDB is installed and running:

```bash
mongod --version
```

You can also check if MongoDB is running by connecting to the database shell:

```bash
mongosh
```

---

## 4. Configure MongoDB (Optional)

- By default, MongoDB stores data in `/data/db` (Linux/macOS) or `C:\Program Files\MongoDB\Server\<version>\data\db` (Windows).
- Update the configuration file (`mongod.conf`) to customize storage paths or network settings.

---

## 5. Access MongoDB

- Use **MongoDB Compass** (a GUI tool) for easier interaction.
  - Download from [MongoDB Compass](https://www.mongodb.com/try/download/compass).
  - Install and connect to your local MongoDB instance.

---

You’re now ready to use MongoDB as your local database! 🚀

```markdown
# Backend Setup Instructions

Follow these steps to set up and run the backend server:

---

## 1. Navigate to the Backend Folder

Open your terminal or command prompt and run the following command to move into the backend folder:

```bash
cd backend
```

---

## 2. Install Dependencies

Run the following command to install the required `node_modules`:

```bash
npm install
```

This will install all the necessary packages specified in the `package.json` file.

---

## 3. Start the Server

To start the backend server, run:

```bash
npm run start
```

The server should now be up and running. You can view logs in the terminal for confirmation.

---

# How to Run Frontend

```markdown
# Frontend Setup Instructions

Follow these steps to set up and run the frontend for the hospital management system:

---

## 1. Navigate to the Frontend Folder

Open your terminal or command prompt and run the following command to enter the frontend folder:

```bash
cd hospital-management-system
```

---

## 2. Install Dependencies

Run the following command to install the required `node_modules`:

```bash
npm install
```

This will install all the necessary packages specified in the `package.json` file.

---

## 3. Start the Frontend

To start the frontend development server, run:

```bash
npm run dev
```

The frontend should now be up and running. You can open your browser and view the application.

---

You're all set to work on the frontend! 🚀
