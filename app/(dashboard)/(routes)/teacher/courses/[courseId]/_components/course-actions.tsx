'use client';

import ConfirmModal from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ICourseActionsProps {
	disabled: boolean;
	courseId: string;
	isPublished: boolean;
}

const CourseActions = ({
	disabled,
	courseId,
	isPublished,
}: ICourseActionsProps) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();
	const confetti = useConfettiStore();

	const deletePromise = () => {
		return new Promise(async (resolve, reject) => {
			try {
				setIsLoading(true);
				await axios.delete(`/api/courses/${courseId}`);
				router.refresh();
				router.push(`/teacher/courses`);
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
			loading: 'Deleting course...',
			success: 'Course deleted successfully',
			error: 'Failed to delete course',
		});
	};

	const onClickPublish = async () => {
		try {
			if (isPublished) {
				await axios.patch(`/api/courses/${courseId}/conceal`);
				toast.success('Course concealed successfully');
			} else {
				await axios.patch(`/api/courses/${courseId}/publish`);
				confetti.onOpen();
				toast.success('Course published successfully');
			}
			router.refresh();
		} catch (error) {
			toast.error(`Failed to ${isPublished ? 'conceal' : 'publish'} course`);
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
export default CourseActions;
