import { StorageAPI } from "../services/storage.js";

export const lists = {
  root: {
    type: "lists",
    getParams() {
      return {
        title: "Lists",
        items: StorageAPI.getItemsByParentId("root"),
      }
    }
  },
};