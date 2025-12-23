import { CaseInput } from '../types';

export type SearchCategory = 'General Web' | 'Social Profiles' | 'Business Records' | 'Archives & Wayback' | 'Images';

export interface SearchItem {
  label: string;
  query: string;
  url: string;
}

export interface SearchPackGroup {
  category: SearchCategory;
  items: SearchItem[];
}

function buildQuery(parts: string[]): string {
  return parts
    .filter(Boolean)
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' ');
}

function encodeQuery(query: string): string {
  return encodeURIComponent(query);
}

export function buildSearchPack(caseData: CaseInput): SearchPackGroup[] {
  const { subjectName, location, keywords, knownUsernames } = caseData;
  const baseQuery = buildQuery([subjectName, location, keywords]);
  const usernameQuery = (knownUsernames || '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
    .join(' OR ');

  const searchGroups: SearchPackGroup[] = [
    {
      category: 'General Web',
      items: [
        {
          label: 'Google',
          query: baseQuery,
          url: `https://www.google.com/search?q=${encodeQuery(baseQuery)}`,
        },
        {
          label: 'Bing',
          query: baseQuery,
          url: `https://www.bing.com/search?q=${encodeQuery(baseQuery)}`,
        },
      ],
    },
    {
      category: 'Social Profiles',
      items: [
        {
          label: 'LinkedIn',
          query: buildQuery([subjectName, location, 'site:linkedin.com']),
          url: `https://www.google.com/search?q=${encodeQuery(buildQuery([subjectName, location, 'site:linkedin.com']))}`,
        },
        {
          label: 'GitHub',
          query: buildQuery([subjectName, usernameQuery, 'site:github.com']),
          url: `https://www.google.com/search?q=${encodeQuery(buildQuery([subjectName, usernameQuery, 'site:github.com']))}`,
        },
        {
          label: 'Reddit',
          query: buildQuery([usernameQuery || subjectName, 'site:reddit.com']),
          url: `https://www.google.com/search?q=${encodeQuery(buildQuery([usernameQuery || subjectName, 'site:reddit.com']))}`,
        },
      ],
    },
    {
      category: 'Business Records',
      items: [
        {
          label: 'OpenCorporates',
          query: buildQuery([subjectName, location]),
          url: `https://opencorporates.com/companies?utf8=%E2%9C%93&q=${encodeQuery(buildQuery([subjectName, location]))}`,
        },
        {
          label: 'State Filings (Google)',
          query: buildQuery([subjectName, location, 'business registration filetype:pdf']),
          url: `https://www.google.com/search?q=${encodeQuery(
            buildQuery([subjectName, location, 'business registration filetype:pdf'])
          )}`,
        },
      ],
    },
    {
      category: 'Archives & Wayback',
      items: [
        {
          label: 'Wayback Machine',
          query: subjectName,
          url: `https://web.archive.org/web/*/${encodeQuery(subjectName)}`,
        },
        {
          label: 'Google Cache',
          query: buildQuery([subjectName, keywords]),
          url: `https://www.google.com/search?q=${encodeQuery(buildQuery([subjectName, keywords, 'cache:']))}`,
        },
      ],
    },
    {
      category: 'Images',
      items: [
        {
          label: 'Google Images',
          query: baseQuery,
          url: `https://www.google.com/search?tbm=isch&q=${encodeQuery(baseQuery)}`,
        },
        {
          label: 'Bing Images',
          query: baseQuery,
          url: `https://www.bing.com/images/search?q=${encodeQuery(baseQuery)}`,
        },
      ],
    },
  ];

  return searchGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) => item.query.trim().length > 0),
  }));
}
