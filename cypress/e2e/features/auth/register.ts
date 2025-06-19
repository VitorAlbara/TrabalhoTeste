import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('que eu estou na página de registo', () => {
    cy.visit('/register');
});

When('eu preencho o formulário de registo com dados válidos', () => {
    const timestamp = new Date().getTime();
    cy.get('input[name="name"]').type('Novo Usuário Teste');
    cy.get('input[name="email"]').type(`novo.usuario.${timestamp}@teste.com`);
    cy.get('input[name="password"]').type('senhaForte123');
});

When('envio o formulário de registo', () => {
    cy.get('form').submit();
});

Then('o botão {string} deve estar visível', (buttonText: string) => {

    cy.contains('button', buttonText).should('be.visible');
});
