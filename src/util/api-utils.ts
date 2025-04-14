export function lastSegment(url: string) {
  const parts = url.split("/");
  return parts.pop();
}