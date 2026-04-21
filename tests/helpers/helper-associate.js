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

// Utility functions for test data generation
const getUniquePhoneNumber = () => {
  const firstDigits = ['6', '7', '8', '9'];
  let phone = firstDigits[Math.floor(Math.random() * firstDigits.length)];
  for (let i = 0; i < 9; i++) {
    phone += Math.floor(Math.random() * 10);
  }
  return phone;
};

const getRandomName = () => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const name = Array.from({ length: 5 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const getUniqueYopmailEmail = () => {
  const randomString = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now().toString().slice(-6);
  return `test${randomString}${timestamp}@yopmail.com`;
};

// Fill lead form without creating
const FillLeadForm = async (page, firstName, lastName, phoneNumber, email) => {
  await page.getByRole('combobox').filter({ hasText: 'Mr.' }).click();
  await page.getByRole('option', { name: 'Mr', exact: true }).click();
  await page.getByRole('textbox', { name: 'First name *' }).fill(firstName);
  await page.getByRole('textbox', { name: 'Last name' }).fill(lastName);
  await page.getByRole('textbox', { name: 'Phone number' }).fill(phoneNumber);
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('combobox').nth(1).click();
  await page.getByRole('option', { name: 'Personal' }).click();
  await page.locator('div').filter({ hasText: /^Property type\*SelectResidentialCommercial$/ }).getByRole('combobox').click();
  await page.getByRole('option', { name: 'Residential' }).click();
  await page.getByRole('textbox', { name: 'Context about how the lead' }).fill('xyz');
  await page.locator('div').filter({ hasText: /^Sub typeSelectApartmentsBungalowsWeekend Homes$/ }).getByRole('combobox').click();
  await page.getByRole('option', { name: 'Apartments' }).click();
  await page.getByRole('combobox').filter({ hasText: 'Select' }).click();
  await page.getByRole('option', { name: 'Sale' }).click();
  await page.getByRole('textbox', { name: '1,00,000' }).fill('1000');
  await page.getByRole('textbox', { name: '10,00,000' }).fill('10000000');
  await page.getByRole('button', { name: 'Select' }).click();
  await page.getByRole('textbox', { name: 'Search localities' }).fill('gota');
  await page.locator('span.flex-1:has-text("Gota")').click();
};

const PrimaryTeamLeadCreate = async (page, firstName, lastName, phoneNumber, email) => {
  await page.getByRole('button', { name: 'Leads Leads' }).click();
  await page.getByRole('button', { name: 'Add Lead' }).click();
  await FillLeadForm(page, firstName, lastName, phoneNumber, email);
  await page.getByRole('button', { name: 'Create Lead' }).click();
};

module.exports = {
  PrimaryTeamLeadCreate,
  PrimaryTeamLoginPage,
  PrimaryTeamLogin,
  FillLeadForm,
  getRandomName,
  getUniquePhoneNumber,
  getUniqueYopmailEmail,
  gotoLogin,
  login
};
