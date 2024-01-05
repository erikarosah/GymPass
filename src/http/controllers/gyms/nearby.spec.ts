import { app } from '@/app';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Nearby Gyms (e2e)', () => {
    beforeAll( async () => {
        await app.ready();
    });

    afterAll( async () => {
        await app.close();
    });

    it('should be able to list nearby gyms', async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`).send({
                title: 'Gym 01',
                description: null,
                phone: null,
                latitude: -18.9692848,
                longitude: -43.0921941 
            });

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`).send({
                title: 'Gym 02',
                description: null,
                phone: null,
                latitude: -12.9692848,
                longitude: -41.0921941 
            });

        const response = await request(app.server)
            .get('/gyms/nearby')
            .query({
                latitude: -18.9692848,
                longitude: -43.0921941 
            })
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({title: 'Gym 01'})
        ]);
    });
});