\# Testes de Integração — Prova 02



\*\*Aluno:\*\* Filipe Belmiro Jeremias

\*\*Disciplina:\*\* Testes de Software — UNISATC

\*\*API testada:\*\* \[DummyJSON](https://dummyjson.com)

\*\*Ferramentas:\*\* PactumJS + Jest + TypeScript

\*\*Padrão utilizado:\*\* AAA (Arrange, Act, Assert)



\## Sobre a API



A \*\*DummyJSON\*\* é uma API REST pública e gratuita que fornece dados fictícios (produtos, carrinhos, usuários, posts) para prática de testes e desenvolvimento. Não requer autenticação nos endpoints utilizados.



\## Descrição dos Testes



Arquivo: `test/dummy\_json.spec.ts`



\### Teste 1 — GET /products

Verifica se o endpoint principal de produtos retorna a lista paginada padrão da API.

\- \*\*Método:\*\* GET

\- \*\*Validações:\*\* status 200, tempo de resposta abaixo de 3s, retorno de 30 produtos, campos `skip`, `limit` e `total` corretos.



\### Teste 2 — GET /products/:id

Busca um produto específico por ID e valida sua estrutura mínima.

\- \*\*Método:\*\* GET

\- \*\*Validações:\*\* status 200, presença dos campos `id`, `title`, `price` e `category` no JSON de retorno.



\### Teste 3 — POST /products/add

Cria um novo produto na base da API e verifica se os dados enviados foram preservados.

\- \*\*Método:\*\* POST

\- \*\*Validações:\*\* status 201 (Created), presença de `id` gerado, `title` e `price` coincidentes com os dados enviados.



\### Teste 4 — POST /carts/add

Cria um novo carrinho vinculado a um usuário, com múltiplos produtos.

\- \*\*Método:\*\* POST

\- \*\*Validações:\*\* status 201, `userId` correto, quantidade de produtos correta, `total` calculado pela API maior que zero.



\### Teste 5 — PUT /products/:id

Atualiza campos específicos de um produto existente.

\- \*\*Método:\*\* PUT

\- \*\*Validações:\*\* status 200, resposta contendo o `id` original com `title` e `price` atualizados.



\## Como Executar



```bash

npm install

npm test                          # Roda todos os testes

npx jest test/dummy\_json.spec.ts  # Roda só os testes da DummyJSON

```



\## Pipeline CI/CD



O projeto está integrado com:

\- \*\*GitHub Actions:\*\* roda os testes automaticamente a cada push (`.github/workflows/node.js.yml`)

\- \*\*SonarCloud:\*\* analisa a qualidade e cobertura do código

