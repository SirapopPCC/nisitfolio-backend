import { Body, Controller, Get, Post, Param, HttpException } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('/additional/:id')
  async additionalAnalytics(@Param('id') id: string): Promise<any> {
    //const oid = mongoose.Types.ObjectId(id);
    return this.analyticsService.additionalAnalytics(id);
  }

  // -------------------- MainSkill ---------------------------

  @Get('/main/:id')
  async findUserJobSkill(@Param('id') id: string): Promise<any> {
    return this.analyticsService.findUserJobSkill(id);
  }

  @Post('/cache/:id')
  async UpdateAnalytics(
    @Param('id') id: string
  ): Promise<any> {
    return this.analyticsService.callUpdate(id);
  }

  @Get('/cache/:id')
  async GetAnalytics(
    @Param('id') id: string
  ): Promise<any> {
    return this.analyticsService.GetAnalytics(id);
  }

  @Get('/update/Type')
  async updateType(): Promise<any> {
    console.log("aaaaaaa");
    return this.analyticsService.updateType();
  }
  
}
