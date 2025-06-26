'use client';

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../styles/testimonial.css';
import Image from 'next/image';

interface EmailServiceProps {
    emailServices: {
        emailHeading: string;
        emailContent: string;
        logoImages?: Array<{
            image: {
                node: {
                    altText: string;
                    sourceUrl: string;
                };
            };
        }>;
    };
}

export default function EmailService({ emailServices }: EmailServiceProps) {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        rows: 4,
        arrows: true,
    };

    return (
        <section className="relative z-10 py-10 md:py-16 lg:py-20 bg-theme-light-gray">
            <div className="container small-container flex flex-wrap items-center">
                {/* Left: Text Content */}
                <div className="email-service-title w-full lg:w-5/12 text-center lg:text-left pb-8 md:pb-10 lg:pb-0 lg:pr-2">
                    <h2
                        className="mb-6 md:mb-8"
                        dangerouslySetInnerHTML={{ __html: emailServices.emailHeading }}
                    />
                    <p
                        className="text-base md:text-lg lg:max-w-lg lg:pr-2"
                        dangerouslySetInnerHTML={{ __html: emailServices.emailContent }}
                    />
                </div>

                {/* Right: Slider */}
                <div className="w-full lg:w-7/12">
                    <div className="testimonial-slider emailservice slider-wrapper w-full md:w-auto">
                        <Slider {...settings}>
                            {emailServices.logoImages?.map((logo, idx) => {
                                const image = logo?.image?.node;
                                if (!image?.sourceUrl) return null;

                                return (
                                    <div key={idx} className="px-2 my-2">
                                        <div className="logowrap flex items-center justify-center p-3 md:p-2">
                                            <Image
                                                src={image.sourceUrl}
                                                alt={image.altText || 'Email Service Logo'}
                                                width={200}
                                                height={100}
                                                loading="lazy"
                                                className="object-contain"
                                                style={{ maxHeight: '80px' }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </Slider>
                    </div>
                </div>
            </div>
        </section>
    );
}
