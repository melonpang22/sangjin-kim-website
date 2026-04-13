import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'av7c5qs8',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
});