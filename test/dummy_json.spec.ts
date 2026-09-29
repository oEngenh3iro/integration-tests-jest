import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

/**
 * Testes de integração da DummyJSON API (https://dummyjson.com)
 *
 * A DummyJSON é uma API pública de dados fictícios (produtos, carrinhos,
 * usuários) usada para prática de consumo e testes de APIs REST.
 *
 * Todos os testes seguem o padrão AAA (Arrange, Act, Assert) e utilizam
 * a biblioteca PactumJS para orquestrar as requisições e asserções.
 */
describe('DummyJSON API - Testes de Integração', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://dummyjson.com';

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  /**
   * Teste 1 - GET
   * Objetivo: garantir que o endpoint /products retorna a lista paginada
   * padrão da API (30 produtos por página, começando do skip=0).
   */
  it('GET /products - deve retornar lista paginada de produtos', async () => {
    // Arrange
    const endpoint = `${baseUrl}/products`;

    // Act
    const response = await p
      .spec()
      .get(endpoint)
      .expectStatus(StatusCodes.OK)
      .expectResponseTime(3000)
      .returns('.');

    // Assert
    expect(response.products.length).toBe(30);
    expect(response.skip).toBe(0);
    expect(response.limit).toBe(30);
    expect(response.total).toBeGreaterThan(0);
  });

  /**
   * Teste 2 - GET
   * Objetivo: validar a busca de um produto específico pelo ID, verificando
   * a estrutura do JSON retornado (schema mínimo esperado).
   */
  it('GET /products/:id - deve retornar produto específico com estrutura válida', async () => {
    // Arrange
    const produtoId = 1;
    const endpoint = `${baseUrl}/products/${produtoId}`;

    // Act & Assert
    await p
      .spec()
      .get(endpoint)
      .expectStatus(StatusCodes.OK)
      .expectJsonLike({
        id: produtoId,
        title: /.+/,
        price: /.+/,
        category: /.+/
      });
  });

  /**
   * Teste 3 - POST
   * Objetivo: criar um novo produto e validar que a API retorna o objeto
   * criado com um ID gerado e os dados enviados preservados.
   */
  it('POST /products/add - deve criar novo produto e retornar ID gerado', async () => {
    // Arrange
    const novoProduto = {
      title: 'Notebook Dell Inspiron 15',
      description: 'Notebook para desenvolvimento com 16GB RAM',
      price: 4500,
      category: 'laptops',
      brand: 'Dell'
    };

    // Act
    const response = await p
      .spec()
      .post(`${baseUrl}/products/add`)
      .withHeaders('Content-Type', 'application/json')
      .withJson(novoProduto)
      .expectStatus(StatusCodes.CREATED)
      .expectJsonLike(novoProduto)
      .returns('.');

    // Assert
    expect(response.id).toBeDefined();
    expect(response.title).toBe(novoProduto.title);
    expect(response.price).toBe(novoProduto.price);
  });

  /**
   * Teste 4 - POST
   * Objetivo: criar um novo carrinho vinculado a um usuário, com múltiplos
   * produtos, e validar que a API calcula o total corretamente.
   */
  it('POST /carts/add - deve criar carrinho e calcular total dos produtos', async () => {
    // Arrange
    const novoCarrinho = {
      userId: 1,
      products: [
        { id: 144, quantity: 4 },
        { id: 98, quantity: 1 }
      ]
    };

    // Act
    const response = await p
      .spec()
      .post(`${baseUrl}/carts/add`)
      .withHeaders('Content-Type', 'application/json')
      .withJson(novoCarrinho)
      .expectStatus(StatusCodes.CREATED)
      .returns('.');

    // Assert
    expect(response.userId).toBe(novoCarrinho.userId);
    expect(response.products.length).toBe(2);
    expect(response.total).toBeGreaterThan(0);
    expect(response.totalProducts).toBe(2);
  });

  /**
   * Teste 5 - PUT
   * Objetivo: atualizar campos de um produto existente e garantir que
   * a resposta contém os novos valores enviados no corpo da requisição.
   */
  it('PUT /products/:id - deve atualizar campos do produto existente', async () => {
    // Arrange
    const produtoId = 1;
    const dadosAtualizados = {
      title: 'iPhone 15 Pro Max',
      price: 8999
    };

    // Act & Assert
    await p
      .spec()
      .put(`${baseUrl}/products/${produtoId}`)
      .withHeaders('Content-Type', 'application/json')
      .withJson(dadosAtualizados)
      .expectStatus(StatusCodes.OK)
      .expectJsonLike({
        id: produtoId,
        title: dadosAtualizados.title,
        price: dadosAtualizados.price
      });
  });
});