export function time(time: number, c: string): number {
  if (c[0] == "m") {
    return time * 60 * 1000;
  } else if (c[0] == "h") {
    return time * 60 * 60 * 1000;
  } else if (c[0] == "d") {
    return time * 24 * 60 * 60 * 1000;
  } else if (c[0] == "s") {
    return time * 1000;
  }
  return 0;
}
