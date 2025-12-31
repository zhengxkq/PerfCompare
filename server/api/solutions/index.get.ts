import { connectToDatabase } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const db = await connectToDatabase()
    const solutions = await db.collection('solutions').find({}).toArray()
    return solutions
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch solutions'
    })
  }
})

