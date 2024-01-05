import { app } from '@/app';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Create Gym (e2e)', () => {
    beforeAll( async () => {
        await app.ready();
    });

    afterAll( async () => {
        await app.close();
    });

    it('should be able to create a gym', async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        const response = await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`).send({
                title: 'Gym 01',
                description: 'Some description',
                phone: '00000000',
                latitude: -18.9692848,
                longitude: -43.0921941 
            });

        expect(response.statusCode).toEqual(201);
    });
});