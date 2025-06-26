'use client';

import { useEffect } from 'react';

export default function ErrorHandler() {
    useEffect(() => {
        // Store original error handlers
        const originalError = window.onerror;
        const originalUnhandledRejection = window.onunhandledrejection;

        // Custom error handler for Google Maps errors
        const handleGoogleMapsError = (event: { message?: string; filename?: string; source?: string; error?: Error }) => {
            if (event && typeof event === 'object') {
                const errorMessage = event.message || event.error?.message || '';
                const scriptSrc = event.filename || event.source || '';

                // Check if the error is related to Google Maps
                if (
                    errorMessage.includes('google') ||
                    errorMessage.includes('maps') ||
                    scriptSrc.includes('maps.googleapis.com') ||
                    scriptSrc.includes('maps.gstatic.com') ||
                    errorMessage.includes('main.js') ||
                    errorMessage.includes('search_impl.js') ||
                    errorMessage.includes('search.js') ||
                    errorMessage.includes('common.js') ||
                    errorMessage.includes('_.Nc') ||
                    errorMessage.includes('oaa') ||
                    errorMessage.includes('_.G') ||
                    errorMessage.includes('_.gB')
                ) {
                    console.warn('Google Maps error suppressed:', errorMessage);
                    return true; // Prevent the error from propagating
                }
            }
            return false;
        };

        // Override window.onerror
        window.onerror = (message, source, lineno, colno, error) => {
            const messageStr = typeof message === 'string' ? message : '';
            const sourceStr = typeof source === 'string' ? source : '';
            if (handleGoogleMapsError({ message: messageStr, filename: sourceStr, error })) {
                return true; // Suppress the error
            }
            // Call original handler if it exists
            return originalError ? originalError(message, source, lineno, colno, error) : false;
        };

        // Override window.onunhandledrejection
        window.onunhandledrejection = (event: PromiseRejectionEvent) => {
            if (handleGoogleMapsError({ message: event.reason?.message })) {
                event.preventDefault(); // Suppress the unhandled rejection
                return;
            }
            // Call original handler if it exists
            if (originalUnhandledRejection) {
                originalUnhandledRejection.call(window, event);
            }
        };

        // Cleanup function to restore original handlers
        return () => {
            window.onerror = originalError;
            window.onunhandledrejection = originalUnhandledRejection;
        };
    }, []);

    return null; // This component doesn't render anything
} 