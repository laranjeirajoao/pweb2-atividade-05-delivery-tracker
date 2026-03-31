# João Pedro de Castro Laranjeira Rocha

# Delivery Tracker

API em Node.js + Express para cadastro e acompanhamento de entregas e motoristas, seguindo a arquitetura Controller -> Service -> Repository com composição centralizada de dependências.

## Requisitos

- Node.js 18+ instalado
- npm instalado

## Como executar

```bash
npm install
npm run dev
```

Servidor padrão:

```text
http://localhost:3000
```

## Rotas disponíveis

### Entregas

- `POST /api/entregas`
- `GET /api/entregas`
- `GET /api/entregas/:id`
- `PATCH /api/entregas/:id/avancar`
- `PATCH /api/entregas/:id/cancelar`
- `GET /api/entregas/:id/historico`
- `PATCH /api/entregas/:id/atribuir`

### Motoristas

- `POST /api/motoristas`
- `GET /api/motoristas`
- `GET /api/motoristas/:id`
- `GET /api/motoristas/:id/entregas`

## Exemplos de requisição

Criar entrega:

```bash
curl -X POST http://localhost:3000/api/entregas \
  -H "Content-Type: application/json" \
  -d '{
    "descricao": "Notebook",
    "origem": "Centro",
    "destino": "Zona Sul"
  }'
```

Listar entregas:

```bash
curl http://localhost:3000/api/entregas
```

Listar entregas com filtro por status:

```bash
curl "http://localhost:3000/api/entregas?status=CRIADA"
```

Avancar status de uma entrega:

```bash
curl -X PATCH http://localhost:3000/api/entregas/1/avancar
```

Cancelar entrega:

```bash
curl -X PATCH http://localhost:3000/api/entregas/1/cancelar
```

Consultar historico da entrega:

```bash
curl http://localhost:3000/api/entregas/1/historico
```

Criar motorista:

```bash
curl -X POST http://localhost:3000/api/motoristas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva",
    "cpf": "12345678901",
    "placaVeiculo": "ABC1D23"
  }'
```

Listar motoristas:

```bash
curl http://localhost:3000/api/motoristas
```

Buscar motorista por id:

```bash
curl http://localhost:3000/api/motoristas/2
```

Atribuir motorista a entrega:

```bash
curl -X PATCH http://localhost:3000/api/entregas/1/atribuir \
  -H "Content-Type: application/json" \
  -d '{
    "motoristaId": 2
  }'
```

Listar entregas de um motorista:

```bash
curl http://localhost:3000/api/motoristas/2/entregas
```

Listar entregas de um motorista com filtro por status:

```bash
curl "http://localhost:3000/api/motoristas/2/entregas?status=CRIADA"
```

## Regras implementadas

- Entrega nasce com status `CRIADA`
- Nao permite criar entrega com origem e destino iguais
- Nao permite duplicar entrega ativa com mesma descricao, origem e destino
- Motorista nasce com status `ATIVO`
- Nao permite cadastrar motorista com CPF duplicado
- Nao permite atribuir motorista a entrega que nao esteja com status `CRIADA`
- Nao permite atribuir motorista `INATIVO`
- Nova atribuicao de motorista substitui a anterior e registra evento no historico
- Filtro por `status` pode ser combinado com `motoristaId`

## Composicao de dependencias

```text
Database
  |
  +-- EntregasRepositoryInMemory ------+
  |                                    |
  |                                    v
  |                            EntregasService --------> EntregasController
  |
  +-- MotoristasRepositoryInMemory ----+----> MotoristasService -------> MotoristasController
                                       |
                                       +----> EntregasService
```

Ponto unico de composicao:

- [`src/routes/composicao-dependencias.js`](/home/jope/repos/pweb2-delivery-tracker/src/routes/composicao-dependencias.js)

## Estrutura resumida

```text
src/
  controllers/
  services/
  repositories/
  routes/
  middlewares/
  database/
  utils/
```
