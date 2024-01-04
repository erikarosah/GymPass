import { CheckInUseCase } from '../checkin';
import { PrismaGymRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';

export function makeCheckInUseCase(){
    const checkInsRepository = new PrismaCheckInsRepository();
    const gymsRepository = new PrismaGymRepository();
    const useCase = new CheckInUseCase(checkInsRepository, gymsRepository);

    return useCase;
}