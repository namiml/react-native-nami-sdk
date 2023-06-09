import {device, element, by, expect, waitFor} from 'detox';

const data = {
  campaign: 'lagoon',
};

describe('Configure Test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should have Campaings screen', async () => {
    await expect(element(by.id('campaigns_title'))).toBeVisible();
  });

  it('should unlabeled campaigns have default', async () => {
    await expect(
      element(
        by.id('default_campaigns').withAncestor(by.id('unlabeled_campaigns')),
      ),
    ).toBeVisible();
  });

  it('should interact with item at index', async () => {
    await element(by.id('campaigns_list')).scrollTo('top');
    await waitFor(element(by.text(`${data.campaign}`))).toBeVisible();
    await element(by.text(`${data.campaign}`)).tap();
  });
});
