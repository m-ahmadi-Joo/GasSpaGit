export abstract class ApiUrlProvider {
  abstract getUrl(controller?: string, action?: string , id?: number): string;
  abstract getUrlForUser(controller?: string, action?: string , id?: string): string;
  abstract getUrlByArray(controller?: string, action?: string , ids?: string[]): string;
}
