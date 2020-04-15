import "./ruffle.js";

function to_ul(obj) {
  // --------v create an <ul> element
  let f, li;
  const ul = document.createElement("ul");
  ul.className = "tree__list";

  // --v loop through its children
  for (let child of obj.children) {
    li = document.createElement("li");
    li.className = "tree__list__item";

    let childHtml;
    // if the child has a 'folder' prop on its own, call me again
    if (child.children) {
      childHtml = document.createElement("div");
      childHtml.className = "tree__list__item--withChildren";
      childHtml.appendChild(document.createTextNode(child.name));
      childHtml.onclick = function() {
        this.parentElement.children[1].hidden = !this.parentElement.children[1]
          .hidden;
      };
      li.appendChild(childHtml);
      li.appendChild(to_ul(child));
    } else {
      childHtml = document.createElement("a");
      childHtml.appendChild(document.createTextNode(child.name));
      // childHtml.href = `?file_to_play=${child.fullPath}`;
      childHtml.onclick = () => playFile(child.fullPath);
	  li.appendChild(childHtml);
    }
    ul.appendChild(li);
  }
  ul.hidden = true;
  return ul;
}

let swfPlayerContainer;
let resolvePromise;
let readyPromise = new Promise(res => (resolvePromise = res));

window.addEventListener("DOMContentLoaded", async event => {
  const responseBody = await fetch("./directory");

  swfPlayerContainer = document.getElementById("swfPlayerContainer");


  const fileTreeContainer = document.getElementById("fileTreeContainer");
  const uls = to_ul(await responseBody.json());
  uls.hidden = false;
  fileTreeContainer.appendChild(uls);
  resolvePromise();
});

export async function playFile(file) {
  await readyPromise;
  
  const ruffle = window.RufflePlayer.newest();
  const rufflePlayer = ruffle.create_player();
  swfPlayerContainer.innerHTML = "";
  swfPlayerContainer.appendChild(rufflePlayer);
  
  rufflePlayer.stream_swf_url(file);
}
