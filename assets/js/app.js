// Selecciona el input de resultado
const resultado = document.getElementById('resultado');

// Agrega el valor al input
const agregarValor = (valor) => {
  const actual = resultado.value;
  const ultimoCaracter = actual.slice(-1);
  const operadores = ['+', '-', '*', '/'];

  // Validación del punto decimal
  if (valor === '.') {
    const partes = actual.split(/[\+\-\*\/]/); // Separa por operadores
    const ultimaParte = partes[partes.length - 1];

    if (ultimaParte.includes('.')) return;
    if (ultimaParte === '') {
      resultado.value += '0.';
      return;
    }
  }

  // Evita varios puntos seguidos
  if (valor === '.' && ultimoCaracter === '.') return;

  // Manejo de operadores
  if (operadores.includes(valor)) {
    // No permite iniciar con +, *, /
    if (actual === '' && valor !== '-') return;

    // Si el último carácter es un operador, reemplázalo por el nuevo
    if (operadores.includes(ultimoCaracter)) {
      resultado.value = actual.slice(0, -1) + valor;
      return;
    }
  }

  // Si pasa todas las validaciones, lo agrega normalmente
  resultado.value += valor;
};

// Limpia el input
const limpiar = () => {
  resultado.value = '';
};

// Evalúa la expresión del input
const calcular = () => {
  let expresion = resultado.value.trim();

  // Evitar evaluar si está vacío
  if (expresion === '') return;

  // Reemplazar el símbolo '%' por su equivalente matemático
  expresion = expresion.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

  // Ajustar porcentajes en operaciones de suma y resta
  expresion = expresion.replace(/(\d+(\.\d+)?)([+\-])(\d+(\.\d+)?\/100)/g, '($1$3($1*$4))');

  // Evitar terminar con operador
  const ultimoCaracter = expresion.slice(-1);
  if (['+', '-', '*', '/', '.'].includes(ultimoCaracter)) {
    expresion = expresion.slice(0, -1);
  }

  // Evitar división por cero
  if (/\/0(?!\d)/.test(expresion)) {
    resultado.value = 'Error: división por 0';
    return;
  }

  try {
    // Evaluar la expresión de forma segura
    const resultadoFinal = eval(expresion);
    resultado.value = resultadoFinal;
  } catch (error) {
    resultado.value = 'Error';
  }

  // Expresiones como: número + porcentaje
  const regex = /(\d+(\.\d+)?)\s*([\+\-])\s*(\d+(\.\d+)?)%/;

  if (regex.test(expresion)) {
    expresion = expresion.replace(regex, (match, num1, _, operador, porcentaje) => {
      num1 = parseFloat(num1);
      porcentaje = parseFloat(porcentaje);
      let valorPorcentaje = num1 * porcentaje / 100;

      if (operador === '+') {
        return num1 + valorPorcentaje;
      } else {
        return num1 - valorPorcentaje;
      }
    });
  }

  try {
    resultado.value = eval(expresion);
  } catch (error) {
    resultado.value = "Error";
  }
};

// Borra el último carácter del input
const retroceder = () => {
  resultado.value = resultado.value.slice(0, -1);
};

// Calcula el porcentaje del número actual
const calcularPorcentaje = () => {
  const actual = resultado.value.trim();

  // Evitar agregar '%' si el último carácter ya es un operador o '%'
  if (actual === '' || ['+', '-', '*', '/', '%'].includes(actual.slice(-1))) return;

  // Agregar el símbolo '%' al campo de entrada
  resultado.value += '%';
};

