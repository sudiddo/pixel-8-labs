import { EventType } from '@/types/eventType';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {
  profile: EventType;
};

function Avatar({ profile }: Props) {
  return (
    <Link href={`/octocat/${profile.actor.login}`}>
      <div className="relative w-10 h-10 md:w-14 md:h-14">
        <Image
          src={profile.actor.avatar_url}
          fill
          sizes="(max-width: 768px) 100vw,"
          className="rounded-full"
          alt="avatar"
        />
      </div>
    </Link>
  );
}

export default Avatar;
