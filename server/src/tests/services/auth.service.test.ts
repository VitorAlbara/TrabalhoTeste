import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthService } from '../../services/auth.service';
import { prisma } from '../../utils/prisma';
import { UserAlreadyRegisteredError } from '../../errors/auth/UserAlreadyRegisteredError';
import { InvalidCredentialsError } from '../../errors/auth/InvalidCredentialsError';
import { UserNotFoundError } from '../../errors/auth/UserNotFoundError';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../utils/prisma', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    },
}));

describe('AuthService', () => {
    const mockUser = {
        id: 1,
        email: 'usuario@exemplo.teste',
        name: 'Usuário Exemplo',
        password: 'senha-criptografada',
        createdAt: new Date(),
    };
    const password = 'senha';

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('registerUser', () => {
        it('1. Deve cadastrar um novo usuário e retornar seu token', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue(mockUser.password);
            (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
            (jwt.sign as jest.Mock).mockReturnValue('token-jwt-mock');

            const result = await AuthService.registerUser(mockUser.email, password, mockUser.name);

            expect(result.token).toBe('token-jwt-mock');
            expect(result.user.email).toBe(mockUser.email);
        });

        it('2. Deve lançar um erro ao tentar cadastrar um e-mail que já existe', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
            await expect(AuthService.registerUser(mockUser.email, password, mockUser.name))
                .rejects.toThrow(UserAlreadyRegisteredError);
        });
    });

    describe('loginUser', () => {
        it('3. Deve realizar o login do usuário e retornar seu token', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('token-jwt-mock');

            const result = await AuthService.loginUser(mockUser.email, password);

            expect(result.token).toBe('token-jwt-mock');
        });

        it('4. Deve lançar um erro se o usuário não for encontrado durante o login', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            await expect(AuthService.loginUser('naoexiste@exemplo.com', password))
                .rejects.toThrow(InvalidCredentialsError);
        });

        it('5. Deve lançar um erro se a senha estiver incorreta durante o login', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);
            await expect(AuthService.loginUser(mockUser.email, 'senha-errada'))
                .rejects.toThrow(InvalidCredentialsError);
        });
    });

    describe('getUserById', () => {
        it('6. Deve retornar os dados do usuário com base no seu identificador', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
            const user = await AuthService.getUserById(mockUser.id);
            expect(user).toEqual(mockUser);
        });

        it('7. Deve lançar um erro se o usuário com o ID fornecido não for encontrado', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            await expect(AuthService.getUserById(999))
                .rejects.toThrow(UserNotFoundError);
        });
    });

    describe('getUserFromTokenPayload', () => {
        it('8. Deve retornar dados do usuário com base no ID extraído do token', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
            const user = await AuthService.getUserFromTokenPayload(mockUser.id);
            expect(user).toEqual(mockUser);
        });
    });

    describe('refreshToken', () => {
        it('9. Deve retornar um novo token se o token antigo for válido', () => {
            (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUser.id });
            (jwt.sign as jest.Mock).mockReturnValue('token-novo-gerado');

            const newToken = AuthService.refreshToken('token-antigo-valido');

            expect(jwt.verify).toHaveBeenCalledWith('token-antigo-valido', expect.any(String), { ignoreExpiration: true });
            expect(newToken).toBe('token-novo-gerado');
        });

        it('10. Deve lançar um erro se o token antigo for inválido ou expirado', () => {
            const erroToken = new Error('Token inválido');
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw erroToken;
            });
            expect(() => AuthService.refreshToken('token-antigo-invalido')).toThrow(erroToken);
        });
    });
});
