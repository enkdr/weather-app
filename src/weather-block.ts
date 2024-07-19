interface WeatherData {
    location: {
        name: string;
        country: string;
    };
    current: {
        temp_c: number;
        condition: {
            text: string;
        };
        wind_kph: number;
        humidity: number;
    };
}

export class WeatherBlock extends HTMLElement {
    private _data?: WeatherData;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    set data(value: WeatherData) {
        this._data = value;
        this.render();
    }

    private render() {
        if (!this._data) {
            return;
        }

        this.shadowRoot!.innerHTML = `
            <style>
                @import url("/src/style.css");
            </style>
            <div class="weather-block">
                <h2>${this._data.location.name}, ${this._data.location.country}</h2>
                <p><strong>Temperature:</strong> ${this._data.current.temp_c} °C</p>
                <p><strong>Condition:</strong> ${this._data.current.condition.text}</p>
                <p><strong>Wind:</strong> ${this._data.current.wind_kph} km/h</p>
                <p><strong>Humidity:</strong> ${this._data.current.humidity}%</p>                
                <button class="remove-weather-block">Remove</button>
            </div>
        `;

        const removeBtn = this.shadowRoot!.querySelector('.remove-weather-block');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                this.remove();
            });
        }
    }
}

customElements.define('weather-block', WeatherBlock);
