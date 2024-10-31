import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Event } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * API para obtener los eventos del calendario 🇲🇽
 * @param {NextApiRequest} req - Request
 * @param {NextApiResponse} res - Response
 * @returns {Promise<void>} - Retorna los eventos
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const events: Event[] = await prisma.event.findMany()
        res.status(200).json(events)
      } catch (error) {
        console.error('Error al obtener los events:', error)
        res.status(500).json({ error: 'Error al obtener los events' })
      } finally {
        await prisma.$disconnect()
      }
      break

    case 'POST':
      try {
        const eventData = req.body
        const newEvent = await prisma.event.create({ data: eventData })
        res.status(201).json(newEvent)
      } catch (error) {
        console.error('Error al crear el event:', error)
        res.status(500).json({ error: 'Error al crear el event' })
      } finally {
        await prisma.$disconnect()
      }
      break

    case 'DELETE':
      try {
        await prisma.event.delete({
          where: { id: Number(id) },
        });
        res.status(204).end();
      } catch (error) {
        console.error('Error al eliminar el evento:', error);
        res.status(500).json({ error: 'Error al eliminar el evento' });
      } finally {
        await prisma.$disconnect();
      }
      break;

    case 'PUT':
      try {
        const eventData = req.body
        const updatedEvent = await prisma.event.update({
          where: { id: Number(id) },
          data: eventData,
        })
        res.status(200).json(updatedEvent)
      } catch (error) {
        console.error('Error al actualizar el evento:', error)
        res.status(500).json({ error: 'Error al actualizar el evento' })
      } finally {
        await prisma.$disconnect()
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Método ${req.method} no permitido`)
      break
  }
}
