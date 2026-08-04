import { listBase } from "./listBase.js";

export const listsPage = {
  getInnerHTML(params) {
    return listBase({
      ...params,
    });
  }
};