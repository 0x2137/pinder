const dotenv = require('dotenv');
dotenv.config();

if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI not defined');
}
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not defined');
}
