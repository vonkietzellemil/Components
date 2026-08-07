import { listBase } from "./listBase.js";
import { App, VIEWS } from "../core/app.js";

import { renderCollection } from "../components/items.js"

export const listsPage = {
  getInnerHTML(params) {
    return listBase({
      ...params,
    });
  },  
  init({ page, params}) {
    const btn = page.querySelector(".floating-action-button");

    btn.addEventListener("click", () => {
      App.pages.newPage({ page: App.pages.configs.list.root })
    });

    this.renderItems({ page, params });
  },

  renderItems({ page, params}) {

    const container = page.querySelector(".items-container");
    const items = params.items;
  
  
    //  Add items to dom
    renderCollection({
      container,
      items,
      config: VIEWS.root,
      emptyMessage: true,
    });
  },
};