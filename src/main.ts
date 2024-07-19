import './style.css'
import './weather-form.ts'
import './weather-init.ts'
import { WeatherBlock } from './weather-block.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <content>
    <div class="row">
      <weather-form></weather-form> <!-- Use the custom weather form element -->
      <div class="weather-info">
      </div>
    </div>    
    <div class="weather-blocks">
    </div>    
  </content>`
