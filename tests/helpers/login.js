const associateLoginPage = async (page, aBaseURL) => {
  await page.goto(aBaseURL);
};

const associateLogin = async (page, aUsername, aPassword) => {
  await page.fill('#email', aUsername);
  await page.fill('#password', aPassword);
  await page.click('button[type="submit"]');
};

module.exports = {
  associateLoginPage,
  associateLogin,
};
