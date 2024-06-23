import express from 'express';
import jwt from 'jsonwebtoken';


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";

router.get('/validate', (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ valid: false, error: 'Authorization header missing' });
    }

    jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error verifying token:', err);
            return res.status(401).json({ valid: false, error: 'Invalid or expired token' });
        }

       
        return res.json({ valid: true });
    });
});

export { router as authRouter };
