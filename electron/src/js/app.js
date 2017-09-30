const ipc = require('electron').ipcRenderer;
const mtg = require('mtgsdk');
const handlebars = require('handlebars');

let rowTemplate;

// {{#nl2br}} replace returns with <br>
handlebars.registerHelper('nl2br', (text) => {
  if (!text) return '';

  const nl2br = text.replace(
      /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');
  return new handlebars.SafeString(nl2br);
});

function setLoading(loading) {
  const img = document.getElementById('loading-image');
  if (loading) {
    img.style.display = 'block';
  } else {
    img.style.display = 'none';
  }
}

function getManaCost(card) {
}

function performSearch(keywords) {
  const cardList = document.getElementById('cardlist-div');
  const search = document.getElementById('search');
  cardList.innerHTML = '';
  setLoading(true);

  mtg.card.where({ name: keywords }).then((cards) => {
    setLoading(false);
    console.log(`Found ${cards.length} cards...`);
    let html = '';

    cards.forEach((c, i) => {
      console.log(c);
      if (c.imageUrl) {
        html += rowTemplate({
          card: c,
          index: i,
          manaCost: getManaCost(c.manaCost),
        });
      }
    });

    cardList.innerHTML = html;
    search.focus();
    search.select();

    cards.forEach((c, i) => {
      if (c.imageUrl) {
        const img = document.getElementById(`card-image-${i}`);
        img.src = c.imageUrl;
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('search').focus();

  rowTemplate = handlebars.compile(
    document.getElementById('card-row-template').innerHTML);

  const search = document.getElementById('search');

  search.addEventListener('keydown', (e) => {
    if (e.which === 13) {
      performSearch(search.value);
    } else if (e.which === 27) {
      ipc.send('application-exit');
    }
  });
});


/* vim: set sts=2 ts=2 sw=2 : */
