import { Suspense } from 'react';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import {
  BuildersView,
  BuildersViewFallback,
} from '@/components/discover/builders-view';
import {
  BUILDERS_REVALIDATE_SECONDS,
  buildersKeys,
  fetchBuilderFilters,
  fetchBuilders,
  parseBuildersQueryParams,
} from '@/components/discover/use-builders';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { JsonLd } from '@/components/seo/json-ld';
import { buildPageMetadata } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  collectionPageSchema,
  homeBreadcrumb,
} from '@/lib/seo/schema';

const BUILDERS_DESCRIPTION =
  'Browse the people building on Stellar through Boundless. Find builders by skill, country, and availability, and see who is open to work.';

export const metadata = buildPageMetadata({
  title: 'Builders',
  description: BUILDERS_DESCRIPTION,
  path: '/builders',
});

const buildersSchema = collectionPageSchema({
  name: 'Builders',
  description: BUILDERS_DESCRIPTION,
  path: '/builders',
});
const buildersBreadcrumbs = breadcrumbSchema([
  homeBreadcrumb,
  { name: 'Builders', path: '/builders' },
]);

interface BuildersPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BuildersPage(props: BuildersPageProps) {
  const resolvedSearchParams = props.searchParams
    ? await props.searchParams
    : {};
  const queryParams = parseBuildersQueryParams(resolvedSearchParams);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
      },
    },
  });

  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: buildersKeys.list(queryParams),
      queryFn: () =>
        fetchBuilders(queryParams, {
          next: { revalidate: BUILDERS_REVALIDATE_SECONDS },
          signal: AbortSignal.timeout(5000),
        }),
    }),
    queryClient.prefetchQuery({
      queryKey: buildersKeys.filters,
      queryFn: () =>
        fetchBuilderFilters({
          next: { revalidate: BUILDERS_REVALIDATE_SECONDS },
          signal: AbortSignal.timeout(5000),
        }),
    }),
  ]);

  return (
    <>
      <JsonLd data={buildersSchema} />
      <JsonLd data={buildersBreadcrumbs} />

      <SiteHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<BuildersViewFallback />}>
          <BuildersView />
        </Suspense>
      </HydrationBoundary>
      <SiteFooter />
    </>
  );
}
