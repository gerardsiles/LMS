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

		const updatedCourse = await db.course.update({
			where: {
				id: params.courseId,
			},
			data: {
				isPublished: false,
			},
		});

		return NextResponse.json(updatedCourse);
	} catch (error) {
		console.log(['COURSES-CONCEAL'], error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
