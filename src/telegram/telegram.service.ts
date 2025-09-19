import { Injectable } from '@nestjs/common'
import { ExtraReplyMessage } from 'node_modules/telegraf/typings/telegram-types'
import { getTelegramConfig } from 'src/config/telegram.config'
import { Telegraf } from 'telegraf'
import { Telegram } from './telegram.interface'

@Injectable()
export class TelegramService {
  bot: Telegraf
  options: Telegram

  constructor() {
    this.options = getTelegramConfig()
    this.bot = new Telegraf(this.options.token)
  }

  async sendMessage(
    msg: string,
    options?: ExtraReplyMessage,
    chatId: string = this.options.chatId
  ) {
    await this.bot.telegram.sendMessage(chatId, msg, {
      parse_mode: 'HTML',
      ...options,
    })
  }

  async sendPhoto(
    photo: string,
    msg?: string,
    chatId: string = this.options.chatId
  ) {
    await this.bot.telegram.sendPhoto(
      chatId,
      photo,
      msg
        ? {
            caption: msg,
          }
        : {}
    )
  }
}
