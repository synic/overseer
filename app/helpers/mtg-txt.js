import Ember from 'ember';

export function mtgTxt([text, wh]) {
  if (!text) return '';
  let t = text.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');

  t = t.replace(/\{([0-9A-Z]\/?[0-9A-Z]?)\}/g, (all, g1) => {
    const imageName = g1.toLowerCase().replace('/', '');
    return `<img src="assets/images/mana/mana-${imageName}.svg"
      width="${wh}" height="${wh}" class="mana-img">`;
  });

  return Ember.String.htmlSafe(t);
}

export default Ember.Helper.helper(mtgTxt);
