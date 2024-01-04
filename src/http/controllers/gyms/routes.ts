import { create } from './create';
import { search } from './search';
import { nearby } from './nearby';
import { FastifyInstance } from 'fastify';
import { verifyJWT } from '../../middlewares/verify-jwt';

export async function gymsRoutes (app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT);

    app.post('/gyms', create);
    app.get('/gyms/search', search);
    app.get('/gyms/nearby', nearby);
}