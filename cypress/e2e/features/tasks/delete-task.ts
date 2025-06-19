import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given(
    'que o utilizador {string} está cadastrado com o e-mail {string} e a senha {string}',
    (name: string, email: string, password: string) => {
        cy.registerUser({ name, email, password });
    },
);

Given(
    'está autenticado com o e--mail {string} e a senha {string}',
    (email: string, password: string) => {
        cy.login(email, password);
    },
);

Given('que existe uma tarefa com o título {string}', (title: string) => {
    cy.createTask({ title, description: 'Descrição para deletar', priority: 'low' });
});

When('eu acesso a lista de tarefas', () => {
    cy.intercept('GET', '**/api/tasks*').as('getTasks');
    cy.visit('/tasks');
    cy.wait('@getTasks');
});

When('clico no botão {string} na tarefa {string}', (buttonText: string, taskTitle: string) => {
    cy.contains('.task-card', taskTitle).within(() => {
        cy.contains('button', buttonText).click();
    });
});

Then('a tarefa {string} não deve mais estar visível na lista', (taskTitle: string) => {
    cy.contains(taskTitle).should('not.exist');
});
