'use client'
import { useState } from 'react';
import Image from 'next/image';

import PlayIcon from '../images/video-play.png';

interface Post {
    videoHeading: string;
    videoContent: string;
    videoUrl: string;
    videoImage: {
        node: {
            sourceUrl: string;
        };
    };
}

interface VideoScottCohenProps {
    aboutpages: Post;
}

export default function VideoScottCohen({ aboutpages }: VideoScottCohenProps) {
    const [showModal, setShowModal] = useState(false);


    // Check if all content is empty
    if (!aboutpages ||
        (!aboutpages.videoHeading &&
            !aboutpages.videoContent &&
            !aboutpages.videoUrl &&
            !aboutpages.videoImage?.node?.sourceUrl)) {
        return null;
    }

    return (
        <>
            <section className="relative z-10 my-12 md:my-16 lg:my-20">
                <div className="container small-container">
                    <div className="bg-gradient-to-b from-white rounded-3xl p-4 md:p-12 lg:flex flex-col md:flex-row items-start 2xl:items-center gap-16 mt-8">
                        <div className="flex-1 space-y-6 md:space-y-8 subtitle2 pb-8 lg:pb-0">
                            {aboutpages.videoHeading && (
                                <h2>{aboutpages.videoHeading}</h2>
                            )}
                            {aboutpages.videoContent && (
                                <div
                                    className="content-text"
                                    dangerouslySetInnerHTML={{ __html: aboutpages.videoContent }}
                                ></div>
                            )}
                        </div>
                        <div className="flex-1 flex justify-center">
                            {/* Replace the href with the actual Vimeo video URL */}
                            <button
                                onClick={() => setShowModal(true)}
                                className="group relative block w-full bg-white border border-solid border-theme-border rounded-xl md:rounded-3xl p-2 md:p-6 cursor-pointer" aria-label="Play Video" >
                                {aboutpages.videoImage?.node?.sourceUrl && (
                                    <Image
                                        src={aboutpages.videoImage.node.sourceUrl}
                                        alt="Scott Cohen CEO"
                                        width={580}
                                        height={350}
                                        className="w-full rounded-lg md:rounded-2xl shadow-lg cursor-pointer hover:opacity-80 transition"
                                    />
                                )}
                                {/* Optional Play Button Overlay */}
                                <span className="absolute inset-0 flex items-center justify-center transition ease-in-out scale-100 origin-center group-hover:scale-110 w-12 md:w-16 mx-auto xl:w-auto">
                                    <Image src={PlayIcon} alt="Play" width={90} height={90} />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <span
                        className="absolute top-0 left-0 w-full h-full"
                        onClick={() => setShowModal(false)}
                    ></span>
                    <div className="relative w-full max-w-4xl mx-auto px-4">
                        <button
                            onClick={() => setShowModal(false)}
                            className="closebtn text-4xl absolute -top-12 h-10 w-8 right-4 z-10 text-white bg-none bg-opacity-50 rounded-full hover:text-theme-blue p-0 text-right"
                        >
                            &times;
                        </button>
                        <iframe
                            src={`https://player.vimeo.com/video/${aboutpages.videoUrl.replace(/[^0-9]/g, '')}?autoplay=1`}
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            title="Scott Cohen Introduction"
                            className="w-full h-full aspect-video object-cover rounded-lg border-none"
                        ></iframe>
                    </div>
                </div>
            )}
        </>
    );
}