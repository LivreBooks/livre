import { CategoryType } from "../types";

export let exploreData: CategoryType[] = [];

export function fetchExploreData() {
  fetch("https://livre.deno.dev/categories")
    .then((res) => res.json())
    .then((data) => {
      exploreData = data;
    })
    .catch((err) => {
      console.log(err);
    });
}

fetchExploreData();
