import { Body, Controller, Get, Patch, Path, Post, Response, Route, SuccessResponse, Tags } from 'tsoa';
import {
  ApplicationsListResponse,
  ApplyRequest,
  ApplyResponse,
  ErrorResponse,
  UpdateApplicationRequest,
  UpdateApplicationResponse,
} from '../models';

@Route('api')
@Tags('Applications')
export class ApplicationContractController extends Controller {
  @Post('apply')
  @SuccessResponse('200', 'Applied')
  @Response<ErrorResponse>('400', 'Invalid input')
  @Response<ErrorResponse>('500', 'Server error')
  public async apply(@Body() body: ApplyRequest): Promise<ApplyResponse> {
    void body;
    throw new Error('Contract-only controller. Route handled by Express controllers.');
  }

  @Get('applications')
  @SuccessResponse('200', 'Listed')
  @Response<ErrorResponse>('500', 'Server error')
  public async getApplications(): Promise<ApplicationsListResponse> {
    throw new Error('Contract-only controller. Route handled by Express controllers.');
  }

  @Patch('applications/{id}')
  @SuccessResponse('200', 'Updated')
  @Response<ErrorResponse>('400', 'Invalid input')
  @Response<ErrorResponse>('404', 'Not found')
  @Response<ErrorResponse>('500', 'Server error')
  public async updateApplication(
    @Path() id: string,
    @Body() body: UpdateApplicationRequest,
  ): Promise<UpdateApplicationResponse> {
    void id;
    void body;
    throw new Error('Contract-only controller. Route handled by Express controllers.');
  }
}
