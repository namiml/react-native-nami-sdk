import { device, element, by, expect, waitFor } from 'detox';

const data = {
  campaign: 'aquarius',
};

// Will help to debug text statuses //
async function logElementText(elementId) {
  try {
    const text = await element(by.id(elementId)).getAttributes();
    console.log(`Text of ${elementId}: `, text);
  } catch (error) {
    console.error(`Error getting text of ${elementId}: `, error);
  }
}

describe('iOS: Placement tests setup', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await device.reloadReactNative();
  });
  afterAll(async () => {
    await device.launchApp({
      newInstance: true,
    });
  });

  it('Should have Placement screen', async () => {
    await expect(element(by.id('campaigns_title'))).toBeVisible();
  });

  it('Should interact with item Campaigns', async () => {
    await expect(element(by.id('campaigns_modal_action'))).toHaveText(
      'INITIAL',
    );
    await expect(element(by.id('refresh_campaigns'))).toBeVisible();
    await expect(element(by.id('refresh_status_text'))).toBeVisible();
    await logElementText('refresh_status_text');
    await waitFor(element(by.id('refresh_status_text')))
      .toHaveText('Refreshed: false')
      .withTimeout(10000);
    await element(by.id('refresh_campaigns')).tap();
    await waitFor(element(by.id('refresh_status_text')))
      .toHaveText('Refreshed: true')
      .withTimeout(10000);

    await element(by.id('campaigns_list')).scrollTo('top');
    await waitFor(element(by.text(`${data.campaign}`))).toBeVisible();

    await element(by.text(`${data.campaign}`)).tap();
    // Comment if on local machine;
    await waitFor(element(by.id('campaigns_modal_action')))
      .toHaveText('SHOW_PAYWALL')
      .withTimeout(10000);
  });
});

describe('iOS: Profile and Entitlements screens Test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('Should have Campaigns screen', async () => {
    await expect(element(by.id('campaigns_title'))).toBeVisible();
  });

  it('Should navigate to the Profile tab screen', async () => {
    await expect(element(by.id('campaign_screen'))).toBeVisible();
    await element(by.id('profile_tab')).tap();
    await expect(element(by.id('profile_title'))).toBeVisible();
  });

  it('Should Profile screen have data', async () => {
    await expect(element(by.id('profile_screen'))).toBeVisible();
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
    await expect(element(by.id('profile_screen'))).toBeVisible();
    await element(by.id('entitlements_tab')).tap();
    await expect(element(by.id('entitlements_screen'))).toBeVisible();
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

describe('iOS: Customer Manager screen Test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should navigate to the Customer Manager tab screen', async () => {
    await expect(element(by.id('campaign_tab'))).toBeVisible();
    await expect(element(by.id('profile_tab'))).toBeVisible();
    await expect(element(by.id('entitlements_tab'))).toBeVisible();
    await expect(element(by.id('customer_manager_tab'))).toBeVisible();

    await element(by.id('customer_manager_tab')).tap();
    await expect(element(by.id('customer_manager_screen'))).toBeVisible();
  });

  it('should Customer Manager screen have data', async () => {
    await expect(element(by.id('campaign_tab'))).toBeVisible();
    await expect(element(by.id('profile_tab'))).toBeVisible();
    await expect(element(by.id('entitlements_tab'))).toBeVisible();
    await expect(element(by.id('customer_manager_tab'))).toBeVisible();

    await expect(element(by.id('customer_manager_title'))).toBeVisible();
    await expect(element(by.id('send_btn'))).toBeVisible();
    await element(by.id('send_btn')).tap();
    await expect(element(by.id('customer_attribute_text'))).toHaveText('value1');
    await expect(element(by.id('clear_attribute_btn'))).toBeVisible();
    await element(by.id('clear_attribute_btn')).tap();
    await expect(element(by.id('customer_attribute_text'))).toHaveText('');
  });
});
