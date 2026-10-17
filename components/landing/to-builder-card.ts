import type { BuilderCardView } from '@/components/cards/types';
import type { Schemas } from '@/lib/api/types';

const MAX_SKILLS = 4;

/** One row of `GET /users/top-builders`. */
export type TopBuilder = Schemas['TopBuilderDto'];

export function toBuilderCard(builder: TopBuilder): BuilderCardView {
  return {
    id: builder.id,
    displayName: builder.name ?? builder.username ?? 'Builder',
    username: builder.username ?? '',
    avatarSrc: builder.image ?? undefined,
    location: builder.location ?? builder.country ?? undefined,
    skills: builder.skills.slice(0, MAX_SKILLS),
    followers: builder.followers,
    projects: builder.projects,
    detailUrl: builder.username ? `/builders/${builder.username}` : undefined,
  };
}
