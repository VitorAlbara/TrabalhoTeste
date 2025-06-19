import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given(
    'que o usuário {string} está cadastrado com o e-mail {string} e a senha {string}',
    (name: string, email: string, password: string) => {
        cy.registerUser({ name, email, password });
    },
);

Given(
    'está autenticado com o e-mail {string} e a senha {string}',
    (email: string, password: string) => {    
        cy.login(email, password);
    },
);


Given('que existe uma tarefa com o título {string}', (title: string) => {

    cy.createTask({ title, description: 'Descrição inicial', priority: 'low' });
});


When('eu acesso a lista de tarefas', () => {

    cy.intercept('GET', '**/api/tasks*').as('getTasks');

    cy.visit('/tasks');
    cy.wait('@getTasks');
});

When('clico em {string} na tarefa {string}', (buttonText: string, taskTitle: string) => {
    cy.contains('.task-card', taskTitle).within(() => {
        cy.contains('a', buttonText).click();
    });
});

When('limpo o campo de título e digito {string}', (newTitle: string) => {
    cy.get('input[name="title"]').clear().type(newTitle);
});

When('envia o formulário de edição', () => {
    cy.get('form').submit();
});

Then('a tarefa {string} deve aparecer na lista de tarefas', (title: string) => {
    cy.url().should('include', '/tasks');
    cy.contains(title).should('be.visible');
});

Then('a tarefa {string} não deve mais existir', (oldTitle: string) => {
    cy.contains(oldTitle).should('not.exist');
});
