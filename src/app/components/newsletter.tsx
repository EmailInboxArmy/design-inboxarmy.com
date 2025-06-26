"use client";

import { useState } from 'react';
import Image from 'next/image';
import SearchIcon from '../images/submit-icon.svg'

export default function Newsletter() {
    const [formData, setFormData] = useState({
        'your-email': '',
    });

    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        try {
            console.log('Submitting form with data:', formData);

            // Contact Form 7 expects a specific payload format
            const formPayload = new FormData();
            formPayload.append('your-email', formData['your-email']);
            formPayload.append('_wpcf7', '586'); // Form ID
            formPayload.append('_wpcf7_version', '5.7.7');
            formPayload.append('_wpcf7_locale', 'en_US');
            formPayload.append('_wpcf7_unit_tag', 'wpcf7-f586-p0-o1');
            formPayload.append('_wpcf7_container_post', '0');

            const response = await fetch('https://staging.project-progress.net/projects/imail/wp-json/contact-form-7/v1/contact-forms/586/feedback', {
                method: 'POST',
                body: formPayload, // Use FormData instead of URLSearchParams
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            // Check if response is JSON or text
            const contentType = response.headers.get('content-type');
            console.log('Content-Type:', contentType);

            let responseData;
            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
                console.log('JSON Response:', responseData);

                // Contact Form 7 JSON response format
                if (responseData.status === 'mail_sent') {
                    setStatus('Message sent successfully!');
                    setFormData({
                        'your-email': '',
                    });
                } else if (responseData.status === 'validation_failed') {
                    setStatus('Please check your email address.');
                } else {
                    setStatus(`Error: ${responseData.message || 'Failed to send message'}`);
                }
            } else {
                responseData = await response.text();
                console.log('Text Response:', responseData);

                // Check for different success indicators
                if (responseData.includes('Your message was sent successfully') ||
                    responseData.includes('mail_sent') ||
                    responseData.includes('Thank you for your message')) {
                    setStatus('Message sent successfully!');
                    setFormData({
                        'your-email': '',
                    });
                } else if (responseData.includes('validation_failed')) {
                    setStatus('Please check your email address.');
                } else {
                    setStatus('Failed to send message. Please try again.');
                    console.error('Unexpected response:', responseData);
                }
            }

        } catch (error) {
            console.error('Network error:', error);

            // More specific error messages
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                setStatus('Network error. Please check your connection and try again.');
            } else if (error instanceof TypeError && error.message.includes('CORS')) {
                setStatus('CORS error. Please contact support.');
            } else {
                setStatus('An error occurred. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-wrap xl:flex-nowrap gap-4 items-center md:bg-theme-light-gray-2 md:rounded-2xl md:p-2 w-full xl:min-w-[583px] md:pl-4">
                <span className='font-medium md:font-semibold md:font-intersemi w-full md:w-auto lg:w-full xl:w-auto text-center md:text-left'>Sign Up For Our Newsletter</span>

                <form onSubmit={handleSubmit} className='w-full md:w-auto lg:w-full xl:w-auto relative md:flex-1'>
                    <div className='newsletter-form flex flex-nowrap w-full md:w-auto lg:w-full xl:w-auto relative md:flex-1'>

                        <input
                            type="email"
                            id="your-email"
                            name="your-email"
                            value={formData['your-email']}
                            onChange={handleChange}
                            placeholder="Email Address"
                            required
                            className="bg-theme-light-gray-3 md:bg-white px-4 py-2 rounded-r-lg border-none flex-1"
                        />


                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-theme-blue hover:bg-theme-dark px-3 py-0 rounded-md text-white border-none absolute top-1 right-1 bottom-1 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <Image className='w-4 h-4' src={SearchIcon} width={15} height={15} alt="Icon" />
                        </button>
                    </div>

                </form>
            </div>
            {status && (
                <p className={`mt-4 text-center ${status.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                    {status}
                </p>
            )}
        </>
    );
}