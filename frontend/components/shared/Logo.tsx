import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function Logo() {
  return (
    <Link href="/octocat" className="flex flex-row space-x-2 px-4 items-center">
      <Image
        src="/logo.png"
        alt="logo"
        width={52}
        height={52}
        className="object-contain"
      />
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold font-salsa">Gut.</h1>
        <h2 className="text-xs font-salsa font-medium">
          GitHub Profile Previewer
        </h2>
      </div>
    </Link>
  );
}

export default Logo;
