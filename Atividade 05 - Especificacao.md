# PWEB2 – ATIVIDADE 05

## Sistema de Rastreamento de Entregas (Delivery Tracker API) ---

Desenvolver uma API REST com regras de negócio não triviais, aplicando:

- Arquitetura em camadas (Controller, Service, Repository)
- Injeção de Dependência
- Separação entre lógica de domínio e transporte HTTP

---

## **Requisitos Funcionais (Simulação de Cliente)**

Uma empresa de logística deseja um sistema para rastrear entregas entre cidades. O sistema deve permitir o acompanhamento do ciclo de vida de cada entrega, bem como manter um histórico auditável de eventos.

O sistema deve atender aos seguintes requisitos:

1. O sistema deve permitir o cadastro de novas entregas, informando descrição, origem e destino.
2. O sistema deve controlar o ciclo de vida da entrega, que segue estados bem definidos:
   - Uma entrega começa como **CRIADA**
   - Pode ser colocada em **EM_TRANSITO**
   - Pode ser finalizada como **ENTREGUE**
   - Pode ser **CANCELADA** antes da entrega
3. O sistema deve garantir que transições de estado sejam válidas e consistentes.
4. O sistema deve manter um histórico de eventos para cada entrega, registrando todas as mudanças relevantes.
5. O sistema deve permitir consulta de entregas com filtros por status.
6. O sistema deve impedir inconsistências, como:
   - Origem e destino iguais
   - Avanço de status inválido
   - Cancelamento de entregas já finalizadas
7. O sistema deve garantir que não existam entregas duplicadas com a mesma descrição, origem e destino em aberto.

---

## **Modelo de Dados**

### **Entrega**

```
{
  id: number,
  descricao: string,
  origem: string,
  destino: string,
  status: "CRIADA" | "EM_TRANSITO" | "ENTREGUE" | "CANCELADA",
  historico: [
    {
      data: string,
      descricao: string
    }
  ]
}
```

---

## **Estrutura do Projeto**

```
src/
├── controllers/
├── services/
├── repositories/
├── database/
├── routes/
├── utils/
```

---

## **Camada de "Banco de Dados" (Simulado)**

Implemente uma classe responsável por simular persistência em memória.

```javascript
// src/database/database.js
export class Database {
	constructor() {
		this.entregas = [];
		this.nextId = 1;
	}

	getEntregas() {
		return this.entregas;
	}

	generateId() {
		return this.nextId++;
	}
}
```

O repository deve depender desta classe, e não acessar arrays diretamente.

---

## **Repository**

Implemente `EntregasRepository` utilizando a classe `Database`.

Métodos obrigatórios:

- `listarTodos()`
- `buscarPorId(id)`
- `criar(dados)`
- `atualizar(id, dados)`

---

## **Service (Regras de Negócio)**

O `EntregasService` deve implementar as seguintes regras:

### **Regras básicas**

- Origem e destino não podem ser iguais
- Status inicial deve ser `CRIADA`
- Cada criação deve gerar evento no histórico

---

### **Transições de status**

- `CRIADA → EM_TRANSITO`
- `EM_TRANSITO → ENTREGUE`
- Não pode avançar após `ENTREGUE` ou `CANCELADA`

---

### **Cancelamento**

- Só pode cancelar se não estiver `ENTREGUE`

---

### **Regras adicionais**

1. **Evitar duplicidade ativa**
   - Não pode existir outra entrega com mesma:
      - descrição
      - origem
      - destino
   - desde que NÃO esteja `ENTREGUE` ou `CANCELADA`
2. **Entrega não pode ser marcada como ENTREGUE sem passar por EM_TRANSITO**
   - Deve respeitar a sequência correta
3. **Tempo mínimo lógico (simulado)**
   - Não permitir avanço para `ENTREGUE` imediatamente após criação
   - Deve haver pelo menos um evento intermediário (EM_TRANSITO)

---

### **Histórico**

Cada operação relevante deve gerar evento:

- Criação
- Mudança de status
- Cancelamento

---

## **Rotas obrigatórias**

```
POST   /api/entregas
GET    /api/entregas
GET    /api/entregas/:id
PATCH  /api/entregas/:id/avancar
PATCH  /api/entregas/:id/cancelar
GET    /api/entregas/:id/historico
GET /api/entregas?status="<STATUS>" #Ex. <STATUS>=EM_TRANSITO
```

---

## **Injeção de Dependência**

A composição deve ocorrer no arquivo de rotas:

```javascript
const database = new Database();
const repository = new EntregasRepository(database);
const service = new EntregasService(repository);
const controller = new EntregasController(service);
```

---

## **Cenário de Teste Esperado**

O aluno deve conseguir executar:

1. Criar entrega
2. Visualizar todas as entregas
3. Vsualizar uma entrega pelo ID
4. Tentar criar duplicada (erro esperado)
5. Avançar para EM_TRANSITO
6. Avançar para ENTREGUE
7. Tentar avançar novamente (erro)
8. Tentar cancelar após entrega (erro)
9. Consultar histórico
10.   Filtrar por status

---

## **Diretrizes**

- Não use banco real
- Não use ORM
- Não coloque lógica no controller
- Centralize regras no service
- Repository deve ser simples

---
