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
		const chapter = await db.chapter.findUnique({
			where: {
				id: params.chapterId,
				courseId: params.courseId,
			},
		});
		const muxData = await db.muxData.findUnique({
			where: {
				chapterId: params.chapterId,
			},
		});
		if (
			!muxData ||
			!chapter ||
			!chapter.title ||
			!chapter.description ||
			!chapter.videoUrl
		) {
			return new NextResponse('Missing required fields', { status: 400 });
		}

		const published = await db.chapter.update({
			where: {
				id: params.chapterId,
			},
			data: {
				isPublished: true,
			},
		});

		return NextResponse.json(published);
	} catch (error) {
		console.log('[COURSES_CHAPTER_ID_PUBLISH_ROUTE]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
