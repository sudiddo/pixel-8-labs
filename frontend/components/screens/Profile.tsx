import { EventType } from '@/types/eventType';
import { RepoType } from '@/types/repoType';
import { UserType } from '@/types/userType';
import React from 'react';
import Header from '../shared/header/Header';
import UserInfo from '../shared/UserInfo';
import Repositories from '../shared/repositories/Repositories';

export type ProfileType = {
  user: UserType;
  repos: RepoType[];
  recentProfileViews: EventType[];
  totalProfileViews: number;
};

interface Props extends ProfileType {}

function Profile({
  user,
  totalProfileViews,
  recentProfileViews,
  repos,
}: Props) {
  return (
    <div>
      <Header />
      <div className="flex flex-col md:flex-row md:space-x-8 max-w-7xl mx-auto md:px-4">
        <UserInfo
          user={user}
          totalProfileViews={totalProfileViews}
          recentProfileViews={recentProfileViews}
        />
        <Repositories repos={repos} />
      </div>
    </div>
  );
}

export default Profile;
