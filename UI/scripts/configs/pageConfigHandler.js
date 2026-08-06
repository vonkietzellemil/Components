import { lists } from "./lists.js"
import { list } from "./list.js"
import { settings } from "./settings.js"

const test = {
  root: {
    type: "lists",
    getParams() {
      return {
        title: "Test Page",
      }
    }
  },
};

export const pageConfigs = {
  lists,
  list,
  settings,

  test,
};