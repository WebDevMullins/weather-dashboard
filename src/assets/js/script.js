const API_KEY = 'eb95e5e9de7eec32ef17c67998bd7439'
const formInput = document.querySelector('#city-input')
const currentEl = document.querySelector('#current-weather')
const forecastEl = document.querySelector('#forecast-weather')
const submitBtn = document.querySelector('#submit')
submitBtn.addEventListener('click', searchWeather)

function searchWeather(e) {
	e.preventDefault()

	const city = formInput.value
	formInput.value = ''
	forecastEl.innerHTML = ''

	getCurrentWeather(city)
	getFiveDayForecast(city)
	saveCity()
}
function getCurrentWeather(city) {
	const currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`
	fetch(currentWeather)
		.then((res) => {
			if (!res.ok) {
				throw new Error('City not found')
			}
			return res.json()
		})
		.then((data) => {
			const cityName = 'Weather in ' + data.name
			const currentCondition = data.weather[0].main
			const currentTemp = data.main.temp.toFixed(0) + '\u00B0'
			const currentFeel = data.main.feels_like.toFixed(0) + '\u00B0'
			const currentWind = data.wind.speed.toFixed(0) + ' mph'
			const currentHumidity = data.main.humidity + '%'

			currentEl.classList.replace('hidden', 'flex')
			currentEl.innerHTML = `
			<h1 id="city-name" class="text-3xl text-center">${cityName}</h1>
				<div class="flex flex-col justify-between items-center">
					<div class="flex justify-around items-center w-full max-w-lg">
						<div class="flex flex-col items-center">
							<img id="current-icon" src='https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png' alt="" />
							<p id="current-condition" class="text-xl">${currentCondition}</p>
						</div>
						<p id="current-temp" class="text-7xl">${currentTemp}</p>
					</div>
					<div class="flex justify-around items-center w-full max-w-lg text-center pt-4">
						<div>
							<p id="current-feel" class="text-2xl font-bold">${currentFeel}</p>
							<p class="text-xl">Feels Like</p>
						</div>
						<div>
							<p id="current-humidity" class="text-2xl font-bold">${currentHumidity}</p>
							<p class="text-xl">Humidity</p>
						</div>
						<div>
							<p id="current-wind" class="text-2xl font-bold">${currentWind}</p>
							<p class="text-xl">Wind Speed</p>
						</div>
					</div>
				</div>
			`

			saveCity(data.name)
		})
		.catch((error) => {
			currentEl.classList.replace('hidden', 'flex')
			currentEl.innerHTML = `<p>Error: ${error.message}</p>`
		})
}

function getFiveDayForecast(city) {
	const fiveDayForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${API_KEY}`
	fetch(fiveDayForecast)
		.then((res) => {
			if (!res.ok) {
				throw new Error('City not found')
			}
			return res.json()
		})
		.then((data) => {
			const dailyForecast = data.list.filter((forecast) => {
				const forecastTime = new Date(forecast.dt * 1000)
				return forecastTime.getHours() === 16
			})

			dailyForecast.forEach((forecast) => {
				const card = document.createElement('div')
				const classList = [
					'card',
					'flex',
					'flex-col',
					'py-6',
					'rounded-lg',
					'shadow',
					'bg-black/60',
					'text-white',
					'align-center',
					'justify-center'
				]
				card.classList.add(...classList)

				let date = new Date(forecast.dt * 1000)
				let month = date.getMonth()
				let day = date.getDate()
				let icon = forecast.weather[0].icon
				let condition = forecast.weather[0].main
				let temp = forecast.main.temp.toFixed(0) + '\u00B0'
				let wind = forecast.wind.speed.toFixed(0) + ' mph'
				let humidity = forecast.main.humidity + '%'

				card.innerHTML = `
				<h2 class='text-center'>${month}/${day}</h2>
				<img src='https://openweathermap.org/img/wn/${icon}@2x.png'/>
				<p class='text-center text-xl font-bold py-2'>${temp}</p>
				<div class='py-1'>
				<p class='text-center text-lg font-bold'>${wind}</p>
				<p class='text-center'>Wind</p>	
				</div>
				<div class='py-1'>
				<p class='text-center text-lg font-bold'>${humidity}</p>
				<p class='text-center'>Hum</p>
				</div>`

				forecastEl.appendChild(card)
			})
		})
		.catch((error) => {
			currentEl.classList.replace('hidden', 'flex')

			currentEl.innerHTML = `<p>Error: ${error.message}</p>`
		})
}

function saveCity(city) {
	console.log(city)
	const history = JSON.parse(localStorage.getItem('history')) || []
	if (city === undefined) {
		return
	} else {
		if (!history.includes(city)) {
			history.push(city)
			localStorage.setItem('history', JSON.stringify(history))
		}
	}
}
