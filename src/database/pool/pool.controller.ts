import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PoolDto } from './pool.dto';
import { PoolService } from './pool.service';

@ApiTags('Pool')
@Controller('pool')
export class PoolControllers {
  constructor(private readonly poolService: PoolService) {}

  @Post('/generate')
  generate(@Body() { num }: PoolDto) {
    return this.poolService.generate(num);
  }

  @Get('status')
  status() {
    return this.poolService.status();
  }
}
