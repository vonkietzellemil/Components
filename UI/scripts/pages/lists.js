import { listBase } from "./listBase.js";
import { App } from "../app.js";

export const listsPage = {
  getInnerHTML(params) {
    return listBase({
      ...params,
    });
  },
  init({ page, params}) {
    const btn = page.querySelector(".floating-action-button");

    btn.addEventListener("click", () => {
      App.pages.newPage(App.pages.configs.list.root)
    });
  }
};