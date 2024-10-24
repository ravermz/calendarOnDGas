import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const getEvents = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const events = await prisma.event.findMany()
    res.status(200).json(events)
  } catch (error) {
    console.error('Error getting events:', error)
    res.status(500).json({ error: 'Error getting events' })
  } finally {
    await prisma.$disconnect()
  }
}

export default getEvents
