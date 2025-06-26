'use client'
import { useRef, useEffect, useState } from 'react';
import CountUp from 'react-countup';

interface CounterProps {
    counterData: {
        content: string;
        number: number;
        numberSuffixAfter?: string;
        numberSuffixBefore?: string;
    }[];
}


export default function Counter({ counterData }: CounterProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [start, setStart] = useState(false);

    useEffect(() => {
        const observer = new window.IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setStart(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <section ref={sectionRef} className='relative z-10 my-10 md:my-16 lg:my-20'>
                <div className='container small-container text-center md:text-left'>
                    <div className="counter-row flex flex-col md:flex-row justify-center md:justify-between items-start gap-6 md:gap-4 lg::gap-2">
                        {counterData.map((counter, index) => (
                            <div key={index} className="w-full md:w-auto flex-1 space-y-2 md:space-y-4">
                                <div className="text-2xl md:text-3xl lg:text-45xl font-bold">
                                    {counter.numberSuffixAfter}
                                    <CountUp
                                        end={counter.number}
                                        start={start ? undefined : 0}
                                        duration={2}
                                    />
                                    {counter.numberSuffixBefore}
                                </div>
                                <div className="text-lg lg:text-1xl" dangerouslySetInnerHTML={{ __html: counter.content }}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}