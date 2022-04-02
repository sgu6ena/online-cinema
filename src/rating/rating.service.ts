import {Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ModelType} from "@typegoose/typegoose/lib/types";
import {RatingModel} from './rating.model';
import {MovieService} from "../movie/movie.service";
import {Types} from "mongoose";
import {SetRatingDto} from "./dto/set-rating.dto";

@Injectable()
export class RatingService {

    constructor(@InjectModel(RatingModel) private readonly RatingModel: ModelType<RatingModel>,
                private readonly movieService: MovieService) {
    }

    async getMovieValueByUser(movieId: Types.ObjectId, userId: Types.ObjectId) {
        return this.RatingModel.findOne(movieId, userId).select('value').exec().then(data => data.value ? data.value : 0)
    }

    async averageRatingByMovie(movieID: Types.ObjectId | string) {
        const ratingMovie: RatingModel[] = await this.RatingModel.aggregate().match({
            movieId: new Types.ObjectId(movieID)
        }).exec()

        return ratingMovie.reduce((acc, item) => acc + item.value, 0)/ratingMovie.length
    }

    async setRating(userId: Types.ObjectId, dto: SetRatingDto) {
        const {movieId, value} = dto

        const newRating = await this.RatingModel.findOneAndUpdate(
            {movieId, userId},
            {movieId, userId, value},
            {
                new: true,
                upsert: true,
                setDefaultsOnInserte: true
            }).exec()

        const  averageRating = await this.averageRatingByMovie(movieId)

        await this.movieService.updateRating(movieId, averageRating)
        return newRating
    }
}

