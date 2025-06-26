import Link from 'next/link';
import HeaderSearch from './HeaderSearch';
import { postdata } from '../lib/queries';

// components/Header.tsx
import HeaderClientWrapper from './HeaderClientWrapper';
import DownArrow from '../images/down-arrow.svg'
import Image from 'next/image';

export default async function Header() {
    let emailTypes = [];
    let seasonals = [];
    let industries = [];

    try {
        const data = await postdata();
        emailTypes = data.emailTypes || [];
        seasonals = data.seasonals || [];
        industries = data.industries || [];
    } catch (error) {
        console.error('Error fetching header data:', error);
        // Use empty arrays as fallback
    }

    return (
        <>
            <HeaderClientWrapper>
                <header className="top-header fixed top-0 left-0 z-50  w-full px-4 xl:px-12 py-3 xl:py-0 border-b xl:border-none border-solid border-theme-border">
                    <span className='header-bg absolute top-0 left-0 w-full h-full z-10'></span>
                    <div className="flex items-center relative z-10">
                        <div className="left-wrap flex items-center justify-between xl:justify-start w-full xl:w-auto">
                            {/* Logo */}
                            <div className="left-logo">
                                <Link href={'/'}>
                                    <svg width="161" height="33" viewBox="0 0 161 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0.683594 0.738281V32.2806L23.9764 16.5095L0.683594 0.738281Z" fill="#ADA772" />
                                        <path d="M23.9766 16.5095L47.2694 32.2806V0.738281L23.9766 16.5095Z" fill="#ADA772" />
                                        <path d="M0.683594 32.2817H47.2692L23.9764 13.2754L0.683594 32.2817Z" fill="#A29A69" />
                                        <path opacity="0.25" d="M21.7927 15.0137L0.683594 31.3914V32.2811L21.8331 15.0541L21.7927 15.0137Z" fill="#010101" />
                                        <path opacity="0.25" d="M26.1602 15.0137L47.2693 31.4319V32.2811L26.1602 15.0541V15.0137Z" fill="#010101" />
                                        <path opacity="0.25" d="M47.2692 0.738281H0.683594L22.0758 20.0681C23.1676 21.0386 24.7852 21.0386 25.877 20.0681L47.2692 0.738281Z" fill="#010101" />
                                        <path d="M47.2692 0.738281H0.683594L22.1971 17.9248C23.2485 18.7336 24.7043 18.7336 25.7557 17.9248L47.2692 0.738281Z" fill="#4C4034" />
                                        <path d="M23.9784 4.66016L25.0702 7.97615H28.548L25.7173 9.99809L26.8091 13.3141L23.9784 11.2517L21.1881 13.3141L22.2395 9.99809L19.4492 7.97615H22.927L23.9784 4.66016Z" fill="#E9EFE9" />
                                        <path className="logo-txt" d="M117.008 20.7155H111.872L110.942 23.4653H107.141L112.398 9.39258H116.482L121.78 23.4653H117.978L117.008 20.7155ZM112.681 18.2083H116.158L114.46 13.1534H114.379L112.681 18.2083Z" fill="#4C4034" />
                                        <path className="logo-txt" d="M124.813 19.0553V23.4632H121.699V11.9785H126.835C128.372 11.9785 129.585 12.302 130.515 12.9086C131.445 13.5152 131.89 14.3644 131.89 15.4158C131.89 16.0224 131.728 16.5077 131.364 16.9525C131 17.3973 130.474 17.7208 129.747 18.0039C130.555 18.2061 131.162 18.5296 131.526 19.0149C131.89 19.5002 132.052 20.0663 132.052 20.7538V21.4817C132.052 21.7647 132.092 22.1287 132.213 22.4926C132.335 22.897 132.496 23.1397 132.739 23.3014V23.4632H129.544C129.302 23.3014 129.14 23.0183 129.059 22.614C128.978 22.2096 128.938 21.8052 128.938 21.4412V20.7538C128.938 20.1876 128.776 19.7832 128.453 19.5002C128.129 19.2171 127.644 19.0553 126.997 19.0553H124.813ZM124.813 16.9929H126.875C127.482 16.9929 127.967 16.8716 128.291 16.629C128.614 16.3864 128.776 16.0224 128.776 15.5776C128.776 15.0923 128.614 14.7284 128.25 14.4453C127.927 14.1622 127.442 14.0005 126.835 14.0005H124.813V16.9929Z" fill="#4C4034" />
                                        <path className="logo-txt" d="M138.16 11.9785L141.152 20.0259H141.193L144.226 11.9785H148.31V23.4632H145.196V20.592L145.479 15.3349H145.439L142.204 23.4632H140.101L136.906 15.4158H136.866L137.149 20.592V23.4632H134.035V11.9785H138.16Z" fill="#4C4034" />
                                        <path className="logo-txt" d="M154.618 16.9949H154.658L157.327 11.9805H160.684L156.154 19.4212V23.4651H153.081V19.2999L148.633 11.9805H151.989L154.618 16.9949Z" fill="#4C4034" />
                                        <path className="logo-txt" d="M59.9888 23.4653H56.1875V9.39258H59.9888V23.4653Z" fill="#4C4034" />
                                        <path className="logo-txt" d="M73.2105 23.4651H70.1372L65.2441 16.1457H65.2036V23.4651H62.0898V11.9805H65.2036L70.0968 19.2999H70.1372V11.9805H73.2105V23.4651Z" fill="#4C4034" />
                                        <path className="logo-txt" d="M74.9531 23.4632V11.9785H79.5227C81.1807 11.9785 82.4748 12.2616 83.4049 12.7873C84.335 13.313 84.7798 14.1218 84.7798 15.1328C84.7798 15.6989 84.618 16.1842 84.335 16.5886C84.0519 17.0334 83.5666 17.3165 82.96 17.5591C83.7284 17.7208 84.335 18.0039 84.6989 18.4892C85.0629 18.934 85.265 19.5002 85.265 20.0663C85.265 21.1986 84.8202 22.0478 83.971 22.614C83.0813 23.1801 81.8277 23.4632 80.2102 23.4632H74.9531ZM78.0669 16.7503H79.6036C80.2911 16.7503 80.8168 16.629 81.1807 16.3864C81.5447 16.1437 81.7064 15.8202 81.7064 15.4158C81.7064 14.9306 81.5447 14.5666 81.1807 14.3644C80.8168 14.1218 80.2911 14.0409 79.5632 14.0409H78.1074V16.7503H78.0669ZM78.0669 18.5296V21.4008H80.2102C80.8572 21.4008 81.3829 21.2795 81.7064 21.0773C82.0299 20.8346 82.1917 20.5111 82.1917 20.0663C82.1917 19.581 82.0299 19.1766 81.7469 18.934C81.4638 18.6914 81.019 18.5701 80.3719 18.5701H78.0669V18.5296Z" fill="#4C4034" />
                                        <path className="logo-txt" d="M96.543 18.7328C96.543 20.1482 96.0173 21.3209 94.9659 22.251C93.9145 23.1811 92.58 23.6259 90.8816 23.6259C89.1831 23.6259 87.8082 23.1811 86.7568 22.251C85.7054 21.3209 85.1797 20.1482 85.1797 18.7328V16.6705C85.1797 15.2551 85.7054 14.0824 86.7568 13.1523C87.8082 12.2222 89.1831 11.7773 90.8411 11.7773C92.4991 11.7773 93.8741 12.2222 94.9255 13.1523C95.9769 14.0824 96.5026 15.2551 96.5026 16.6705V18.7328H96.543ZM93.4292 16.6705C93.4292 15.8617 93.1866 15.1742 92.7418 14.6485C92.2969 14.1228 91.6499 13.8397 90.8411 13.8397C89.9919 13.8397 89.3449 14.0824 88.9405 14.6081C88.4957 15.1338 88.2935 15.8212 88.2935 16.63V18.7328C88.2935 19.5821 88.5361 20.2291 88.9809 20.7548C89.4258 21.2805 90.0728 21.5636 90.922 21.5636C91.7308 21.5636 92.3778 21.2805 92.8226 20.7548C93.2675 20.2291 93.5101 19.5416 93.5101 18.7328V16.6705H93.4292Z" fill="#4C4034" />
                                        <path className="logo-txt" d="M100.994 15.8626L103.177 11.9805H106.736L102.935 17.6824L107.06 23.4651H103.299L101.034 19.5021L98.7696 23.4651H95.2109L99.1335 17.6824L95.3322 11.9805H98.8909L100.994 15.8626Z" fill="#4C4034" />
                                    </svg>
                                </Link>
                            </div>
                            {/* Navigation */}
                            <nav className='top-nav xl:pl-9'>
                                <input className='toggle-menu block xl:hidden' type="checkbox" />
                                <span className='menu-toggle'>
                                    <span className='bg-theme-dark'></span>
                                    <span className='bg-theme-dark'></span>
                                    <span className='bg-theme-dark'></span>
                                </span>
                                <div className='min-menu text-center xl:text-left'>
                                    <ul className="block xl:flex pt-4 xl:pt-0 pb-10 xl:pb-0">
                                        <li className="group submenu">
                                            <Link className="text-lg md:text-base font-semibold md:font-medium block px-7 py-3 xl:py-7 text-theme-dark hover:text-theme-blue" href={'/categories'}>
                                                Categories
                                            </Link>
                                            <input className='category-menu absolute top-3 left-32 right-0 m-auto w-6 h-6 z-30 cursor-pointer block xl:hidden opacity-0' type="checkbox" />
                                            <span className='down-arrow absolute top-2 left-32 right-0 m-auto w-8 h-10 flex items-center justify-center xl:hidden'>
                                                <Image src={DownArrow} width={30} header={30} alt="Icon" />
                                            </span>
                                            <div className="child-menu xl:absolute top-full xl:left-0 xl:right-0 hidden xl:group-hover:flex xl:gap-x-4 2xl:gap-x-20 px-4 md:px-10 py-4 xl:pt-0 xl:py-6 2xl:py-12 bg-white">
                                                <ul className="flex flex-wrap content-start xl:w-4/12 xl:border-r border-theme-border border-solid pb-4 xl:pb-0">
                                                    <input type="checkbox" id="main" className="category-child top-0 left-28 right-0 m-auto w-8 h-9 z-30 cursor-pointer block xl:hidden opacity-0" defaultChecked />
                                                    <li className="w-full py-3 2xl:mb-4 px-3 md:px-5 xl:px-2 2xl:px-5 uppercase text-left bg-theme-light-gray-3 xl:bg-transparent relative rounded-lg">Email Type
                                                        <span className='submenu-arrow absolute top-0 right-4 w-8 h-full flex items-center justify-center xl:hidden'>
                                                            <Image className='w-5' src={DownArrow} width={30} header={30} alt="Icon" />
                                                        </span>
                                                    </li>
                                                    {emailTypes.map((item) => (
                                                        <li key={item.slug} className="w-6/12 child-2 inline-block text-left">
                                                            <Link className="text-sm md:text-base inline-block px-3 md:px-5 xl:px-2 2xl:px-5 py-1 2xl:py-2 hover:bg-theme-light-gray-3 rounded-lg text-theme-dark" href={`/email-type/${item.slug}`}>
                                                                {item.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>

                                                <ul className="flex flex-wrap content-start xl:w-4/12 xl:border-r border-theme-border border-solid pb-4 xl:pb-0">
                                                    <input type="checkbox" id="option1" className="category-child top-0 left-28 right-0 m-auto w-8 h-9 z-30 cursor-pointer block xl:hidden opacity-0" />
                                                    <li className="w-full py-3 2xl:mb-4 px-3 md:px-5 xl:px-2 2xl:px-5 uppercase text-left bg-theme-light-gray-3 xl:bg-transparent relative rounded-lg">Industry
                                                        <span className='submenu-arrow absolute top-0 right-4 w-8 h-full flex items-center justify-center xl:hidden'>
                                                            <Image className='w-5' src={DownArrow} width={30} header={30} alt="Icon" />
                                                        </span>
                                                    </li>
                                                    {industries.map((item) => (
                                                        <li key={item.slug} className="w-6/12 child-2 inline-block text-left">
                                                            <Link className="text-sm md:text-base inline-block px-3 md:px-5 xl:px-2 2xl:px-5 py-1 2xl:py-2 hover:bg-theme-light-gray-3 rounded-lg text-theme-dark" href={`/industry/${item.slug}`}>
                                                                {item.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>

                                                <ul className="flex flex-wrap content-start xl:w-4/12">
                                                    <input type="checkbox" id="option2" className="category-child top-0 left-28 right-0 m-auto w-8 h-9 z-30 cursor-pointer block xl:hidden opacity-0" />
                                                    <li className="w-full py-3 2xl:mb-4 px-3 md:px-5 xl:px-2 2xl:px-5 uppercase text-left bg-theme-light-gray-3 xl:bg-transparent relative rounded-lg">Seasonal
                                                        <span className='submenu-arrow absolute top-0 right-4 w-8 h-full flex items-center justify-center xl:hidden'>
                                                            <Image className='w-5' src={DownArrow} width={30} header={30} alt="Icon" />
                                                        </span>
                                                    </li>

                                                    {seasonals.map((item) => (
                                                        <li key={item.slug} className="w-6/12 child-2 inline-block text-left">
                                                            <Link className="text-sm md:text-base inline-block px-3 md:px-5 xl:px-2 2xl:px-5 py-1 2xl:py-2 hover:bg-theme-light-gray-3 rounded-lg text-theme-dark" href={`/seasonal/${item.slug}`}>
                                                                {item.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </li>

                                        <li>
                                            <Link className="text-lg md:text-base font-semibold md:font-medium block px-7 py-3 xl:py-7 text-theme-dark hover:text-theme-blue" href={'/brands'}>
                                                Brands
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="text-lg md:text-base font-semibold md:font-medium block px-7 py-3 xl:py-7 text-theme-dark hover:text-theme-blue" href={'/about-us'}>
                                                About
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="text-lg md:text-base font-semibold md:font-medium block px-7 py-3 xl:py-7 text-theme-dark hover:text-theme-blue" href={'/contact-us'}>
                                                Contact Us
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                        </div>
                        <div className="ml-auto">
                            <input className='search-input h-5 w-5 z-10 absolute top-3 -mt-1 right-12 block xl:hidden cursor-pointer opacity-0' type="checkbox" name='Search' />
                            <span className="search-toggle absolute top-3 -mt-1 right-12 block xl:hidden">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 19L15.5001 15.5M18 9.5C18 14.1944 14.1944 18 9.5 18C4.80558 18 1 14.1944 1 9.5C1 4.80558 4.80558 1 9.5 1C14.1944 1 18 4.80558 18 9.5Z" stroke="#362C22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <div className='header-search hidden xl:flex flex-wrap items-center'>
                                <HeaderSearch />
                            </div>
                            {/* <button className="font-semibold px-5 py-4 text-theme-dark hover:bg-theme-dark hover:text-white whitespace-nowrap  rounded-lg bg-transparent border-none">Sign up</button>
                            <button className="bg-theme-blue text-white hover:bg-theme-dark font-semibold px-5 py-4 rounded-lg whitespace-nowrap border-none">Log in</button> */}
                        </div>
                    </div>
                </header>
            </HeaderClientWrapper>
            <span className='block w-full h-16 xl:h-24'></span>
        </>
    );
}