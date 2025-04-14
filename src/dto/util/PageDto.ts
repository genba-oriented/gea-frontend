export class PageDto<Element> {
  content: Array<Element>;
  totalElements: number;
  last: boolean;
}