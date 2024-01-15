import React, { useEffect, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { UserType } from '@/types/userType';
import MobileHeader from './MobileHeader';
import DesktopHeader from './DesktopHeader';
import { fetchUserProfile } from '@/pages/api';
import { useSession } from 'next-auth/react';

function Header() {
  const { data: session } = useSession({ required: true });
  const [user, setUser] = useState<UserType>({} as UserType);

  useEffect(() => {
    if (session && session.user) {
      const loadData = async () => {
        const userProfile = await fetchUserProfile({ session });
        setUser(userProfile);
      };

      loadData();
    }
  }, [session]);
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
