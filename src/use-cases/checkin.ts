import { CheckIn } from '@prisma/client';
import { GymsRepository } from '@/repositories/gyms-repository';
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { ResourceNotFoundError } from './errors/resource-not-found.error';
import { getDistanceBetweenCoordinate } from '@/utils/get-distance-between-coordinates';

interface CheckInUseCaseRequest {
    userId: string,
    gymId: string,
    userLatitude: number,
    userLongitude: number
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn
}

export class CheckInUseCase {
    constructor(
        private checkInsRepository: CheckInsRepository,
        private gymsRepository: GymsRepository
    ) {}

    async execute(
        {userId, gymId, userLatitude, userLongitude}
        : CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {

        const gym = await this.gymsRepository.findById(gymId);

        if(!gym) {
            throw new ResourceNotFoundError();
        }
        
        const distance = getDistanceBetweenCoordinate(
            { latitude: userLatitude, longitude: userLongitude},
            { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber()},
        );

        const maxDistanceInKm = 0.1;
        if(distance > maxDistanceInKm) {
            throw new Error();
        }
        
        const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(userId, new Date());

        if(checkInOnSameDate) {
            throw new Error();
        }

        const checkIn = await this.checkInsRepository.create({
            user_id: userId,
            gym_id: gymId
        });

        return {
            checkIn
        };
    }
}