# To-Do Application Backend

Express.js backend server for the To-Do application with MongoDB integration.

## Features

- RESTful API for managing to-do items
- MongoDB database integration
- CORS enabled for frontend communication
- Input validation
- Error handling

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env` file in the backend directory:

```
MONGODB_URI=mongodb://localhost:27017/todoapp
PORT=5000
NODE_ENV=development
```

For MongoDB Atlas, use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp
```

## Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/` - Check if API is running

### Submit To-Do Item
- **POST** `/submittodoitem`
  - Request body: `{ "itemName": "string", "itemDescription": "string" }`
  - Response: Created todo object with timestamp

### Get All To-Do Items
- **GET** `/todos` - Retrieve all to-do items

### Get To-Do Item by ID
- **GET** `/todos/:id` - Retrieve specific to-do item

### Delete To-Do Item
- **DELETE** `/todos/:id` - Remove a to-do item

## Requirements

- Node.js v14 or higher
- MongoDB v4.0 or higher
- npm or yarn package manager
