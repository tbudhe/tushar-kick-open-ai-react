import { Body, Controller, Example, Post, Response, Route, SuccessResponse, Tags } from 'tsoa';
import { ErrorResponse, ParseResumeRequest, ParseResumeSuccessResponse } from '../models';

@Route('api')
@Tags('Resume')
export class ResumeContractController extends Controller {
  @Post('parse-resume')
  @SuccessResponse('200', 'Parsed')
  @Response<ErrorResponse>('400', 'Invalid input')
  @Response<ErrorResponse>('413', 'Payload too large')
  @Response<ErrorResponse>('500', 'Server error')
  @Example<ParseResumeSuccessResponse>({
    success: true,
    source: 'fallback',
    fileName: 'sample.txt',
    parsedData: {
      fullName: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      phone: '+1 415 555 1290',
      summary: null,
      skills: ['React', 'TypeScript', 'Node.js'],
      experience: ['Senior Engineer at CloudNova'],
      education: ['B.S. Computer Science'],
    },
  })
  public async parseResume(
    @Body() body: ParseResumeRequest,
  ): Promise<ParseResumeSuccessResponse> {
    void body;
    throw new Error('Contract-only controller. Route handled by Express controllers.');
  }
}
