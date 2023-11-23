import axios from 'axios'
import moment from 'moment-timezone'

export default async function motd () {
  const apiKey = process.env.OW
  if (!apiKey) {
    console.log('OW key missing, skipping motd.')
    return
  }

  const city = 'Seattle'

  // Time
  const date = moment().tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss a')
  const time = Math.floor(Date.now() / 1000)

  // Weather
  const weatherApi = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`
  const { data } = await axios.get(weatherApi)
  const weather = data.weather[0].main
  const temperature = Math.round(data.main.temp)
  const { sunrise } = data.sys
  const { sunset } = data.sys
  const timeOfDay = sunrise < time && time < sunset
    ? 'day'
    : 'night'

  console.log('c a s s i e')
  console.log(date)
  console.log(`${weather} to${timeOfDay} in ${city} with a temperature of ${temperature}°F`)
  console.log()
}
