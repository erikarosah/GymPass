import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';
import { beforeEach, describe, expect, it } from 'vitest';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use Case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new SearchGymsUseCase(gymsRepository);
    });

    it('should be able to search for gyms', async() => {
        await gymsRepository.create({
            title: 'Gym 01 title',
            description: null,
            phone: null,
            latitude: -18.9692848,
            longitude: -43.0921941 
        });

        await gymsRepository.create({
            title: 'Gym 02 title',
            description: null,
            phone: null,
            latitude: -18.9692848,
            longitude: -43.0921941 
        });

        const { gyms } = await sut.execute({
            query:'Gym 01 title',
            page: 1
        }); 

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({title: 'Gym 01 title'})
        ]);
    });

    it('should be able to fetch pagination gyms search', async() => {
        for(let i = 1; i <= 22; i ++) {
            await gymsRepository.create({
                title: `Gym ${i} title`,
                description: null,
                phone: null,
                latitude: -18.9692848,
                longitude: -43.0921941 
            });
        }
        

        const { gyms } = await sut.execute({
            query:'Gym',
            page: 2

        }); 

        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({title: 'Gym 21 title'}),
            expect.objectContaining({title: 'Gym 22 title'})
        ]);
    });
});