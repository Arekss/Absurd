## Starting MongoDB with Docker Compose

1. Clone the repository and navigate to the project root.
2. Modify `.env` file with your own username and password

   ```plaintext
   MONGO_INITDB_ROOT_USERNAME=yourusername
   MONGO_INITDB_ROOT_PASSWORD=yourpassword
   ```plaintext
3. Start MongoDB
    sudo docker-compose up -d