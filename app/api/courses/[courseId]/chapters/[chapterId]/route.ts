import Mux from '@mux/mux-node';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

const { Video } = new Mux(
	process.env.MUX_TOKEN_ID!,
	process.env.MUX_TOKEN_SECRET!
);

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } }
) {
	try {
		const { userId } = auth();
		const { isPublished, ...values } = await req.json();

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

		const chapter = await db.chapter.update({
			where: {
				id: params.chapterId,
				courseId: params.courseId,
			},
			data: {
				...values,
			},
		});

		if (values.videoUrl) {
			const existing = await db.muxData.findFirst({
				where: {
					chapterId: params.chapterId,
				},
			});

			if (existing) {
				await Video.Assets.del(existing.assetId);
				await db.muxData.delete({
					where: {
						id: existing.id,
					},
				});
			}
			const asset = await Video.Assets.create({
				input: values.videoUrl,
				playback_policy: 'public',
				test: false,
			});

			await db.muxData.create({
				data: {
					chapterId: params.chapterId,
					assetId: asset.id,
					playbackId: asset.playback_ids?.[0]?.id,
				},
			});
		}
		return NextResponse.json(chapter);
	} catch (error) {
		console.log('[COURSES_CHAPTER_ID_ROUTE]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
