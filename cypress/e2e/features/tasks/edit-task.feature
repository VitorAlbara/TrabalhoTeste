# language: pt
Feature: Edição de Tarefas
  Como um usuário autenticado
  Eu quero poder editar minhas tarefas existentes
  Para manter minhas informações atualizadas

  Background:
    Given que o usuário "Mark" está cadastrado com o e-mail "mark@user.example" e a senha "123456"
    And está autenticado com o e-mail "mark@user.example" e a senha "123456"

  Scenario: Edição bem-sucedida de uma tarefa
    Given que existe uma tarefa com o título "Tarefa Original"
    When eu acesso a lista de tarefas
    And clico em "Editar" na tarefa "Tarefa Original"
    And limpo o campo de título e digito "Tarefa Editada com Sucesso"
    And envio o formulário de edição
    Then a tarefa "Tarefa Editada com Sucesso" deve aparecer na lista de tarefas
    And a tarefa "Tarefa Original" não deve mais existir
