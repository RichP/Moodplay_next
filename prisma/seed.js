//import { PrismaClient } from '../src/generated/prisma/index.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
	await prisma.game.createMany({
		data: [
			{
				name: "Grand Theft Auto V",
				description: "",
				mood: "Creative",
				image: "https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg",
				steamUrl: "https://store.steampowered.com/app/3240220/Grand_Theft_Auto_V_Enhanced/",
				popularity: 100
			},
			{
				name: "The Witcher 3: Wild Hunt",
				description: "",
				mood: "Scared",
				image: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
				steamUrl: "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/",
				popularity: 95
			},
			{
				name: "Portal 2",
				description: "",
				mood: "Focused",
				image: "https://media.rawg.io/media/games/2ba/2bac0e87cf45e5b508f227d281c9252a.jpg",
				steamUrl: "http://store.steampowered.com/app/620/",
				popularity: 90
			},
			{
				name: "Counter-Strike: Global Offensive",
				description: "",
				mood: "Competitive",
				image: "https://media.rawg.io/media/games/736/73619bd336c894d6941d926bfd563946.jpg",
				steamUrl: "http://store.steampowered.com/app/730/",
				popularity: 98
			}
		]
	});
	console.log('Seed data inserted');
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
