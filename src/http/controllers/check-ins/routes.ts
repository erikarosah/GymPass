import { create } from './create';
import { metrics } from './metrics';
import { history } from './history';
import { validate } from './validate';
import { FastifyInstance } from 'fastify';
import { verifyJWT } from '../../middlewares/verify-jwt';

export async function checkInsRoutes (app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT);
    
    app.get('/check-ins/history', history);
    app.get('/check-ins/metrics', metrics);
    app.post('/gyms/:gymId/check-ins', create);
    app.patch('/check-ins/:checkInId/validate', validate);
}