<template>
  <div class="row">
    <div class="image-container" ref="imgContainer">
      <img
        src="~@/assets/images/example_card.jpg"
        :onerror="'this.src=\'' + exampleCardUrl + '\';'"
        ref="image"
        width="200"
        height="279"
        >
    </div>

    <div class="information">
      <div class="header">
        <div class="name">
          {{ card.name }}
        </div>

        <div class="mana-cost" v-html="mtg( card.manaCost, 17 )"></div>
      </div>

      <hr>

      <div class="type">
        {{ card.type }}
        <span v-if="card.power">
          {{ card.power }} / {{ card.toughness }}
        </span>
      </div>

      <div class="text" v-html="mtg( card.text, 14 )"></div>

      <div class="flavor" v-html="mtg( card.flavor, 14 )"></div>

      <div class="legality">
        Legal in: {{ card.legalities | legalities }}
      </div>

      <div class="extra">
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
      legalities(cardLegalities) {
        if (cardLegalities === undefined) {
          return 'All';
        }
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

    data() {
      return {
        exampleCardUrl: require('@/assets/images/example_card.jpg'),
      };
    },

    methods: {
      mtg(text, wh) {
        if (!text) return '';
        let t = text.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');
        const scopeId = this.$options._scopeId; // eslint-disable-line no-underscore-dangle

        t = t.replace(/\{([0-9A-Z]\/?[0-9A-Z]?)\}/g, (all, g1) => {
          const imageName = g1.toLowerCase().replace('/', '');
          const img = require( // eslint-disable-line import/no-dynamic-require
            `@/assets/images/mana/mana-${imageName}.svg`);

          return `<img ${scopeId} src="${img}" width="${wh}"
                    height="${wh}" class="mana-image">`;
        });

        return t;
      },
    },

    mounted() {
      const image = this.$refs.image;

      image.onload = () => {
        image.className += ' loaded';
      };
      image.src = this.card.imageUrl;
    },
  };
</script>

<style lang="scss" scoped>
  @import '~@/style/variables.scss';

  .row {
    background-color: $color3;
    display: flex;
    color: #000;
    flex-direction: row;
    padding: 1%;
    border-radius: 4px;
    margin: 0 .8% 1% .8%;

    .image-container {
      width: 200px;
      height: 279px;
      border-radius: 4px;
      vertical-align: middle;
      flex: 0 0 auto;
      background: url(~@/assets/images/example_card.jpg);
      background-position: left top;
      background-size: 100%;
      background-repeat: no-repeat;

      img {
        vertical-align: middle;
        opacity: 0;
        overflow: hidden;
        border-radius: 4px;
        transition: opacity 0.5s;

        &.loaded {
          opacity: 1 !important;
        }
      }
    }

    .information {
      flex: 1 1 auto;
      padding: 0 .5% 0% 1%;
      border-radius: 4px;
      display: flex;
      flex-direction: column;

      .header {
        display: flex;
        flex: 0 0 auto;
      }

      .name {
        font-size: 20px;
        flex: 1 0 auto;
        color: black;
      }

      .mana-cost {
        flex: 1 0 auto;
        text-align: right;
      }

      > hr {
        border: none;
        height: 1px;
        background-color: $color5;
        flex: 0 0 auto;
        width: 100%;
        margin: .5% 0 .5% 0;
      }

      .text {
        flex: 1 1 auto;
      }

      .flavor {
        font-style: italic;
        margin-top: 1%;
        flex: 0 0 auto;
      }

      .type {
        flex: 0 0 auto;
        margin-bottom: 1%;
      }

      .extra {
        flex: 0 0 auto;
      }

      .legality {
        flex: 0 0 auto;
        margin-top: 1%;
      }
    }

    img.mana-image {
      border: 1px solid $color1;
      border-radius: 100%;
      box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 1);
    }
  }
</style>
