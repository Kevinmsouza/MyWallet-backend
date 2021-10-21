import bcrypt from 'bcrypt'
import connection from '../database/database.js'
import { validateUser } from '../validation/validation.js'

async function postSignUp (req, res){
    if(validateUser(req.body)) return res.sendStatus(400)
    const {
        name,
        email,
        password
    } = req.body
    try {
        const checkDisponibility = await connection.query('SELECT * FROM users WHERE email = $1;', [email]);
        if(checkDisponibility.rows.length) return res.sendStatus(409);
        const passwordHash = bcrypt.hashSync(password, 10);
        await connection.query(`
            INSERT INTO users
            (name, email, password)
            VALUES ($1, $2, $3);
        `, [name, email, passwordHash]);
        res.sendStatus(201);
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export {
    postSignUp
}