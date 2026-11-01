// When the options page is loaded, populate the checkbox with the current setting
chrome.storage.local.get('playSound').then((result) => {
  document.querySelector('#playSoundCheckbox').checked = result.playSound;
});

// Save the setting whenever the checkbox is toggled
document.querySelector('#playSoundCheckbox').addEventListener('change', (event) => {
  chrome.storage.local.set({ playSound: event.target.checked });
});
