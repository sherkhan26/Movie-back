import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { MovieModel } from './movie.model'
import { UpdateMovieDto } from './update-move.dto'

@Injectable()
export class MovieService {
  constructor(
    // @ts-expect-error - Typegoose injection issue
    @InjectModel(MovieModel) private readonly movieModel: ModelType<MovieModel>
    // private readonly telegramService: TelegramService
  ) {}

  async getAll(searchTerm?: string) {
    let options = {}

    if (searchTerm) {
      options = {
        $or: [
          {
            title: new RegExp(searchTerm, 'i'),
          },
        ],
      }
    }

    return this.movieModel
      .find(options)
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .populate('genres actors')
      .exec()
  }

  async bySlug(slug: string) {
    const doc = await this.movieModel
      .findOne({ slug })
      .populate('actors genres')
      .exec()
    if (!doc) throw new NotFoundException('Movie not found')
    return doc
  }

  async byActor(actorId: Types.ObjectId) {
    const docs = await this.movieModel.find({ actors: actorId }).exec()
    if (!docs) throw new NotFoundException('Movie not found')
    return docs
  }

  async byGenres(genreIds: Types.ObjectId[]) {
    const docs = await this.movieModel
      .find({ genres: { $in: genreIds } })
      .exec()
    if (!docs) throw new NotFoundException('Actor not found')
    return docs
  }

  async getMostPopular() {
    return this.movieModel
      .find({ countOpened: { $gt: 0 } })
      .sort({ countOpened: -1 })
      .populate('genres')
      .exec()
  }
  async updateCountOpened(slug: string) {
    return this.movieModel
      .findOneAndUpdate({ slug }, { $inc: { countOpened: 1 } }, { new: true })
      .exec()
  }

  /* Admin area */

  async byId(id: string) {
    return this.movieModel.findById(id).exec()
  }

  async create(): Promise<Types.ObjectId> {
    const defaultValue: UpdateMovieDto = {
      bigPoster: '',
      actors: [],
      genres: [],
      poster: '',
      title: '',
      videoUrl: '',
      slug: '',
    }
    const movie = await this.movieModel.create(defaultValue)
    return movie._id
  }

  async update(id: string, dto: UpdateMovieDto) {
    if (!dto.isSendTelegram) {
      // await this.sendNotifications(dto)
      dto.isSendTelegram = true
    }

    return this.movieModel.findByIdAndUpdate(id, dto, { new: true }).exec()
  }

  async delete(id: string) {
    return this.movieModel.findByIdAndDelete(id).exec()
  }

  async updateRating(id: Types.ObjectId, newRating: number) {
    return this.movieModel
      .findByIdAndUpdate(id, { rating: newRating }, { new: true })
      .exec()
  }

  /* Utilites */
  // async sendNotifications(dto: UpdateMovieDto) {
  //   if (process.env.NODE_ENV !== 'development')
  //     await this.telegramService.sendPhoto(dto.poster)

  //   const msg = `<b>${dto.title}</b>\n\n` + `${dto.description}\n\n`

  //   await this.telegramService.sendMessage(msg, {
  //     reply_markup: {
  //       inline_keyboard: [
  //         [
  //           {
  //             url: 'https://okko.tv/movie/free-guy',
  //             text: '🍿 Go to watch',
  //           },
  //         ],
  //       ],
  //     },
  //   })
  // }
}
