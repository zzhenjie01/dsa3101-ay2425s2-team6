import User from './createUserCredentialsCollection.js';

const n = 10;
const createTestUser = async num => {
    const newUser = new User({ username: `testuser${num}`, password: `testpassword${num}` });
    await newUser.save();
    console.log(`User ${num} created`);
};

for (let i = 0; i < n; i ++)
{
    createTestUser(i);
};