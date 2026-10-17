import { useQuery } from '@tanstack/react-query';

import { apiFetch } from '@/lib/api/client';
import type { Schemas } from '@/lib/api/types';

/** One page of `/projects`. */
export type ProjectListResponse = Schemas['PublicProjectListDto'];

/** Facets for the `/projects` filter rail. */
export type ProjectFilters = Schemas['ProjectFiltersDto'];

/** Query params `GET /projects` accepts from the directory page. */
export interface ProjectsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  /** Repeatable filter, sent as a comma-separated `tags` value. */
  tags?: string[];
  publicStatus?: string;
  originType?: string;
}

export const projectsKeys = {
  all: ['projects'] as const,
  list: (params: ProjectsQueryParams) =>
    ['projects', 'list', params] as const,
  filters: ['projects', 'filters'] as const,
};

function toQueryString(params: ProjectsQueryParams): string {
  const search = new URLSearchParams();

  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.search) search.set('search', params.search);
  if (params.category) search.set('category', params.category);
  if (params.tags?.length) search.set('tags', params.tags.join(','));
  if (params.publicStatus) search.set('publicStatus', params.publicStatus);
  if (params.originType) search.set('originType', params.originType);

  const query = search.toString();
  return query ? `?${query}` : '';
}

/** Paginated `/projects` directory list, filtered by the params above. */
export function useProjects(params: ProjectsQueryParams = {}) {
  return useQuery({
    queryKey: projectsKeys.list(params),
    queryFn: () =>
      apiFetch<ProjectListResponse>(`/projects${toQueryString(params)}`),
  });
}

/** Filter facets (categories, tags, statuses, origin types) for `/projects`. */
export function useProjectFilters() {
  return useQuery({
    queryKey: projectsKeys.filters,
    queryFn: () => apiFetch<ProjectFilters>('/projects/filters'),
  });
}
