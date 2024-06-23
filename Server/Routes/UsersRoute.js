// // Import necessary modules
// import express from 'express';
// import jwt from 'jsonwebtoken';

// // Create an instance of Express router
// const router = express.Router();

// // Secret key for JWT verification
// const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";

// // Middleware to verify JWT token
// const verifyToken = (req, res, next) => {
//     // Extract token from Authorization header
//     const token = req.headers.authorization;

//     // Check if token is provided
//     if (!token) {
//         return res.status(401).json({ authenticated: false, error: 'Authorization header missing' });
//     }

//     // Verify the token
//     jwt.verify(token, JWT_SECRET, (err, decoded) => {
//         if (err) {
//             console.error('Error verifying token:', err);
//             return res.status(401).json({ authenticated: false, error: 'Invalid or expired token' });
//         }

//         // Token is valid, pass decoded user ID to next middleware
//         req.userId = decoded.id;
//         next();
//     });
// };

// // Route to verify JWT token
// router.get('/users-data', verifyToken, (req, res) => {
//     // If middleware reaches this point, token is valid
//     res.json({ authenticated: true });
// });

// // Export the router
// export { router as userDataRouter };
