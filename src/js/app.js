const ipc = require('electron').ipcRenderer;
const mtg = require('mtgsdk');
const handlebars = require('handlebars');

let rowTemplate = null;
let search = null;

handlebars.registerHelper('mtg', (text, wh) => {
  if (!text) return '';
  let t = text.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');

  t = t.replace(/\{([0-9A-Z]\/?[0-9A-Z]?)\}/g, (all, g1) => {
    const imageName = g1.toLowerCase().replace('/', '');
    return `<img src="images/mana/mana-${imageName}.svg"
      width="${wh}" height="${wh}" class="mana-img">`;
  });

  return new handlebars.SafeString(t);
});

function setLoading(loading) {
  const img = document.getElementById('loading-img');
  if (loading) {
    img.style.display = 'block';
  } else {
    img.style.display = 'none';
  }
}

function performSearch(keywords) {
  const cardList = document.getElementById('cardlist');
  search = document.getElementById('search-txt');
  cardList.innerHTML = '';
  setLoading(true);

  mtg.card.where({ name: keywords }).then((cards) => {
    setLoading(false);
    console.log( // eslint-disable-line no-console
      `Found ${cards.length} cards...`);

    cards.forEach((c, i) => {
      console.log(c); // eslint-disable-line no-console
      if (c.imageUrl) {
        cardList.innerHTML += rowTemplate({
          card: c,
          index: i,
        });
        let img = document.getElementById(`card-img-${i}`);
        img.onload = () => {
          img = document.getElementById(`card-img-${i}`);
          img.className += ' card-img-loaded';
        };
        img.src = c.imageUrl;
      }
    });

    search.focus();
    search.select();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('search-txt');
  search.focus();

  window.addEventListener('click', () => {
    search.focus();
    search.select();
  });

  rowTemplate = handlebars.compile(
    document.getElementById('card-row-tmpl').innerHTML);

  search.addEventListener('keydown', (e) => {
    if (e.which === 13) {
      if (search.value === ':debug:') {
        ipc.send('mainwindow-debug');
      } else if (search.value === ':exit:') {
        ipc.send('application-exit');
      } else {
        performSearch(search.value);
      }
    } else if (e.which === 27) {
      ipc.send('mainwindow-hide');
    }
  });
});


// IPC Handlers

ipc.on('focus-search', () => {
  if (search != null) {
    search.focus();
    search.select();
  }
});

/* vim: set sts=2 ts=2 sw=2 : */
