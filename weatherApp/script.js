const yourweather = document.querySelector("[data-user]");
const searchweather = document.querySelector("[data-user-search]");
const weather = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const grantAccessbtn = document.querySelector("[data-grantAccess]");
const loading_img = document.querySelector(".loading-container");
const searchForm = document.querySelector("[data-searchForm]");
const searchInp = document.querySelector("[data-searchInput]");
const userInfoContainer = document.querySelector(".show-weather-container");

let currentTab = yourweather;
const Api_key = "3c1622d3a22cf67002e7df00dbf2126d";

currentTab.classList.add("current_Tab");
// getlocation();


function switchTab(clickedTab) {
    console.log("1")
    if (clickedTab !== currentTab) {
        currentTab.classList.remove("current_Tab");
        currentTab = clickedTab;
        currentTab.classList.add("current_Tab");
        console.log("switched")
    }

        console.log("2")
        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
            console.log("search wla tab")
        } else {
            //mai phle search wlae TAb par tha abb weather wle par jana h
            searchForm.classList.remove("active");
            userInfoContainer.classList.add("active");
            console.log("weather wla tab 1")
            getfromSectionStorage();  // local storage ma jo meri location padi h
            console.log("weather wla tab 2")
        }
    console.log("3")
}

yourweather.addEventListener("click", () => {
    console.log("weather click")
    switchTab(yourweather);
});

searchweather.addEventListener("click", () => {
    console.log("search click")
    switchTab(searchweather);
});

function getfromSectionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    } else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    grantAccessContainer.classList.remove("active"); 
    loading_img.classList.add("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${Api_key}&units=metric`);
        //const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${Api_key}`);
        const data = await response.json();
        console.log(data);

        loading_img.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    } catch (err){
        loading_img.classList.remove("active");
        console.log("errrorrr")
    }

}

function renderWeatherInfo(weatherInfo) {
    let cityName = document.querySelector("[data-cityName]");
    // const counrtyIcon = document.querySelector("[data-country-flag]");
    let desc = document.querySelector("[data-weather-desc]");
    const weatherIcon = document.querySelector("[data-weather-icon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[ data-windspeed]");
    const humidity = document.querySelector("[data-humditiy]");
    const clouds = document.querySelector("[data-cloud]");

    cityName.innerText = weatherInfo?.name;
    console.log(cityName.innerText);
   // counrtyIcon.src = ` ${weatherInfo?.sys?.country.lowerCase()}.png`
    desc.innerText = weatherInfo?.weather?.[0]?.description;

    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

    temp.innerText = `${weatherInfo?.main?.temp}°C`;

    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText =`${weatherInfo?.main?.humidity}%`;
    clouds.innerText = `${weatherInfo?.clouds?.all}%`;
}


function getlocation() {
    console.log("1")
    if (navigator.geolocation) {
        console.log("A")
        navigator.geolocation.getCurrentPosition(showPosition);
        console.log("B")
    } else {
        grantAccessbtn.style.display = "none";
        console.log("geolocation not support")
    }
}

function showPosition(position) {
    console.log("C")
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    console.log(userCoordinates)

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
getfromSectionStorage();

grantAccessbtn.addEventListener("click", getlocation);


/*****   search form    *****/

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (searchInp.value === "") return;
    // console.log(searchInp.value);
    fetchSearchWeatherInfo(searchInp.value);
    searchInp.value = "";
  });
  
  // fetch data from API - user weather info
  async function fetchSearchWeatherInfo(city) {
    userInfoContainer.classList.remove("active");
    loading_img.classList.add("active");
  
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Api_key}&units=metric`
      );
      const data = await res.json();
      // console.log("Search - Api Fetch Data", data);
      if (!data.sys) {
        throw data;
      }
      loading_img.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
    } catch (error) {
      console.log("Search - Api Fetch Error");
      loading_img.classList.remove("active");
    }
  }
  