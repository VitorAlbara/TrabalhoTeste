# language: pt
Funcionalidade: Deleção de Tarefas
  Como um utilizador autenticado
  Eu quero poder deletar as minhas tarefas
  Para manter a minha lista organizada

  Background:
    Given que o utilizador "Deleter User" está cadastrado com o e-mail "deleter@user.example" e a senha "123456"
    And está autenticado com o e-mail "deleter@user.example" e a senha "123456"

  Scenario: Deleção bem-sucedida de uma tarefa existente
    Given que existe uma tarefa com o título "Tarefa Para Deletar"
    When eu acesso a lista de tarefas
    And clico no botão "Deletar" na tarefa "Tarefa Para Deletar"
    Then a tarefa "Tarefa Para Deletar" não deve mais estar visível na lista
