import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}
		const course = await db.course.findUnique({
			where: {
				id: params.courseId,
				userId: userId,
			},
		});
		if (!course) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const concealed = await db.chapter.update({
			where: {
				id: params.chapterId,
			},
			data: {
				isPublished: false,
			},
		});

		// Check if there are any chapters published
		const publishedChapters = await db.chapter.findMany({
			where: {
				courseId: params.courseId,
				isPublished: true,
			},
		});

		// If there are no chapters published, conceal the course
		if (publishedChapters.length === 0) {
			await db.course.update({
				where: {
					id: params.courseId,
				},
				data: {
					isPublished: false,
				},
			});
		}

		return NextResponse.json(concealed);
	} catch (error) {
		console.log('[COURSES_CHAPTER_ID_PUBLISH_ROUTE]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
