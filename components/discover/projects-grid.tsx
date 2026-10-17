'use client';

import { OpportunityCard } from '@/components/cards/opportunity-card';
import { OpportunityCardSkeleton } from '@/components/cards/opportunity-card-skeleton';
import { Pagination } from '@/components/ui/pagination';

import { toProjectCard } from './to-project-card';
import type { ProjectListResponse } from './use-projects';

const GRID_CLASS = 'grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3';

export function ProjectsGrid({
  data,
  isPending,
  isError,
  isNarrowed,
  page,
  pageSize,
  onPageChange,
}: {
  data?: ProjectListResponse;
  isPending: boolean;
  isError: boolean;
  /** A search or filter is applied, so an empty result is a miss, not an empty directory. */
  isNarrowed: boolean;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  if (isPending) {
    return (
      <div className={GRID_CLASS}>
        {Array.from({ length: pageSize }, (_, index) => (
          <OpportunityCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className='py-12 text-center text-body-sm text-muted-foreground'>
        Projects could not be loaded right now.
      </p>
    );
  }

  if (data.data.length === 0) {
    return (
      <p className='py-12 text-center text-body-sm text-muted-foreground'>
        {isNarrowed
          ? 'No projects match these filters.'
          : 'No projects to show yet.'}
      </p>
    );
  }

  return (
    <div className='flex flex-col gap-8'>
      <div className={GRID_CLASS}>
        {data.data.map((project, index) => (
          <OpportunityCard
            key={project.id}
            // Keep the card's `#n` running across pages instead of restarting.
            opportunity={toProjectCard(project, (page - 1) * pageSize + index)}
          />
        ))}
      </div>

      {data.pagination.total > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={data.pagination.total}
          onPageChange={onPageChange}
          className='justify-between'
        />
      )}
    </div>
  );
}
