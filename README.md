# (Portfolio project) Back-End for PromEnergo company

Online store with the ability to manage orders by administrator

## Technologies used in the development

TypeScript, NodeJS, Express, Sequelize (ORM for working with MySQL database), MySQL

## MySQL Database

### Models

User, Product, Order, OrderProduct (many-to-many between orders and products), Token (for password resetting)

![database](https://user-images.githubusercontent.com/72016991/215357324-b8b87e95-faf0-49ed-8642-3a416a1f901e.png)

## Authorization

I have implemented authorization through a json web token that is sent to the user via an http-only cookie when the user logs in.
Thanks to this, the server knows nothing about the user and only needs to check the validity of his token when he accesses routes that require authorization.

## Password reset

I implemented a password change by sending an email to the user's mail using NodeMailer. The letter contains a link that looks like http://localhost:3000/:token, where token is a hex code encoded with crypto. When the user clicks on the link, he is taken to the corresponding page on the front-end and enters his new password. When submitting the form, the user also sends his token, which the server checks for expiration and validity and then sends either a successful response or an error.

## Products Page 

I implemented pagination and filter search by using query parameters in URL
