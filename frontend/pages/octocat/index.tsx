import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { fetchEvents, fetchRepos, fetchUserProfile } from '../api';
import Profile, { ProfileType } from '@/components/screens/Profile';

function Octocat() {
  const { data: session } = useSession({ required: true });
  const [profile, setProfile] = useState<ProfileType>({} as ProfileType);

  useEffect(() => {
    if (session && session.user) {
      const loadData = async () => {
        const userProfile = await fetchUserProfile(session);

        const repos = await fetchRepos(session);

        const events = await fetchEvents(session);

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
  }, [session]);

  if (session && session.user) {
    return <Profile {...profile} />;
  }
  return <></>;
}

export default Octocat;
