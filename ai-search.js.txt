// ai-search.js
console.log("ai-search.js loaded");

async function loadDocs() {
  const res = await fetch("docs.json");
  return res.json();
}

function findAnswer(query, docs) {
  query = query.toLowerCase();
  for (let doc of docs) {
    if (doc.text.toLowerCase().includes(query)) {
      return doc;
    }
  }
  return null;
}

function intentCTA(query) {
  if (/after hours|emergency|urgent|no cool/i.test(query)) {
    return `<button onclick="alert('Calling now...')">📞 Call Now</button>`;
  }
  if (/price|quote|estimate|financing|cost/i.test(query)) {
    return `<button onclick="alert('Redirecting to quote...')">💲 Get a Quote</button>`;
  }
  if (/tune-up|schedule|appointment|maintenance/i.test(query)) {
    return `<button onclick="alert('Booking now...')">📅 Book Now</button>`;
  }
  return "";
}

function createModal() {
  const modal = document.createElement("div");
  modal.id = "ai-modal";
  modal.style = `
    position: fixed; top:0; left:0; right:0; bottom:0;
    background: rgba(0,0,0,0.6); display:none;
    justify-content: center; align-items: center;
  `;
  modal.innerHTML = `
    <div style="background:white; padding:20px; border-radius:10px; width:400px; max-width:90%;">
      <h3>AI Answer Bar</h3>
      <input id="ai-query" type="text" placeholder="Ask something..." style="width:100%; padding:8px;">
      <div id="ai-result" style="margin-top:15px;"></div>
      <button onclick="document.getElementById('ai-modal').style.display='none'">Close</button>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById("ai-query").addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      const docs = await loadDocs();
      const query = e.target.value;
      const match = findAnswer(query, docs);
      const resultBox = document.getElementById("ai-result");
      if (match) {
        resultBox.innerHTML = `
          <p>${match.text}</p>
          <small>Source: <a href="${match.url}" target="_blank">${match.title}</a></small>
          <div style="margin-top:10px;">${intentCTA(query)}</div>
        `;
      } else {
        resultBox.innerHTML = `<p>Sorry, I couldn’t find an answer. Try our <a href="/contact">contact page</a>.</p>`;
      }
    }
  });
}

function createButton() {
  const btn = document.createElement("button");
  btn.innerText = "🔍 Search this site";
  btn.style = `
    position: fixed; bottom:20px; right:20px;
    background:#004080; color:white; padding:12px 18px;
    border:none; border-radius:25px; cursor:pointer;
    font-size:14px; box-shadow:0 4px 6px rgba(0,0,0,0.2);
  `;
  btn.onclick = () => {
    document.getElementById("ai-modal").style.display = "flex";
  };
  document.body.appendChild(btn);
}

window.onload = () => {
  createModal();
  createButton();
};
