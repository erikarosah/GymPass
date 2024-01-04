import { FastifyInstance } from 'fastify';
import { profile } from './profile';
import { register } from './register';
import { authenticate } from './authenticate';
import { verifyJWT } from '../middlewares/verify-jwt';

export async function appRoutes (app: FastifyInstance) {
    app.post('/users', register);
    app.post('/sessions', authenticate);
    
    app.get('/me', {onRequest: [verifyJWT]}, profile);
}