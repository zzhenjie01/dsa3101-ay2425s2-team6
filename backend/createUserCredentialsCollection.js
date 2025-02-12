import mongoose from "mongoose";

/*
Connect to users database with following credentials
user: root
password: root.
need to move on .env file
*/
mongoose.connect('mongodb://root:root@localhost:27017/users?authSource=admin')
    .then(() => console.log('MongoDB connected'))
    .catch(error => console.error('MongoDB connection error:', error));

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});

const User = mongoose.model('users', userSchema);

export default User;