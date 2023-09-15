// const API_KEY = 'eb95e5e9de7eec32ef17c67998bd7439'
// const defaultCity = 'dallas'

const fiveDayWeather = `https://api.openweathermap.org/data/2.5/forecast?q=${defaultCity}&units=imperial&appid=${API_KEY}`

fetch(fiveDayWeather)
	.then((res) => {
		return res.json()
	})
	.then((data) => {
		console.log(data)
	})
