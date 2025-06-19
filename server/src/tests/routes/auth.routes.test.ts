import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import app from '../../app';
import { prisma } from '../../utils/prisma';
import { setupTestDB, disconnectTestDB } from '../setup.test.db';

beforeAll(async () => {
    await setupTestDB();
});

afterAll(async () => {
    await disconnectTestDB();
});

describe('AuthController', () => {
    describe('POST /api/auth/register', () => {
        it('deve registrar um usuário com dados válidos', async () => {
            // Arrange: Prepara os dados para o novo usuário.
            const userData = {
                email: 'usuario@valido.teste',
                password: 'senha',
                name: 'Usuário Válido',
            };

            // Act: Envia a requisição para o endpoint.
            const response = await request(app).post('/api/auth/register').send(userData);

            // Assert: Verifica a resposta da API e o estado do banco de dados.
            expect(response.status).toBe(StatusCodes.CREATED);
            expect(response.body).toMatchObject({
                user: { email: userData.email },
                token: expect.any(String),
            });

            const userInDB = await prisma.user.findUnique({ where: { email: userData.email } });
            expect(userInDB).not.toBeNull();
            expect(userInDB?.password).not.toBe(userData.password); 
        });
    });

    describe('POST /api/auth/login', () => {
        const loginData = {
            email: 'usuario.login@valido.teste',
            password: 'senhaValida123',
        };

        beforeAll(async () => {
            await request(app).post('/api/auth/register').send({
                ...loginData,
                name: 'Usuario Login',
            });
        });

        it('deve autenticar um usuário com credenciais válidas e retornar um token', async () => {

            const response = await request(app).post('/api/auth/login').send(loginData);

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body).toMatchObject({
                user: { email: loginData.email },
                token: expect.any(String),
            });
        });

        it('deve retornar erro de não autorizado para credenciais inválidas', async () => {
            const response = await request(app).post('/api/auth/login').send({
                email: loginData.email,
                password: 'senha-incorreta',
            });

            expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
            expect(response.body.token).toBeUndefined();
        });
    });
});
