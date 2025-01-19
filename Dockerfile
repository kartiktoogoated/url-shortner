# Use the official Node.js image from the Docker Hub
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Expose the port that your app runs on (e.g., port 5000)
EXPOSE 5000

# Set environment variables, if needed (e.g., for MongoDB URI or other variables)
ENV MONGO_URI=mongodb://mongodb+srv://kartiktoogoated:uBzdTeiGl5O82LjQ@cluster0.1qto9rk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
ENV PORT=5000

# Start the application when the container runs
CMD ["npm", "start"]
