import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

interface WeatherResponse {
  temperature: number
  condition: string
  icon: string
}


/**
 * API para obtener la información del clima 🇲🇽
 * @param {NextApiRequest} req - Request
 * @param {NextApiResponse} res - Response
 * @returns {Promise<void>} - Retorna el clima
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET requests allowed' })
  }

  const { location, dateTime } = req.query as { location: string; dateTime: string }

  if (!location || !dateTime) {
    return res.status(400).json({ message: 'Location and dateTime are required' })
  }


  const apiKey = process.env.WEATHER_API_KEY

  const requestedDate = new Date(dateTime)
  const currentDate = new Date()

  const currentEnd = new Date(currentDate)
  currentEnd.setDate(currentEnd.getDate() + 13)

  const futureEnd = new Date(currentDate)
  futureEnd.setDate(futureEnd.getDate() + 300)

  let endpoint
  if (requestedDate < currentDate) {
    endpoint = 'history'
  } else if (requestedDate >= currentDate && requestedDate <= currentEnd) {
    endpoint = 'current'
  } else if (requestedDate > currentEnd && requestedDate <= futureEnd) {
    endpoint = 'future'
  } else {
    return res.status(400).json({ message: 'Requested date out of valid range (0-300 days from today)' })
  }

  const url = endpoint === 'current' 
    ? `http://api.weatherapi.com/v1/${endpoint}.json?key=${apiKey}&q=${location}&aqi=no`
    : `http://api.weatherapi.com/v1/${endpoint}.json?key=${apiKey}&q=${location}&dt=${dateTime}`
  
  try {
    
    const response = await axios.get(url)
    const data = response.data

    // Extraer la información relevante del clima
    const forecastHour = data.forecast.forecastday[0].hour[parseInt(dateTime.slice(-5, -3), 10)]
    const weatherInfo: WeatherResponse = {
      temperature: forecastHour.temp_c,
      condition: forecastHour.condition.text,
      icon: forecastHour.condition.icon,
    }

    return res.status(200).json(weatherInfo)
  } catch (error) {
    console.error('Error fetching weather data:', JSON.stringify({ error, url }))
    return res.status(500).json({ message: 'Failed to retrieve weather data', error, url })
  }
}
