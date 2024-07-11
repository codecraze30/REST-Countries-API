<template>
  <div class="home" :class="{ darkTheme: isDarkTheme }">
    <!-- Top left search bar component -->
    <div class="searchBar">
      <div class="searchContainer">
        <i class="fas fa-search searchIcon"></i>
        <input class="searchInput" type="text" v-model="search"
          aria-label="Search for a country..."
          placeholder="Search for a country..." />
        <ul class="searchResults"></ul>
      </div>
      <!-- Top right dropdown region selector -->
      <div class="dropdownDiv">
        <!-- Default text changes after selecting a region -->
        <a class="dropdownBtn" v-if="!showAllRegion"
          @click="showFilter = !showFilter">
          Filter by Region
        </a>

        <a class="dropdownBtn" v-else @click="showFilter = !showFilter">
          {{ region || 'Select Region' }}
        </a>
        <!-- Dropdown list of regions -->
        <ul v-if="showFilter" class="dropdownUL">
          <li>
            <label for="radioAfrica">Africa
              <input id="radioAfrica" class="dropdownInput" type="radio"
                name="region" value="Africa" v-model="region"
                @click="handleFilterClick" />
            </label>
          </li>
          <li>
            <label for="radioAmerica">America
              <input id="radioAmerica" class="dropdownInput" type="radio"
                name="region" value="Americas" v-model="region"
                @click="handleFilterClick" />
            </label>
          </li>
          <li>
            <label for="radioAsia">Asia
              <input id="radioAsia" class="dropdownInput" type="radio"
                name="region" value="Asia" v-model="region"
                @click="handleFilterClick" />
            </label>
          </li>
          <li>
            <label for="radioEurope">Europe
              <input id="radioEurope" class="dropdownInput" type="radio"
                name="region" value="Europe" v-model="region"
                @click="handleFilterClick" />
            </label>
          </li>
          <li>
            <label for="radioOceania">Oceania
              <input id="radioOceania" class="dropdownInput" type="radio"
                name="region" value="Oceania" v-model="region"
                @click="handleFilterClick" />
            </label>
          </li>
          <!-- After selecting a region, the "All Regions" option becomes available -->
          <li v-if="showAllRegion">
            <label for="radioAll">All Regions
              <input id="radioAll" class="dropdownInput" type="radio"
                name="region" value="All Regions" v-model="region"
                @click="handleFilterClick" />
            </label>
          </li>
        </ul>
      </div>
    </div>

    <!-- Error Handling -->
    <h1 v-if="error">Sorry, an error has occurred: {{ error }}</h1>

    <!-- Loading API response -->
    <div v-if="pending" class="loaderFlex">
      <div class="loader"></div>
    </div>

    <!-- API response data -->
    <div v-if="countryInfo" class="tileGrid">
      <div v-for="country in filteredCountries" :key="country.alpha3Code"
        class="countryTile">
        <router-link
          :to="{ name: 'country-detail', params: { country: country.name } }"
          class="linkTile">
          <img :src="country.flag" :alt="'Flag of ' + country.name" class="flag">
          <div class="text">
            <h1>{{ country.name }}</h1>
            <p><span>Population:</span> {{ formatNumbers(country.population) }}
            </p>
            <p><span>Region:</span> {{ country.region }}</p>
            <p><span>Capital:</span> {{ country.capital }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

export default {
  name: 'HomePage',
  props: ['isDarkTheme'],
  setup() {
    const pending = ref(false);
    const error = ref(null);
    const countryInfo = ref(null);
    const search = ref('');
    const showFilter = ref(false);
    const showAllRegion = ref(false);
    const region = ref('');
    const darkMode = ref(false);

    const fetchCountries = async () => {
      pending.value = true;
      try {
        const response = await axios.get('https://restcountries.com/v2/all');
        countryInfo.value = response.data;
      } catch (err) {
        error.value = err.message;
      } finally {
        pending.value = false;
      }
    };

    onMounted(fetchCountries);

    const formatNumbers = (value) => {
      return value ? value.toLocaleString() : '';
    };

    const filteredCountries = computed(() => {
      if (!countryInfo.value) return [];
      return countryInfo.value.filter((country) => {
        const matchesSearch = search.value === '' || country.name.toLowerCase().includes(search.value.toLowerCase());
        const matchesRegion = region.value === '' || region.value === 'All Regions' || country.region === region.value;
        return matchesSearch && matchesRegion;
      });
    });

    const handleFilterClick = () => {
      setTimeout(() => {
        showFilter.value = !showFilter.value;
        showAllRegion.value = true;
      });
    };

    return {
      pending,
      error,
      countryInfo,
      search,
      showFilter,
      showAllRegion,
      region,
      darkMode,
      fetchCountries,
      formatNumbers,
      filteredCountries,
      handleFilterClick
    };
  },
};
</script>

<style scoped>
.home {
  background-color: #f9f9f9;
}

/* Search bar styles */
.searchBar {
  padding: 35px 75px;
  display: flex;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
}

.searchContainer {
  border: none;
  border-radius: 5px;
  box-shadow: 1px 1px 7px 0px rgb(0, 0, 0, 0.1);
  width: 500px;
  height: 50px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding-left: 30px;
}

.searchIcon {
  font-size: 16px;
  color: #848484;
  padding-right: 30px;
}

.searchInput {
  border: none;
  font-size: 14px;
  font-family: 'Nunito Sans', sans-serif;
  padding: 10px;
  width: 420px;
}

/* Dropdown region selector Styles */
.dropdownBtn {
  display: block;
  background: #fff;
  height: 50px;
  width: 160px;
  box-shadow: 1px 1px 7px 0px rgb(0, 0, 0, 0.1);
  padding-right: 30px;
  padding-left: 30px;
  border-radius: 3px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dropdownBtn::after {
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  content: "\f107";
}

.dropdownUL {
  padding-left: 0;
  text-align: left;
  background-color: #fff;
  margin-top: 3px;
  padding: 10px 0;
  box-shadow: 1px 1px 7px 0px rgb(0, 0, 0, 0.1);
  border-radius: 3px;
  position: absolute;
  width: 220px;
}

.dropdownUL li {
  list-style: none;
  line-height: 2;
  cursor: pointer;
}

.dropdownUL li label {
  cursor: pointer;
  padding: 0 26px;
  display: block;
  width: 148px;
}

.dropdownUL li:hover {
  background-color: #f9f9f9;
}

.dropdownInput {
  height: 1px;
  clip: rect(1px, 1px, 1px, 1px);
  position: absolute;
}

input[type="radio"] {
  -webkit-appearance: radio;
}

/* loading animation */
.loader {
  border: 16px solid #f3f3f3;
  border-top: 16px solid #2b3845;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  margin-bottom: 100px;
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

.tileGrid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 25px 50px 0;
  margin: 0 auto;
  max-width: 1450px;
}

.countryTile {
  display: inline-block;
  background-color: #fff;
  width: 300px;
  box-shadow: 1px 1px 7px 0px rgb(0, 0, 0, 0.1);
  border-radius: 3px;
  cursor: pointer;
  text-align: left;
  margin: 0 25px 80px;
  text-decoration: none;
  color: inherit;
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

.linkTile {
  display: inline-block;
  width: 300px;
  height: 365px;
  text-decoration: none;
  color: inherit;
}

.flag {
  height: 180px;
  width: 300px;
  border-radius: 3px 3px 0 0;
}

.text {
  padding-left: 30px;
  padding-right: 20px;
}

.text h1 {
  font-size: 20px;
}

.text p span {
  font-weight: 600;
}

.text p {
  line-height: 1;
}

::placeholder {
  font-weight: 600;
}

/* Dark Theme */
.darkTheme,
.darkTheme .dropdownUL li:hover {
  background-color: #202c36;
}

.darkTheme .searchContainer,
.darkTheme .searchInput,
.darkTheme .dropdownBtn,
.darkTheme .dropdownUL,
.darkTheme .countryTile {
  background-color: #2b3845;
}

.darkTheme h1,
.darkTheme p,
.darkTheme .searchIcon,
.darkTheme .searchInput,
.darkTheme ::placeholder,
.darkTheme .dropdownBtn,
.darkTheme .dropdownUL {
  color: #fff;
}

.darkTheme .loader {
  border: 16px solid #2b3845;
  border-top: 16px solid #f3f3f3;
}


@media (max-width: 875px) {
  .tileGrid {
    justify-content: center;
    padding-left: 50px;
  }

  .searchBar {
    flex-direction: column;
    padding: 25px 15px;
  }

  .searchContainer {
    width: inherit;
  }

  .dropdownDiv {
    margin-top: 40px;
  }
}
</style>
