import { device, element, by, expect, waitFor, log } from 'detox';

const data = {
  campaign: 'puffin',
};

describe('Android: Configure Test', () => {
  beforeAll(async () => {
    await device.launchApp();
    await device.reloadReactNative();
  });
  afterAll(async () => {
    await device.launchApp({
      newInstance: true,
    });
  });

  // workaround to load data for android,
  // we can try to disable sync (!dangerous way!)
  it('Should load data', async () => {
    await expect(element(by.id('refresh_campaigns'))).toBeVisible();
    await element(by.id('refresh_campaigns')).tap();
    await element(by.id('refresh_campaigns')).tap();
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await element(by.id('refresh_campaigns')).tap();
    await element(by.id('refresh_campaigns')).tap();
    await new Promise((resolve) => setTimeout(resolve, 10000));
  });

  it('Should load data #2', async () => {
    await expect(element(by.id('refresh_campaigns'))).toBeVisible();
    await element(by.id('refresh_campaigns')).tap();
    await element(by.id('refresh_campaigns')).tap();
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await element(by.id('refresh_campaigns')).tap();
    await element(by.id('refresh_campaigns')).tap();
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await element(by.id('refresh_campaigns')).tap();
  });
});

describe('Android: Campaign tests after setup', () => {
  beforeAll(async () => {
    await device.launchApp();
    await device.reloadReactNative();
  });
  afterAll(async () => {
    await device.launchApp({
      newInstance: true,
    });
  });

  it('Should have Campaigns screen', async () => {
    await expect(element(by.id('campaigns_title'))).toBeVisible();
  });

  it('Should unlabeled campaigns have default', async () => {
    await expect(
      element(
        by.id('default_campaigns').withAncestor(by.id('unlabeled_campaigns')),
      ),
    ).toBeVisible();
  });

  it('Should interact with item Campaigns', async () => {
    await expect(element(by.id('campaigns_modal_action'))).toHaveText(
      'INITIAL',
    );
    await expect(element(by.id('refresh_campaigns'))).toBeVisible();
    await expect(element(by.id('refresh_status_text'))).toBeVisible();
    await waitFor(element(by.id('refresh_status_text')))
      .toHaveText('Refreshed: false')
      .withTimeout(10000);

    await element(by.id('refresh_campaigns')).tap();
    await waitFor(element(by.id('refresh_status_text')))
      .toHaveText('Refreshed: true')
      .withTimeout(10000);

    await element(by.id('campaigns_list')).scrollTo('top');
    await waitFor(element(by.text(`${data.campaign}`))).toBeVisible();

    // need to find a way how to handle native paywall action
    if (device.getPlatform() === 'ios') {
      await element(by.text(`${data.campaign}`)).tap();
      // Comment if on local machine;
      await expect(element(by.id('campaigns_modal_action'))).toHaveText(
        'SHOW_PAYWALL',
      );
    }
  });
});

describe('Android: Second part of campaigns tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('Should have Campaigns screen', async () => {
    await expect(element(by.id('campaigns_title'))).toBeVisible();
  });

  it('Should interact with item Campaigns #2', async () => {
    await expect(element(by.id('refresh_campaigns'))).toBeVisible();
    await element(by.id('refresh_campaigns')).tap();

    await waitFor(element(by.id(`list_item_view_${data.campaign}`)))
      .toBeVisible()
      .withTimeout(5000);
    const campaignItem = await element(
      by.id(`list_item_${data.campaign}`),
    ).getAttributes();

    const jsonString =
      device.getPlatform() === 'android'
        ? campaignItem.label
        : campaignItem.value;
    const campaignObj = JSON.parse(jsonString);
    campaignObj.hasOwnProperty('rule');
    if (!campaignObj.hasOwnProperty('rule')) {
      log.error(
        { err: new Error('campaignObj rule') },
        'campaignObj do not have rule',
      );
    }
    if (!campaignObj.hasOwnProperty('id')) {
      log.error(
        { err: new Error('campaignObj id') },
        'campaignObj do not have id',
      );
    }
    if (!campaignObj.hasOwnProperty('paywall')) {
      log.error(
        { err: new Error('campaignObj paywall') },
        'campaignObj do not have paywall',
      );
    }
    if (!campaignObj.hasOwnProperty('type')) {
      log.error(
        { err: new Error('campaignObj type') },
        'campaignObj do not have type',
      );
    }
    if (!campaignObj.hasOwnProperty('segment')) {
      log.error(
        { err: new Error('campaignObj segment') },
        'campaignObj do not have segment',
      );
    }
    if (!campaignObj.hasOwnProperty('value')) {
      log.error(
        { err: new Error('campaignObj value') },
        'campaignObj do not have value',
      );
    }
  });
});

