export function ipfsToHttp(uri: string): string {
  if (uri.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${uri.slice(7)}`;
  }
  return uri;
}

export async function fetchNftMetadata(tokenUri: string): Promise<{ image: string | null; name: string | null }> {
  try {
    const res = await fetch(ipfsToHttp(tokenUri));
    if (!res.ok) return { image: null, name: null };
    const json = (await res.json()) as { image?: string; name?: string };
    const image = json.image ? ipfsToHttp(json.image) : null;
    return { image, name: json.name ?? null };
  } catch {
    return { image: null, name: null };
  }
}
