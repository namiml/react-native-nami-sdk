import {device, element, by, expect, waitFor, log} from 'detox';

const data = {
  campaign: 'lagoon',
};

describe('Configure Test', () => {
  beforeAll(async () => {
    await device.launchApp();
    await device.reloadReactNative();
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
    await expect(element(by.id('refresh_campaigns'))).toBeVisible();
    await expect(element(by.id('refresh_status_text'))).toBeVisible();
    await expect(element(by.id('refresh_status_text'))).toHaveText(
      'Refreshed: false',
    );
    await element(by.id('refresh_campaigns')).tap();
    await expect(element(by.id('refresh_status_text'))).toHaveText(
      'Refreshed: true',
    );

    await element(by.id('campaigns_list')).scrollTo('top');
    await waitFor(element(by.text(`${data.campaign}`))).toBeVisible();
    await element(by.text(`${data.campaign}`)).tap();
    // TODO: Issue with SHOW_PAYWALL
    // await expect(element(by.id('campaigns_modal_action'))).toHaveText(
    //   'SHOW_PAYWALL',
    // );
  });
});

describe('Second part of campaigns tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should have Campaings screen', async () => {
    await expect(element(by.id('campaigns_title'))).toBeVisible();
  });

  it('should interact with item Campaigns #2', async () => {
    await expect(element(by.id('refresh_campaigns'))).toBeVisible();
    await element(by.id('refresh_campaigns')).tap();

    await waitFor(element(by.id(`list_item_${data.campaign}`)))
      .toBeVisible()
      .withTimeout(5000);
    const campaignItem = await element(
      by.id(`list_item_${data.campaign}`),
    ).getAttributes();
    const campaignObj = JSON.parse(campaignItem.value);
    campaignObj.hasOwnProperty('rule');
    if (!campaignObj.hasOwnProperty('rule')) {
      log.error(
        {err: new Error('campaignObj rule')},
        'campaignObj do not have rule',
      );
    }
    if (!campaignObj.hasOwnProperty('id')) {
      log.error(
        {err: new Error('campaignObj id')},
        'campaignObj do not have id',
      );
    }
    if (!campaignObj.hasOwnProperty('paywall')) {
      log.error(
        {err: new Error('campaignObj paywall')},
        'campaignObj do not have paywall',
      );
    }
    if (!campaignObj.hasOwnProperty('type')) {
      log.error(
        {err: new Error('campaignObj type')},
        'campaignObj do not have type',
      );
    }
    if (!campaignObj.hasOwnProperty('segment')) {
      log.error(
        {err: new Error('campaignObj segment')},
        'campaignObj do not have segment',
      );
    }
    if (!campaignObj.hasOwnProperty('value')) {
      log.error(
        {err: new Error('campaignObj value')},
        'campaignObj do not have value',
      );
    }
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

    await waitFor(element(by.id('login_btn')))
      .toHaveText('Logout')
      .withTimeout(2000);

    await expect(element(by.id('user_id'))).toHaveText('Customer Id');

    await element(by.id('login_btn')).tap();

    await waitFor(element(by.id('login_btn')))
      .toHaveText('Login')
      .withTimeout(2000);

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

describe('Customer Manager screen Test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should navigate to the Customer Manager tab screen', async () => {
    await expect(element(by.id('campaign_screen'))).toBeVisible();
    await expect(element(by.id('profile_screen'))).toBeVisible();
    await expect(element(by.id('entitlements_screen'))).toBeVisible();
    await expect(element(by.id('customer_manager_screen'))).toBeVisible();

    await element(by.id('customer_manager_screen')).tap();
    await expect(element(by.id('customer_manager_title'))).toBeVisible();
  });

  it('should Customer Manager screen have data', async () => {
    await expect(element(by.id('campaign_screen'))).toBeVisible();
    await expect(element(by.id('profile_screen'))).toBeVisible();
    await expect(element(by.id('entitlements_screen'))).toBeVisible();
    await expect(element(by.id('customer_manager_screen'))).toBeVisible();

    await expect(element(by.id('customer_manager_title'))).toBeVisible();
    await expect(element(by.id('customer_attribute_text'))).toExist();
    await element(by.id('customer_attribute_input')).typeText('Test Attribute');
    await expect(element(by.id('send_btn'))).toBeVisible();
    await element(by.id('send_btn')).tap();
    await expect(element(by.id('customer_attribute_text'))).toHaveText(
      'Test Attribute',
    );

    await expect(element(by.id('clear_attribute_btn'))).toBeVisible();
    await element(by.id('clear_attribute_btn')).tap();
    await expect(element(by.id('customer_attribute_text'))).toHaveText('');
  });
});
