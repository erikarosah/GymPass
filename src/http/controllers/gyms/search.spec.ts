import { app } from '@/app';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Search (e2e)', () => {
    beforeAll( async () => {
        await app.ready();
    });

    afterAll( async () => {
        await app.close();
    });

    it('should be able to search gyms by title', async () => {
        const { token } = await createAndAuthenticateUser(app);

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`).send({
                title: 'Gym 01',
                description: 'Some description',
                phone: '00000000',
                latitude: -18.9692848,
                longitude: -43.0921941 
            });

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`).send({
                title: 'Gym 02',
                description: 'Some description',
                phone: '00000000',
                latitude: -19.9692848,
                longitude: -44.0921941 
            });

        const response = await request(app.server)
            .get('/gyms/search')
            .query({
                query:'Gym 01'
            })
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({title: 'Gym 01'})
        ]);
    });
});