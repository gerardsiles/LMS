'use client';

import qs from 'query-string';
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { IconType } from 'react-icons';

interface ICategoryItemProps {
	label: string;
	icon?: IconType;
	value?: string;
}

const CategoryItem = ({ label, icon: Icon, value }: ICategoryItemProps) => {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const currentCategoryId = searchParams.get('categoryId');
	const currentTitle = searchParams.get('title');

	const isActive = currentCategoryId === value || currentTitle === value;

	const handleClick = () => {
		const url = qs.stringifyUrl(
			{
				url: pathname,
				query: {
					title: currentTitle,
					categoryId: isActive ? undefined : value,
				},
			},
			{ skipEmptyString: true, skipNull: true }
		);

		router.push(url);
	};

	return (
		<button
			className={cn(
				'py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition',
				isActive && 'border-sky-700 bg-sky-200/20 text-sky-800'
			)}
			onClick={handleClick}
		>
			{Icon && <Icon size={20} />}
			<div className='truncate'>{label}</div>
		</button>
	);
};
export default CategoryItem;
