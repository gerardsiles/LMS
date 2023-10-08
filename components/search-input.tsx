'use client';

import qs from 'query-string';
import { Search } from 'lucide-react';
import React, { useEffect } from 'react';
import { Input } from './ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const SearchInput = () => {
	const [value, setValue] = React.useState<string>('');
	const debounced = useDebounce(value);
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathName = usePathname();

	const currentCategoryId = searchParams.get('categoryId');

	useEffect(() => {
		const url = qs.stringifyUrl(
			{
				url: pathName,
				query: {
					categoryId: currentCategoryId,
					title: debounced,
				},
			},
			{ skipEmptyString: true, skipNull: true }
		);
		router.push(url);
	}, [debounced, currentCategoryId, pathName, router]);

	return (
		<div className='relative'>
			<Search className='h-4 w-4 absolute top-3 left-3 text-slate-600' />
			<Input
				className='w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200'
				type='text'
				placeholder='Search course..'
				name='search'
				value={value}
				onChange={e => setValue(e.target.value)}
			/>
		</div>
	);
};

export default SearchInput;
