/* eslint-disable no-undef */
import '../src/setup.js';
import supertest from 'supertest';
import { v4 as uuid } from 'uuid';
import app from '../src/app.js';
import connection from '../src/database/database.js';
import createUser from './factories/user.factory.js';

let user;
const token = uuid();

const validBody = { value: 1, description: 'Teste automatizado' };

beforeAll(async () => {
    user = createUser();
    await connection.query('INSERT INTO sessions (userid, token) values ($1, $2);', [user.id, token]);
});

afterAll(async () => {
    await connection.query('TRUNCATE users CASCADE;');
    connection.end();
});

describe('POST /operations', () => {
    it('returns 400 for invalid body', async () => {
        const result = await supertest(app)
            .post('/operations')
            .set('Authorization', token)
            .send({
                description: 'Teste automatizado',
            });
        expect(result.status).toEqual(400);
    });

    it('returns 401 for unauthenticated', async () => {
        const result = await supertest(app)
            .post('/operations')
            .send(validBody);
        expect(result.status).toEqual(401);
    });

    it('returns 200 for success', async () => {
        const result = await supertest(app)
            .post('/operations')
            .set('Authorization', token)
            .send(validBody);
        expect(result.status).toEqual(200);
    });
});
