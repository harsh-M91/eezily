const gotoLogin = async (page, baseUrl) => {
  await page.goto(baseUrl);
};

const PrimaryTeamLoginPage = async (page, aBaseURL) => {
  await page.goto(aBaseURL);
};

const login = async (page, username, password) => {
  await page.fill('#login_email', username);
  await page.fill('#login_password', password);
  await page.click('button[type="submit"]');
};

const PrimaryTeamLogin = async (page, aUsername, aPassword) => {
  await page.fill('#email', aUsername);
  await page.fill('#password', aPassword);
  await page.click('button[type="submit"]');
  await page.waitForURL(/.*dashboard/);
};

const PrimaryTeamLeadCreate = async (page, firstName, lastName, phoneNumber, email) => {
  await expect(page.getByRole('button', { name: 'Leads Leads' })).toBeVisible();
  await page.getByRole('button', { name: 'Leads Leads' }).click();
  await page.getByRole('button', { name: 'Add Lead' }).click();
  await page.getByRole('combobox').filter({ hasText: 'Mr.' }).click();
  await page.getByRole('option', { name: 'Mr', exact: true }).click();
  await page.getByRole('textbox', { name: 'First name *' }).click();
  await page.getByRole('textbox', { name: 'First name *' }).fill(firstName);
  await page.getByRole('textbox', { name: 'Last name' }).click();
  await page.getByRole('textbox', { name: 'Last name' }).fill(lastName);
  await page.getByRole('textbox', { name: 'Phone number' }).click();
  await page.getByRole('textbox', { name: 'Phone number' }).fill(phoneNumber);
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('combobox').nth(1).click();
  await page.getByRole('option', { name: 'Personal' }).click();
  await page.locator('div').filter({ hasText: /^Property type\*SelectResidentialCommercial$/ }).getByRole('combobox').click();
  await page.getByRole('option', { name: 'Residential' }).click();
  await page.getByRole('textbox', { name: 'Context about how the lead' }).click();
  await page.getByRole('textbox', { name: 'Context about how the lead' }).fill('xyz');
  await page.locator('div').filter({ hasText: /^Sub typeSelectApartmentsBungalowsWeekend Homes$/ }).getByRole('combobox').click();
  await page.getByRole('option', { name: 'Apartments' }).click();
  await page.getByRole('combobox').filter({ hasText: 'Select' }).click();
  await page.getByRole('option', { name: 'Sale' }).click();
  await page.getByRole('textbox', { name: '1,00,000' }).click();
  await page.getByRole('textbox', { name: '1,00,000' }).fill('1000');
  await page.getByRole('textbox', { name: '10,00,000' }).click();
  await page.getByRole('textbox', { name: '10,00,000' }).fill('10000000');
  await page.getByRole('button', { name: 'Select' }).click();
  await page.getByRole('textbox', { name: 'Search localities' }).click();
  await page.getByRole('textbox', { name: 'Search localities' }).fill('gota');
  await page.locator('#radix-_r_1c_').getByRole('checkbox').click();
  await page.getByRole('button', { name: 'Create Lead' }).click();
};

module.exports = {
  PrimaryTeamLeadCreate,
  PrimaryTeamLoginPage,
  PrimaryTeamLogin,
  gotoLogin,
  login
};
