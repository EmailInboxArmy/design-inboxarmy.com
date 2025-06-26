import Image from 'next/image';
import SearchIcon from '../images/search-icon.svg'

export default function Newsletter() {
    return (
        <>
            <div>


                <div className="flex flex-wrap xl:flex-nowrap gap-4 items-center md:bg-theme-light-gray-2 md:rounded-2xl md:p-2 w-full xl:min-w-[583px] md:pl-4">
                    <span className='font-medium md:font-semibold md:font-intersemi w-full md:w-auto lg:w-full xl:w-auto text-center md:text-left'>Sign Up For Our Newsletter</span>
                    <form className='flex flex-nowrap w-full md:w-auto lg:w-full xl:w-auto relative md:flex-1'>
                        <input type="email" placeholder="Email Address" className="bg-theme-light-gray-3 md:bg-white px-4 py-2 rounded-r-lg border-none flex-1" />
                        <button type="submit" className="bg-theme-blue hover:bg-theme-dark px-3 py-0 rounded-md text-white border-none absolute top-1 right-1 bottom-1">
                            <Image src={SearchIcon} width={15} height={15} alt="Icon" />
                        </button>
                    </form>
                </div>
            </div>
        </>

    );
}