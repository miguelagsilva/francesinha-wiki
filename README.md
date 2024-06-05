# Francesinha Wiki 🥪

Francesinha Wiki is a platform where users can look for francesinhas and their respective ingredients and in which restaurants to find them. Restaurants and francesinhas can be review them, added, deleted and edited. This documentation provides instructions to set up, run the project.

## Main Goals

This platform enables users to manage francesinha, restaurant, and ingredient entries with the following capabilities:
- Register new entries: Add new francesinhas, restaurants, and ingredients.
- List entries: View all entries with options for sorting and searching.
- Update details: Modify the details of existing entries.
- Delete registries: Remove entries from the platform.

## Structure and Entities

### Francesinha

A francesinha entry is composed of:
- Name
- Price
- Rating (1-5)
- Photos (optional)
- Ingredients
- Restaurants

**Example:**
- Name: Mega Francesinha
- Price: 10
- Rating: 4.9
- Ingredients: Ham, Steak, Egg, Cheese, Bacon, Sausage, Bread, Francesinha sauce
- Restaurants: A Biquinha, Zé Manel dos Ossos

### Restaurant

A restaurant is composed of:
- Name
- Address
- City
- Country
- Rating (1-5)
- Francesinhas

**Example:**
- Name: A Biquinha
- Address: Rua das Padeiras 88, 3000-311 Coimbra
- City: Coimbra
- Country: Portugal
- Rating: 5.0
- Francesinhas: Mega Francesinha, Chicken Francesinha, Omelet Francesinha

### Ingredients

An ingredient is composed of:
- Name
- Francesinhas

**Example:**
- Name: Ham
- Francesinhas: Mega Francesinha, Chicken Francesinha

## Technologies

### Frontend

The frontend consists of web pages where users can complete the goals mentioned above. The frontend uses [React](https://reactjs.org/) and [Tailwind CSS](https://tailwindcss.com/).

### Backend

The backend is a server that responds to frontend requests and integrates with a [MySQL](https://www.mysql.com/) database storing information about francesinhas, restaurants and ingredients. The backend is built using [Express.js](https://expressjs.com/) and an ORM [Sequelize](https://sequelize.org/) for easier database management.

### Extras

- Soft deletable entities that can be recovered
- Ingredients as entities/classes, associated with multiple francesinhas
- Backend validation for parameters
- Form field validations
- Sorting by classification and name in search functionality
- Photo uploads for francesinha entries

## Prerequisites

- Node.js v20.12.2 or higher
- Npm v10.8.1 or higher
- MySQL

## Setup

### Environment Variables

Default environment variables are set up in `/frontend/.env`. These can be changed as needed.

### Database Setup

Run the following commands to set up the MySQL database:

```sh
chmod +x setup_db.sh && ./setup_db.sh
```

### Dependency Download 

Run the following commands inside both the frontend and backend folders to redownload the dependencies if needed.

```sh
npm install
```

## Running the project

Follow this steps in order to run the project in development mode. Run the following command separately in both the frontend and backend folders. 

```
npm start
```

### Further Updates

- Better handling of photo uploading
- Hyperlinks when clicking restaurants in a Francesinha's description and vice-versa
- Implementing code tests
- Creating the API documentation
