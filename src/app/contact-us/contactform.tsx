"use client";

import { useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';

// Define types for better type safety
interface ServiceOption {
    key: string;
    name: string;
}

interface ValidationError {
    field: string;
    message: string;
}

interface ContactFormResponse {
    status: string;
    message?: string;
    invalid_fields?: ValidationError[];
}

export const ContactForm = () => {
    const servicesOptions: ServiceOption[] = [
        { key: 'Email Strategy and Audit', name: 'Email Strategy and Audit' },
        { key: 'Email Campaign Management', name: 'Email Campaign Management' },
        { key: 'Email Marketing Automation', name: 'Email Marketing Automation' },
        { key: 'Email Template Production', name: 'Email Template Production' },
        { key: 'ESP Vendor Evaluation and Migration', name: 'ESP Vendor Evaluation and Migration' },
        { key: 'Email Deliverability', name: 'Email Deliverability' },
        { key: 'Dedicated Resources', name: 'Dedicated Resources' }
    ];

    const [formData, setFormData] = useState({
        'your-name': '',
        'your-email': '',
        'your-number': '',
        'your-website': '',
        'services-interested': [] as string[],
        'your-message': '',
        'enquired-form': true, // Default checked as per CF7 default:1
    });

    const [selectedServices, setSelectedServices] = useState<ServiceOption[]>([]);

    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleServiceSelect = (selectedList: ServiceOption[]) => {
        setSelectedServices(selectedList);
        const selectedValues = selectedList.map(item => item.key);
        setFormData((prev) => ({
            ...prev,
            'services-interested': selectedValues,
        }));
    };

    const handleServiceRemove = (selectedList: ServiceOption[]) => {
        setSelectedServices(selectedList);
        const selectedValues = selectedList.map(item => item.key);
        setFormData((prev) => ({
            ...prev,
            'services-interested': selectedValues,
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement;
            setFormData((prev) => ({
                ...prev,
                [name]: target.checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Frontend validation for required fields
        if (!formData['services-interested'] || formData['services-interested'].length === 0) {
            setStatus('Please select at least one service you are interested in.');
            return;
        }

        setLoading(true);
        setStatus('');

        try {
            console.log('Submitting form with data:', formData);

            // Contact Form 7 expects a specific payload format
            const formPayload = new FormData();
            formPayload.append('your-name', formData['your-name']);
            formPayload.append('your-email', formData['your-email']);

            // Clean phone number - remove spaces, parentheses, and dashes but keep + sign
            const cleanedPhoneNumber = formData['your-number'].replace(/[\s\(\)\-]/g, '');
            console.log('Original phone:', formData['your-number']);
            console.log('Cleaned phone:', cleanedPhoneNumber);
            formPayload.append('your-number', cleanedPhoneNumber);

            formPayload.append('your-website', formData['your-website']);

            // Send selected services as comma-separated string (Contact Form 7 expects single value)
            console.log('Services data before sending:', formData['services-interested']);
            console.log('Services data type:', typeof formData['services-interested']);
            console.log('Services data length:', formData['services-interested']?.length);

            // Backup: Also check the actual select element to see what's selected
            const selectElement = document.querySelector('select[name="services-interested"]') as HTMLSelectElement;
            if (selectElement) {
                const backupSelectedValues = Array.from(selectElement.selectedOptions, option => option.value);
                console.log('Backup - DOM selected values:', backupSelectedValues);

                // Use backup values if formData is empty but DOM has selections
                if ((!formData['services-interested'] || formData['services-interested'].length === 0) && backupSelectedValues.length > 0) {
                    console.log('Using backup DOM values');
                    // For CF7 multiselect, use array notation
                    backupSelectedValues.forEach(service => {
                        console.log('Appending backup service with array notation:', service);
                        formPayload.append('services-interested[]', service);
                    });
                } else if (formData['services-interested'] && formData['services-interested'].length > 0) {
                    console.log('Sending services from formData:', formData['services-interested']);
                    // For CF7 multiselect, use array notation
                    formData['services-interested'].forEach(service => {
                        console.log('Appending service with array notation:', service);
                        formPayload.append('services-interested[]', service);
                    });
                } else {
                    console.log('No services selected anywhere, sending empty string');
                    formPayload.append('services-interested', '');
                }
            } else {
                // Fallback to original logic if can't find DOM element
                if (formData['services-interested'] && formData['services-interested'].length > 0) {
                    console.log('Fallback: Sending services from formData:', formData['services-interested']);
                    // For CF7 multiselect, use array notation
                    formData['services-interested'].forEach(service => {
                        console.log('Fallback: Appending service with array notation:', service);
                        formPayload.append('services-interested[]', service);
                    });
                } else {
                    console.log('Fallback: No services selected, sending empty string');
                    formPayload.append('services-interested', '');
                }
            }


            formPayload.append('your-message', formData['your-message']);

            // Checkbox field - send "Yes" when checked or empty string when unchecked as per CF7 format [checkbox enquired-form default:1 id:Subscribe "Yes"]
            formPayload.append('enquired-form', formData['enquired-form'] ? 'Yes' : 'No');

            // Using the exact field names from Contact Form 7 configuration

            formPayload.append('_wpcf7', '112'); // Form ID
            formPayload.append('_wpcf7_version', '5.7.7');
            formPayload.append('_wpcf7_locale', 'en_US');
            formPayload.append('_wpcf7_unit_tag', 'wpcf7-f112-p0-o1');
            formPayload.append('_wpcf7_container_post', '0');

            // Final safety check: Ensure services-interested is never undefined
            let hasServicesField = false;
            for (const [key, value] of formPayload.entries()) {
                if (key === 'services-interested[]' || key === 'services-interested') {
                    hasServicesField = true;
                    console.log('Found services field:', key, '=', value);
                }
            }

            if (!hasServicesField) {
                console.log('SAFETY: No services field found, adding empty services-interested');
                formPayload.append('services-interested', '');
            }

            // Debug: Log all form data being sent
            console.log('FormData entries:');
            for (const [key, value] of formPayload.entries()) {
                console.log(key, value);
            }

            const response = await fetch('https://design-backend.inboxarmy.com/wp-json/contact-form-7/v1/contact-forms/112/feedback', {
                method: 'POST',
                body: formPayload,
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            // Check if response is JSON or text
            const contentType = response.headers.get('content-type');
            console.log('Content-Type:', contentType);

            let responseData: ContactFormResponse | string;
            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json() as ContactFormResponse;
                console.log('JSON Response:', responseData);

                // Contact Form 7 JSON response format
                if (responseData.status === 'mail_sent') {
                    setStatus('Message sent successfully!');
                    setFormData({
                        'your-name': '',
                        'your-email': '',
                        'your-number': '',
                        'your-website': '',
                        'services-interested': [],
                        'your-message': '',
                        'enquired-form': true, // Default checked as per CF7
                    });
                    setSelectedServices([]);
                } else if (responseData.status === 'validation_failed') {
                    // Show specific validation errors
                    if (responseData.invalid_fields && responseData.invalid_fields.length > 0) {
                        const errorMessages = responseData.invalid_fields.map((field: ValidationError) =>
                            `${field.field}: ${field.message}`
                        ).join(', ');
                        setStatus(`Validation errors: ${errorMessages}`);
                        console.log('Validation errors:', responseData.invalid_fields);
                    } else {
                        setStatus('Please check your form fields and try again.');
                    }
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
                        'your-name': '',
                        'your-email': '',
                        'your-number': '',
                        'your-website': '',
                        'services-interested': [],
                        'your-message': '',
                        'enquired-form': true, // Default checked as per CF7
                    });
                    setSelectedServices([]);
                } else if (responseData.includes('validation_failed')) {
                    setStatus('Please check your form fields and try again.');
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
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                    <input
                        type="text"
                        name="your-name"
                        value={formData['your-name']}
                        onChange={handleChange}
                        placeholder="Your name*"
                        required
                        className="rounded-lg px-4 py-3  col-span-1" />
                    <input
                        type="email"
                        name="your-email"
                        value={formData['your-email']}
                        onChange={handleChange}
                        placeholder="Email address*"
                        required
                        className="rounded-lg px-4 py-3  col-span-1" />
                    <input
                        type="tel"
                        name="your-number"
                        value={formData['your-number']}
                        onChange={handleChange}
                        placeholder="Phone number*"
                        maxLength={20}
                        required
                        className="rounded-lg px-4 py-3  col-span-1" />
                    <input
                        type="text"
                        name="your-website"
                        value={formData['your-website']}
                        onChange={handleChange}
                        placeholder="Website*"
                        required
                        className="rounded-lg px-4 py-3  col-span-1" />
                </div>
                <div className='multiselectbox'>
                    <Multiselect
                        options={servicesOptions}
                        selectedValues={selectedServices}
                        onSelect={handleServiceSelect}
                        onRemove={handleServiceRemove}
                        displayValue="name"
                        placeholder="Services Interested*"
                        showCheckbox={true}
                        closeIcon="cancel"
                        closeOnSelect={false}
                        onSearch={() => { }}
                        style={{
                            chips: {
                                background: '#2e3b00',
                                color: 'white',
                                fontSize: '14px',
                                borderRadius: '6px',
                                margin: '2px',
                                padding: '4px 8px'
                            },
                            inputField: {
                                color: '#374151',
                                fontSize: '16px'
                            },
                            option: {
                                color: '#374151',
                                backgroundColor: 'white',
                                borderBottom: '1px solid #e5e7eb',
                            },
                            optionContainer: {
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                marginTop: '4px',
                                backgroundColor: 'white',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }
                        }}
                    />
                </div>

                <textarea
                    name="your-message"
                    value={formData['your-message']}
                    onChange={handleChange}
                    placeholder="Type your message..."
                    rows={4}
                    className="rounded-lg px-4 py-3 bg-theme-light-gray 
                    focus:outline-none w-full mb-4 resize-none"
                />
                <div className="flex items-center justify-center mb-6 newsletter-checkbox">
                    <div className='relative'>
                        <input
                            type="checkbox"
                            id="newsletter"
                            name="enquired-form"
                            checked={formData['enquired-form']}
                            onChange={handleChange}
                            className="accent-theme-blue w-5 h-5 mr-2"
                        />
                        <label htmlFor="newsletter" className="text-theme-text-2 text-base select-none">
                            Subscribe to our Newsletter
                        </label>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-theme-blue text-white font-semibold py-3 rounded-lg text-lg transition hover:bg-theme-d font-intersemi border-none ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Sending...' : 'Send A Request'}
                </button>
                <p className="text-sm italic text-theme-text-2 text-center mt-4">
                    (InboxArmy doesn&apos;t work or provide email list buying or rental service.)
                </p>
            </form>
            {status && (
                <p className={`mt-4 text-center ${status.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                    {status}
                </p>
            )}
        </>
    )
}