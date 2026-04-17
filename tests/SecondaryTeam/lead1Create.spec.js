const {test, expect} = require('@playwright/test');
const { PrimaryTeamLoginPage, PrimaryTeamLogin, PrimaryTeamLeadCreate } = require('../helpers/helper-associate');
const { envConfig } = require('../config/env');
const { aBaseURL, aUsername, aPassword} = envConfig;

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

test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1250, height: 720 });
  });

test.describe('Add Lead as Primary Team', () => {

    test('Login as primary team and Create Lead', async ({ page }) => {
        await PrimaryTeamLoginPage(page, aBaseURL);
        await PrimaryTeamLogin(page, aUsername, aPassword);
        await expect(page).not.toHaveURL(aBaseURL);

        const firstName = getRandomName();
        const lastName = getRandomName();
        const phoneNumber = getUniquePhoneNumber();
        const email = getUniqueYopmailEmail();

        await PrimaryTeamLeadCreate(page, firstName, lastName, phoneNumber, email);

        await expect(page.getByText(`${firstName} ${lastName}`)).toBeVisible();
        await expect(page.locator('tbody')).toContainText(email);
        await expect(page.locator('tbody')).toContainText(`+91-${phoneNumber}`);
        await expect(page.locator('tbody')).toContainText('Personal');
        await expect(page.locator('tbody')).toContainText('Sale');
        
    });


});