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

            weatherInfo.innerHTML = "";
            const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${city}&aqi=no`);
            const data = await response.json();

            const tmpWeatherBlock = document.createElement('weather-block') as WeatherBlock;

            data.btnAction = "add"
            data.btnText = "Add Weather Block"
            tmpWeatherBlock.data = data;
            weatherInfo.appendChild(tmpWeatherBlock);
            
            const shadowRoot = tmpWeatherBlock.shadowRoot;
            const weatherBlockBtn = shadowRoot.querySelector(".weather-block-btn")

            if (weatherBlockBtn) {
                weatherBlockBtn.addEventListener("click", () => {
                    weatherBlockBtn.disabled = "true"                    
                    weatherBlockBtn.classList.toggle("disabled")
                    const weatherBlock = document.createElement('weather-block') as WeatherBlock;
                    weatherBlock.data = data;
                    data.btnAction = "remove"
                    data.btnText = "Remove"
                    weatherBlocks.appendChild(weatherBlock);
                });
            } else {
                console.error('Add Weather Block button not found.');
            }

        } catch (error) {
            console.error("Failed to fetch weather data:", error);
        }
    });
});
