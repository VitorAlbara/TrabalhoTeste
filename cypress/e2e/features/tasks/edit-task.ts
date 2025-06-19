import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('que existe uma tarefa com o título {string}', (title: string) => {
    cy.createTask({ title, description: 'Descrição inicial', priority: 'low' });
});

When('eu acesso a lista de tarefas', () => {
    cy.visit('/tasks');
});

When('clico em {string} na tarefa {string}', (buttonText: string, taskTitle: string) => {
    cy.contains(taskTitle).parents('.task-card').within(() => {
        cy.contains('a', buttonText).click();
    });
});

When('limpo o campo de título e digito {string}', (newTitle: string) => {
    cy.get('input[name="title"]').clear().type(newTitle);
});

When('envia o formulário de edição', () => {
    cy.get('form').submit();
});

Then('a tarefa {string} não deve mais existir', (oldTitle: string) => {
    cy.contains(oldTitle).should('not.exist');
});
