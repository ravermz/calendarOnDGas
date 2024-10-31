import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

/**
 * API para autocompletar el nombre de la ciudad 🇲🇽
 * @param {NextApiRequest} req - Request
 * @param {NextApiResponse} res - Response
 * @returns {Promise<void>} - Retorna las sugerencias de ciudades
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET requests allowed' })
  }

  const { query } = req.query as { query: string }

  if (!query || query.length < 3) {
    return res.status(400).json({ message: 'Query must be at least 3 characters long' })
  }

  const apiKey = process.env.WEATHER_API_KEY
  const url = `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`

  try {
    const response = await axios.get(url)
    const data = response.data

    return res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching city autocomplete data:', error)
    return res.status(500).json({ message: 'Failed to retrieve city autocomplete data' })
  }
}
