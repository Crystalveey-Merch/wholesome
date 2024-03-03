export function urlToBlob(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("error", reject);
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState === 4) {
        resolve(xhr.response);
      }
    });
    xhr.open("GET", url);
    xhr.responseType = "blob"; // convert type
    xhr.send();
  });
}