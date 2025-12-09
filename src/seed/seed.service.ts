import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
// import { PokemonService } from 'src/pokemon/pokemon.service';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    private readonly http: AxiosAdapter,
    // private readonly pokemonService: PokemonService,
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async executeSeed() {
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );
    const pokemons: CreatePokemonDto[] = [];
    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      console.log({ name, no });
      pokemons.push({ name, no });
    });
    // await this.pokemonService.createAll(pokemons);
    await this.pokemonModel.deleteMany({});
    await this.pokemonModel.insertMany(pokemons);
    return '  Seed executed successfully';
  }
}
