import { Api } from "@/util/Api";
import { lastSegment } from "@/util/api-utils";
import { makeAutoObservable, runInAction } from "mobx";

export class ProductImageEditModel {

  private api: Api;
  private images: Array<Image> = [];
  private loaded: boolean;

  constructor(api: Api) {
    makeAutoObservable(this);
    this.api = api;
  }

  async load(productImageIds: Array<string>, sellId: string) {
    // StrictModeで2回呼び出されたときの対策
    if (this.loaded) {
      return;
    }
    this.loaded = true;
    const requestPromises = [];
    const loadedImages = [];
    for (const productImageId of productImageIds) {
      const request = this.api.fetch(`/api/sell/sells/${sellId}/product-images/${productImageId}`)
        .then(res => res.blob())
        .then((data) => {
          const image = new Image();
          image.id = productImageId;
          image.data = data;
          image.status = Status.SYNCED;
          loadedImages.push(image);
        });
      requestPromises.push(request);
    }
    await Promise.all(requestPromises);
    runInAction(() => {
      this.images.push(...loadedImages);
    });

  }

  async doSync(sellId: string) {
    const requestPromises = [];
    const newImages = [];
    for (const image of this.images) {
      if (image.status == Status.SYNCED) {
        newImages.push(image);
      } else if (image.status == Status.ADD) {
        const formData = new FormData();
        formData.append("file", image.data);
        const request = this.api.fetch(`/api/sell/sells/${sellId}/product-images`, {
          method: "POST",
          body: formData
        }).then(res => {
          const location = res.headers.get("Location");
          const imageId = lastSegment(location);
          image.id = imageId;
        });
        newImages.push(image);
        requestPromises.push(request);
      } else {
        if (image.id != null) {
          const request = this.api.fetch(`/api/sell/sells/${sellId}/product-images/${image.id}`, {
            method: "DELETE"
          });
          requestPromises.push(request);
        }
      }
    }
    await Promise.all(requestPromises);
    const ids = newImages.map(image => image.id);
    await this.api.fetch(`/api/sell/sells/${sellId}/product-images/reorder`, {
      method: "PUT",
      body: JSON.stringify(ids)
    });
  }


  addImage(data: Blob) {
    const image = new Image();
    image.data = data;
    image.status = Status.ADD;
    this.images.push(image);
  }


  deleteImage(data: Blob) {
    for (const image of this.images) {
      if (image.data == data) {
        if (image.id != null) {
          image.status = Status.DELETE;
        } else {
          const idx = this.images.indexOf(image);
          if (idx != -1) {
            this.images.splice(idx, 1);
          }
        }
        return;
      }
    }
  }

  getImages() {
    return this.images.filter((image) => image.status != Status.DELETE);
  }


  isNeedSync() {
    for (const image of this.images) {
      if (image.status == Status.ADD) {
        return true;
      }
      if (image.status == Status.DELETE && image.id != null) {
        return true;
      }
    }
    return false;
  }


}

class Image {
  constructor() {
    makeAutoObservable(this);
  }
  id: string;
  data: Blob;
  status: Status;
}

export enum Status {
  SYNCED,
  ADD,
  DELETE,
}
