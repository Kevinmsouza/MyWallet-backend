import app from '../src/app.js';
import supertest from 'supertest';

const token = "Bearer f634d51e-ea54-42a6-84e1-51f7dfad66d1"
const putId = 7

describe("PUT /operations", () => {

    it("returns 400 for id is not a number", async () => {
        const result = await supertest(app)
            .put("/operations/k")
            .set('Authorization', token)
            .send({value: 1, description: "Teste automatizado"})
        expect(result.status).toEqual(400)
    })

    it("returns 400 for id is not a positive integer", async () => {
        const result = await supertest(app)
            .put("/operations/-1")
            .set('Authorization', token)
            .send({value: 1, description: "Teste automatizado"})
        expect(result.status).toEqual(400)
    })

    it("returns 400 for invalid body", async () => {
        const result = await supertest(app)
            .put(`/operations/7`)
            .set('Authorization', token)
            .send({
                description: "Teste automatizado"
            })
        expect(result.status).toEqual(400)
    })

    it("returns 401 for unauthenticated", async () => {
        const result = await supertest(app)
            .put(`/operations/7`)
            .send({
                value: 1,
                description: "Teste automatizado"
            })
        expect(result.status).toEqual(401)
    })

    it("returns 404 for operation does not exist", async () => {
        const result = await supertest(app)
            .put(`/operations/1`)
            .set('Authorization', token)
            .send({
                value: 1,
                description: "Teste automatizado"
            })
        expect(result.status).toEqual(404)
    })

    it("returns 403 for operation of other user", async () => {
        const result = await supertest(app)
            .put(`/operations/8`)
            .set('Authorization', token)
            .send({
                value: 1,
                description: "Teste automatizado"
            })
        expect(result.status).toEqual(403)
    })

    it("returns 200 for success", async () => {
        const result = await supertest(app)
            .put(`/operations/7`)
            .set('Authorization', token)
            .send({
                value: 1,
                description: "Teste automatizado"
            })
        expect(result.status).toEqual(200)
    })
});