const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ email: 'pratik123@gmail.com' });
        if (user) {
            console.log('USER_FOUND:', JSON.stringify(user, null, 2));
        } else {
            console.log('USER_NOT_FOUND');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUser();
