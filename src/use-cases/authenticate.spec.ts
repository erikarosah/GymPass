import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid.credentials.error';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authentication Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new AuthenticateUseCase(usersRepository);
    });
    
    it('should be able to authentication', async () => {
        await usersRepository.create({
            name: 'John Doe',
            email:'johndoe@gmail.com',
            password_hash: await hash('123456', 6)
        });

        const {user} = await sut.execute({
            email: 'johndoe@gmail.com',
            password: '123456'
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it('should not be able with wrong email', async () => {
        await expect(() =>
            sut.execute({
                email: 'johndoe@gmail.com',
                password: '123456'
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError); 
    });

    it('should not be able with wrong password', async () => {
        await usersRepository.create({
            name: 'John Doe',
            email:'johndoe@gmail.com',
            password_hash: await hash('123456', 6)
        });

        await expect(() =>
            sut.execute({
                email: 'johndoe@gmail.com',
                password: '1234567'
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError); 
    });
});