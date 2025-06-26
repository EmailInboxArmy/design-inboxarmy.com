'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SearchIcon from '../images/search-icon.svg';
import Willow from '../images/willow.jpg';

interface Brand {
    featuredImage?: {
        node?: {
            sourceUrl?: string;
            altText?: string;
        };
    };
    slug: string;
    title: string;
    brandCategories?: {
        nodes: Array<{
            name: string;
            slug: string;
        }>;
    };
}

interface BrandCategory {
    name: string;
    slug: string;
}

interface BrandsSearchProps {
    brands: Brand[];
    brandCategories: BrandCategory[];
}

export default function BrandsSearch({ brands, brandCategories }: BrandsSearchProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Filter brands based on search term and category
    const filteredBrands = useMemo(() => {
        return brands.filter((brand) => {
            const matchesSearch = brand.title.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = selectedCategory === '' ||
                brand.brandCategories?.nodes?.some(category => category.slug === selectedCategory);

            return matchesSearch && matchesCategory;
        });
    }, [brands, searchTerm, selectedCategory]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
    };

    return (
        <>
            <div className="container">
                <div className='lg:px-20 md:pt-6 md:pb-1'>
                    <div className="bg-gradient-to-r from-[#E9EFE9] to-[#DEE5C5] rounded-2xl lg:rounded-3xl pb-0 p-4 md:p-6 md:px-8 flex flex-wrap items-center justify-between">
                        <div className="w-full md:w-7/12 search-row lg:pr-10">
                            <div className='flex w-full flex-wrap items-center bg-theme-light-gray rounded-xl py-1.5 md:py-1 relative'>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    placeholder="Search brands"
                                    className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500"
                                />
                                <button type="submit" className="search-btn bg-theme-blue hover:bg-theme-dark px-3 py-0 min-w-fit rounded-md text-white border-none absolute top-2 right-2 bottom-2">
                                    <Image src={SearchIcon} width={15} height={15} alt="Icon" />
                                </button>
                            </div>
                        </div>

                        <div className='w-full md:w-5/12'>
                            <div className='flex justify-center md:justify-end'>
                                <div className='w-full md:w-[205px]'>
                                    <select
                                        value={selectedCategory}
                                        onChange={handleCategoryChange}
                                        className='w-full cursor-pointer text-base font-medium bg-transparent border-none px-2 py-3 md:py-6 pr-4'
                                    >
                                        <option value="">Brands by Category</option>
                                        {brandCategories.map((category) => (
                                            <option key={category.slug} value={category.slug}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='pt-12 pb-10 md:pt-24 md:pb-24'>
                <div className='container'>
                    <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-2 gap-y-4 md:gap-6 lg:gap-9 lg:px-10'>
                        {filteredBrands.map((brand: Brand, index: number) => (
                            <Link key={index} href={`/brands/${brand.slug}`} className="bg-white rounded-2xl shadow-md py-8 px-6  flex flex-col items-center border border-solid border-theme-border origin-center transition-all ease-in-out lg:hover:scale-105">
                                <div className="w-28 lg:w-[150px] h-28 lg:h-[150px] rounded-full overflow-hidden flex items-center justify-center">
                                    <Image
                                        className='w-full h-full object-cover'
                                        src={brand.featuredImage?.node?.sourceUrl || Willow}
                                        alt={brand.featuredImage?.node?.altText || brand.title || "Brand Image"}
                                        width={150}
                                        height={150}
                                    />
                                </div>
                                <p className="mt-4 text-base md:text-lg font-semibold text-[#2E2B29]">{brand.title}</p>
                            </Link>
                        ))}
                    </div>

                    {filteredBrands.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-lg text-gray-600">No brands found matching your search criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
} 