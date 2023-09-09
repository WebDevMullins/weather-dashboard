const API_KEY = 'eb95e5e9de7eec32ef17c67998bd7439'
const iconURL = 'https://openweathermap.org/img/wn/10d@2x.png'
const defaultCity = 'dallas'

const currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&units=imperial&appid=${API_KEY}`

fetch(currentWeather)
	.then( res => {
		return res.json()
	})
	.then( data => {
		let cityName = document.querySelector('#city-name')
		let currentIcon = document.querySelector('#current-icon')
		let currentCondition = document.querySelector('#current-condition')
		let currentTemp = document.querySelector('#current-temp')
		let currentWind = document.querySelector('#current-wind')
		let currentHumidity = document.querySelector('#current-humidity')
		cityName.textContent = 'Weather in ' + data.name
		currentIcon.setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
		currentCondition.textContent = data.weather[0].main
		currentTemp.textContent = data.main.temp.toFixed(0) + '\u00B0'
		currentWind.textContent = data.wind.speed.toFixed(0) + " MPH"
		currentHumidity.textContent = data.main.humidity + '%'
		console.log(data)
	})