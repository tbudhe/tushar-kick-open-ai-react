import { Body, Controller, Get, Post, Query, Response, Route, SuccessResponse, Tags } from 'tsoa';
import {
  ErrorResponse,
  RagBenchmarkRunListResponse,
  RagBenchmarkRunSaveRequest,
  RagBenchmarkRunSaveResponse,
  RagRetrieveRequest,
  RagRetrieveResponse,
  RagUpsertRequest,
  RagUpsertResponse,
} from '../models';

@Route('api/rag')
@Tags('RAG')
export class RagContractController extends Controller {
  @Post('upsert')
  @SuccessResponse('200', 'Upserted')
  @Response<ErrorResponse>('400', 'Invalid input')
  @Response<ErrorResponse>('500', 'Server error')
  public async upsert(@Body() body: RagUpsertRequest): Promise<RagUpsertResponse> {
    void body;
    throw new Error('Contract-only controller. Route handled by Express controllers.');
  }

  @Post('retrieve')
  @SuccessResponse('200', 'Retrieved')
  @Response<ErrorResponse>('400', 'Invalid input')
  @Response<ErrorResponse>('500', 'Server error')
  public async retrieve(@Body() body: RagRetrieveRequest): Promise<RagRetrieveResponse> {
    void body;
    throw new Error('Contract-only controller. Route handled by Express controllers.');
  }

  @Post('benchmark-runs')
  @SuccessResponse('200', 'Saved')
  @Response<ErrorResponse>('400', 'Invalid input')
  @Response<ErrorResponse>('500', 'Server error')
  public async saveBenchmarkRun(
    @Body() body: RagBenchmarkRunSaveRequest,
  ): Promise<RagBenchmarkRunSaveResponse> {
    void body;
    throw new Error('Contract-only controller. Route handled by Express controllers.');
  }

  @Get('benchmark-runs')
  @SuccessResponse('200', 'Listed')
  @Response<ErrorResponse>('500', 'Server error')
  public async listBenchmarkRuns(
    @Query() limit?: number,
  ): Promise<RagBenchmarkRunListResponse> {
    void limit;
    throw new Error('Contract-only controller. Route handled by Express controllers.');
  }
}
