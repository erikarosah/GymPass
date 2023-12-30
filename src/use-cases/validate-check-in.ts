import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { ResourceNotFoundError } from './errors/resource-not-found.error';
import dayjs from 'dayjs';
import { LateCheckInValidateError } from './errors/late-check-in-validate-error';

interface ValidadeCheckInUseCaseRequest {
    checkInId: string
}

interface ValidadeCheckInUseCaseResponse {
    checkIn: CheckIn
}

export class ValidadeCheckInUseCase {
    constructor(
        private checkInsRepository: CheckInsRepository
    ){}

    async execute({
        checkInId
    }: ValidadeCheckInUseCaseRequest): Promise<ValidadeCheckInUseCaseResponse> {

        const checkIn = await this.checkInsRepository.findById(checkInId);

        if(!checkIn) {
            throw new ResourceNotFoundError();
        }

        const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
            checkIn.created_at,
            'minutes'
        );

        const twentyMinutes = 20;
        if(distanceInMinutesFromCheckInCreation > twentyMinutes) {
            throw new LateCheckInValidateError();
        }

        checkIn.validated_at = new Date();

        await this.checkInsRepository.save(checkIn);

        return {
            checkIn
        };
    }
}