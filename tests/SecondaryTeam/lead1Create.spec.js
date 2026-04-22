const {test, expect} = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { PrimaryTeamLoginPage, PrimaryTeamLogin, PrimaryTeamLeadCreate, FillLeadForm, getRandomName, getUniquePhoneNumber, getUniqueYopmailEmail } = require('../helpers/helper-associate');
const { envConfig } = require('../config/env');
const { aBaseURL, aUsername, aPassword} = envConfig;

// Only use storage state if auth.json exists
const authFile = 'auth.json';
if (fs.existsSync(authFile)) {
    test.use({ storageState: authFile });
}

test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1250, height: 720 });
});

const saveAuthState = async (page) => {
    await page.context().storageState({ path: 'auth.json' });
};

test.describe('Add Lead as Primary Team', () => {

    test('Login as primary team and Create Lead', async ({ page }) => {
        //Go To the login page
        await PrimaryTeamLoginPage(page, aBaseURL);
        //Login as primary team
        await PrimaryTeamLogin(page, aUsername, aPassword);
        await expect(page.getByRole('button', { name: 'Leads Leads' })).toBeVisible();
        
        // Save authentication state after login
        await saveAuthState(page);

        const firstName = getRandomName();
        const lastName = getRandomName();
        const phoneNumber = getUniquePhoneNumber();
        const email = getUniqueYopmailEmail();

        await PrimaryTeamLeadCreate(page, firstName, lastName, phoneNumber, email);
        await expect(page.getByRole('status')).toContainText('Lead created successfully!');

        await expect(page.getByText(`${firstName} ${lastName}`)).toBeVisible();
        await expect(page.locator('tbody')).toContainText(email);
        await expect(page.locator('tbody')).toContainText(`+91-${phoneNumber}`);
        await expect(page.locator('tbody')).toContainText('Personal');
        await expect(page.locator('tbody')).toContainText('Sale');

        await expect(page.getByRole('button', { name: 'Contacts Contacts' })).toBeVisible();
        await page.getByRole('button', { name: 'Contacts Contacts' }).click();
        await expect(page.getByText(`Mr ${firstName} ${lastName}`)).toBeVisible();
        await expect(page.getByText(email)).toBeVisible();
        await expect(page.getByText(`+91-${phoneNumber}`)).toBeVisible();        
    });

    test('Should not create lead with duplicate phone number', async ({ page }) => {
        // Login (will use cached auth state from auth.json)
        await PrimaryTeamLoginPage(page, aBaseURL);

        // Create first lead
        const firstName1 = getRandomName();
        const lastName1 = getRandomName();
        const phoneNumber = getUniquePhoneNumber();
        const email1 = getUniqueYopmailEmail();

        await PrimaryTeamLeadCreate(page, firstName1, lastName1, phoneNumber, email1);
        await expect(page.getByRole('status')).toContainText('Lead created successfully!');
        await expect(page.getByText(`${firstName1} ${lastName1}`)).toBeVisible();
        await expect(page.locator('tbody')).toContainText(email1);
        await expect(page.locator('tbody')).toContainText(`+91-${phoneNumber}`);

        await expect(page.getByRole('button', { name: 'Contacts Contacts' })).toBeVisible();
        await page.getByRole('button', { name: 'Contacts Contacts' }).click();
        await expect(page.getByText(`Mr ${firstName1} ${lastName1}`)).toBeVisible();
        await expect(page.getByText(email1)).toBeVisible();
        await expect(page.getByText(`+91-${phoneNumber}`)).toBeVisible();

        // Try to create second lead with same phone number
        const firstName2 = getRandomName();
        const lastName2 = getRandomName();
        const email2 = getUniqueYopmailEmail();

        await page.getByRole('button', { name: 'Leads Leads' }).click();
        await page.getByRole('button', { name: 'Add Lead' }).click();
        await FillLeadForm(page, firstName2, lastName2, phoneNumber, email2);
        await page.getByRole('button', { name: 'Create Lead' }).click();

        // Verify error message for duplicate phone number
        await expect(page.getByLabel('Dialog')).toContainText('This phone number is already registered. Please use a different phone number.');
    });

    test('Should not create lead with duplicate email', async ({ page }) => {
        // //Go To the login page
        await PrimaryTeamLoginPage(page, aBaseURL);

        // Create first lead
        const firstName1 = getRandomName();
        const lastName1 = getRandomName();
        const phoneNumber1 = getUniquePhoneNumber();
        const email = getUniqueYopmailEmail();

        await PrimaryTeamLeadCreate(page, firstName1, lastName1, phoneNumber1, email);
        await expect(page.getByRole('status')).toContainText('Lead created successfully!');
        await expect(page.getByText(`${firstName1} ${lastName1}`)).toBeVisible();
        await expect(page.locator('tbody')).toContainText(email);
        await expect(page.locator('tbody')).toContainText(`+91-${phoneNumber1}`);

        await expect(page.getByRole('button', { name: 'Contacts Contacts' })).toBeVisible();
        await page.getByRole('button', { name: 'Contacts Contacts' }).click();
        await expect(page.getByText(`Mr ${firstName1} ${lastName1}`)).toBeVisible();
        await expect(page.getByText(email)).toBeVisible();
        await expect(page.getByText(`+91-${phoneNumber1}`)).toBeVisible();

        // Try to create second lead with same email
        const firstName2 = getRandomName();
        const lastName2 = getRandomName();
        const phoneNumber2 = getUniquePhoneNumber();

        await page.getByRole('button', { name: 'Leads Leads' }).click();
        await page.getByRole('button', { name: 'Add Lead' }).click();
        await FillLeadForm(page, firstName2, lastName2, phoneNumber2, email);
        await page.getByRole('button', { name: 'Create Lead' }).click();

        // Verify error message for duplicate email
        await expect(page.getByLabel('Dialog')).toContainText('A profile with this email already exists. Please use a different email address.');
    });

    test('Add another lead from same contact via name', async ({ page }) => {
        // //Go To the login page
        await PrimaryTeamLoginPage(page, aBaseURL);
    
        await page.getByRole('button', { name: 'Leads Leads' }).click();

        // Enter the same first name and check if the existing contact is visible in dropdown
        await page.getByRole('button', { name: 'Add Lead' }).click();
        await page.getByRole('textbox', { name: 'First name *' }).click();
        await page.getByRole('textbox', { name: 'First name *' }).fill('harsh');
        await expect(page.getByRole('button', { name: 'harsh dave @ 9090909090' })).toBeVisible();
        await page.getByRole('button', { name: 'harsh dave @ 9090909090' }).click();
        await expect(page.getByRole('textbox', { name: 'Last name' })).toBeDisabled();
        await expect(page.getByRole('textbox', { name: 'Phone number' })).toBeDisabled();
        await expect(page.getByRole('textbox', { name: 'Email' })).toBeDisabled();

        // Fill other details
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
        await page.locator('span.flex-1:has-text("Gota")').click();
        await page.getByRole('button', { name: 'Create Lead' }).click();
        await expect(page.getByRole('status')).toContainText('Lead created successfully!');
    });

    test('Add another lead from same contact via Phone-number', async ({ page }) => {
        // //Go To the login page
        await PrimaryTeamLoginPage(page, aBaseURL);
       
        await page.getByRole('button', { name: 'Leads Leads' }).click();

        // Enter the same number and check if the existing contact is visible in dropdown
        await page.getByRole('button', { name: 'Add Lead' }).click();
        await page.getByRole('textbox', { name: 'Phone number' }).fill('9090909090');
        await page.getByRole('button', { name: '@harsh dave' }).click();
        await page.getByRole('button', { name: '@harsh dave' }).click();
        await expect(page.getByRole('textbox', { name: 'Last name' })).toBeDisabled();
        await expect(page.getByRole('textbox', { name: 'First name *' })).toBeDisabled();
        await expect(page.getByRole('textbox', { name: 'Email' })).toBeDisabled();

        // Fill other details
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
        await page.locator('span.flex-1:has-text("Gota")').click();
        await page.getByRole('button', { name: 'Create Lead' }).click();
        await expect(page.getByRole('status')).toContainText('Lead created successfully!');
    });
});