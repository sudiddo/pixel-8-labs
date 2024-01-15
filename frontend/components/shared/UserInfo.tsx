import { EventType } from '@/types/eventType';
import { UserType } from '@/types/userType';
import { EnvelopeIcon, UsersIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import React from 'react';
import { defaultAvatar } from 'utility/common';
import Avatar from './Avatar';

type Props = {
  user: UserType;
  recentProfileViews: EventType[];
  totalProfileViews: number;
};

function UserInfo({ user, recentProfileViews, totalProfileViews }: Props) {
  return (
    <div className="md:max-w-[280px]">
      {/* User Info */}
      <div className="px-8 py-6">
        {/* Profile and Name */}
        <div className="flex flex-row md:flex-col md:space-x-0 md:space-y-2 space-x-4 items-center mb-6">
          <div className="relative w-[88px] h-[88px] md:w-40 md:h-40 shrink-0">
            <Image
              fill
              src={user?.avatar_url || defaultAvatar}
              alt="avatar"
              sizes="(max-width: 768px) 100vw,"
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col text-gray-900 md:text-center">
            <p className="text-2xl font-bold gray-700">{user?.name}</p>
            <p>{user?.login}</p>
          </div>
        </div>

        {/* About */}
        {user?.bio && (
          <div className="flex flex-col space-y-2 mb-4">
            <div className="text-gray-900 font-bold text-sm">About</div>
            <div className="text-gray-900">{user?.bio}</div>
          </div>
        )}

        {/* Email and visitor */}
        <div className="flex flex-col space-y-2 mb-10">
          {user?.email && (
            <div className="flex flex-row space-x-2 text-gray-700 items-center">
              <EnvelopeIcon className="w-5 h-5" />
              <p>{user?.email}</p>
            </div>
          )}
          <div className="flex flex-row space-x-2 text-gray-700 items-center">
            <UsersIcon className="w-5 h-5" />
            <p>
              <span className="font-bold text-gray-800">
                {totalProfileViews + ' '}
              </span>
              profile visitor
            </p>
          </div>
        </div>

        {/* Latest Visitor */}
        <div className="flex flex-col space-y-2 mb-4">
          <div className="text-gray-900 font-bold text-sm">Latest Visitor</div>
          <div className="flex flex-row flex-wrap space-x-4">
            {recentProfileViews.map((profile) => (
              <Avatar profile={profile} key={profile.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
