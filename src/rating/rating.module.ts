import {Module} from '@nestjs/common';
import {RatingController} from './rating.controller';
import {RatingService} from './rating.service';
import {TypegooseModule} from "nestjs-typegoose";
import {MovieModule} from "../movie/movie.module";

@Module({

    imports: [
        TypegooseModule.forFeature([
            {
                typegooseClass: RatingModule,
                schemaOptions: {
                    collection: 'Rating'
                },
            },
        ]),
        MovieModule
    ],
    controllers: [RatingController],
    providers: [RatingService],
    exports: [RatingService],
})
export class RatingModule {
}
