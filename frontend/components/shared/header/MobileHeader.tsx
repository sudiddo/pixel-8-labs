import { UserType } from '@/types/userType';
import { Disclosure } from '@headlessui/react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import { defaultAvatar } from 'utility/common';

type Props = {
  user: UserType;
};

function MobileHeader({ user }: Props) {
  return (
    <Disclosure.Panel className="md:hidden">
      <div className="border-t border-[#F2F4F7] py-3">
        <div className="flex items-center px-4">
          <div className="flex-shrink-0">
            <Image
              className="rounded-full object-cover"
              src={user?.avatar_url ?? defaultAvatar}
              alt={user?.name ?? 'avatar'}
              width={64}
              height={64}
            />
          </div>
          <div className="ml-3 flex flex-col">
            <p className="text-base font-semibold text-[#344054]">
              {user?.name}
            </p>
            <p className="text-sm text-[#667085]">{user?.email}</p>
          </div>
        </div>
        <div className="mt-6">
          <Disclosure.Button
            as="a"
            href="#"
            className="block rounded-md py-3 text-base font-medium text-gray-900 px-4"
          >
            View Profile
          </Disclosure.Button>
          <div className="bg-gray-100 h-px w-full my-2" />
          <Disclosure.Button
            as="button"
            className="block rounded-md py-3 text-base font-medium text-gray-900 px-4"
            onClick={() => signOut()}
          >
            Log out
          </Disclosure.Button>
        </div>
      </div>
    </Disclosure.Panel>
  );
}

export default MobileHeader;
