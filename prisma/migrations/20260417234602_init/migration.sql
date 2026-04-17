-- CreateEnum
CREATE TYPE "MotoristaStatus" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "EntregaStatus" AS ENUM ('CRIADA', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADA');

-- CreateTable
CREATE TABLE "Motorista" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "placa_veiculo" TEXT NOT NULL,
    "status" "MotoristaStatus" NOT NULL DEFAULT 'ATIVO',

    CONSTRAINT "Motorista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entrega" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "descricao" TEXT NOT NULL,
    "origem" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "status" "EntregaStatus" NOT NULL DEFAULT 'CRIADA',
    "motorista_id" INTEGER,

    CONSTRAINT "Entrega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventoEntrega" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "descricao" TEXT NOT NULL,
    "entrega_id" INTEGER NOT NULL,

    CONSTRAINT "EventoEntrega_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Motorista_cpf_key" ON "Motorista"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Motorista_placa_veiculo_key" ON "Motorista"("placa_veiculo");

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_motorista_id_fkey" FOREIGN KEY ("motorista_id") REFERENCES "Motorista"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoEntrega" ADD CONSTRAINT "EventoEntrega_entrega_id_fkey" FOREIGN KEY ("entrega_id") REFERENCES "Entrega"("id") ON DELETE CASCADE ON UPDATE CASCADE;
