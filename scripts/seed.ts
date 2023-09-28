const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
	try {
		await db.category.createMany({
			data: [
				{ name: 'Computer Science' },
				{ name: 'Mathematics' },
				{ name: 'Physics' },
				{ name: 'Chemistry' },
				{ name: 'Biology' },
				{ name: 'Geography' },
				{ name: 'History' },
				{ name: 'Literature' },
				{ name: 'Philosophy' },
				{ name: 'Economics' },
				{ name: 'Law' },
				{ name: 'Medicine' },
			],
		});
		console.log('success');
	} catch (err) {
		console.log('error seeding database categories');
		console.log(err);
	} finally {
		await db.$disconnect();
	}
}

main();
