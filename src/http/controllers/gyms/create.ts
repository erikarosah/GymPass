import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const createGymBodySchema = z.object({
        title: z.string(),
        description: z.null().nullable(),
        phone: z.null().nullable(),
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90;
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 100;
        })
    });

    const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body);

    const createGymUseCase = makeCreateGymUseCase();

    await createGymUseCase.execute({
        title,
        description,
        phone,
        latitude,
        longitude
    });

    reply.status(201).send();

    
}  