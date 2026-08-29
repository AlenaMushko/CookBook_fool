import { Injectable } from '@nestjs/common';

import { CountryListResDto } from '../models/dto/res/country.res.dto';
import { CountryRepository } from '../repositories/country.repository';

@Injectable()
export class CountryService {
  constructor(private readonly countryRepository: CountryRepository) {}

  public async getCountries(): Promise<CountryListResDto> {
    const countries = await this.countryRepository.findAll();
    return { data: countries };
  }
}
