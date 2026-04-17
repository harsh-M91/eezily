const {test, expect} = require('@playwright/test');
const { PrimaryTeamLoginPage, PrimaryTeamLogin} = require('../helpers/helper-associate');
const { envConfig } = require('../config/env');
const { aBaseURL, aUsername, aPassword} = envConfig;

test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1250, height: 720 });
  });

test.describe('Login Page Scenarios of secondary team', () => {

  test('Successful login', async ({ page }) => {
    await PrimaryTeamLoginPage(page, aBaseURL);
    await PrimaryTeamLogin(page, aUsername, aPassword);
    await expect(page).not.toHaveURL(aBaseURL);
    });

  test('Login with invalid username', async ({ page }) => {
    await PrimaryTeamLoginPage(page, aBaseURL);
    await PrimaryTeamLogin(page, "harshdave", aPassword);

    const validationMsg = await page.$eval('#email', el => el.validationMessage);
    expect(validationMsg).toBe("Please include an '@' in the email address. 'harshdave' is missing an '@'.");
    });

  test('Login with invalid password', async ({ page }) => {
    await PrimaryTeamLoginPage(page, aBaseURL);
    await PrimaryTeamLogin(page, aUsername, "Momentum@91");

    await expect(page.locator('.rounded-md.bg-red-50')).toHaveText("Invalid login credentials");
    });

  test('Login with empty username', async ({ page }) => {
    await PrimaryTeamLoginPage(page, aBaseURL);
    await PrimaryTeamLogin(page, '', aPassword);

    const validationMsg = await page.$eval('#email', el => el.validationMessage);
    expect(validationMsg).toBe('Please fill out this field.');
    });

  test('Login with empty password', async ({ page }) => {
    await PrimaryTeamLoginPage(page, aBaseURL);
    await PrimaryTeamLogin(page, aUsername, '');

    const validationMsg = await page.$eval('#password', el => el.validationMessage);
    expect(validationMsg).toBe('Please fill out this field.');
    });

  test('Login with empty username and password', async ({ page }) => {

    await PrimaryTeamLoginPage(page, aBaseURL);
    await PrimaryTeamLogin(page, '', '');

    const validationMsg = await page.$eval('#email', el => el.validationMessage);
    expect(validationMsg).toBe('Please fill out this field.');    
    });

  test.skip('Account disabled or not allowed', async ({ page }) => {

    await PrimaryTeamLoginPage(page, aBaseURL);
    await PrimaryTeamLogin(page, 'xyz@gmail.com', 'xyz@12345');
    //await expect(page.locator('.page-card-body')).toContainText('Please contact your administrator.');
    await expect(page.locator('.rounded-md.bg-red-50')).toHaveText("Invalid login credentials");
    });

  test.skip('User does not exist', async ({ page }) => {

    await PrimaryTeamLoginPage(page, aBaseURL);
    await PrimaryTeamLogin(page, 'abc@gmail.com', 'xyz@12345');
    //await expect(page.locator('.page-card-body')).toContainText('Please contact your administrator.');
    await expect(page.locator('.rounded-md.bg-red-50')).toHaveText("Invalid login credentials");
    });


});