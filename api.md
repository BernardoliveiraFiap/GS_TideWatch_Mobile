# API Documentation

## Overview
Este documento descreve as APIs utilizadas no projeto Global Solution TIDEWATCH para gerenciar usuários, barcos e dados de coleta. 

## Endpoints

# Autenticação
1. **Registro de Usuário**
   - Se o usuário não tiver uma conta, ele deve se registrar.
   - O endpoint de registro cria uma nova conta de usuário no Firebase e retorna um token de autenticação.

2. **Login de Usuário**
   - Se o usuário já tiver uma conta, ele pode fazer login.
   - O endpoint de login autentica o usuário no Firebase e retorna um token de autenticação.

# Login
http
POST /api/login
Descrição: Autentica um usuário e retorna um token de acesso.
Parâmetros de Requisição:
email (string, obrigatório): O email do usuário.
password (string, obrigatório): A senha do usuário.
Exemplo de Requisição:
{
  "email": "usuario@example.com",
  "password": "senha123"
}
---------------------------------------------------------------------
# Registro
POST /api/register
name (string, obrigatório): O nome do usuário.
email (string, obrigatório): O email do usuário.
password (string, obrigatório): A senha do usuário.
Exemplo de Requisição:
{
  "email": "joao.silva@example.com",
  "password": "senha123"
}
---------------------------------------------------------------------
# Barcos Listar Barcos
GET /api/boats
Resposta de Sucesso:
[
  {
    "id": 1,
    "name": "Barco 1",
    "data: 01/06/2004"
  },
  {
    "id": 2,
    "name": "Barco 2",
    "data: 01/06/2004"
  }
]
---------------------------------------------------------------------
# Barcos Adicionar Barcos 
Descrição: Adiciona um novo barco ao sistema.
Parâmetros de Requisição:
name (string, obrigatório): O nome do barco.
status (string, obrigatório): O status do barco (ex: "operando", "manutenção").
---------------------------------------------------------------------
# Atualizar Barco
Descrição: Atualiza as informações de um barco específico.
Parâmetros de Requisição:
name (string, opcional): O nome do barco.
status (string, opcional): O status do barco (ex: "operando", "manutenção").
---------------------------------------------------------------------
# Deletar Barco
DELETE /api/boats/{id}
Descrição: Remove um barco específico do sistema.
Parâmetros de Requisição: Nenhum
---------------------------------------------------------------------
# Coleta
GET /api/collection
Descrição: Retorna dados de barcos existentes em tempo real.
---------------------------------------------------------------------
# Exclusão de Conta
DELETE /api/users/{id}
Deletar Conta de Usuário
Descrição: Remove a conta de um usuário específico do Firebase. Este endpoint exige autenticação.

### Explicação

1. **Visão Geral**: Explica brevemente o propósito das APIs.
2. **Endpoints de Autenticação**: Detalha os endpoints de login e registro, explicando como obter um token de autenticação.
3. **Endpoints de Barcos**: Inclui endpoints para listar, adicionar, atualizar e deletar barcos, com exemplos de requisições e respostas.
4. **Endpoint de Coleta**: Detalha o endpoint que retorna dados de coleta em tempo real.
5. **Autenticação e Autorização**: Explica como usar o token de autenticação.
6. **Respostas de Erro**: Define o formato de respostas de erro e códigos de status HTTP.
7. **Contato**: Fornece informações de contato para suporte adicional.
