'use client';

import ConfirmModal from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface IChapterActionsProps {
	disabled: boolean;
	courseId: string;
	chapterId: string;
	isPublished: boolean;
}

const ChapterActions = ({
	disabled,
	courseId,
	chapterId,
	isPublished,
}: IChapterActionsProps) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();

	const deletePromise = () => {
		return new Promise(async (resolve, reject) => {
			try {
				setIsLoading(true);
				await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
				router.refresh();
				router.push(`/teacher/courses/${courseId}`);
			} catch (error) {
				reject(error);
			} finally {
				resolve(true);
				setIsLoading(false);
			}
		});
	};
	const confirmDelete = async () => {
		toast.promise(deletePromise(), {
			loading: 'Deleting chapter...',
			success: 'Chapter deleted successfully',
			error: 'Failed to delete chapter',
		});
	};

	const onClickPublish = async () => {
		try {
			if (isPublished) {
				await axios.patch(
					`/api/courses/${courseId}/chapters/${chapterId}/conceal`
				);
				toast.success('Chapter concealed successfully');
			} else {
				await axios.patch(
					`/api/courses/${courseId}/chapters/${chapterId}/publish`
				);
				toast.success('Chapter published successfully');
			}
			router.refresh();
		} catch (error) {
			toast.error(`Failed to ${isPublished ? 'conceal' : 'publish'} chapter`);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='flex items-center gap-x-2'>
			<Button
				onClick={onClickPublish}
				disabled={disabled || isLoading}
				variant='outline'
				size='sm'
			>
				{isPublished ? 'Conceal' : 'Publish'}
			</Button>
			<ConfirmModal onConfirm={confirmDelete}>
				<Button size='sm' disabled={isLoading}>
					<Trash className='h-4 w-4' />
				</Button>
			</ConfirmModal>
		</div>
	);
};
export default ChapterActions;
