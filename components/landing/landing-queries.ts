import { apiFetch } from '@/lib/api/client';
import type { Schemas } from '@/lib/api/types';
import type { TopBuilder } from './to-builder-card';

/**
 * Cache lifetime in seconds for the landing page data.
 * Keeps API load low while revalidating periodically.
 */
export const LANDING_REVALIDATE_SECONDS = 180;

export const STATS = [
  {
    label: 'Builders',
    path: '/users/directory?limit=1',
    queryKey: ['ecosystem-stats', 'builders'] as const,
  },
  {
    label: 'Projects',
    path: '/projects?limit=1',
    queryKey: ['ecosystem-stats', 'projects'] as const,
  },
  {
    label: 'Teams',
    path: '/organizations?limit=1',
    queryKey: ['ecosystem-stats', 'teams'] as const,
  },
] as const;

export type CountedList =
  | Schemas['BuildersDirectoryResponseDto']
  | Schemas['PublicProjectListDto']
  | Schemas['PublicOrganizationListDto'];

export async function fetchTotal(
  path: string,
  init?: RequestInit
): Promise<number> {
  const response = await apiFetch<CountedList>(path, init);
  return response.pagination.total;
}

export const TOP_BUILDERS_LIMIT = 8;
export const topBuildersQueryKey = [
  'users',
  'top-builders',
  TOP_BUILDERS_LIMIT,
] as const;

export async function fetchTopBuilders(
  init?: RequestInit
): Promise<TopBuilder[]> {
  return apiFetch<TopBuilder[]>(
    `/users/top-builders?limit=${TOP_BUILDERS_LIMIT}`,
    init
  );
}

export const featuredProjectsQueryKey = ['projects', 'featured'] as const;

export async function fetchFeaturedProjects(
  init?: RequestInit
): Promise<Schemas['PublicProjectListDto']> {
  return apiFetch<Schemas['PublicProjectListDto']>('/projects/featured', init);
}
