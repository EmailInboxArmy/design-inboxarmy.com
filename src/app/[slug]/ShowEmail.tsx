'use client';

import { useEffect, useRef } from 'react';

export default function EmailShadowPreview({ html }: { html: string }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            // Check if shadow root already exists
            if (!containerRef.current.shadowRoot) {
                const shadowRoot = containerRef.current.attachShadow({ mode: 'open' });
                shadowRoot.innerHTML = html;
            } else {
                // Update existing shadow root content
                containerRef.current.shadowRoot.innerHTML = html;
            }
        }
    }, [html]);

    return <div ref={containerRef} className="rounded border" />;
}