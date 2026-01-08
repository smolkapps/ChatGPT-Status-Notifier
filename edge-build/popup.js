// When the options button is clicked, open the options page
document.querySelector('#optionsButton').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

// When the popup page is loaded, populate the checkbox with the current setting
chrome.storage.local.get('playSound').then((result) => {
  document.querySelector('#soundCheckbox').checked = result.playSound;
});

// Save the setting whenever the checkbox is toggled
document.querySelector('#soundCheckbox').addEventListener('change', (event) => {
  chrome.storage.local.set({ playSound: event.target.checked });
});
