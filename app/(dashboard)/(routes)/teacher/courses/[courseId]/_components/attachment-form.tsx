'use client';

import * as z from 'zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Attachment, Course } from '@prisma/client';
import Image from 'next/image';
import { FileUpload } from '@/components/file-upload';

interface IAttachmentFormProps {
	initialData: Course & { attachments: Attachment[] };
	courseId: string;
}

const formSchema = z.object({
	url: z.string().min(1),
});

const AttachmentForm = ({ initialData, courseId }: IAttachmentFormProps) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const router = useRouter();
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.post(`/api/courses/${courseId}/attachments`, values);
			toast.success('Course description updated');
			toggleEditing();
			router.refresh();
		} catch {
			toast.error('Something went wrong');
		}
	};

	const toggleEditing = () => {
		setIsEditing(!isEditing);
	};

	const onDelete = async (id: string) => {
		try {
			setDeletingId(id);
			await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
			toast.success('Attachment deleted');
			router.refresh();
		} catch (error) {
			toast.error('Something went wrong');
		} finally {
			setDeletingId(null);
		}
	};
	console.log(initialData.attachments);
	return (
		<div className='mt-6 border bg-slate-100 rounded-md p-4'>
			<div className='font-medium flex items-center justify-between'>
				Course attachments
				<Button variant='ghost' onClick={toggleEditing}>
					<ButtonText isEditing={isEditing} imageUrl={initialData.imageUrl} />
				</Button>
			</div>
			{!isEditing && (
				<>
					{initialData.attachments.length === 0 && (
						<p className='text-sm mt-2 text-slate-500 italic'>
							No attachments yet
						</p>
					)}
					{initialData.attachments.length > 0 && (
						<div className='space-y-2'>
							{initialData.attachments.map(attachment => (
								<div
									className='flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md'
									key={attachment.id}
								>
									<File className='h-4 w-4 flex-shrink-0' />
									<p className='text-sm line-clamp-1'>{attachment.name}</p>
									{deletingId === attachment.id ? (
										<div className=''>
											<Loader2 className='h-4 w-4 animate-spin ' />
										</div>
									) : (
										<button
											className='ml-auto hover:opacity-75 transition'
											onClick={() => onDelete(attachment.id)}
										>
											<X className='h-4 w-4' />
										</button>
									)}
								</div>
							))}
						</div>
					)}
				</>
			)}
			{isEditing && (
				<div className=''>
					<FileUpload
						endpoint='courseAttachment'
						onChange={url => {
							if (url) {
								onSubmit({ url });
							}
						}}
					/>
					<div className='text-xs text-muted-foreground mt-4'>
						Add files to the course.
					</div>
				</div>
			)}
		</div>
	);
};

const ButtonText = ({
	isEditing,
	imageUrl,
}: {
	isEditing: boolean;
	imageUrl: string | null;
}) => {
	if (isEditing) {
		return <>Cancel</>;
	}

	return (
		<>
			<PlusCircle className='h-4 w-4 mr-2' />
			Add file
		</>
	);
};
export default AttachmentForm;
