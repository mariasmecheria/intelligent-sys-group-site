export type CourseListItem = {
  id: number;
  courseName: string;
  slug: string;
  type?: string;
  coverPictureUrl?: string;
};

export type ContentBlock = {
  id: number;
  title: string;
  content?: string;
};

export type BibliographyEntry = {
  id: number;
  citation: string;
};

export type CourseTeamMember = {
  id: number;
  fullName: string;
  slug: string;
};

export type CourseDetail = {
  id: number;
  courseName: string;
  slug: string;
  instructor?: string;
  type?: string;
  prerequisites?: string;
  content: ContentBlock[];
  mainBibliography: BibliographyEntry[];
  additionalBibliography: BibliographyEntry[];
  team_members: CourseTeamMember[];
  coverPictureUrl?: string;
  semester?: string;
  studyYear?: string;
  isCompulsory: boolean;
  faculty?: string;
};

function resolveMediaUrl(base: string, media: any): string | undefined {
  if (!media?.url) return undefined;
  return media.url.startsWith('http') ? media.url : `${base}${media.url}`;
}

/** Turns "third_year" or "THIRD_YEAR" into "Third Year". */
export function titleCase(value?: string): string {
  if (!value) return '';
  return value
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export async function getCourses(): Promise<CourseListItem[]> {
  const base = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  const res = await fetch(`${base}/api/courses?populate=coverPicture&pagination[pageSize]=100`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch courses: ${res.status}`);
  }

  const json = await res.json();

  return json.data.map((entry: any) => ({
    id: entry.id,
    courseName: entry.courseName,
    slug: entry.slug,
    type: entry.type,
    coverPictureUrl: resolveMediaUrl(base, entry.coverPicture),
  }));
}

export async function getCourseBySlug(slug: string): Promise<CourseDetail | null> {
  const base = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  const res = await fetch(
    `${base}/api/courses?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=coverPicture,content,mainBibliography,additionalBibliography,team_members`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch course: ${res.status}`);
  }

  const json = await res.json();
  const entry = json.data?.[0];
  if (!entry) return null;

  return {
    id: entry.id,
    courseName: entry.courseName,
    slug: entry.slug,
    instructor: entry.instructor,
    type: entry.type,
    prerequisites: entry.prerequisites,
    content: (entry.content ?? []).map((c: any) => ({
      id: c.id,
      title: c.title,
      content: c.content,
    })),
    mainBibliography: (entry.mainBibliography ?? []).map((b: any) => ({
      id: b.id,
      citation: b.citation,
    })),
    additionalBibliography: (entry.additionalBibliography ?? []).map((b: any) => ({
      id: b.id,
      citation: b.citation,
    })),
    team_members: (entry.team_members ?? []).map((t: any) => ({
      id: t.id,
      fullName: t.fullName,
      slug: t.slug,
    })),
    coverPictureUrl: resolveMediaUrl(base, entry.coverPicture),
    semester: entry.semester,
    studyYear: entry.studyYear,
    isCompulsory: entry.isCompulsory,
    faculty: entry.faculty,
  };
}