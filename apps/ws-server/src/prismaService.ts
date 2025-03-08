import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getAvailableDrivers = async () => {
  return await prisma.driver.findMany({
    where: { available: true },
    select: { id: true, latitude: true, longitude: true }
  })
}

export default prisma
