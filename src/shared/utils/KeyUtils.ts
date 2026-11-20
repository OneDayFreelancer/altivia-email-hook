export function getMissingKeys<K extends string>(
  env: Record<string, string | undefined>,
  required: readonly K[],
): K[] {
  return required.filter((key) => !env[key])
}
