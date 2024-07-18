export class WeatherForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    private render() {
        this.shadowRoot!.innerHTML = `
            <form class="weather-form">
                <select name="city" id="city">
                    <option value="">Choose a city</option>
                </select>
                <button type="submit">Update</button>
            </form>
            <style>
                .weather-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1em;
                }

                select, button {
                    padding: 0.5em;
                    font-size: 1em;
                }
            </style>
        `;
    }
}

// Define the custom element
customElements.define('weather-form', WeatherForm);
