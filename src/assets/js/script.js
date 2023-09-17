const API_KEY = 'eb95e5e9de7eec32ef17c67998bd7439'
const defaultCity = 'dallas'
const formInput = document.querySelector('#city-input')
const currentEl = document.querySelector('#current-weather')
const forecastEl = document.querySelector('#forecast-weather')
const submitBtn = document.querySelector('#submit')
submitBtn.addEventListener('click', searchCity)

function searchCity(e) {
	e.preventDefault()

	let city = formInput.value
	console.log(city)

	// const currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`

	// const fiveDayForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${API_KEY}`

	const currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&units=imperial&appid=${API_KEY}`

	const fiveDayForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${defaultCity}&units=imperial&appid=${API_KEY}`

	forecastEl.innerHTML = ''

	function getCurrentWeather() {
		fetch(currentWeather)
			.then((res) => {
				return res.json()
			})
			.then((data) => {
				let cityName = document.querySelector('#city-name')
				let currentIcon = document.querySelector('#current-icon')
				let currentCondition = document.querySelector('#current-condition')
				let currentTemp = document.querySelector('#current-temp')
				let currentFeel = document.querySelector('#current-feel')
				let currentHumidity = document.querySelector('#current-humidity')
				let currentWind = document.querySelector('#current-wind')
				currentEl.classList.replace('hidden', 'flex')
				cityName.textContent = 'Weather in ' + data.name
				currentIcon.setAttribute(
					'src',
					`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
				)
				currentCondition.textContent = data.weather[0].main
				currentTemp.textContent = data.main.temp.toFixed(0) + '\u00B0'
				currentFeel.textContent = data.main.feels_like.toFixed(0) + '\u00B0'
				currentWind.textContent = data.wind.speed.toFixed(0) + ' MPH'
				currentHumidity.textContent = data.main.humidity + '%'
				// console.log(data)
			})
	}

	function getFiveDayForecast() {
		fetch(fiveDayForecast)
			.then((res) => {
				return res.json()
			})
			.then((data) => {
				const dailyForecast = data.list.filter((forecast) => {
					const forecastTime = new Date(forecast.dt * 1000)
					return forecastTime.getHours() === 16
				})

				// const forecastEl = document.getElementById('forecast-weather')
				dailyForecast.forEach((forecast) => {
					const card = document.createElement('div')
					const classList = [
						'card',
						'flex',
						'flex-col',
						'block',
						'min-w-[50px]',
						'max-w-sm',
						'p-6',
						'border',
						'rounded-lg',
						'shadow',
						'bg-gray-800',
						'border-gray-700',
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
				<p class='text-center'>${condition}</p>
				<p class='text-center'>${temp}</p>
				<p class='text-center'>${wind}</p>
				<p class='text-center'>${humidity}</p>`

					forecastEl.appendChild(card)
				})

				console.log(dailyForecast)
			})
	}

	getCurrentWeather()
	// getFiveDayForecast()

	formInput.value = ''
}