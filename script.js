// MATRIZES SECTION
const tableA = document.getElementById("tableA");
const tableB = document.getElementById("tableB");

const addRowA = document.getElementById("addRowA");
const removeRowA = document.getElementById("removeRowA");
const addColA = document.getElementById("addColA");
const removeColA = document.getElementById("removeColA");

const addRowB = document.getElementById("addRowB");
const removeRowB = document.getElementById("removeRowB");
const addColB = document.getElementById("addColB");
const removeColB = document.getElementById("removeColB");

const operationSelect = document.getElementById("operationSelect");
const solveBtn = document.getElementById("solveBtn");
const stepsDiv = document.getElementById("steps");

let dimsA = { rows: 3, cols: 3 };
let dimsB = { rows: 3, cols: 3 };

function createNumberInput(value = "") {
  const input = document.createElement("input");
  input.type = "number";
  input.step = "1";
  input.value = value;
  input.autocomplete = "off";
  input.spellcheck = false;
  input.style.minWidth = "60px";
  return input;
}

function buildTable(table, dims) {
  table.innerHTML = "";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  for (let c = 1; c <= dims.cols; c++) {
    const th = document.createElement("th");
    th.textContent = "Col " + c;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  for (let r = 0; r < dims.rows; r++) {
    const tr = document.createElement("tr");
    for (let c = 0; c < dims.cols; c++) {
      const td = document.createElement("td");
      const input = createNumberInput("");
      td.appendChild(input);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
}

function readMatrix(table) {
  const matrix = [];
  const tbody = table.querySelector("tbody");
  if (!tbody) return matrix;
  for (const row of tbody.rows) {
    const rowValues = [];
    for (const cell of row.cells) {
      const input = cell.querySelector("input");
      const val = parseInt(input.value, 10);
      if (isNaN(val)) return null;
      rowValues.push(val);
    }
    matrix.push(rowValues);
  }
  return matrix;
}

function clearSteps() {
  stepsDiv.textContent = "";
  stepsDiv.classList.remove("error");
}
function addStep(text) {
  stepsDiv.textContent += text + "\n\n";
  stepsDiv.scrollTop = stepsDiv.scrollHeight;
}
function setError(text) {
  stepsDiv.classList.add("error");
  stepsDiv.textContent = text;
}

function matrixToString(matrix) {
  return matrix
    .map((row) => row.map((v) => v.toString()).join("\t"))
    .join("\n");
}

function sameDimensions(matA, matB) {
  return matA.length === matB.length && matA[0].length === matB[0].length;
}

function isSquare(matrix) {
  return matrix.length === matrix[0].length;
}

function somaMatrizes(A, B) {
  clearSteps();
  addStep("Operação: Soma de matrizes (A + B)");
  addStep("Matriz A:\n" + matrixToString(A));
  addStep("Matriz B:\n" + matrixToString(B));
  if (!sameDimensions(A, B)) {
    setError("Erro: Matrizes devem ter as mesmas dimensões para soma.");
    return;
  }
  let result = [];
  for (let i = 0; i < A.length; i++) {
    let row = [];
    for (let j = 0; j < A[0].length; j++) {
      let val = A[i][j] + B[i][j];
      row.push(val);
      addStep(
        `Elemento [${i + 1},${j + 1}]: ${A[i][j]} + ${B[i][j]} = ${val}`
      );
    }
    result.push(row);
  }
  addStep("Matriz Resultado (A + B):\n" + matrixToString(result));
}

function subtracaoMatrizes(A, B) {
  clearSteps();
  addStep("Operação: Subtração de matrizes (A - B)");
  addStep("Matriz A:\n" + matrixToString(A));
  addStep("Matriz B:\n" + matrixToString(B));
  if (!sameDimensions(A, B)) {
    setError(
      "Erro: Matrizes devem ter as mesmas dimensões para subtração."
    );
    return;
  }
  let result = [];
  for (let i = 0; i < A.length; i++) {
    let row = [];
    for (let j = 0; j < A[0].length; j++) {
      let val = A[i][j] - B[i][j];
      row.push(val);
      addStep(
        `Elemento [${i + 1},${j + 1}]: ${A[i][j]} - ${B[i][j]} = ${val}`
      );
    }
    result.push(row);
  }
  addStep("Matriz Resultado (A - B):\n" + matrixToString(result));
}

function multiplicacaoMatrizes(A, B) {
  clearSteps();
  addStep("Operação: Multiplicação de matrizes (A × B)");
  addStep("Matriz A:\n" + matrixToString(A));
  addStep("Matriz B:\n" + matrixToString(B));
  if (A[0].length !== B.length) {
    setError(
      "Erro: Número de colunas de A deve ser igual ao número de linhas de B para multiplicação."
    );
    return;
  }
  let result = math.multiply(A, B);
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < B[0].length; j++) {
      let products = [];
      for (let k = 0; k < B.length; k++) {
        products.push(`${A[i][k]}×${B[k][j]}`);
      }
      let stepStr = products.join(" + ");
      addStep(
        `Elemento [${i + 1},${j + 1}]: ${stepStr} = ${result[i][
          j
        ].toFixed(0)}`
      );
    }
  }
  let resultInt = result.map((row) => row.map((v) => Math.round(v)));
  addStep("Matriz Resultado (A × B):\n" + matrixToString(resultInt));
}

function transposicaoA(A) {
  clearSteps();
  addStep("Operação: Transposição da Matriz A (Aᵀ)");
  addStep("Matriz A:\n" + matrixToString(A));
  let result = math.transpose(A);
  let resultInt = result.map((row) => row.map((v) => Math.round(v)));
  addStep("Matriz Transposta Aᵀ:\n" + matrixToString(resultInt));
}

function determinanteA(A) {
  clearSteps();
  addStep("Operação: Determinante da Matriz A");
  if (!isSquare(A)) {
    setError(
      "Erro: Determinante só pode ser calculado para matrizes quadradas."
    );
    return;
  }
  addStep("Matriz A:\n" + matrixToString(A));
  try {
    let det = math.det(A);
    addStep("Determinante calculado: det(A) = " + Math.round(det));
  } catch (e) {
    setError("Erro ao calcular determinante: " + e.message);
  }
}

function inversaA(A) {
  clearSteps();
  addStep("Operação: Inversa da Matriz A");
  if (!isSquare(A)) {
    setError(
      "Erro: Inversa só pode ser calculada para matrizes quadradas."
    );
    return;
  }
  addStep("Matriz A:\n" + matrixToString(A));
  try {
    let det = math.det(A);
    addStep("Determinante: det(A) = " + Math.round(det));
    if (Math.abs(det) < 1e-12) {
      setError(
        "A matriz é singular (determinante zero), não possui inversa."
      );
      return;
    }
    let inv = math.inv(A);
    let invRounded = inv.map((row) => row.map((v) => Math.round(v)));
    addStep(
      "Matriz Inversa A⁻¹ arredondada para inteiros (aproximação):"
    );
    addStep(matrixToString(invRounded));
  } catch (e) {
    setError("Erro ao calcular inversa: " + e.message);
  }
}

function solve() {
  let A = readMatrix(tableA);
  if (!A) {
    setError("Erro: Matriz A contém entradas inválidas ou vazias.");
    return;
  }
  let op = operationSelect.value;

  if (["add", "subtract", "multiply"].includes(op)) {
    let B = readMatrix(tableB);
    if (!B) {
      setError("Erro: Matriz B contém entradas inválidas ou vazias.");
      return;
    }
    switch (op) {
      case "add":
        somaMatrizes(A, B);
        break;
      case "subtract":
        subtracaoMatrizes(A, B);
        break;
      case "multiply":
        multiplicacaoMatrizes(A, B);
        break;
    }
  } else {
    switch (op) {
      case "transposeA":
        transposicaoA(A);
        break;
      case "determinantA":
        determinanteA(A);
        break;
      case "inverseA":
        inversaA(A);
        break;
    }
  }
}

function addRow(dims, table) {
  dims.rows++;
  buildTable(table, dims);
}
function removeRow(dims, table) {
  if (dims.rows > 1) {
    dims.rows--;
    buildTable(table, dims);
  }
}
function addCol(dims, table) {
  dims.cols++;
  buildTable(table, dims);
}
function removeCol(dims, table) {
  if (dims.cols > 1) {
    dims.cols--;
    buildTable(table, dims);
  }
}

function updateBMatrixControls() {
  const op = operationSelect.value;
  const needB = ["add", "subtract", "multiply"].includes(op);
  [addRowB, removeRowB, addColB, removeColB].forEach(
    (btn) => (btn.disabled = !needB)
  );
  tableB.style.opacity = needB ? "1" : "0.5";
  tableB.closest(".matrix-container").style.pointerEvents = needB
    ? "auto"
    : "none";
}

// POLYNOMIAL Section
const polyInput = document.getElementById("polyInput");
const polyOpSelect = document.getElementById("polyOpSelect");
const polyEvalValue = document.getElementById("polyEvalValue");
const polyComputeBtn = document.getElementById("polyComputeBtn");
const polySteps = document.getElementById("polySteps");
const evalValueGroup = document.getElementById("evalValueGroup");

function clearPolySteps() {
  polySteps.textContent = "";
  polySteps.classList.remove("error");
}
function addPolyStep(text) {
  polySteps.textContent += text + "\n\n";
  polySteps.scrollTop = polySteps.scrollHeight;
}
function setPolyError(text) {
  polySteps.classList.add("error");
  polySteps.textContent = text;
}

function updateEvalInputVisibility() {
  if (polyOpSelect.value === "evaluate") {
    evalValueGroup.style.display = "flex";
  } else {
    evalValueGroup.style.display = "none";
  }
}

function computePolynomial() {
  clearPolySteps();
  const polyStr = polyInput.value.trim();
  if (!polyStr) {
    setPolyError('Por favor, insira um polinômio.');
    return;
  }

  // Remove espaços para padronização
  const normalizedPolyStr = polyStr.replace(/\s+/g, '');
  
  const isValid = /^[0-9xX\^\+\-\.,\(\)]+$/.test(normalizedPolyStr);
  if (!isValid) {
    setPolyError('Entrada inválida. Use apenas números, a variável x e os operadores +, -, ^.');
    return;
  }

  const op = polyOpSelect.value;

  if (op === 'evaluate') {
    const xValue = parseFloat(polyEvalValue.value);
    if (isNaN(xValue)) {
      setPolyError('Por favor, insira um valor numérico válido para x.');
      return;
    }
    
    addPolyStep(`Polinômio: ${normalizedPolyStr}`);
    addPolyStep(`Avaliando em x = ${xValue}`);
    
    try {
      // Substitui x pelo valor e avalia
      const expr = normalizedPolyStr.replace(/x/gi, `(${xValue})`);
      const result = math.evaluate(expr);
      addPolyStep(`Resultado: ${math.round(result, 6)}`);
    } catch (e) {
      setPolyError('Erro ao avaliar polinômio: ' + e.message);
    }
  }
  else if (op === 'roots') {
    addPolyStep(`Polinômio: ${normalizedPolyStr}`);
    
    try {
      // Tenta extrair os coeficientes diretamente
      const coeffs = extractCoefficients(normalizedPolyStr);
      if (!coeffs || coeffs.length === 0) {
        setPolyError('Não foi possível extrair coeficientes do polinômio.');
        return;
      }
      
      addPolyStep(`Coeficientes: [${coeffs.join(', ')}]`);
      
      // Calcula raízes
      const roots = findPolynomialRoots(coeffs);
      
      if (roots.length === 0) {
        addPolyStep('Nenhuma raiz real encontrada.');
      } else {
        addPolyStep('Raízes encontradas:');
        roots.forEach((root, i) => {
          let rootStr;
          if (typeof root === 'number') {
            rootStr = math.round(root, 6).toString();
          } else if (math.isComplex(root)) {
            const re = math.round(root.re, 6);
            const im = math.round(root.im, 6);
            rootStr = im === 0 ? re.toString() : 
                     `${re} ${im < 0 ? '-' : '+'} ${Math.abs(im)}i`;
          } else {
            rootStr = root.toString();
          }
          addPolyStep(`x${i+1} = ${rootStr}`);
        });
      }
    } catch (e) {
      setPolyError('Erro ao calcular raízes: ' + e.message + 
                 '\nDica: Use a sintaxe "ax^n+bx+c" (ex: "2x^2-5x+6")');
    }
  }
}

// Função para extrair coeficientes de um polinômio
function extractCoefficients(polyStr) {
  // Converte para minúsculas para padronizar
  const str = polyStr.toLowerCase();
  
  // Encontra o grau máximo do polinômio
  let maxDegree = 0;
  const degreeMatches = str.match(/x\^(\d+)/g) || [];
  degreeMatches.forEach(match => {
    const degree = parseInt(match.split('^')[1]);
    if (degree > maxDegree) maxDegree = degree;
  });
  
  // Se não encontrou grau, verifica se tem x simples (grau 1)
  if (maxDegree === 0 && str.includes('x')) maxDegree = 1;
  
  // Array para armazenar os coeficientes
  const coeffs = new Array(maxDegree + 1).fill(0);
  
  // Divide em termos
  const terms = str.split(/(?=[+-])/);
  
  // Processa cada termo
  terms.forEach(term => {
    term = term.trim();
    if (!term) return;
    
    let sign = 1;
    if (term.startsWith('-')) {
      sign = -1;
      term = term.substring(1);
    } else if (term.startsWith('+')) {
      term = term.substring(1);
    }
    
    // Termo constante
    if (!term.includes('x')) {
      const value = parseFloat(term) || 0;
      coeffs[0] += sign * value;
      return;
    }
    
    // Termo com x
    const parts = term.split('x');
    let coef = parts[0] ? parseFloat(parts[0]) : 1;
    if (isNaN(coef)) coef = 1;
    
    let degree = 1;
    if (parts[1]) {
      if (parts[1].startsWith('^')) {
        degree = parseInt(parts[1].substring(1));
      }
    }
    
    coeffs[degree] += sign * coef;
  });
  
  return coeffs.reverse(); // Inverte para ordem padrão (maior grau primeiro)
}

// Função para encontrar raízes de um polinômio
function findPolynomialRoots(coeffs) {
  const roots = [];
  const degree = coeffs.length - 1;
  
  // Grau 1: ax + b = 0
  if (degree === 1) {
    roots.push(-coeffs[1] / coeffs[0]);
    return roots;
  }
  
  // Grau 2: ax² + bx + c = 0
  if (degree === 2) {
    const a = coeffs[0];
    const b = coeffs[1];
    const c = coeffs[2];
    const delta = b * b - 4 * a * c;
    
    if (delta >= 0) {
      roots.push((-b + Math.sqrt(delta)) / (2 * a));
      roots.push((-b - Math.sqrt(delta)) / (2 * a));
    } else {
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(-delta) / (2 * a);
      roots.push(math.complex(realPart, imagPart));
      roots.push(math.complex(realPart, -imagPart));
    }
    return roots;
  }
  
  // Grau 3 ou superior - usa método numérico
  return findRootsNumerically(coeffs);
}

// Método numérico para encontrar raízes (Durand-Kerner)
function findRootsNumerically(coeffs) {
  const degree = coeffs.length - 1;
  if (degree < 1) return [];
  
  // Estimativa inicial para as raízes
  let roots = [];
  for (let i = 0; i < degree; i++) {
    roots.push(math.complex(Math.random() * 2 - 1, Math.random() * 2 - 1));
  }
  
  // Iterações do método
  for (let iter = 0; iter < 100; iter++) {
    let newRoots = [];
    for (let i = 0; i < degree; i++) {
      let numerator = evaluatePolynomial(coeffs, roots[i]);
      let denominator = 1;
      for (let j = 0; j < degree; j++) {
        if (i !== j) {
          denominator = math.multiply(
            denominator,
            math.subtract(roots[i], roots[j])
          );
        }
      }
      newRoots.push(math.subtract(roots[i], math.divide(numerator, denominator)));
    }
    roots = newRoots;
  }
  
  return roots;
}

// Avalia um polinômio em um ponto complexo
function evaluatePolynomial(coeffs, x) {
  let result = math.complex(0);
  for (let i = 0; i < coeffs.length; i++) {
    const term = math.multiply(
      coeffs[i],
      math.pow(x, coeffs.length - 1 - i)
    );
    result = math.add(result, term);
  }
  return result;
}

// Event Listeners
addRowA.addEventListener("click", () => addRow(dimsA, tableA));
removeRowA.addEventListener("click", () => removeRow(dimsA, tableA));
addColA.addEventListener("click", () => addCol(dimsA, tableA));
removeColA.addEventListener("click", () => removeCol(dimsA, tableA));

addRowB.addEventListener("click", () => addRow(dimsB, tableB));
removeRowB.addEventListener("click", () => removeRow(dimsB, tableB));
addColB.addEventListener("click", () => addCol(dimsB, tableB));
removeColB.addEventListener("click", () => removeCol(dimsB, tableB));

solveBtn.addEventListener("click", solve);
operationSelect.addEventListener("change", () => {
  updateBMatrixControls();
  clearSteps();
});

polyOpSelect.addEventListener("change", updateEvalInputVisibility);
polyComputeBtn.addEventListener("click", computePolynomial);

// Initialize
buildTable(tableA, dimsA);
buildTable(tableB, dimsB);
updateBMatrixControls();
updateEvalInputVisibility();