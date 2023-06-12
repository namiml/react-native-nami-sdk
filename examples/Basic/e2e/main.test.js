import {device, element, by, expect, waitFor} from 'detox';

const data = {
  campaign: 'lagoon',
};

describe('Configure Test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  afterAll(async () => {
    await device.launchApp({newInstance: true});
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

  it('should interact with item Campaigns', async () => {
    await expect(element(by.id('campaigns_modal_action'))).toHaveText(
      'INITIAL',
    );
    await element(by.id('campaigns_list')).scrollTo('top');
    await waitFor(element(by.text(`${data.campaign}`))).toBeVisible();
    await element(by.text(`${data.campaign}`)).tap();
    await expect(element(by.id('campaigns_modal_action'))).toHaveText(
      'SHOW_PAYWALL',
    );
  });
});

describe('Profile and Entitlements screens Test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should have Campaings screen', async () => {
    await expect(element(by.id('campaigns_title'))).toBeVisible();
  });

  it('should navigate to the Profile tab screen', async () => {
    await expect(element(by.id('campaign_screen'))).toBeVisible();
    await expect(element(by.id('profile_screen'))).toBeVisible();
    await expect(element(by.id('entitlements_screen'))).toBeVisible();

    await element(by.id('profile_screen')).tap();
    await expect(element(by.id('profile_title'))).toBeVisible();
  });

  it('should Profile screen have data', async () => {
    await expect(element(by.id('campaign_screen'))).toBeVisible();
    await expect(element(by.id('profile_screen'))).toBeVisible();
    await expect(element(by.id('entitlements_screen'))).toBeVisible();

    await expect(element(by.id('profile_title'))).toBeVisible();

    await element(by.id('profile_screen')).tap();
    await expect(element(by.id('profile_title'))).toBeVisible();
    await expect(element(by.id('login_btn'))).toHaveText('Login');
    await expect(element(by.id('user_id'))).toHaveText('Device Id');

    await expect(element(by.text('In Trial Period'))).toExist();
    await expect(element(by.text('In Intro Offer Period'))).toExist();
    await expect(element(by.text('Has Cancelled'))).toExist();
    await expect(element(by.text('Former Subscriber'))).toExist();
    await expect(element(by.text('In Grace Period'))).toExist();
    await expect(element(by.text('In Account Hold'))).toExist();
    await expect(element(by.text('In Pause'))).toExist();
  });

  it('should Login/Logout work', async () => {
    await expect(element(by.id('login_btn'))).toHaveText('Login');
    await element(by.id('login_btn')).tap();

    await expect(element(by.id('login_btn'))).toHaveText('Logout');
    await expect(element(by.id('user_id'))).toHaveText('External Id');

    await element(by.id('login_btn')).tap();

    await expect(element(by.id('login_btn'))).toHaveText('Login');
    await expect(element(by.id('user_id'))).toHaveText('Device Id');
  });

  it('should navigate to the Entitlements tab screen', async () => {
    await expect(element(by.id('campaign_screen'))).toBeVisible();
    await expect(element(by.id('profile_screen'))).toBeVisible();
    await expect(element(by.id('entitlements_screen'))).toBeVisible();

    await element(by.id('entitlements_screen')).tap();
    await expect(element(by.id('entitlements_title'))).toBeVisible();
  });

  it('should Entitlements  screen have data', async () => {
    await expect(element(by.id('entitlements_title'))).toBeVisible();
    await expect(element(by.id('active_entitlement'))).toBeVisible();
    await expect(element(by.id('refresh_entitlements'))).toExist();

    await expect(element(by.id('refresh_entitlements'))).toBeVisible();
    await element(by.id('refresh_entitlements')).tap();
    await expect(element(by.id('refresh_entitlements'))).toExist();
  });
});
