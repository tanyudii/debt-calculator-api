export const durationConverterRegExp = /(([0-9]+)([wdhms]|\s+))/g;

export const pieces = [
  { label: 'w', value: 604800 },
  { label: 'd', value: 86400 },
  { label: 'h', value: 3600 },
  { label: 'm', value: 60 },
  { label: 's', value: 1 },
];

export const durationRevertConverter = (
  duration: number,
  durationInHuman = '',
): string => {
  if (duration <= 0) {
    return durationInHuman.trim();
  }

  const piece = pieces.find((p) => duration >= p.value);
  if (!piece) {
    return durationInHuman.trim();
  }

  const mod = duration % piece.value;
  const value = (duration - mod) / piece.value;

  duration -= value * piece.value;
  durationInHuman += `${value}${piece.label} `;

  return durationRevertConverter(duration, durationInHuman);
};

export const durationConverter = (duration: string): number => {
  const times: string[] | null = duration.match(durationConverterRegExp);
  if (times === null) {
    return 0;
  }

  return times
    .map((time: string) => {
      const value: string[] | null = time.match(/\d+/);
      const key: string[] | null = time.match(/[w|d|h|m|s]/);

      if (!key || !value) {
        return 0;
      }

      const piece = pieces.find((p) => p.label === key[0]);
      if (!piece) {
        return 0;
      }

      return Number(value) * piece.value;
    })
    .reduce((a: any, b: any) => a + b, 0);
};
