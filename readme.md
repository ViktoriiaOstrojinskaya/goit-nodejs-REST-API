## Branch "hw02-express" - works with Express:
1. Created web server on express and layers morgan and cors. 
2. Started configuring routing to work with a collection of contacts (used HTTP methods GET/POST/PUT/PUTCH/DELETE).
3. Used the Joi package to validate data.

## Branch "hw03-mongodb" - works with MongoDB and Mongoose:
1. Created a database with collection "contacts" and routers.
2. In the functions of processing requests, replaced the code of CRUD operations on contacts from a file with Mongoose methods for working with a collection of contacts in the database.

## Branch "hw04-auth" - works with authentication/authorization user with JWT:
1. Created endpoint /register, /login, /logout, /current.
2. Used the bcryptjs package to salt passwords.

## Branch "hw05-avatars" - works with Multer:
1. Added the ability to download/change the user's avatar.

## Branch "hw06-email" - works with SendGrid service and Docker:
1. Added verification of the user's email after registration.
2. Added sending an email to the user with a link for verification.
3. Added resending an email to the user with a link for verification.
4. Wrote a dockerfile for the application.
