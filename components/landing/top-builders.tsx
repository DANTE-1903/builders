'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import { BuilderCard } from '@/components/cards/builder-card';
import { BuilderCardSkeleton } from '@/components/cards/builder-card-skeleton';
import { ArrowRightIcon } from '@/components/icons';
import { Section, SectionHeading } from '@/components/marketing/section';
import { Button } from '@/components/ui/button';

import {
  TOP_BUILDERS_LIMIT,
  topBuildersQueryKey,
  fetchTopBuilders,
} from './landing-queries';
import { toBuilderCard } from './to-builder-card';

function useTopBuilders() {
  return useQuery({
    queryKey: topBuildersQueryKey,
    queryFn: () => fetchTopBuilders(),
  });
}

function TopBuildersSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {Array.from({ length: TOP_BUILDERS_LIMIT }, (_, index) => (
        <BuilderCardSkeleton key={index} />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <p className='text-center text-body-sm text-muted-foreground'>
      No builders to show yet.
    </p>
  );
}

export function TopBuilders() {
  const { data, isError, isPending } = useTopBuilders();
  const builders = data?.map(toBuilderCard) ?? [];

  return (
    <Section reveal innerClassName='flex flex-col gap-8'>
      <SectionHeading
        align='left'
        title='Top builders'
        description='Meet the builders making an impact across the Boundless ecosystem.'
        titleClassName='leading-none font-semibold lg:text-5xl lg:tracking-[-1.92px]'
      />

      {isPending ? (
        <TopBuildersSkeleton />
      ) : isError ? (
        <p className='text-center text-body-sm text-muted-foreground'>
          Top builders could not be loaded right now.
        </p>
      ) : builders.length === 0 ? (
        <EmptyState />
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {builders.map((builder) => (
            <BuilderCard key={builder.id} builder={builder} />
          ))}
        </div>
      )}

      <div className='flex justify-center'>
        <Button
          intent='secondary'
          appearance='outline'
          size='large'
          asChild
        >
          <Link href='/builders'>
            View all builders
            <ArrowRightIcon aria-hidden />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
