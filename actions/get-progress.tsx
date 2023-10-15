import { db } from '@/lib/db';

export const getProgress = async (
	userId: string,
	courseId: string
): Promise<number> => {
	try {
		const publishedChapters = await db.chapter.findMany({
			where: {
				courseId,
				isPublished: true,
			},
			select: {
				id: true,
			},
		});

		const publishedCHapterIds = publishedChapters.map(chapter => chapter.id);
		const validCompletedChapters = await db.userProgress.count({
			where: {
				userId,
				chapterId: {
					in: publishedCHapterIds,
				},
				isCompleted: true,
			},
		});

		const progress =
			(validCompletedChapters / publishedCHapterIds.length) * 100;
		return progress;
	} catch (error) {
		console.log(error);
		return 0;
	}
};
