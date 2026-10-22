'use client';

import { useQueries } from '@tanstack/react-query';

import { Section } from '@/components/marketing/section';
import { CountUp } from '@/components/ui/count-up';
import { Skeleton } from '@/components/ui/skeleton';
import { StatsBar, type StatItem } from '@/components/ui/stats-bar';

import { STATS, fetchTotal } from './landing-queries';

function NumberSkeleton({ mobile = false }: { mobile?: boolean }) {
  return (
    <Skeleton
      aria-hidden
      className={mobile ? 'h-5 w-10' : 'h-9 w-16'}
    />
  );
}

function useEcosystemStats() {
  return useQueries({
    queries: STATS.map(stat => ({
      queryKey: stat.queryKey,
      queryFn: () => fetchTotal(stat.path),
    })),
  });
}

export function StatsStrip() {
  const queries = useEcosystemStats();
  const items = queries.flatMap((query, index): StatItem[] => {
    const stat = STATS[index];

    if (query.isPending) {
      return [
        {
          label: stat.label,
          value: <NumberSkeleton />,
          mobileValue: <NumberSkeleton mobile />,
        },
      ];
    }

    if (
      query.isError ||
      typeof query.data !== 'number' ||
      !Number.isFinite(query.data)
    ) {
      return [];
    }

    return [{ label: stat.label, value: <CountUp value={query.data} /> }];
  });

  if (items.length === 0) return null;

  return (
    <Section reveal>
      <StatsBar items={items} />
    </Section>
  );
}
