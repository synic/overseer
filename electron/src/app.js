const ipc = require('electron').ipcRenderer;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('search').focus();

  const search = document.getElementById('search');

  search.addEventListener('keypress', (e) => {
    const charCode = e.which;
    if (charCode === 13) {
      ipc.send('search-begin', search.value);
    }
  });
});

ipc.on('search-complete', (event, cards) => {
  console.log(cards);
});

/* vim: set sts=2 ts=2 sw=2 : */
