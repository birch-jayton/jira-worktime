import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';

async function toggleTheme() {
  console.log('initial theme', await exampleThemeStorage.get());
  await exampleThemeStorage.toggle();
  console.log('toggled theme', await exampleThemeStorage.get());
}

void toggleTheme();

function updateHeaderText(hoursLogged) {
  const headerElement = document.querySelector('.aui-header-logo-text') as HTMLElement;

  if (headerElement) {
    headerElement.style.fontSize = '27px';
    headerElement.innerHTML = `${hoursLogged} hrs logged today`;
  } else {
    console.log('Element not found');
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('message from background', request.hoursLogged); // Handle the message
  updateHeaderText(request.hoursLogged);
  sendResponse({ response: 'Response from content script' });
});
