export type PackageItem = {
  quantity: number;
  weightGrams: number;
  widthCm: number;
  heightCm: number;
  lengthCm: number;
};

export function buildShippingPackages(items: PackageItem[]) {
  const volumeLimit = 120_000;
  const packages: Array<{
    weight: number;
    width: number;
    height: number;
    length: number;
  }> = [];

  let current = {
    weight: 0,
    width: 0,
    height: 0,
    length: 0,
    volume: 0,
  };

  for (const item of items) {
    for (let index = 0; index < item.quantity; index += 1) {
      const volume = item.widthCm * item.heightCm * item.lengthCm;
      if (current.volume + volume > volumeLimit && current.volume > 0) {
        packages.push({
          weight: Number((current.weight / 1000).toFixed(3)),
          width: Math.max(current.width, 16),
          height: Math.max(current.height, 4),
          length: Math.max(current.length, 11),
        });
        current = { weight: 0, width: 0, height: 0, length: 0, volume: 0 };
      }

      current.weight += item.weightGrams;
      current.width = Math.max(current.width, item.widthCm);
      current.height += item.heightCm;
      current.length = Math.max(current.length, item.lengthCm);
      current.volume += volume;
    }
  }

  if (current.volume > 0) {
    packages.push({
      weight: Number((current.weight / 1000).toFixed(3)),
      width: Math.max(current.width, 16),
      height: Math.max(current.height, 4),
      length: Math.max(current.length, 11),
    });
  }

  return packages;
}
