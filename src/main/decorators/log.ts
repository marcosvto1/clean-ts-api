import { LogErrorRepository } from './../../data/protocols/log-error-repository';
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";

export class LogControllerDecorator implements Controller {
  private readonly decoratee: Controller;
  private readonly logErrorRespository: LogErrorRepository;

  constructor(decoratee: Controller, logErrorRepository: LogErrorRepository) {
    this.decoratee = decoratee;
    this.logErrorRespository = logErrorRepository;
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.decoratee.handle(httpRequest);
    if (httpResponse.statusCode === 500) {
      await this.logErrorRespository.log(httpResponse.body.stack);
    } 
    return httpResponse;
  }
}