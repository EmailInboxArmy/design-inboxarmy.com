'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const SyntaxHighlighter = dynamic(() => import('react-syntax-highlighter').then(mod => mod.Prism), {
    loading: () => <div className="animate-pulse h-96 bg-gray-200 rounded"></div>
});

export default function CodeView({ content }) {
    if (!content) return null;

    return (
        <div className='email-code bg-white hidden custom-syntax'>
            <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200 rounded"></div>}>
                <SyntaxHighlighter language="html" wrapLongLines >
                    {content}
                </SyntaxHighlighter>
            </Suspense>
        </div>
    );
} 