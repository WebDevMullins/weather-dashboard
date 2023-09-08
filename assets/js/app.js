require('dotenv').config({ path: '../../.env' })

const API_KEY = process.env.API_KEY
const defaultCity = 'dallas'

const currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&appid=${API_KEY}`

fetch(currentWeather)
	.then((res) => {
		return res.json()
	})
	.then((data) => {
		console.log(data)
	})
