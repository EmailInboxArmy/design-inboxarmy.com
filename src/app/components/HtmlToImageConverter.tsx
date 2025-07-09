'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface HtmlToImageConverterProps {
    htmlContent: string;
}

export default function HtmlToImageConverter({ htmlContent }: HtmlToImageConverterProps) {
    const [imageData, setImageData] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const shadowContainerRef = useRef<HTMLDivElement>(null);

    const convertToImage = useCallback(async () => {
        if (!htmlContent) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/convert-to-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ html: htmlContent }),
            });

            if (!response.ok) {
                throw new Error('Failed to convert HTML to image');
            }

            const data = await response.json();
            setImageData(data.image);
        } catch (err) {
            console.error('Error converting to image:', err);
            setError('Failed to convert HTML to image');
        } finally {
            setIsLoading(false);
        }
    }, [htmlContent]);

    useEffect(() => {
        // Convert to image when component mounts
        convertToImage();
    }, [htmlContent, convertToImage]);

    useEffect(() => {
        if (shadowContainerRef.current) {
            // Check if shadow root already exists
            if (!shadowContainerRef.current.shadowRoot) {
                const shadowRoot = shadowContainerRef.current.attachShadow({ mode: 'open' });
                shadowRoot.innerHTML = htmlContent;
            } else {
                // Update existing shadow root content
                shadowContainerRef.current.shadowRoot.innerHTML = htmlContent;
            }
        }
    }, [htmlContent]);

    return (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg absolute top-0 right-0 -z-10">
            {isLoading && (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-blue"></div>
                    <span className="ml-2 text-gray-600">Converting to image...</span>
                </div>
            )}

            {error && (
                <div className="text-red-600 p-4 bg-red-50 rounded-lg">
                    {error}
                </div>
            )}

            {imageData && !isLoading && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Generated Image Preview</span>
                        <button
                            onClick={convertToImage}
                            className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                        >
                            Regenerate
                        </button>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm image-generated">
                        <Image
                            src={imageData}
                            alt="Email preview as image"
                            width={800}
                            height={600}
                            className="w-full h-auto max-w-full"
                            style={{ display: 'block' }}
                        />
                    </div>
                </div>
            )}

            {/* Shadow DOM container for isolated email rendering */}
            <div ref={shadowContainerRef} className="hidden" />
        </div>
    );
} 