const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
    if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
    if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET is required in production');
    }
    return 'supersecret123';
};

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
};

const generateToken = (res, userId, role) => {
    const token = jwt.sign({ userId, role }, getJwtSecret(), {
        expiresIn: '30d'
    });

    res.cookie('jwt', token, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    return token;
};

const clearToken = (res) => {
    res.cookie('jwt', '', {
        ...cookieOptions,
        expires: new Date(0)
    });
};

module.exports = { generateToken, clearToken, getJwtSecret };
