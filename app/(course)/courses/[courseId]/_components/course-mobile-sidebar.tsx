import { Menu } from 'lucide-react';
import { Chapter, Course, UserProgress } from '@prisma/client';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import CourseSidebar from './course-sidebar';

interface Props {
	course: Course & {
		chapters: (Chapter & {
			userProgress: UserProgress[] | null;
		})[];
	};
	progressCount: number;
}

function CourseMobileSidebar({ course, progressCount }: Props) {
	return (
		<Sheet>
			<SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition'>
				<Menu />
			</SheetTrigger>
			<SheetContent side='left' className='p-0 bg-white w-72'>
				<CourseSidebar course={course} progressCount={progressCount} />
			</SheetContent>
		</Sheet>
	);
}

export default CourseMobileSidebar;
