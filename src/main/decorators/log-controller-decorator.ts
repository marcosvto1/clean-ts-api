
import { LogErrorRepository } from "../../data/protocols/db/log/log-error-repository";
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";

export class LogControllerDecorator implements Controller {

  constructor(
    private readonly decoratee: Controller,
    private readonly logErrorRespository: LogErrorRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.decoratee.handle(httpRequest);
    if (httpResponse.statusCode === 500) {
      await this.logErrorRespository.logError(httpResponse.body.stack);
    } 
    return httpResponse;
  }
}