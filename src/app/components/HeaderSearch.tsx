'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SearchIcon from '../images/search-icon.svg'
import Image from 'next/image';

export default function HeaderSearch() {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4 search-form">
      <div className="search-row flex items-center bg-theme-light-gray rounded-xl w-full 2xl:min-w-[520px] py-1 pr-2 relative">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search brands or keywords" className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500"
        />
        <button type="submit"className="search-btn bg-theme-blue hover:bg-theme-dark px-3 py-0 min-w-fit rounded-md text-white border-none absolute top-2 right-2 bottom-2">
        <Image src={SearchIcon} width={15} height={15} alt="Icon" />
        </button>
      </div>
    </form>
  );
}
