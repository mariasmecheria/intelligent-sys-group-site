export type Contact = {
  contactName: string;
  department?: string;
  university?: string;
  postalStreet?: string;
  postalCity?: string;
  postalCode?: string;
  email?: string;
  vCardUrl?: string;
  officeRoom?: string;
  officeStreet?: string;
  officeCity?: string;
  phone?: string;
};

export async function getContact(): Promise<Contact> {
  const base = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  const res = await fetch(`${base}/api/contact`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch contact: ${res.status}`);
  }

  const json = await res.json();
  return json.data ?? {};
}