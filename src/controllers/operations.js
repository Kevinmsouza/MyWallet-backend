import e from 'express';
import connection from '../database/database.js'
import { validateAddOperation } from '../validation/validation.js'

async function getOperations (req, res) {
    const userToken = req.headers.authorization?.replace('Bearer ', '');
    if(!userToken) return res.sendStatus(400);
    try {
        const checkSession = await connection.query(`SELECT * FROM sessions WHERE token = $1;`, [userToken]);
        if(!checkSession.rows.length) return res.sendStatus(403);
        const { userid } = checkSession.rows[0];
        const result = await connection.query(`SELECT * FROM operations WHERE userid = $1;`, [userid])
        result.rows.forEach(operation => delete operation.userid)
        res.send(result.rows)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function postAddOperation (req, res){
    const userToken = req.headers.authorization?.replace('Bearer ', '');
    if(validateAddOperation(req.body) || !userToken) return res.sendStatus(400);
    try {
        const checkSession = await connection.query(`SELECT * FROM sessions WHERE token = $1;`, [userToken]);
        if(!checkSession.rows.length) return res.sendStatus(403);
        const { userid } = checkSession.rows[0];
        const { value, description } = req.body;
        await connection.query(`
            INSERT INTO operations (userid, value, description, date)
            VALUES ($1, $2, $3, NOW())
        ;`, [userid, value, description]);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export {
    getOperations,
    postAddOperation
}