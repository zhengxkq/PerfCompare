import { connectToDatabase } from '~/server/utils/db'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const db = await connectToDatabase()
    
    // 先尝试按id字段查找
    let solution = await db.collection('solutions').findOne({ id })
    
    // 如果找不到，尝试按ObjectId查找
    if (!solution && ObjectId.isValid(id)) {
      solution = await db.collection('solutions').findOne({ _id: new ObjectId(id) })
    }
    
    if (!solution) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Solution not found'
      })
    }
    
    return solution
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch solution'
    })
  }
})

