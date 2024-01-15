import { RepoType } from '@/types/repoType';
import React from 'react';
import RepositoryCard from './RepositoryCard';

type Props = {
  repos: RepoType[];
};

function Repositories({ repos }: Props) {
  const repoList = repos.slice(0, 6);

  return (
    <div className="p-6 flex flex-col space-y-6 border border-gray-100 rounded-lg md:mt-6 mb-6 grow">
      <div className="space-x-3 flex flex-row items-center">
        <p className="text-2xl font-bold text-gray-900">Repository</p>
        <div className="text-[#363F72] flex items-center justify-center font-medium text-sm w-[33px] h-[28px] rounded-full bg-[#F8F9FC]">
          {repos.length}
        </div>
      </div>
      {repoList.map((repo) => (
        <RepositoryCard repo={repo} key={repo.id} />
      ))}
    </div>
  );
}

export default Repositories;
