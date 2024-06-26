const express = require('express');
const { getGmailAuthUrl, getGmailToken } = require('./gmailAuth');
const { getOutlookAuthUrl, getOutlookToken } = require('./outlookAuth');
const { setupImapConnectionForGmail, setupImapConnectionForOutlook } = require('./mailHandler');
const { scheduleEmailFetch } = require('./mqHandler');
const app = express();

app.get('/auth/gmail', (req, res) => {
  const url = getGmailAuthUrl();
  console.log('url', url);
  res.redirect(url);
});

app.get('/auth/outlook', (req, res) => {
  const url = getOutlookAuthUrl();
  res.redirect(url);
});

app.get('/oauth2callback/gmail', async (req,res) => {
  const code =  req.query.code;
  console.log("code",code);
  const tokens = await getGmailToken(code);
  console.log("tokens",tokens);
  const imap = setupImapConnectionForGmail('925sanjeev@gmail.com', tokens);
  scheduleEmailFetch(imap);
  res.send('Gmail connected and fetching emails.');
});

app.get('/oauth2callback/outlook', async (req, res) => {
  const code = req.query.code;
  console.log("code",code);
  const tokens = await getOutlookToken(code);
  console.log("tokens",tokens);
  const imap = setupImapConnectionForOutlook('your-email@outlook.com', tokens);
  scheduleEmailFetch(imap);
  res.send('Outlook connected and fetching emails.');
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
