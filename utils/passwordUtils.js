const bcrypt = require('bcryptjs');

const hashPassword = async (plainPassword) => {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
    return bcrypt.hash(plainPassword, saltRounds);
};

const comparePassword = async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };