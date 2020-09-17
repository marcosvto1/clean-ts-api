import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";

export class LogControllerDecorator implements Controller {
  private readonly decoratee: Controller;
  constructor(decoratee: Controller) {
    this.decoratee = decoratee;
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.decoratee.handle(httpRequest);
    return httpResponse;
  }
}