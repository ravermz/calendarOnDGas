import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { location } = req.query

  try {
    const response = await axios.get('http://api.weatherapi.com/v1/timezone.json', {
      params: {
        key: process.env.WEATHER_API_KEY,
        q: location,
      },
    })

    const timezone = response.data.location.tz_id

    res.status(200).json({ timezone })
  } catch (error) {
    console.error('Error fetching timezone:', error)
    res.status(500).json({ error: 'Error fetching timezone' })
  }
}