export const apiFunctions = {
  users: () =>
    fetch("https://jsonplaceholder.typicode.com/users").then((res) =>
      res.json()
    ),
  posts: () =>
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=5").then(
      (res) => res.json()
    ),
  comments: () =>
    fetch("https://jsonplaceholder.typicode.com/comments?_limit=5").then(
      (res) => res.json()
    ),
  photos: () =>
    fetch("https://jsonplaceholder.typicode.com/photos?_limit=5").then(
      (res) => res.json()
    ),
  todos: () =>
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=5").then(
      (res) => res.json()
    ),
  albums: () =>
    fetch("https://jsonplaceholder.typicode.com/albums?_limit=5").then(
      (res) => res.json()
    ),
};
