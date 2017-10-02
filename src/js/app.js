const ipc = require('electron').ipcRenderer;
const mtg = require('mtgsdk');
const handlebars = require('handlebars');

let rowTemplate = null;

handlebars.registerHelper('mtg', (text, wh) => {
  if (!text) return '';
  let t = text.replace(
      /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');

  t = t.replace(/\{([0-9A-Z]\/?[0-9A-Z]?)\}/g, (all, g1) => {
    const imageName = g1.toLowerCase().replace('/', '');
    return `<img src="images/mana-${imageName}.jpg"
      width="${wh}" height="${wh}">`;
  });

  return new handlebars.SafeString(t);
});

function setLoading(loading) {
  const img = document.getElementById('loading-image');
  if (loading) {
    img.style.display = 'block';
  } else {
    img.style.display = 'none';
  }
}

function performSearch(keywords) {
  const cardList = document.getElementById('cardlist-div');
  const search = document.getElementById('search');
  cardList.innerHTML = '';
  setLoading(true);

  mtg.card.where({ name: keywords }).then((cards) => {
    setLoading(false);
    console.log(`Found ${cards.length} cards...`);

    cards.forEach((c, i) => {
      console.log(c);
      if (c.imageUrl) {
        cardList.innerHTML += rowTemplate({
          card: c,
          index: i,
        });
        const img = document.getElementById(`card-image-${i}`);
        img.src = c.imageUrl;
      }
    });

    search.focus();
    search.select();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('search');
  search.focus();

  window.addEventListener('click', () => {
    search.focus();
    search.select();
  });

  rowTemplate = handlebars.compile(
    document.getElementById('card-row-template').innerHTML);

  search.addEventListener('keydown', (e) => {
    if (e.which === 13) {
      performSearch(search.value);
    } else if (e.which === 27) {
      ipc.send('mainwindow-hide');
    }
  });
});


/* vim: set sts=2 ts=2 sw=2 : */
