# language: pt
Funcionalidade: Registo de um Novo Usuário
  Para poder usar o sistema,
  Como um novo visitante,
  Eu quero poder criar uma nova conta.

  Cenário: Registo bem-sucedido com dados válidos
    Given que eu estou na página de registo
    When eu preencho o formulário de registo com dados válidos
    And envio o formulário de registo
    Then eu devo ser redirecionado para a página de tarefas
    And o botão "Sair" deve estar visível
