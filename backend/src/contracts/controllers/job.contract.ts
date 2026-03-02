import { Body, Controller, Get, Post, Query, Response, Route, SuccessResponse, Tags } from 'tsoa';
import {
  ErrorResponse,
  JobsListResponse,
  SearchJobsRequest,
  SearchJobsResponse,
} from '../models';

@Route('api')
@Tags('Jobs')
export class JobContractController extends Controller {
  @Post('search-jobs')
  @SuccessResponse('200', 'Searched')
  @Response<ErrorResponse>('500', 'Server error')
  public async searchJobs(@Body() body: SearchJobsRequest): Promise<SearchJobsResponse> {
    void body;
    throw new Error('Contract-only controller. Route handled by Express controllers.');
  }

  @Get('jobs')
  @SuccessResponse('200', 'Listed')
  @Response<ErrorResponse>('500', 'Server error')
  public async getJobs(
    @Query() query?: string,
    @Query() location?: string,
    @Query() employmentType?: string,
    @Query() limit?: number,
  ): Promise<JobsListResponse> {
    void query;
    void location;
    void employmentType;
    void limit;
    throw new Error('Contract-only controller. Route handled by Express controllers.');
  }
}
