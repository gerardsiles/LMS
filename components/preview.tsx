'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill/dist/quill.bubble.css';

interface IPreviewProps {
	content: string;
}

export const Preview = ({ content }: IPreviewProps) => {
	const ReactQuill = useMemo(
		() => dynamic(() => import('react-quill'), { ssr: false }),
		[]
	);

	return <ReactQuill theme='bubble' value={content} readOnly />;
};
