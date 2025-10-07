declare class URLPattern {
  constructor(init?: { pathname?: string } | string, baseURL?: string);
  exec(
    input: { pathname?: string } | string
  ):
    | { pathname: { groups: Record<string, string> } }
    | null;
}
