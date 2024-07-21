document.addEventListener("DOMContentLoaded", () => {
    const weatherFormElement = document.querySelector("weather-form") as WeatherForm | null;

    if (!weatherFormElement) {
        console.error('WeatherForm custom element not found.');
        return;
    }

    const weatherForm = weatherFormElement.shadowRoot?.querySelector(".weather-form") as HTMLFormElement;
    const weatherInfo = document.querySelector(".weather-info") as HTMLElement;
    const weatherBlocks = document.querySelector(".weather-blocks") as HTMLElement;
    const cityArray: string[] = ["Melbourne", "London", "Miami", "Berlin", "Madrid", "Accra"];
    const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;

    if (!weatherForm || !weatherInfo || !weatherBlocks) {
        console.error('Required elements not found.');
        return;
    }

    initializeCityOptions(weatherForm.querySelector("#city") as HTMLSelectElement, cityArray);
    addWeatherFormChangeListener(weatherForm, weatherInfo, weatherBlocks, weatherApiKey);
});

function initializeCityOptions(selectCity: HTMLSelectElement, cityArray: string[]): void {
    cityArray.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        selectCity.appendChild(option);
    });
}

function addWeatherFormChangeListener(
    weatherForm: HTMLFormElement,
    weatherInfo: HTMLElement,
    weatherBlocks: HTMLElement,
    weatherApiKey: string
): void {
    weatherForm.addEventListener("change", async (event: Event) => {
        const selectCity = weatherForm.querySelector("#city") as HTMLSelectElement;
        const city = selectCity.value;

        if (!city) return;

        try {
            weatherInfo.innerHTML = "";
            const data = await fetchWeatherData(weatherApiKey, city);
            createWeatherBlock(weatherInfo, weatherBlocks, data);
        } catch (error) {
            console.error("Failed to fetch weather data:", error);
        }
    });
}

async function fetchWeatherData(apiKey: string, city: string): Promise<WeatherData> {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`);
    return response.json();
}

function createWeatherBlock(weatherInfo: HTMLElement, weatherBlocks: HTMLElement, data: WeatherData): void {
    const tmpWeatherBlock = document.createElement('weather-block') as WeatherBlock;
    data.btnAction = "add";
    data.btnText = "Add Weather Block";
    tmpWeatherBlock.data = data;
    weatherInfo.appendChild(tmpWeatherBlock);

    const weatherBlockBtn = tmpWeatherBlock.shadowRoot?.querySelector(".weather-block-btn");

    if (weatherBlockBtn) {
        weatherBlockBtn.addEventListener("click", () => {
            handleWeatherBlockButtonClick(weatherBlockBtn, weatherBlocks, data);
        });
    } else {
        console.error('Add Weather Block button not found.');
    }
}

function handleWeatherBlockButtonClick(button: HTMLButtonElement, weatherBlocks: HTMLElement, data: WeatherData): void {
    button.disabled = true;
    button.classList.toggle("disabled");

    const newWeatherBlock = document.createElement('weather-block') as WeatherBlock;
    const newData = { ...data, btnAction: "remove", btnText: "Remove" };
    newWeatherBlock.data = newData;

    weatherBlocks.appendChild(newWeatherBlock);
}
