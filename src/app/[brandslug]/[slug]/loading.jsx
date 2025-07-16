export default function Loading() {
    return (
        <div className="email-wrapper pb-10 md:py-16 md:pb-10 xl:py-24">
            <div className="container">
                <div className='flex flex-wrap items-start mx-auto md:max-w-4xl xl:max-w-full 2xl:px-20'>
                    <div className="w-full xl:w-3/5 rounded-2xl relative px-4 md:pl-0 md:pr-2 order-2 xl:order-1">
                        <div className='bg-theme-light-gray-2 rounded-2xl animate-pulse'>
                            <div className="email-header rounded-t-2xl w-full z-20 overflow-hidden">
                                <div className='nav-header rounded-t-2xl border border-solid border-theme-border w-full p-2 md:p-4 flex items-center justify-between flex-wrap gap-4 bg-white'>
                                    <div className="h-8 w-32 bg-gray-200 rounded"></div>
                                    <div className="h-8 w-32 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                            <div className="email-content-area rounded-b-2xl border border-solid border-theme-border p-16 min-h-screen">
                                <div className='email-postdata bg-white'>
                                    <div className="space-y-4">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full xl:w-2/5 xl:pl-16 xl:sticky xl:top-[96px] order-1 xl:order-2 mb-10 xl:mb-0'>
                        <div className='bg-white px-6 py-8 md:p-8 w-full md:rounded-2xl space-y-4 animate-pulse'>
                            <div className="flex items-center space-x-4">
                                <div className="w-20 md:w-24 h-20 md:h-24 rounded-full bg-gray-200"></div>
                                <div className="h-8 w-32 bg-gray-200 rounded"></div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 