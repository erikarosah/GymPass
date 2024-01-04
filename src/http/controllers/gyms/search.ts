import { z } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case';

export async function search(request: FastifyRequest, reply: FastifyReply) {
    const searchGymBodySchema = z.object({
        query: z.string(),
        page: z.coerce.number().min(1).default(1)
    });

    const { query, page } =
    searchGymBodySchema.parse(request.query);

    const createGymUseCase = makeSearchGymsUseCase();

    const { gyms } = await createGymUseCase.execute({
        query,
        page
    });

    reply.status(200).send({
        gyms
    });
}  