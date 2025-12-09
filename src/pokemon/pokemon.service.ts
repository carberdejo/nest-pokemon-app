/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      console.log(error);
      this.handlerEcxeptions(error);
    }
  }

  async findAll() {
    return await this.pokemonModel.find();
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null = null;
    //Search by NO
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: +term });
    }

    //Search by MongoID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    //Search by Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.trim(),
      });
    }
    if (!pokemon)
      throw new NotFoundException(`Pokemon with id '${term}' not found.`);
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    try {
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      console.log(error);
      this.handlerEcxeptions(error);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    // const result = await this.pokemonModel.deleteOne({ _id: id });
    // if (result.deletedCount === 0)
    //   throw new BadRequestException(`Pokemon with id '${id}' not found.`);
    const result = await this.pokemonModel.findByIdAndDelete(id);
    if (!result)
      throw new BadRequestException(`Pokemon with id '${id}' not found.`);
    return result;
  }

  private handlerEcxeptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      'Something went wrong while updating the Pokemon.',
    );
  }
}
