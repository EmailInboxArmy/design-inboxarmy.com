'use client';

import { useState, useEffect, useRef } from 'react';

interface DownloadImageButtonProps {
    htmlContent: string;
}

export default function DownloadImageButton({ htmlContent }: DownloadImageButtonProps) {
    const [imageData, setImageData] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);

    const safelyRemoveLink = () => {
        try {
            const link = downloadLinkRef.current;
            if (link && link.parentNode === document.body) {
                document.body.removeChild(link);
            }
            downloadLinkRef.current = null;
        } catch (err) {
            console.warn("removeChild failed:", err);
        }
    };

    const convertToImage = async () => {
        if (!htmlContent || !isClient) return;

        setIsLoading(true);
        setImageData(null);
        setIsGenerated(false);

        try {
            const response = await fetch('/api/convert-to-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ html: htmlContent }),
            });

            if (!response.ok) {
                throw new Error('Failed to convert HTML to image');
            }

            const data = await response.json();
            setImageData(data.image);
            setIsGenerated(true);
        } catch (err) {
            console.error('Image conversion error:', err);
            setIsGenerated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (!isGenerated || isLoading || !imageData || isDownloading) return;

        setIsDownloading(true);
        safelyRemoveLink();

        const link = document.createElement('a');
        link.href = imageData;
        link.download = 'email-preview.png';
        link.style.display = 'none';

        document.body.appendChild(link);
        downloadLinkRef.current = link;

        // Trigger download
        try {
            link.click();
        } catch (clickError) {
            console.error('Download click failed:', clickError);
        }

        setTimeout(() => {
            safelyRemoveLink();
            setIsDownloading(false);
        }, 500);
    };

    useEffect(() => {
        return () => {
            safelyRemoveLink();
        };
    }, []);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient && htmlContent) {
            convertToImage();
        }
    }, [htmlContent, isClient]);

    if (!isClient) {
        return (
            <div className="download-button text-xs md:text-base flex items-center justify-center px-4 py-2 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed opacity-50">
                <span className='icon-wrap'>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                </span>
                <span className="pl-2 font-medium">Loading...</span>
            </div>
        );
    }

    return (
        <a
            href={isGenerated && imageData ? imageData : '#'}
            onClick={handleDownload}
            aria-disabled={!isGenerated || isLoading}
            className={`download-button download-button text-xs md:text-base bg-transparent md:hover:bg-theme-blue md:hover:text-white flex items-center justify-center px-0 md:px-4 py-1 md:py-2 rounded-lg whitespace-nowrap border-none left-button ${
                isGenerated && !isLoading
                    ? 'bg-theme-blue text-white hover:bg-theme-dark'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
            }`}
            style={{ pointerEvents: isGenerated && !isLoading ? 'auto' : 'none' }}
            title={isGenerated ? "Download Email Preview" : "Generating..."}
        >
            <span className='icon-wrap'>
                {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M19 13.0098V14.2098C19 15.89 19 16.73 18.673 17.3718C18.3854 17.9363 17.9265 18.3952 17.362 18.6828C16.7202 19.0098 15.8802 19.0098 14.2 19.0098H5.8C4.11984 19.0098 3.27976 19.0098 2.63803 18.6828C2.07354 18.3952 1.6146 17.9363 1.32698 17.3718C1 16.73 1 15.89 1 14.2098V13.0098M15 8.00977L10 13.0098M10 13.0098L5 8.00977M10 13.0098V1.00977" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </span>
            <span className="pl-2 font-medium">
                {isLoading ? 'Generating...' : 'Download'}
            </span>
        </a>
    );
}
