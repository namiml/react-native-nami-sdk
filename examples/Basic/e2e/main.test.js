import {device, element, by, expect} from 'detox';

describe('Configure Test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should have Campaings screen', async () => {
    await expect(element(by.id('campaigns'))).toBeVisible();
  });

  it('should work refresh btn', async () => {
    await element(by.id('refresh')).tap();
    await expect(element(by.id('campaigns'))).toBeVisible();
  });

  // it('should have list of items', async () => {
  //   await expect(
  //     element(by.id('campaigns').withDescendant(by.id('campaigns_item3'))),
  //   ).toBeVisible();
  // });
});
