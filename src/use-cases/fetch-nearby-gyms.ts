import { GymsRepository } from '@/repositories/gyms-repository';
import { Gym } from '@prisma/client';

interface FetchNearbyGymsUseCasesRequest {
    userLatitude: number,
    userLongitude: number,
}

interface FetchNearbyGymsUseCasesResponse {
    gyms: Gym[]
}

export class FetchNearbyGymsUseCases {
    constructor(private gymsRepository: GymsRepository){}

    async execute({
        userLatitude,
        userLongitude
    }: FetchNearbyGymsUseCasesRequest): Promise<FetchNearbyGymsUseCasesResponse>{
        const gyms = await this.gymsRepository.findManyNearby({
            latitude: userLatitude,
            longitude: userLongitude
        });

        return {
            gyms
        };
    }
}