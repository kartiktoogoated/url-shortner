# Url-Shortner

# URL Shortener

A simple URL shortener API built with **Node.js** and **Express**, using **MongoDB** for storing URLs. This project allows users to shorten URLs, retrieve the original URL from a short code, update existing short URLs, delete them, and view URL statistics such as access count.

## Features
- Shorten a valid URL.
- Retrieve the original URL from a short code.
- Update an existing short URL.
- Delete an existing short URL.
- Retrieve statistics for a short URL (e.g., access count).

## Table of Contents
- [Technologies](#technologies)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Technologies
- **Node.js**: JavaScript runtime used for the server.
- **Express**: Web framework for building the API.
- **MongoDB**: NoSQL database for storing the URLs.
- **Mongoose**: ODM for interacting with MongoDB.
- **Nanoid**: For generating short URL codes.
- **dotenv**: For managing environment variables.

## Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed.

### Steps
1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/kartiktoogoated/url-shortner.git
```bash
   cd url-shortner
2. Install dependencies:
```bash
    npm install
3. Create a .env file in the root of the project with the following content:
```bash
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/url-shortener
4. Run the server:
```bash
    npm start


