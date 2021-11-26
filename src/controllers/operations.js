import connection from '../database/database.js';
import { validateAddOperation } from '../validation/validation.js';

async function getOperations(req, res) {
    const userToken = req.headers.authorization?.replace('Bearer ', '');
    if (!userToken) return res.sendStatus(400);
    try {
        const checkSession = await connection.query('SELECT * FROM sessions WHERE token = $1;', [userToken]);
        if (!checkSession.rows.length) return res.sendStatus(403);
        const { userid } = checkSession.rows[0];
        const result = await connection.query(`
            SELECT * FROM operations
            WHERE userid = $1 
            LIMIT 1000
            ;`, [userid]);
        // eslint-disable-next-line no-param-reassign
        result.rows.forEach((operation) => delete operation.userid);
        return res.send(result.rows);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return res.sendStatus(500);
    }
}

async function postAddOperation(req, res) {
    const userToken = req.headers.authorization?.replace('Bearer ', '');
    if (!userToken) return res.sendStatus(401);
    if (validateAddOperation(req.body)) return res.sendStatus(400);
    try {
        const checkSession = await connection.query('SELECT * FROM sessions WHERE token = $1;', [userToken]);
        if (!checkSession.rows.length) return res.sendStatus(403);
        const { userid } = checkSession.rows[0];
        const { value, description } = req.body;
        await connection.query(`
            INSERT INTO operations (userid, value, description, date)
            VALUES ($1, $2, $3, NOW())
        ;`, [userid, value, description]);
        return res.sendStatus(200);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return res.sendStatus(500);
    }
}

async function putEditOperation(req, res) {
    let { id } = req.params;
    id *= 1;
    if (!Number.isInteger(id) || id <= 0 || validateAddOperation(req.body)) {
        return res.sendStatus(400);
    }
    const userToken = req.headers.authorization?.replace('Bearer ', '');
    if (!userToken) return res.sendStatus(401);
    try {
        const checkOperation = await connection.query('SELECT * FROM operations WHERE id = $1;', [id]);
        if (!checkOperation.rows.length) return res.sendStatus(404);
        const checkSession = await connection.query('SELECT * FROM sessions WHERE token = $1;', [userToken]);
        const session = checkSession.rows;
        if (!session.length || checkOperation.rows[0].userid !== session[0].userid) {
            return res.sendStatus(403);
        }
        const { value, description } = req.body;
        await connection.query(`
            UPDATE operations
            SET value = $2, description = $3
            WHERE id = $1
        ;`, [id, value, description]);
        return res.sendStatus(200);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return res.sendStatus(500);
    }
}

async function deleteOperation(req, res) {
    let { id } = req.params;
    id *= 1;
    if (!Number.isInteger(id) || id <= 0) return res.sendStatus(400);
    const userToken = req.headers.authorization?.replace('Bearer ', '');
    if (!userToken) return res.sendStatus(401);
    try {
        const checkOperation = await connection.query('SELECT * FROM operations WHERE id = $1;', [id]);
        if (!checkOperation.rows.length) return res.sendStatus(404);
        const checkSession = await connection.query('SELECT * FROM sessions WHERE token = $1;', [userToken]);
        const session = checkSession.rows;
        if (!session.length || checkOperation.rows[0].userid !== session[0].userid) {
            return res.sendStatus(403);
        }
        await connection.query(`
            DELETE FROM operations
            WHERE id = $1
        ;`, [id]);
        return res.sendStatus(200);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return res.sendStatus(500);
    }
}

export {
    getOperations,
    postAddOperation,
    putEditOperation,
    deleteOperation,
};
