import IconBadge from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { CircleDollarSign, LayoutDashboard, ListChecks } from 'lucide-react';
import { redirect } from 'next/navigation';
import TitleForm from './_components/title-form';
import DescriptionForm from './_components/description-form';
import ImageForm from './_components/image-form';
import CategoryForm from './_components/category-form';
import PriceForm from './_components/price-form';

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
	const { userId } = auth();

	if (!userId) return redirect('/');

	const course = await db.course.findUnique({
		where: {
			id: params.courseId,
		},
	});

	const categories = await db.category.findMany({
		orderBy: {
			name: 'asc',
		},
	});
	const options = categories.map(category => ({
		label: category.name,
		value: category.id,
	}));

	if (!course) return redirect('/');

	const requireFields = [
		course.title,
		course.description,
		course.price,
		course.imageUrl,
		course.categoryId,
	];

	const totalFields = requireFields.length;
	const completedFields = requireFields.filter(Boolean).length;

	const completionText = `${completedFields} of ${totalFields} fields completed`;

	return (
		<div className='p-6'>
			<div className='flex items-center justify-between'>
				<div className='flex flex-col gap-y-2'>
					<h1 className='text-2xl font-medium'>Course setup</h1>
					<span>{completionText}</span>
				</div>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 '>
				<div>
					<div className='flex items-center gap-x-2'>
						<IconBadge icon={LayoutDashboard} />
						<h2 className='text-xl font-medium'>Course details</h2>
					</div>
					<TitleForm initialData={course} courseId={course.id} />
					<DescriptionForm initialData={course} courseId={course.id} />
					<ImageForm initialData={course} courseId={course.id} />
					<CategoryForm
						initialData={course}
						courseId={course.id}
						options={options}
					/>
				</div>
				<div className='space-y-6'>
					<div className='flex items-center gap-x-2'>
						<IconBadge icon={ListChecks} />
						<h2 className='text-xl'>Chapters</h2>
					</div>
					<div className=''>TODO: chapters</div>
					<div className='flex items-center gap-x-2'>
						<IconBadge icon={CircleDollarSign} />
						<h2 className='text-xl'>Sell Your Course</h2>
					</div>
					<PriceForm initialData={course} courseId={course.id} />
				</div>
			</div>
		</div>
	);
};
export default CourseIdPage;
