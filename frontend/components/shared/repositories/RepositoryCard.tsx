import { RepoType } from '@/types/repoType';
import moment from 'moment';
import React from 'react';
import { classNames } from 'utility/common';
import { languageColor } from 'utility/language-color';

type Props = {
  repo: RepoType;
};

function RepositoryCard({ repo }: Props) {
  const isPrivate = repo.private;
  const color =
    languageColor[repo.language as keyof typeof languageColor]?.color ?? '#000';
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg px-5 py-6">
      <div className="flex flex-row items-center space-x-3 mb-2">
        {/* Name and public or not */}
        <p className="text-gray-900 font-bold">{repo.name}</p>
        <p
          className={classNames(
            'px-2 text-xs font-medium rounded-[16px] w-fit',
            isPrivate
              ? 'text-gray-700 bg-gray-100'
              : 'text-purple-700 bg-purple-50',
          )}
        >
          {isPrivate ? 'private' : 'public'}
        </p>
      </div>
      <p className="text-gray-900 text-sm mb-6">{repo.description}</p>
      <div className="flex flex-row space-x-6 text-xs">
        {/* Language and latest update */}
        <div className="flex flex-row space-x-1 items-center">
          <div
            style={{
              backgroundColor: color,
            }}
            className={classNames('w-3 h-3 rounded-full')}
          />
          <p className="text-gray-900">{repo.language}</p>
        </div>
        <p className="text-gray-600">{moment(repo.updated_at).fromNow()}</p>
      </div>
    </div>
  );
}

export default RepositoryCard;
