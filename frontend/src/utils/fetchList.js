import { API_BASE_URL as configuredApiBaseUrl } from './api';
export default async function fetchList(resource) {
  const baseUrl = configuredApiBaseUrl;
  const response = await fetch(`${baseUrl}/api/${resource}`);
  if (!response.ok) throw new Error(`Unable to load ${resource}`);
  const list = await response.json();
  if (!Array.isArray(list)) throw new Error(`Invalid ${resource} response`);
  return list;
}
