import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';
import { XMLParser } from 'fast-xml-parser';
import appConfig from '@src/config';

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

function getCookies(domain, callback) {
  chrome.cookies.getAll({ domain: domain }, function (cookies) {
    callback(cookies);
  });
}

function extractLoggedValue(str) {
  const match = str.match(/logged '([^']*)'/);
  if (match) {
    return convertToHours(match[1]);
  }
  return null;
}

function isDateToday(dateString) {
  const today = new Date();
  const dateToCheck = new Date(dateString);

  return (
    today.getFullYear() === dateToCheck.getFullYear() &&
    today.getMonth() === dateToCheck.getMonth() &&
    today.getDate() === dateToCheck.getDate()
  );
}

function convertToHours(timeString) {
  if (timeString.includes('d')) {
    const splitChunks = timeString.split('d');
    return Number(splitChunks[0]) * 8;
  }
  return Number(timeString.split('h')[0]);
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tab.url && tab.url.includes('fhjira.churchofjesuschrist.org')) {
    // Make GET request to Jira here
    console.log('this is jira');
    getCookies('fhjira.churchofjesuschrist.org', function (cookies) {
      const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

      fetch(
        `https://${appConfig.jiraUrl}/plugins/servlet/streams?maxResults=10&relativeLinks=true&streams=user+IS+${appConfig.username}`,
        {
          method: 'GET',
          headers: {
            Cookie: cookieString,
          },
          credentials: 'include', // This is important for including cookies in requests
        },
      )
        .then(response => response.text())
        .then(data => {
          const parser = new XMLParser();
          // Parse the string into an XML Document
          const xmlDoc = parser.parse(data);

          console.log({ xmlDoc });

          let hoursLogged = 0;

          xmlDoc.feed.entry.forEach(entry => {
            if (isDateToday(entry.updated)) {
              if (entry.title.toLowerCase().includes('logged')) {
                console.log(extractLoggedValue(entry.title.toLowerCase()));
                hoursLogged = hoursLogged + extractLoggedValue(entry.title.toLowerCase());
              }
              if (entry.content?.toLowerCase().includes('logged')) {
                console.log(extractLoggedValue(entry.content.toLowerCase()));
                hoursLogged = hoursLogged + extractLoggedValue(entry.content.toLowerCase());
              }
            }
          });
          // send hoursLogged to the content script via message
          chrome.tabs.sendMessage(tabId, { hoursLogged });
        })
        .catch(error => console.error('Error:', error));
    });
  }
});

console.log('background loaded');
