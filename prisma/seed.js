import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	// limpar banco antes do seed
	await prisma.eventoEntrega.deleteMany();
	await prisma.entrega.deleteMany();
	await prisma.motorista.deleteMany();

	await prisma.motorista.createMany({
		data: [
			{
				nome: "João Silva",
				cpf: "11111111111",
				placa_veiculo: "ABC1234",
			},
			{
				nome: "Maria Souza",
				cpf: "22222222222",
				placa_veiculo: "DEF5678",
			},
			{
				nome: "Carlos Lima",
				cpf: "33333333333",
				placa_veiculo: "GHI9012",
			},
		],
	});

	const listaMotoristas = await prisma.motorista.findMany();

	const getMotorista = (i) => listaMotoristas[i % listaMotoristas.length];

	// 2. Status variados
	const statusFluxos = [
		["CRIADA"],
		["CRIADA", "EM_TRANSITO"],
		["CRIADA", "EM_TRANSITO", "ENTREGUE"],
		["CRIADA", "CANCELADA"],
	];

	// 3. Entregas + histórico
	for (let i = 0; i < 10; i++) {
		const fluxo = statusFluxos[i % statusFluxos.length];
		const statusFinal = fluxo[fluxo.length - 1];

		const entrega = await prisma.entrega.create({
			data: {
				descricao: `Entrega ${i + 1}`,
				origem: `Origem ${i + 1}`,
				destino: `Destino ${i + 1}`,
				status: statusFinal,
				motorista_id:
					statusFinal === "CRIADA"
						? null // ainda não atribuída
						: getMotorista(i).id,
			},
		});

		// criar histórico coerente
		for (let j = 0; j < fluxo.length; j++) {
			await prisma.eventoEntrega.create({
				data: {
					entrega_id: entrega.id,
					descricao: `Status alterado para ${fluxo[j]}`,
					createdAt: new Date(Date.now() + j * 1000),
				},
			});
		}
	}

	console.log("Seed executado com sucesso");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
