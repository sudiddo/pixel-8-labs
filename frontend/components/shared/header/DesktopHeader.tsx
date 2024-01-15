import { UserType } from '@/types/userType';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import React, { Fragment } from 'react';
import { classNames, defaultAvatar } from 'utility/common';
import Logo from '../Logo';

type Props = {
  user: UserType;
  open: boolean;
};

function DesktopHeader({ user, open }: Props) {
  return (
    <div className="mx-auto px-4 h-[72px] border-b border-[#F2F4F7]">
      <div className="flex h-full items-center mx-auto justify-between max-w-7xl md:px-8">
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="hidden md:ml-6 sm:block">
          <div className="flex items-center">
            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <Menu.Button className="relative flex rounded-full bg-gray-100 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-500">
                  <div className="flex flex-row items-center px-4 space-x-4 py-2">
                    <Image
                      className="rounded-full object-cover"
                      src={user?.avatar_url ?? defaultAvatar}
                      alt={user?.name ?? 'avatar'}
                      width={40}
                      height={40}
                    />
                    <Bars3Icon
                      className="block h-6 w-6 text-black"
                      aria-hidden="true"
                    />
                  </div>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-1 w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="flex items-center px-4 py-3">
                    <div className="flex-shrink-0">
                      <Image
                        className="rounded-full object-cover"
                        src={user?.avatar_url ?? defaultAvatar}
                        alt={user?.name ?? 'avatar'}
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="ml-3 flex flex-col">
                      <p className="text-sm font-semibold text-[#344054]">
                        {user?.name}
                      </p>
                      <p className="text-xs text-[#667085]">{user?.email}</p>
                    </div>
                  </div>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'block px-4 py-[10px] text-sm text-gray-700',
                        )}
                      >
                        View Profile
                      </a>
                    )}
                  </Menu.Item>
                  <div className="bg-gray-100 h-[3px] w-full" />

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => signOut()}
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'block w-full text-left px-4 py-[10px] text-sm text-gray-700',
                        )}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        <div className="-mr-2 flex sm:hidden">
          {/* Mobile menu button */}
          <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-black hover:text-black/70 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black/30">
            <span className="absolute -inset-0.5" />
            <span className="sr-only">Open main menu</span>
            {open ? (
              <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
            )}
          </Disclosure.Button>
        </div>
      </div>
    </div>
  );
}

export default DesktopHeader;
