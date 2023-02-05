import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './interfaces/track.interface';
import { HttpException } from '@nestjs/common/exceptions';

@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  create(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    if (createTrackDto.duration && createTrackDto.name) {
      return this.tracksService.create(createTrackDto);
    }
    throw new HttpException('Body is incorrect', HttpStatus.BAD_REQUEST);
  }

  @Get()
  findAll(): Promise<Track[]> {
    return this.tracksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Track> {
    const track = this.tracksService.findOne(id);
    if (track) return track;
    throw new HttpException(
      'The track with such id is not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    if (updateTrackDto.name !== null && updateTrackDto.duration !== null) {
      return this.tracksService.update(id, updateTrackDto);
    }
    throw new HttpException('Body is not valid', HttpStatus.BAD_REQUEST);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    const isSuccess = this.tracksService.remove(id);
    if (!isSuccess) {
      throw new HttpException(
        'This track does not exist',
        HttpStatus.NOT_FOUND,
      );
    } else {
      throw new HttpException(
        'This track was successfullly deleted',
        HttpStatus.NO_CONTENT,
      );
    }
  }
}