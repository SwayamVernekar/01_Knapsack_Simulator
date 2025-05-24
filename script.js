
let weights, values, capacity, dp, currentRow, n;
let tablesDiv, nextBtn, resetBtn;

function initialize() {
  weights = document.getElementById("weights").value.split(',').map(Number);
  values = document.getElementById("values").value.split(',').map(Number);
  capacity = parseInt(document.getElementById("capacity").value);
  currentRow = 0;
  n = weights.length;

  if (weights.length !== values.length || isNaN(capacity)) {
    alert("Please enter valid weights, values, and capacity.");
    return;
  }

  dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  tablesDiv = document.getElementById("tables");
  nextBtn = document.getElementById("nextBtn");
  resetBtn = document.getElementById("resetBtn");

  tablesDiv.innerHTML = "";
  nextBtn.style.display = "inline-block";
  resetBtn.style.display = "none";

  renderItemTable(weights, values);
  renderTable(0, true);
}

function nextRow() {
    currentRow++;
  
    if (currentRow > n) {
      nextBtn.style.display = "none";
      resetBtn.style.display = "inline-block";
      const maxProfit = dp[n][capacity];
      addFinalMessage(`✅ <b>Simulation Complete!</b> Maximum Profit = <b>${maxProfit}</b>`);
      scrollToBottom(); 
      return;
    }
  
    const w = weights[currentRow - 1];
    const v = values[currentRow - 1];
  
    for (let j = 0; j <= capacity; j++) {
      if (w <= j) {
        const include = v + dp[currentRow - 1][j - w];
        const exclude = dp[currentRow - 1][j];
        dp[currentRow][j] = Math.max(include, exclude);
      } else {
        dp[currentRow][j] = dp[currentRow - 1][j];
      }
    }
  
    renderTable(currentRow, false);
}
  

function renderTable(uptoRow, isInitial) {
  let html = `<table><tr><th>i/j</th>`;
  for (let c = 0; c <= capacity; c++) html += `<th>${c}</th>`;
  html += `</tr>`;

  for (let i = 0; i <= uptoRow; i++) {
    html += `<tr><th>${i}</th>`;
    for (let j = 0; j <= capacity; j++) {
      const cellClass = i === uptoRow && !isInitial ? "animate" : "";
      html += `<td class="${cellClass}">${dp[i][j]}</td>`;
    }
    html += `</tr>`;
  }

  html += `</table>`;
  const container = document.createElement("div");
  container.classList.add("step-container");
  container.innerHTML = `<h3>Step ${uptoRow}</h3>${html}`;

  const explanation = document.createElement("p");
  explanation.classList.add("explanation");
  explanation.innerHTML = isInitial
    ? "🔹 <b>Row 0</b>: No items considered yet. All values are initialized to 0."
    : generateStepExplanation(uptoRow, weights[uptoRow - 1], values[uptoRow - 1]);

  container.appendChild(explanation);
  tablesDiv.appendChild(container);
  scrollToBottom();
}

function generateStepExplanation(row, w, v) {
  return `🔸 <b>Row ${row}</b>: Considering item ${row} with weight <b>${w}</b> and profit <b>${v}</b>.<br>
  For each capacity from 0 to ${capacity}, we check:<br>
  - If the item fits (weight ≤ capacity), we compare profit from including it (profit + value at remaining capacity) and excluding it.<br>
  - The higher profit is stored in the table.`;
}

function addFinalMessage(msg) {
  const finalMsg = document.createElement("p");
  finalMsg.innerHTML = msg;
  finalMsg.classList.add("final-message");
  tablesDiv.appendChild(finalMsg);
}

function resetSimulation() {
    document.getElementById("weights").value = "";
    document.getElementById("values").value = "";
    document.getElementById("capacity").value = "";
    tablesDiv.innerHTML = "";
    document.getElementById("itemTable").innerHTML = ""; 
    nextBtn.style.display = "none";
    resetBtn.style.display = "none";
  }

function scrollToBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

function renderItemTable(weights, values) {
  const itemTableDiv = document.getElementById("itemTable");
  let html = `<h3>📦 Item List</h3><table><tr><th>Item</th><th>Weight</th><th>Profit</th></tr>`;

  for (let i = 0; i < weights.length; i++) {
    html += `<tr><td>${i + 1}</td><td>${weights[i]}</td><td>${values[i]}</td></tr>`;
  }

  html += `</table>`;
  itemTableDiv.innerHTML = html;
}
