import { Suspense } from 'react';
import SearchPageClient from './SearchPageClient';

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="my-10 md:my-24">
                <div className="container">
                    <div className="max-w-2xl mx-auto text-center">
                        <h1 className="text-2xl font-bold mb-6">Search Email Templates</h1>
                        <p className="text-gray-600 mb-8">Loading search...</p>
                    </div>
                </div>
            </div>
        }>
            <SearchPageClient />
        </Suspense>
    );
}