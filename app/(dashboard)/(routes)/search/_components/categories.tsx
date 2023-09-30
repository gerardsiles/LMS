'use client';

import { Category } from '@prisma/client';
import {
	FcBiohazard,
	FcBiomass,
	FcBiotech,
	FcBullish,
	FcCollect,
	FcEngineering,
	FcFilmReel,
	FcIdea,
	FcLandscape,
	FcLibrary,
	FcMultipleDevices,
	FcMusic,
	FcNumericalSorting12,
	FcOldTimeCamera,
	FcPortraitMode,
	FcRules,
	FcSalesPerformance,
	FcSportsMode,
} from 'react-icons/fc';
import { IconType } from 'react-icons';
import CategoryItem from './category-item';

const iconMap: Record<Category['name'], IconType> = {
	Music: FcMusic,
	Film: FcFilmReel,
	Sports: FcSportsMode,
	Sales: FcSalesPerformance,
	Engineering: FcEngineering,
	Photography: FcOldTimeCamera,
	Technology: FcMultipleDevices,
	Medicine: FcBiotech,
	Economics: FcBullish,
	'Computer Science': FcMultipleDevices,
	Mathematics: FcNumericalSorting12,
	Physics: FcCollect,
	Philosophy: FcIdea,
	Chemistry: FcBiomass,
	Biology: FcBiohazard,
	Literature: FcRules,
	Geography: FcLandscape,
	History: FcLibrary,
	Law: FcPortraitMode,
};

interface ICategoriesProps {
	items: Category[];
}

const Categories = ({ items }: ICategoriesProps) => {
	return (
		<div className='flex items-center gap-x-2 overflow-x-auto pb-2'>
			{items.map(item => (
				<CategoryItem
					key={item.id}
					label={item.name}
					icon={iconMap[item.name]}
					value={item.id}
				/>
			))}
		</div>
	);
};
export default Categories;
