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

    const selectCity = weatherForm.querySelector("#city") as HTMLSelectElement;

    cityArray.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        selectCity.appendChild(option);
    });

    weatherForm.addEventListener("change", async (event: Event) => {
        
        const city = selectCity.value;
        
        if (!city) return;

        try {
            const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${city}&aqi=no`);
            const data = await response.json();

            weatherInfo.innerHTML = `
                <h2>${data.location.name}, ${data.location.country}</h2>
                <p><strong>Temperature:</strong> ${data.current.temp_c} °C</p>
                <p><strong>Condition:</strong> ${data.current.condition.text}</p>
                <p><strong>Wind:</strong> ${data.current.wind_kph} km/h</p>
                <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
                <button id="add-weather-block">Add Weather Block</button>
            `;

            const addButton = document.getElementById("add-weather-block") as HTMLButtonElement | null;
            if (addButton) {
                addButton.addEventListener("click", () => {
                    const weatherBlock = document.createElement('weather-block') as WeatherBlock;
                    weatherBlock.data = data;
                    weatherBlocks.appendChild(weatherBlock);
                    addButton.disabled = true;
                });
            } else {
                console.error('Add Weather Block button not found.');
            }

        } catch (error) {
            console.error("Failed to fetch weather data:", error);
        }
    });
});
