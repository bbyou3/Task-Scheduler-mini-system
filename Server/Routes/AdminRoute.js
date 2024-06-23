import express from 'express';
import con from "../utils/db.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    
    const query = 'SELECT * FROM users WHERE email = ?';
    con.query(query, [email], async (err, result) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ loginStatus: false, error: 'Internal Server Error' });
        }

        if (result.length === 0) {
            return res.status(401).json({ loginStatus: false, error: 'Invalid credentials' });
        }

        
        const user = result[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ loginStatus: false, error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ email: email }, JWT_SECRET);

        // Set token as cookie
        res.cookie('token', token, { httpOnly: true });

        return res.json({ loginStatus: true, token }); // Send token in response
    });
});

router.get('/logout', (req, res) => {
    try {
        res.clearCookie('token');
        res.json({ success: true, message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.get('/users-data', (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error verifying token:', err);
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        
        const email = decoded.email;
        const query = 'SELECT id, email, username FROM users WHERE email = ?';
        
        con.query(query, [email], (err, result) => {
            if (err) {
                console.error('Error fetching user data:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            
            if (result.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            const userData = result[0];
            return res.json({ user: userData });
        });
    });
});


//para ni sa authentication sa dashboard pero kay conflict kaayu so ako pa ni sya gihimo ug comment
// router.get('/users-data', (req, res) => {
//     const token = req.headers.authorization;

//     if (!token) {
//         return res.status(401).json({ authenticated: false, error: 'Authorization header missing' });
//     }

//     jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
//         if (err) {
//             console.error('Error verifying token:', err);
//             return res.status(401).json({ authenticated: false, error: 'Invalid or expired token' });
//         }
        
//         // Fetch user data from the database based on decoded email
//         const email = decoded.email;
//         const query = 'SELECT id, email, username FROM users WHERE email = ?';
//         con.query(query, [email], (err, result) => {
//             if (err) {
//                 console.error('Error fetching user data:', err);
//                 return res.status(500).json({ authenticated: false, error: 'Internal Server Error' });
//             }
            
//             if (result.length === 0) {
//                 return res.status(404).json({ authenticated: false, error: 'User not found' });
//             }
            
//             // User data found, send it in the response
//             const userData = result[0];
//             return res.json({ authenticated: true, user: userData });
//         });
//     });
// });



export { router as adminRouter };
