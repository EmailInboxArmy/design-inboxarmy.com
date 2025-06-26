'use client';

import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/testimonial.css';


interface TestimonialItem {
    testimonialHeading?: string;
    desktopImage: { node: { sourceUrl: string } };
    tabletImage: { node: { sourceUrl: string } };
    mobileImage: { node: { sourceUrl: string } };
}

interface TestimonialsProps {
    testimonials: TestimonialItem[];
    testimonialHeading: string;
}

export default function Testimonials({ testimonials = [], testimonialHeading = '' }: TestimonialsProps) {
    if (!testimonials.length) {
        return <div className="text-center mt-10">Loading testimonials..</div>;
    }

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
    };

    return (
        <>
            <section className="my-10 md:my-24 bg-transparent testimonial-slider">

                <h2 className="text-center mb-12">{testimonialHeading}</h2>

                <div className="slider-wrapper mx-auto">
                    <Slider {...settings}>
                        {(testimonials || []).map((item, index) => (
                            <div className="item" key={index}>
                                <picture className="block m-auto">
                                    <source className="block m-auto"
                                        srcSet={item.desktopImage?.node?.sourceUrl}
                                        media="(min-width: 1025px)"
                                    />
                                    <source className="block m-auto"
                                        srcSet={item.tabletImage?.node?.sourceUrl}
                                        media="(min-width: 768px)"
                                    />
                                    <Image className="block m-auto"
                                        src={item.mobileImage?.node?.sourceUrl || ''}
                                        alt={`Testimonial ${index + 1}`}
                                        width={320}
                                        height={1294}
                                    />
                                </picture>

                            </div>
                        ))}
                    </Slider>
                </div>
            </section>
        </>
    );
}
