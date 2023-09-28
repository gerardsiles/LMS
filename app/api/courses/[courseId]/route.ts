import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	const { userId } = auth();
	const { courseId } = params;
	const values = await req.json();

	if (!userId) {
		return new NextResponse('Unauthorized', { status: 401 });
	}
	try {
		const course = await db.course.update({
			where: {
				id: courseId,
				userId,
			},
			data: { ...values },
		});
		return NextResponse.json(course);
	} catch (error) {
		console.log('[COURSES-PATCH]', error);
		return new NextResponse('InternalError', { status: 500 });
	}
}
