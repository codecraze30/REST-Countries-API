<template>
  <div class="country-detail" :class="{ darkTheme: isDarkTheme }">
    <!-- Back button -->
    <a @click="$router.go(-1)" class="backBtn"><i class="fas fa-arrow-left"></i>
      Back</a>

    <!-- Error Handling -->
    <h1 v-if="error !== null">Sorry, an error has occurred {{ error }}</h1>

    <!-- Loading API response -->
    <div class="loaderFlex">
      <div v-if="pending" class="loader"></div>
    </div>

    <!-- Country Details -->
    <template v-if="countryInfo">
      <div class="countryTile" v-for="country in countryInfo"
        :key="country.alpha3Code">
        <img :src="country.flag" :alt="'Flag of ' + country.name" class="flag">
        <div class="country-details">
          <h1>{{ country.name }}</h1>
          <div class="listDiv">
            <ul>
              <li><span>Native Name:</span> {{ country.nativeName }}</li>
              <li><span>Population:</span> {{ formatNumbers(country.population) }}
              </li>
              <li><span>Region:</span> {{ country.region }}</li>
              <li><span>Sub Region:</span> {{ country.subregion }}</li>
              <li><span>Capital:</span> {{ country.capital }}</li>
            </ul>
            <ul>
              <li><span>Top Level Domain:</span> {{ country.topLevelDomain[0] }}
              </li>
              <li><span>Currencies:</span> {{ country.currencies[0].name }}</li>
              <li><span>Languages:</span>
                <span v-for="(language, index) in country.languages" :key="index"
                  class="languages">
                  {{ language.name }}<span
                    v-if="index + 1 < country.languages.length">, </span>
                </span>
              </li>
            </ul>
          </div>

          <!-- Border Countries -->
          <div class="borders">
            <div class="bordersWrapper">
              <span v-if="!country.borders || country.borders.length === 0"
                class="noBorders">No
                Border
                Countries</span>
              <span v-else class="borderTitle">Border Countries:</span>
              <router-link v-for="borderCountry in borderCountries"
                :key="borderCountry.alpha3Code"
                :to="{ name: 'country-detail', params: { country: borderCountry.name } }"
                class="borderLinks">
                {{ borderCountry.name }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'CountryDetail',
  props: ['isDarkTheme', 'country'],
  setup(props) {
    const pending = ref(false);
    const error = ref(null);
    const countryInfo = ref(null);
    const borderCountries = ref(null);
    const alpha3Code = ref([]);
    const alpha3CodetoString = ref('');
    const errorBorders = ref(null);

    const fetchCountryData = async () => {
      pending.value = true;
      try {
        const response = await axios.get(`https://restcountries.com/v2/name/${props.country}?fullText=true`);
        countryInfo.value = response.data;

        alpha3Code.value = countryInfo.value[0].borders;
        try {
          if (countryInfo.value[0].borders) {
            let countries = [];
            for (let value of Object.entries(countryInfo.value[0].borders)) {
              const borderResponse = await axios.get(`https://restcountries.com/v2/alpha?codes=${value}`);
              countries.push(borderResponse.data[0]);
            }
            console.log(countries);
            borderCountries.value = countries;
          }
        } catch (err) {
          errorBorders.value = err;
        }
      } catch (err) {
        error.value = err;
      } finally {
        pending.value = false;
      }
    };

    onMounted(fetchCountryData);

    const formatNumbers = (value) => {
      return value ? value.toLocaleString() : '';
    };

    return {
      pending,
      error,
      countryInfo,
      borderCountries,
      alpha3Code,
      alpha3CodetoString,
      errorBorders,
      formatNumbers,
    };
  },
};
</script>

<style scoped>
.country-detail {
  background: #fff;
  max-width: 1400px;
  margin: 0 auto;
  padding: 75px;
  font-size: 16px;
}

/* loading animation */
.loader {
  border: 16px solid #f3f3f3;
  border-top: 16px solid #2b3845;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  transition: 1s ease;
}

.borders .loader {
  width: 60px;
  height: 60px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loaderFlex {
  display: flex;
  justify-content: center;
}

.backBtn,
.borderLinks {
  display: block;
  background: #fff;
  width: 130px;
  box-shadow: 1px 1px 7px 0px rgb(0, 0, 0, 0.20);
  cursor: pointer;
  border-radius: 5px;
  text-decoration: none;
  color: #111517;
  padding: 10px 0;
  text-align: center;
}

.fa-arrow-left {
  padding-right: 7px;
}

/* Fade in animation using CSS 3 animations */
.countryTile {
  display: flex;
  padding-top: 70px;
}

.countryTile {
  -webkit-animation: fadein 1s;
  /* Safari, Chrome and Opera > 12.1 */
  -moz-animation: fadein 1s;
  /* Firefox < 16 */
  -ms-animation: fadein 1s;
  /* Internet Explorer */
  -o-animation: fadein 1s;
  /* Opera < 12.1 */
  animation: fadein 1s;
}

@keyframes fadein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Firefox < 16 */
@-moz-keyframes fadein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Safari, Chrome and Opera > 12.1 */
@-webkit-keyframes fadein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Internet Explorer */
@-ms-keyframes fadein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.flag {
  max-width: 570px;
  min-width: 350px;
  padding-bottom: 70px;
  width: 100%;
  height: 100%;
}

.country-details {
  text-align: left;
  min-width: 400px;
  max-width: 650px;
  margin: 0 0 0 auto;
  width: 100%;
  padding-left: 40px;
}

.listDiv {
  display: flex;
}

.country-details ul {
  list-style: none;
  text-align: left;
  line-height: 32px;
  padding-left: 0;
  margin: 0 auto 0 0;
}

.country-details ul:last-child {
  margin: 0 0 0 auto;
}

li span {
  font-weight: 600;
}

.languages,
.languages span {
  font-weight: 400;
}

.borders {
  display: flex;
  padding-top: 50px;
}

.borderTitle {
  font-weight: 600;
  margin-top: 5px;
  padding-right: 5px;
}

.bordersWrapper {
  display: flex;
  flex-wrap: wrap;
  padding-top: 16px;
}

.borderList {
  padding-bottom: 10px;
}

.borderLinks {
  margin: 5px 5px;
  min-width: 100px;
  width: inherit;
  padding: 0;
  display: table;
  align-self: center;
  padding: 2px 5px;
}

.noBorders {
  font-weight: 600;
}

/* Dark Theme */
.darkTheme {
  background-color: #202c36;
}

.darkTheme .borderLinks,
.darkTheme .backBtn {
  background-color: #2b3845;
}

.darkTheme h1,
.darkTheme p,
.darkTheme span,
.darkTheme li,
.darkTheme .borderLinks,
.darkTheme .backBtn {
  color: #fff;
}

.darkTheme .loader {
  border: 16px solid #2b3845;
  border-top: 16px solid #f3f3f3;
}


@media (max-width: 875px) {
  .country-detail {
    padding: 25px;
  }

  .backBtn {
    margin-top: 22px;
  }

  .countryTile {
    flex-direction: column;
  }

  .flag {
    min-width: 325px;
    height: 100%;
    padding-bottom: 20px;
  }

  .country-details {
    padding-left: 0;
    min-width: 325px;
  }

  .listDiv {
    flex-direction: column;
  }

  .country-details ul:last-child {
    margin: inherit;
    padding-top: 40px;
  }
}
</style>
