// MATRIZES SECTION
    const tableA = document.getElementById('tableA');
    const tableB = document.getElementById('tableB');

    const addRowA = document.getElementById('addRowA');
    const removeRowA = document.getElementById('removeRowA');
    const addColA = document.getElementById('addColA');
    const removeColA = document.getElementById('removeColA');

    const addRowB = document.getElementById('addRowB');
    const removeRowB = document.getElementById('removeRowB');
    const addColB = document.getElementById('addColB');
    const removeColB = document.getElementById('removeColB');

    const operationSelect = document.getElementById('operationSelect');
    const solveBtn = document.getElementById('solveBtn');
    const stepsDiv = document.getElementById('steps');

    let dimsA = { rows: 3, cols: 3 };
    let dimsB = { rows: 3, cols: 3 };

    function createNumberInput(value = '') {
      const input = document.createElement('input');
      input.type = 'number';
      input.step = '1';
      input.value = value;
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.style.minWidth = '60px';
      return input;
    }

    function buildTable(table, dims) {
      table.innerHTML = '';

      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      for (let c = 1; c <= dims.cols; c++) {
        const th = document.createElement('th');
        th.textContent = 'Col ' + c;
        headerRow.appendChild(th);
      }
      thead.appendChild(headerRow);
      table.appendChild(thead);

      const tbody = document.createElement('tbody');
      for (let r = 0; r < dims.rows; r++) {
        const tr = document.createElement('tr');
        for (let c = 0; c < dims.cols; c++) {
          const td = document.createElement('td');
          const input = createNumberInput('');
          td.appendChild(input);
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      }
      table.appendChild(tbody);
    }

    function readMatrix(table) {
      const matrix = [];
      const tbody = table.querySelector('tbody');
      if (!tbody) return matrix;
      for (const row of tbody.rows) {
        const rowValues = [];
        for (const cell of row.cells) {
          const input = cell.querySelector('input');
          const val = parseInt(input.value, 10);
          if (isNaN(val)) return null;
          rowValues.push(val);
        }
        matrix.push(rowValues);
      }
      return matrix;
    }

    function clearSteps(){
      stepsDiv.textContent = '';
      stepsDiv.classList.remove('error');
    }
    function addStep(text){
      stepsDiv.textContent += text + '\n\n';
      stepsDiv.scrollTop = stepsDiv.scrollHeight;
    }
    function setError(text){
      stepsDiv.classList.add('error');
      stepsDiv.textContent = text;
    }

    function matrixToString(matrix) {
      return matrix.map(row => row.map(v => v.toString()).join('\t')).join('\n');
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
      if (!sameDimensions(A, B)){
        setError("Erro: Matrizes devem ter as mesmas dimensões para soma.");
        return;
      }
      let result = [];
      for(let i=0; i<A.length; i++){
        let row = [];
        for(let j=0; j<A[0].length; j++){
          let val = A[i][j] + B[i][j];
          row.push(val);
          addStep(`Elemento [${i+1},${j+1}]: ${A[i][j]} + ${B[i][j]} = ${val}`);
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
      if (!sameDimensions(A, B)){
        setError("Erro: Matrizes devem ter as mesmas dimensões para subtração.");
        return;
      }
      let result = [];
      for(let i=0; i<A.length; i++){
        let row = [];
        for(let j=0; j<A[0].length; j++){
          let val = A[i][j] - B[i][j];
          row.push(val);
          addStep(`Elemento [${i+1},${j+1}]: ${A[i][j]} - ${B[i][j]} = ${val}`);
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
      if (A[0].length !== B.length){
        setError("Erro: Número de colunas de A deve ser igual ao número de linhas de B para multiplicação.");
        return;
      }
      let result = math.multiply(A, B);
      for(let i=0; i<A.length; i++){
        for(let j=0; j<B[0].length; j++){
          let products = [];
          for(let k=0; k<B.length; k++){
            products.push(`${A[i][k]}×${B[k][j]}`);
          }
          let stepStr = products.join(' + ');
          addStep(`Elemento [${i+1},${j+1}]: ${stepStr} = ${result[i][j].toFixed(0)}`);
        }
      }
      let resultInt = result.map(row => row.map(v => Math.round(v)));
      addStep("Matriz Resultado (A × B):\n" + matrixToString(resultInt));
    }

    function transposicaoA(A) {
      clearSteps();
      addStep("Operação: Transposição da Matriz A (Aᵀ)");
      addStep("Matriz A:\n" + matrixToString(A));
      let result = math.transpose(A);
      let resultInt = result.map(row => row.map(v => Math.round(v)));
      addStep("Matriz Transposta Aᵀ:\n" + matrixToString(resultInt));
    }

    function determinanteA(A) {
      clearSteps();
      addStep("Operação: Determinante da Matriz A");
      if (!isSquare(A)) {
        setError("Erro: Determinante só pode ser calculado para matrizes quadradas.");
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
        setError("Erro: Inversa só pode ser calculada para matrizes quadradas.");
        return;
      }
      addStep("Matriz A:\n" + matrixToString(A));
      try {
        let det = math.det(A);
        addStep("Determinante: det(A) = " + Math.round(det));
        if (Math.abs(det) < 1e-12) {
          setError("A matriz é singular (determinante zero), não possui inversa.");
          return;
        }
        let inv = math.inv(A);
        let invRounded = inv.map(row => row.map(v => Math.round(v)));
        addStep("Matriz Inversa A⁻¹ arredondada para inteiros (aproximação):");
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

      if (['add','subtract','multiply'].includes(op)) {
        let B = readMatrix(tableB);
        if (!B) {
          setError("Erro: Matriz B contém entradas inválidas ou vazias.");
          return;
        }
        switch(op){
          case 'add': somaMatrizes(A,B); break;
          case 'subtract': subtracaoMatrizes(A,B); break;
          case 'multiply': multiplicacaoMatrizes(A,B); break;
        }
      } else {
        switch(op){
          case 'transposeA': transposicaoA(A); break;
          case 'determinantA': determinanteA(A); break;
          case 'inverseA': inversaA(A); break;
        }
      }
    }

    function addRow(dims, table) {
      dims.rows++;
      buildTable(table, dims);
    }
    function removeRow(dims, table) {
      if(dims.rows > 1){
        dims.rows--;
        buildTable(table, dims);
      }
    }
    function addCol(dims, table) {
      dims.cols++;
      buildTable(table, dims);
    }
    function removeCol(dims, table) {
      if(dims.cols > 1){
        dims.cols--;
        buildTable(table, dims);
      }
    }

    addRowA.addEventListener('click', ()=>addRow(dimsA, tableA));
    removeRowA.addEventListener('click', ()=>removeRow(dimsA, tableA));
    addColA.addEventListener('click', ()=>addCol(dimsA, tableA));
    removeColA.addEventListener('click', ()=>removeCol(dimsA, tableA));

    addRowB.addEventListener('click', ()=>addRow(dimsB, tableB));
    removeRowB.addEventListener('click', ()=>removeRow(dimsB, tableB));
    addColB.addEventListener('click', ()=>addCol(dimsB, tableB));
    removeColB.addEventListener('click', ()=>removeCol(dimsB, tableB));

    solveBtn.addEventListener('click', solve);

    function updateBMatrixControls() {
      const op = operationSelect.value;
      const needB = ['add','subtract','multiply'].includes(op);
      [addRowB,removeRowB,addColB,removeColB].forEach(btn => btn.disabled = !needB);
      tableB.style.opacity = needB ? "1" : "0.5";
      tableB.closest('.matrix-container').style.pointerEvents = needB ? "auto" : "none";
    }

    operationSelect.addEventListener('change', ()=>{
      updateBMatrixControls();
      clearSteps();
    });

    buildTable(tableA, dimsA);
    buildTable(tableB, dimsB);
    updateBMatrixControls();

    // POLYNOMIAL Section
    const polyInput = document.getElementById('polyInput');
    const polyOpSelect = document.getElementById('polyOpSelect');
    const polyEvalValue = document.getElementById('polyEvalValue');
    const polyComputeBtn = document.getElementById('polyComputeBtn');
    const polySteps = document.getElementById('polySteps');
    const evalValueGroup = document.getElementById('evalValueGroup');

    function clearPolySteps(){
      polySteps.textContent = '';
      polySteps.classList.remove('error');
    }
    function addPolyStep(text){
      polySteps.textContent += text + '\n\n';
      polySteps.scrollTop = polySteps.scrollHeight;
    }
    function setPolyError(text){
      polySteps.classList.add('error');
      polySteps.textContent = text;
    }

    function updateEvalInputVisibility() {
      if (polyOpSelect.value === 'evaluate') {
        evalValueGroup.style.display = 'flex';
      } else {
        evalValueGroup.style.display = 'none';
      }
    }
    polyOpSelect.addEventListener('change', updateEvalInputVisibility);
    updateEvalInputVisibility();

    function polyToString(node) {
      try {
        return node.toString({parenthesis: 'auto'});
      } catch {
        return node.toString();
      }
    }

    function computePolynomial() {
      clearPolySteps();
      const polyStr = polyInput.value.trim();
      if (!polyStr) {
        setPolyError('Por favor, insira um polinômio válido.');
        return;
      }
      let expr;
      try {
        expr = math.parse(polyStr);
      } catch (e) {
        setPolyError('Erro ao interpretar o polinômio: ' + e.message);
        return;
      }

      const op = polyOpSelect.value;

      if (op === 'evaluate') {
        let xVal = parseFloat(polyEvalValue.value);
        if (isNaN(xVal)) {
          setPolyError('Por favor, informe um valor numérico válido para x.');
          return;
        }
        addPolyStep(`Polinômio: ${polyStr}`);
        addPolyStep(`Avaliar em x = ${xVal}`);
        try {
          const code = expr.compile();
          let result = code.evaluate({x: xVal});
          if (typeof result === 'number') result = Math.round(result * 1e12) / 1e12;
          addPolyStep(`Resultado: ${result}`);
        } catch (e) {
          setPolyError('Erro ao avaliar o polinômio: ' + e.message);
        }
      }
      else if (op === 'derivative') {
        addPolyStep(`Polinômio: ${polyStr}`);
        addPolyStep('Derivando em relação a x...');
        try {
          const derived = math.derivative(expr, 'x');
          const simplified = derived.simplify();
          addPolyStep(`Derivada: ${polyToString(simplified)}`);
        } catch (e) {
          setPolyError('Erro ao derivar o polinômio: ' + e.message);
        }
      }
      else if (op === 'integral') {
        addPolyStep(`Polinômio: ${polyStr}`);
        addPolyStep('Integrando indefinidamente em relação a x...');
        try {
          const simplified = expr.simplify();

          let integralStr = '';

          function integrateNode(node) {
            if(node.isConstantNode) {
              return `${node.value}x`;
            } else if(node.isSymbolNode) {
              if(node.name === 'x') return "0.5x^2";
              else throw new Error('Variável desconhecida: ' + node.name);
            } else if(node.isOperatorNode){
              if(node.op === '+') {
                return node.args.map(integrateNode).join(' + ');
              }
              else if(node.op === '-') {
                return node.args.map(integrateNode).join(' - ');
              } else if(node.op === '*') {
                const [a,b] = node.args;
                if(a.isConstantNode && b.isOperatorNode && b.op === '^' && b.args[0].isSymbolNode && b.args[0].name==='x' && b.args[1].isConstantNode) {
                  const c = a.value;
                  const n = b.args[1].value;
                  const newN = n+1;
                  const coef = c / newN;
                  return coef + 'x^' + newN;
                }
                else if (b.isConstantNode && a.isOperatorNode && a.op === '^' && a.args[0].isSymbolNode && a.args[0].name==='x' && a.args[1].isConstantNode) {
                  const c = b.value;
                  const n = a.args[1].value;
                  const newN = n+1;
                  const coef = c / newN;
                  return coef + 'x^' + newN;
                } else if (a.isConstantNode && b.isSymbolNode && b.name === 'x') {
                  const coef = a.value / 2;
                  return coef + 'x^2';
                } else if (b.isConstantNode && a.isSymbolNode && a.name === 'x') {
                  const coef = b.value / 2;
                  return coef + 'x^2';
                }
                else throw new Error('Termo não suportado para integração.');
              } else if(node.op === '^'){
                if(node.args[0].isSymbolNode && node.args[0].name==='x' && node.args[1].isConstantNode) {
                  const n = node.args[1].value;
                  const newN = n+1;
                  const coef = 1 / newN;
                  return coef + 'x^' + newN;
                } else {
                  throw new Error('Padrão não suportado para potência.');
                }
              } else {
                throw new Error('Operador não suportado para integração.');
              }
            } else if(node.isParenthesisNode) {
              return integrateNode(node.content);
            } else {
              throw new Error('Tipo de nó não suportado: ' + node.type);
            }
          }

          try {
            integralStr = integrateNode(simplified);
            addPolyStep('Integral indefinida aproximada:');
            addPolyStep(integralStr + ' + C');
          } catch(integErr) {
            setPolyError('Erro ao integrar polinômio: ' + integErr.message + '\n' +
                         'A integração simbólica completa não é suportada, apenas polinômios simples.');
          }

        } catch (e) {
          setPolyError('Erro ao integrar o polinômio: ' + e.message);
        }
      }
    }

    polyComputeBtn.addEventListener('click', computePolynomial);