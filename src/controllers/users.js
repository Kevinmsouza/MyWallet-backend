import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import connection from '../database/database.js';
import { validateSignUp, validateSignIn } from '../validation/validation.js';

async function postSignUp(req, res) {
    if (validateSignUp(req.body)) return res.sendStatus(400);
    const {
        name,
        email,
        password,
    } = req.body;
    try {
        const checkDisponibility = await connection.query('SELECT * FROM users WHERE email = $1;', [email]);
        if (checkDisponibility.rows.length) return res.sendStatus(409);
        const passwordHash = bcrypt.hashSync(password, 10);
        await connection.query(`
            INSERT INTO users
            (name, email, password)
            VALUES ($1, $2, $3);
        `, [name, email, passwordHash]);
        return res.sendStatus(201);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return res.sendStatus(500);
    }
}

async function postSignIn(req, res) {
    if (validateSignIn(req.body)) return res.sendStatus(400);
    const {
        email,
        password,
    } = req.body;
    try {
        const result = await connection.query('SELECT * FROM users WHERE email = $1;', [email]);
        const user = result.rows[0];
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = uuid();
            const checkSessions = await connection.query(`
                SELECT * FROM sessions 
                WHERE userid = $1;
            `, [user.id]);
            if (checkSessions.rows.length) { await connection.query('DELETE FROM sessions WHERE userid = $1;', [user.id]); }
            await connection.query(`
                INSERT INTO sessions
                    (token, userid)
                VALUES ($1, $2);
                `, [token, user.id]);
            return res.send({
                name: user.name,
                token,
            });
        }
        return res.sendStatus(404);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return res.sendStatus(500);
    }
}

async function postLogout(req, res) {
    const userToken = req.headers.authorization?.replace('Bearer ', '');
    if (!userToken) return res.sendStatus(400);
    try {
        const checkSession = await connection.query('SELECT * FROM sessions WHERE token = $1', [userToken]);
        if (!checkSession.rows.length) return res.sendStatus(403);
        await connection.query('DELETE FROM sessions WHERE token = $1', [userToken]);
        return res.sendStatus(200);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return res.sendStatus(500);
    }
}

export {
    postSignUp,
    postSignIn,
    postLogout,
};
