import Profile, { ProfileType } from '@/components/screens/Profile';
import { UserType } from '@/types/userType';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { fetchUserProfile, fetchRepos, fetchEvents } from '../api';
import Spinner from '@/components/shared/Spinner';

function UserPage() {
  const router = useRouter();
  const slug = String(router.query.slug);

  const { data: session } = useSession({ required: true });
  const [profile, setProfile] = useState<ProfileType>({
    recentProfileViews: [],
    totalProfileViews: 0,
    user: {} as UserType,
    repos: [],
  } as ProfileType);

  useEffect(() => {
    if (session && session.user) {
      const loadData = async () => {
        const userProfile = await fetchUserProfile({ session, slug });

        const repos = await fetchRepos({ session, slug });

        const events = await fetchEvents({ session, slug });

        const watchEvents = events.filter(
          (event) => event.type === 'WatchEvent',
        );

        const lastThreeWatchEvents = watchEvents.slice(0, 3);
        const totalProfileViews = watchEvents.length;

        setProfile({
          user: userProfile,
          repos,
          recentProfileViews: lastThreeWatchEvents,
          totalProfileViews,
        });
      };

      loadData();
    }
  }, [session, slug]);

  if (session && session.user && profile.user.id) {
    return <Profile {...profile} />;
  }
  return <Spinner />;
}

export default UserPage;
