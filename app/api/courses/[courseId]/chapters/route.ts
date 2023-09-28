import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	console.log('POST', params);
	try {
		const { userId } = auth();
		const { title } = await req.json();

		if (!userId) return new NextResponse('Unauthorized', { status: 401 });

		const courseOwner = await db.course.findUnique({
			where: { id: params.courseId, userId: userId },
		});

		if (!courseOwner) return new NextResponse('Unauthorized', { status: 401 });

		const lastChapter = await db.chapter.findFirst({
			where: { courseId: params.courseId },
			orderBy: { position: 'desc' },
		});

		const position = lastChapter ? lastChapter.position + 1 : 1;

		const chapter = await db.chapter.create({
			data: {
				title,
				position,
				course: { connect: { id: params.courseId } },
			},
		});

		return NextResponse.json(chapter);
	} catch (error) {
		console.log('[chapters]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
