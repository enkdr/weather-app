document.addEventListener("DOMContentLoaded", () => {
    // Ensure the custom element is available in the DOM
    const weatherFormElement = document.querySelector("weather-form") as WeatherForm | null;
    
    if (!weatherFormElement) {
        console.error('WeatherForm custom element not found.');
        return;
    }
    
    // Access shadow DOM to get the form element
    const weatherForm = weatherFormElement.shadowRoot?.querySelector(".weather-form") as HTMLFormElement;
    const weatherInfo = document.querySelector(".weather-info") as HTMLElement;
    const weatherBlocks = document.querySelector(".weather-blocks") as HTMLElement;
    const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY
    
    if (!weatherForm || !weatherInfo || !weatherBlocks) {
        console.error('Required elements not found.');
        return;
    }

    const selectCity = weatherForm.querySelector("#city") as HTMLSelectElement;

    const cityArray: string[] = ["Melbourne", "London", "Miami", "Berlin", "Madrid", "Accra"];

    // Loop through the cityArray and create <option> elements
    cityArray.forEach(city => {
        const option = document.createElement("option");
        option.value = city; // Set the value attribute
        option.textContent = city; // Set the text content
        selectCity.appendChild(option); // Append the option to the select element
    });

    weatherForm.addEventListener("submit", async (event: Event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const city = (form.elements.namedItem("city") as HTMLSelectElement).value;
        
        if (!city) return;
        
        try {
            // const response = await fetch(`/weather/${city}`);
            const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${city}&aqi=no`);
            const data = await response.json();

            // Update the weather information in the HTML
            weatherInfo.innerHTML = `
<h2>${data.location.name}, ${data.location.country}</h2>
<p><strong>Temperature:</strong> ${data.current.temp_c} °C</p>
<p><strong>Condition:</strong> ${data.current.condition.text}</p>
<p><strong>Wind:</strong> ${data.current.wind_kph} km/h</p>
<p><strong>Humidity:</strong> ${data.current.humidity}%</p>
<button id="add-weather-block">Add Weather Block</button>
`;

            // Add event listener for the "add weather block" button
            const addButton = document.getElementById("add-weather-block") as HTMLButtonElement;
            addButton.addEventListener("click", () => {
                // add a weather-block web component
                const weatherBlock = document.createElement('weather-block') as HTMLElement & { data: any };
                weatherBlock.data = data;
                weatherBlocks.appendChild(weatherBlock);
                addButton.disabled = true;
            });

        } catch (error) {
            console.error("Failed to fetch weather data:", error);
        }
    });
});
