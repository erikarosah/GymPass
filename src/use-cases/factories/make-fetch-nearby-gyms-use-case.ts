import { FetchNearbyGymsUseCases } from '../fetch-nearby-gyms';
import { PrismaGymRepository } from '@/repositories/prisma/prisma.gyms-repository';

export function makeFetchNearbyGymsUseCase(){
    const gymsRepository = new PrismaGymRepository();
    const useCase = new FetchNearbyGymsUseCases(gymsRepository);

    return useCase;
}