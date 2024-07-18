import './style.css'
import { WeatherBlock } from './weather-block.ts'
import './weather-form.ts'
import './weather-setup.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <content>
    <div class="row">
      <weather-form></weather-form> <!-- Use the custom weather form element -->
      <div class="weather-info">
      </div>
    </div>    
    <div class="weather-blocks">
    </div>    
    <weather-block></weather-block>
  </content>`
