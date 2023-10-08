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

export async function DELETE(
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

		if (!chapter) {
			return new NextResponse('Not Found', { status: 404 });
		}

		// Clean up Mux data
		if (chapter.videoUrl) {
			const existingMuxData = await db.muxData.findFirst({
				where: {
					chapterId: params.chapterId,
				},
			});
			if (existingMuxData) {
				await Video.Assets.del(existingMuxData.assetId);
				await db.muxData.delete({
					where: {
						id: existingMuxData.id,
					},
				});
			}
		}
		// TODO: Delete section videos
		const deleted = await db.chapter.delete({
			where: {
				id: params.chapterId,
			},
		});

		// Unpublish course if no chapters are public
		const publishedChaptersInCourse = await db.chapter.findMany({
			where: {
				courseId: params.courseId,
				isPublished: true,
			},
		});
		if (publishedChaptersInCourse.length === 0) {
			await db.course.update({
				where: {
					id: params.courseId,
				},
				data: {
					isPublished: false,
				},
			});
		}

		return NextResponse.json(deleted);
	} catch (error) {
		console.log('[COURSES_CHAPTER_ID_ROUTE_DELETE]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
