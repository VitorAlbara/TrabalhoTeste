/* eslint-disable @typescript-eslint/no-namespace */

import { LoginRequest, RegisterRequest } from '../../src/api/auth';
import { CreateTaskRequest } from '../../src/api/task';

// ====================================================================
// DECLARAÇÃO DE TIPOS PARA COMANDOS CUSTOMIZADOS
// Esta seção "ensina" o TypeScript sobre os novos comandos.
// A declaração é movida para o topo para melhor organização.
// ====================================================================
declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Comando para resetar o banco de dados de teste via API.
             * @example cy.resetDatabase()
             */
            resetDatabase(): Chainable<void>;

            /**
             * Comando para registrar um novo usuário via API.
             * @example cy.registerUser({ name: 'User', email: 'user@test.com', password: '123' })
             */
            registerUser(user: RegisterRequest): Chainable<void>;

            /**
             * Comando para fazer login via API e salvar o token no localStorage.
             * @example cy.login('user@test.com', '123')
             */
            login(email: string, password: string): Chainable<void>;
            
            /**
             * Comando para criar uma nova tarefa via API.
             * Requer que o usuário já esteja logado.
             * @example cy.createTask({ title: 'Nova Tarefa', ... })
             */
            createTask(taskData: CreateTaskRequest): Chainable<void>;
        }
    }
}

Cypress.Commands.add('resetDatabase', () => {
    cy.request('POST', `${Cypress.env('apiUrl')}/test/reset-database`);
});

Cypress.Commands.add('registerUser', (user: RegisterRequest) => {
    cy.request('POST', `${Cypress.env('apiUrl')}/auth/register`, user);
});

Cypress.Commands.add('login', (email: string, password: string) => {
    cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/auth/login`,
        body: { email, password } as LoginRequest,
    }).then(({ body }) => {
        expect(body).to.have.property('token');
        window.localStorage.setItem('token', body.token);
    });
});

Cypress.Commands.add('createTask', (taskData: CreateTaskRequest) => {
    const token = window.localStorage.getItem('token');

    cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/tasks`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: taskData,
    });
});

export {};
