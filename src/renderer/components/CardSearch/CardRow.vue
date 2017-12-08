<template>
  <div class="card-row">
    <div class="card-image-container">
      <input type="hidden" :value="card.imageUrl" class="card-image-url">
      <img src="static/images/example_card.jpg"
           onerror="this.src='static/images/example_card.jpg';"
           ref="image"
           class="card-image"
           width="200"
           height="279"
          >
    </div>
    <div class="card-information">
      <div class="card-header">
        <div class="card-name">
          {{ card.name }}
        </div>
        <div
          class="card-mana-cost"
          v-html="$options.filters.mtg( card.manaCost, 17 )">
        </div>
      </div>
      <hr class="card-name-separator">
      <div class="card-type">
        {{ card.type }}
        <span v-if="card.power">
          {{ card.power }} / {{ card.toughness }}
        </span>
      </div>
      <div
        class="card-text"
        v-html="$options.filters.mtg( card.text, 14 )">
      </div>
      <div
        class="card-flavor"
        v-html="$options.filters.mtg( card.flavor, 14 )">
      </div>
      <div class="card-legality">
        Legal in: {{ card.legalities | legalities }}
      </div>
      <div class="card-extra">
        {{ card.setName }} ({{ card.set }}), {{ card.rarity }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'card-row',
    props: ['card'],

    filters: {
      mtg(text, wh) {
        if (!text) return '';
        let t = text.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');

        t = t.replace(/\{([0-9A-Z]\/?[0-9A-Z]?)\}/g, (all, g1) => {
          const imageName = g1.toLowerCase().replace('/', '');
          return `<img src="static/images/mana/mana-${imageName}.svg"
            width="${wh}" height="${wh}" class="mana-img">`;
        });

        return t;
      },

      legalities(cardLegalities) {
        const legalities = [];
        cardLegalities.forEach((legality) => {
          if (legality.legality !== 'Banned') {
            let format = legality.format;
            if (legality.legality === 'Restricted') {
              format += ' (Restricted)';
            }
            legalities.push(format);
          }
        });

        return legalities.join(', ');
      },
    },

    mounted() {
      const image = this.$refs.image;
      image.onload = () => {
        image.className += ' card-image-loaded';
      };
      image.src = this.card.imageUrl;
    },
  };
</script>

<style lang="scss" scoped>
  @import '~@/style/variables.scss';

  .card-row {
    background-color: $color3;
    display: flex;
    color: #000;
    flex-direction: row;
    padding: 1%;
    border-radius: 4px;
    margin: 0 .8% 1% .8%;
  }

  .card-text {
    flex: 1 1 auto;
  }

  .card-flavor {
    font-style: italic;
    margin-top: 1%;
    flex: 0 0 auto;
  }

  .card-image-container {
    width: 200px;
    height: 279px;
    border-radius: 4px;
    vertical-align: middle;
    flex: 0 0 auto;
    background-image: url('/static/images/example_card.jpg');
    background-position: left top;
    background-size: 100%;
    background-repeat: no-repeat;
  }

  .card-image {
    vertical-align: middle;
    opacity: 0;
    overflow: hidden;
    border-radius: 4px;
    transition: opacity 0.5s;

    &.card-image-loaded {
      opacity: 1 !important;
    }
  }

  .card-name-separator {
    border: none;
    height: 1px;
    background-color: $color5;
    flex: 0 0 auto;
    width: 100%;
    margin: .5% 0 .5% 0;
  }

  .card-header {
    display: flex;
    flex: 0 0 auto;
  }

  .card-type {
    flex: 0 0 auto;
    margin-bottom: 1%;
  }

  .card-extra {
    flex: 0 0 auto;
  }

  .card-legality {
    flex: 0 0 auto;
    margin-top: 1%;
  }

  .card-name {
    font-size: 20px;
    flex: 1 0 auto;
    color: black;
  }

  .card-mana-cost {
    flex: 1 0 auto;
    text-align: right;
  }

  .mana-img {
    border: 1px solid $color1;
    border-radius: 100%;
    box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 1);
  }

  .card-information {
    flex: 1 1 auto;
    padding: 0 .5% 0% 1%;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
  }

</style>
<style lang="scss">
  @import '~@/style/variables.scss';

  .mana-img {
    border: 1px solid $color1;
    border-radius: 100%;
    box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 1);
  }
</style>
