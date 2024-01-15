import React from 'react';
import { Disclosure } from '@headlessui/react';
import { UserType } from '@/types/userType';
import MobileHeader from './MobileHeader';
import DesktopHeader from './DesktopHeader';

type Props = {
  user: UserType;
};

function Header({ user }: Props) {
  return (
    <Disclosure as="nav">
      {({ open }) => (
        <>
          <DesktopHeader open={open} user={user} />
          <MobileHeader user={user} />
        </>
      )}
    </Disclosure>
  );
}

export default Header;
