import { GetUserProfileUseCase } from '../get-user-profile';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository';

export function makeGetUserProfileUseCase(){
    const usersRepository = new PrismaUserRepository();
    const useCase = new GetUserProfileUseCase(usersRepository);

    return useCase;
}