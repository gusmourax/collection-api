# Collection API
Collection API is an API project that allows users to register, log in, create and list components, and create and list component categories. It also has different levels of permission for users: ADMIN and PRO.

## Documentation
You can access the API documentation at the following URL: http://ec2-44-204-238-126.compute-1.amazonaws.com/api-docs

## Installation
Fist off all, install the dependencies, run the following command:
```bash
yarn install
```

To create the database, run the following command:
```bash
docker-compose up -d
```
Make sure to create a .env file and define the correct environment variables:
```bash
JWT_SECRET=any_secret_key
DATABASE_URL="postgresql://admin:admin@localhost:5432/collection?schema=public"
```

To populate the database with initial data, run the following command:
```bash
yarn seed
```


Now you can run using the following command:
```bash
yarn start:dev
```

## Usage
This API has two levels of permission for users: ADMIN and PRO. Only users with ADMIN permission can create and list component categories and create components. Users with PRO permission can only list components.

## Credits
Made By Gustavo Moura</br>
Linkedin: https://www.linkedin.com/in/gustavomoura5555/