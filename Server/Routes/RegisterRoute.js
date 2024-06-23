import express from 'express';
import con from "../utils/db.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";
const SALT_ROUNDS = 10;

router.post('/register', (req, res) => {
    const { email, password, username } = req.body;

   
    bcrypt.hash(password, SALT_ROUNDS, (hashErr, hashedPassword) => {
        if (hashErr) {
            console.error("Error hashing password:", hashErr);
            return res.status(500).json({ registerStatus: false, error: "Failed to register user" });
        }

        const sql = "INSERT INTO users (email, password, username) VALUES (?, ?, ?)";
        con.query(sql, [email, hashedPassword, username], (err, result) => {
            if (err) {
                console.error("Error executing SQL query:", err);
                return res.status(500).json({ registerStatus: false, error: "Failed to register user" });
            }

            const token = jwt.sign(
                { email: email },
                JWT_SECRET,
                { expiresIn: "1d" }
            );

           
            const updateTokenSql = "UPDATE users SET token = ? WHERE email = ?";
            con.query(updateTokenSql, [token, email], (updateErr, updateResult) => {
                if (updateErr) {
                    console.error("Error updating token in database:", updateErr);
                    return res.status(500).json({ registerStatus: false, error: "Failed to register user" });
                }

        
                res.cookie('token', token);
                res.json({ registerStatus: true });
            });
        });
    });
});

export { router as registerRouter };
