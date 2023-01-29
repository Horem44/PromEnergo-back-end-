# (Portfolio project) Back-End for PromEnergo company

Online store with the ability to manage orders by administrator

## Technologies used in the development

TypeScript, NodeJS, Express, Sequelize (ORM for working with MySQL database), MySQL

##Authorization

I have implemented authorization through a json web token that is sent to the user via an http-only cookie when the user logs in.
Thanks to this, the server knows nothing about the user and only needs to check the validity of his token when he accesses routes that require authorization.
