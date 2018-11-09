export class ImageAssets {
  public static get ITEM_ASSETS(): IImageAsset[] {
    const assets = [];

    [
      "Angel's Tears",
      'Cyanide',
      'Dark Magic',
      'Dirty Water',
      "Dragon's Eggs",
      'Eggs',
      'Fiji Water',
      'Fish Eggs',
      'Fountain of Youth Water',
      'Garlic',
      'Golden Eggs',
      'Mystery Eggs',
      'Mystery Water',
      'Onions',
      'Organic Eggs',
      'Placeholder',
      'Rainbows',
      'Salt',
      'Sugar',
      'Water',
    ].forEach((item) => {
      const key =
        'itm-' +
        item
          .trim()
          .replace("'", '')
          .replace(' ', '-');

      assets.push({ key, path: `/assets/items/${item}.png` });
    });

    return assets;
  }

  public static get IMAGE_ASSETS(): IImageAsset[] {
    return [
      { key: 'bread', path: '/assets/bread.png' },
      { key: 'tc-bread-hunt', path: '/assets/tc/bread-hunt.png' },
      { key: 'ui-button', path: '/assets/ui/buttonLong_brown.png' },
      {
        key: 'ui-button-pressed',
        path: '/assets/ui/buttonLong_brown_pressed.png',
      },
      ...this.ITEM_ASSETS,
    ];
  }
}

export interface IImageAsset {
  key: string;
  path: string;
}
