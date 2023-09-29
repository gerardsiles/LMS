import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string } }
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
			include: {
				chapters: {
					include: {
						muxData: true,
					},
				},
			},
		});

		if (!course) {
			return new NextResponse('Unauthorized', { status: 401 });
		}
		// Check that the course can be published
		const hasPublishedChapters = course.chapters.some(
			lesson => lesson.isPublished
		);
		if (
			!course.title ||
			!course.description ||
			!course.price ||
			!course.imageUrl ||
			!course.categoryId ||
			!hasPublishedChapters
		) {
			return new NextResponse('Missing required fields', { status: 401 });
		}

		const updatedCourse = await db.course.update({
			where: {
				id: params.courseId,
			},
			data: {
				isPublished: true,
			},
		});

		return NextResponse.json(updatedCourse);
	} catch (error) {
		console.log(['COURSES-PUBLISH'], error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
