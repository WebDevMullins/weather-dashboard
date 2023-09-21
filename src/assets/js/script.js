const API_KEY = 'eb95e5e9de7eec32ef17c67998bd7439'
const formInput = document.querySelector('#city-input')
const searchEl = document.querySelector('#recent-searches')
const currentEl = document.querySelector('#current-weather')
const forecastEl = document.querySelector('#forecast-weather')
const submitBtn = document.querySelector('#submit')
submitBtn.addEventListener('click', searchWeather)

function searchWeather(e) {
	e.preventDefault()

	const city = formInput.value
	formInput.value = '' //  Clear search input box
	forecastEl.innerHTML = '' //  Reset forecast element each search

	getCurrentWeather(city)
	getFiveDayForecast(city)
}

// Fucntion to call current weather
function getCurrentWeather(city) {
	const currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`
	fetch(currentWeather)
		.then((res) => {
			if (!res.ok) {
				throw new Error('City not found') // Check for API error
			}
			return res.json()
		})
		.then((data) => {
			const cityName = 'Weather in ' + data.name
			const today = dayjs().format('MMMM D, YYYY')
			const currentCondition = data.weather[0].main
			const currentTemp = data.main.temp.toFixed(0) + '\u00B0'
			const currentFeel = data.main.feels_like.toFixed(0) + '\u00B0'
			const currentWind = data.wind.speed.toFixed(0) + ' mph'
			const currentHumidity = data.main.humidity + '%'

			currentEl.classList.replace('hidden', 'flex') // Set class to show current weather section
			currentEl.innerHTML = `
			<h1 class="text-2xl md:text-3xl text-center">${cityName}</h1>
			<p class="text-xl md:text-2xl text-center pt-3">${today}</p>
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

			saveSearch(data.name) // Call to save city name in local storage
		})
		.catch((error) => {
			currentEl.classList.replace('hidden', 'flex')
			currentEl.innerHTML = `<p class='text-center'>Error: ${error.message}</p>` //  Display error message
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
			//  Get weather for 4pm each day
			const dailyForecast = data.list.filter((forecast) => {
				const forecastTime = new Date(forecast.dt * 1000)
				return forecastTime.getHours() === 16
			})
			// Loop through and create card for each day
			dailyForecast.forEach((forecast) => {
				const card = document.createElement('div')
				const classList = [
					'card',
					'flex',
					'flex-col',
					'py-4',
					'rounded-lg',
					'shadow',
					'bg-black/60',
					'text-white',
					'align-center',
					'justify-center',
					'w-full'
				]
				card.classList.add(...classList) // Add classes to each card

				const day = dayjs(forecast.dt * 1000).format('ddd')
				const date = dayjs(forecast.dt * 1000).format('DD')
				const icon = forecast.weather[0].icon
				const temp = forecast.main.temp.toFixed(0) + '\u00B0'
				const wind = forecast.wind.speed.toFixed(0) + ' mph'
				const humidity = forecast.main.humidity + '%'

				card.innerHTML = `
				<p class='text-lg text-center'>${day}</p>
				<p class='text-lg text-center pt-3'>${date}</p>
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

				forecastEl.appendChild(card) //  Display cards
			})
		})
		.catch((error) => {
			currentEl.classList.replace('hidden', 'flex')
			currentEl.innerHTML = `<p>Error: ${error.message}</p>`
		})
}
//  Function to save city name to local storage
function saveSearch(city) {
	const history = JSON.parse(localStorage.getItem('history')) || []
	//  Check to see if city is already in storage
	if (!history.includes(city)) {
		history.unshift(city) //  Add city to beginning of array
	}
	//  Check to see if more than 5 cities are stored
	if (history.length > 5) {
		history.pop() // Remove last city
	}
	localStorage.setItem('history', JSON.stringify(history))
	displaySearches(history)
}

//  Function to display search history buttons
function displaySearches(history) {
	searchEl.innerHTML = ''
	if (history === null) {
		return
	}
	//  Loop through local storage and create a button for each city
	history.forEach((city) => {
		const item = document.createElement('button')
		const classListBtn = [
			'hover:bg-gray-800',
			'focus:outline-none',
			'focus:ring-1',
			'focus:ring-gray-300',
			'font-normal',
			'hover:font-bold',
			'rounded-2xl',
			'text-sm',
			'md:text-lg',
			'px-3',
			'py-1',
			'text-center',
			'mr-[0px]',
			'md:mr-1'
		]
		item.classList.add(...classListBtn)
		item.textContent = city
		searchEl.appendChild(item)
		//  Event Listener to search by local storage city
		item.addEventListener('click', (e) => {
			formInput.value = city
			searchWeather(e)
		})
	})
}

//  Display search history on initial page load
const initSearch = JSON.parse(localStorage.getItem('history'))
displaySearches(initSearch)
