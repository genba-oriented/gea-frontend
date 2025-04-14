import { SellDto } from "@/dto/catalog/SellDto";
import { PageDto } from "@/dto/util/PageDto";
import { Api } from "@/util/Api";
import { makeAutoObservable, runInAction } from "mobx";

export class SearchModel {
  private api: Api;
  isSearched: boolean;
  keyword: string;
  page: number;
  total: number;
  isLastPage: boolean;
  sells: Array<SellDto> = [];
  limit = 9;

  constructor(api: Api) {
    makeAutoObservable(this);
    this.api = api;
  }

  async search(keyword: string) {
    this.keyword = keyword;
    this.page = 0;
    this.searchInternal(keyword, this.page, false);
  }
  async searchNext() {
    this.page++;
    this.searchInternal(this.keyword, this.page, true);
  }

  private async searchInternal(keyword: string, page: number, append: boolean) {
    const params = {
      page: page.toString(),
      size: this.limit.toString()
    };
    if (keyword != null) {
      params["keyword"] = keyword;
    }
    const dto: PageDto<SellDto> = await this.api.fetch("/api/catalog/sells?" + new URLSearchParams(params).toString()).then(res => res.json());
    runInAction(() => {
      this.isSearched = true;
      this.total = dto.totalElements;
      this.isLastPage = dto.last;
      if (append) {
        this.sells.push(...dto.content);
      } else {
        this.sells = dto.content;
      }
    });
  }

}