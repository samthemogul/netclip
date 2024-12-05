import cron from 'node-cron'
import NotificationService from '.'
import { redisService } from '../../../../utils/caches/redis'
import logger from '../../../../libs/loggers/winston'

const notificationService = new NotificationService()

const fetchTokenAndTriggerNotification = async () => {
  try {
    const keys = await redisService.scan('userId:*:token')
    const tokens = await Promise.all(
      keys.map(async (key) => {
        const token = await redisService.get(key)
        return token
      })
    )
    const validTokens = tokens.filter(Boolean)
    for (const token of validTokens) {
      try {
        const notification = randomDailyNotification()
        await notificationService.sendNotification(
          notification.title,
          notification.subtitle,
          notification.body,
          token as string
        )
      } catch (error) {
        logger.error('Error sending daily notifications:', error)
      }
    }
  } catch (error) {
    logger.error('Error sending daily notifications:', error)
  }
}

const dailyNotifications = cron.schedule(
  '0 9 * * *',
  fetchTokenAndTriggerNotification
)

export { dailyNotifications }