describe('Android: Profile and Entitlements screen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('Should have Campaigns screen', async () => {
    await expect(element(by.id('campaigns_title'))).toBeVisible();
  });

  it('Should navigate to the Profile tab screen', async () => {
    await expect(element(by.id('campaign_screen'))).toBeVisible();
    await expect(element(by.id('profile_screen'))).toBeVisible();
    await expect(element(by.id('entitlements_screen'))).toBeVisible();

    await element(by.id('profile_screen')).tap();
    await expect(element(by.id('profile_title'))).toBeVisible();
  });

  it('Should Profile screen have data', async () => {
    await expect(element(by.id('campaign_screen'))).toBeVisible();
    await expect(element(by.id('profile_screen'))).toBeVisible();
    await expect(element(by.id('entitlements_screen'))).toBeVisible();

    await expect(element(by.id('profile_title'))).toBeVisible();

    await element(by.id('profile_screen')).tap();
    await expect(element(by.id('profile_title'))).toBeVisible();
    await expect(element(by.id('login_btn_text'))).toHaveText('Login');
    await expect(element(by.id('user_id'))).toHaveText('Device Id');

    await expect(element(by.text('In Trial Period'))).toExist();
    await expect(element(by.text('In Intro Offer Period'))).toExist();
    await expect(element(by.text('Has Cancelled'))).toExist();
    await expect(element(by.text('Former Subscriber'))).toExist();
    await expect(element(by.text('In Grace Period'))).toExist();
    await expect(element(by.text('In Account Hold'))).toExist();
    await expect(element(by.text('In Pause'))).toExist();
  });

  it('Should Login && Logout work', async () => {
    await expect(element(by.id('login_btn_text'))).toHaveText('Login');
    await element(by.id('login_btn')).tap();

    await waitFor(element(by.id('login_btn_text')))
      .toHaveText('Logout')
      .withTimeout(5000);

    await expect(element(by.id('user_id'))).toHaveText('Customer Id');

    await element(by.id('login_btn')).tap();

    await waitFor(element(by.id('login_btn_text')))
      .toHaveText('Login')
      .withTimeout(5000);

    await expect(element(by.id('user_id'))).toHaveText('Device Id');
  });

  it('Should navigate to the Entitlements tab screen', async () => {
    await expect(element(by.id('campaign_screen'))).toBeVisible();
    await expect(element(by.id('profile_screen'))).toBeVisible();
    await expect(element(by.id('entitlements_screen'))).toBeVisible();

    await element(by.id('entitlements_screen')).tap();
    await expect(element(by.id('entitlements_title'))).toBeVisible();
  });

  it('Should Entitlements  screen have data', async () => {
    await expect(element(by.id('entitlements_title'))).toBeVisible();
    await expect(element(by.id('active_entitlement'))).toBeVisible();
    await expect(element(by.id('refresh_entitlements'))).toExist();

    await expect(element(by.id('refresh_entitlements'))).toBeVisible();
    await element(by.id('refresh_entitlements')).tap();
    await expect(element(by.id('refresh_entitlements'))).toExist();
  });
});

describe('Android: Customer Manager screen Test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('Should navigate to the Customer Manager tab screen', async () => {
    await expect(element(by.id('campaign_screen'))).toBeVisible();
    await expect(element(by.id('profile_screen'))).toBeVisible();
    await expect(element(by.id('entitlements_screen'))).toBeVisible();
    await expect(element(by.id('customer_manager_screen'))).toBeVisible();

    await element(by.id('customer_manager_screen')).tap();
    await expect(element(by.id('customer_manager_title'))).toBeVisible();
  });

  it('Should Customer Manager screen have data', async () => {
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
