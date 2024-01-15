import { EventType } from '@/types/eventType';
import { RepoType } from '@/types/repoType';
import { UserType } from '@/types/userType';
import React from 'react';
import Header from '../shared/header/Header';

export type ProfileType = {
  user: UserType;
  repos: RepoType[];
  recentProfileViews: EventType[];
  totalProfileViews: number;
};

interface Props extends ProfileType {}

function Profile({ user }: Props) {
  return (
    <div>
      <Header user={user} />
    </div>
  );
}

export default Profile;
