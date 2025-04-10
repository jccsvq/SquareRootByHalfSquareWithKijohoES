var procedure = { 
"INIT": initialProcess, 
"TOPDIGIT": determineTopDigit,
"SUBSQUARE": subtractSquare,
"DIVBY2": divideBy2,
"HASSAN": hassan,
"CHEATCHECK": cheatCheck,
"MULSUB": multiplyAndSubtract,
"HALFSQUARESUB": halfSquareSubtract,
"FINISHED": finished,
};

function finished() {
  return "FINISHED";
}

function halfSquareSubtract() {
  var digit = getPartialNumber(resultPointer, 1);
  var temp =  getPartialNumber(resultPointer+1, resultPointer+2);     // 2 digit + 1 digit (fraction part)
  temp -= (digit * digit) * 5;
  puts("Restar la mitad del cuadrado de " + rulerRangeWithValue(resultPointer, resultPointer) + " que es " + (digit * digit / 2.0) + " de " + rulerRange(resultPointer+1, valuePointer+1) + "." + rulerRange(valuePointer+2, valuePointer+2) + ".");
  putNumber(temp, resultPointer+1, resultPointer+2);
  outputPanel();
  if (getPartialNumber(resultPointer+1, workArray.length-resultPointer-1) == 0) {
    puts("FIN");
    return "FINISHED";
  } else {
    valuePointer = resultPointer + 1;
    puts("Fin de la Fase V... continuando a Fase IV.");
    puts("Fase IV:: Ahora, determinamos el " + nth(resultPointer+2) + " dígito (desde la izquierda) del resultado.");
    return "HASSAN";
  }
}

function multiplyAndSubtract() {
  if (divisorPointer >= resultPointer) {
    puts("Fin de la Fase IV...continuando a la Fase V.");
    puts("Fase V:: Restar la mitad del cuadrado.");
    return "HALFSQUARESUB";
  }
  var currentResult = getPartialNumber(resultPointer, 1);
  var a = getPartialNumber(divisorPointer, 1);
  puts("  Restar el resultado de " + rulerRange(resultPointer, resultPointer) + "*" + rulerRange(divisorPointer, divisorPointer) + " de " + rulerRange(resultPointer+1, valuePointer+1));
  a = a * currentResult;
  putNumber(getPartialNumber(resultPointer+1, valuePointer-resultPointer+1) - a, resultPointer+1, valuePointer-resultPointer+1);
  outputPanel();
  valuePointer++;
  divisorPointer++;
  return "MULSUB";
}

function cheatCheck() {
  var processDigit = resultPointer - 1;
  var currentResult = getPartialNumber(resultPointer, 1);
  var sum = 0;
  var ll = resultPointer - 1;
  sum = getPartialNumber(1, ll) * currentResult * 100 + (currentResult * currentResult * 5);
  if (sum > getPartialNumber(resultPointer+1, processDigit+3)) {
    puts("  El resultado temporal es demasiado grande, restamos UNO de " + rulerRangeWithValue(resultPointer, resultPointer) + " y sumamos " + english[getPartialNumber(0, 1)] + " a la columna de la derecha.");
    putNumber(getPartialNumber(resultPointer, 1) - 1, resultPointer, 1);
    putNumber(getPartialNumber(resultPointer+1, 1) + getPartialNumber(0, 1), resultPointer + 1, 1);
    outputPanel();
    return "CHEATCHECK";
  }
  puts("Puede dividirse, procedemos...");
  return "MULSUB";
}

var resultPointer;
var divisorPointer;
function hassan() {
  var hou = getPartialNumber(0, 1);
  var jitsu = getPartialNumber(valuePointer, 1);
  if (hou > jitsu) {
    var wrg1 = Math.trunc((jitsu * 10) / hou)
    var wrg2 = (jitsu * 10) % hou
    if (wrg1 != 0) {
      put("Mirando (" + rulerRange(0, 0) + " &) " + rulerRange(valuePointer, valuePointer) + " : " + english[getPartialNumber(0, 1)] + " " + english[getPartialNumber(valuePointer, 1)] + ",");
      if (wrg1 != jitsu) {
        put(" hace " + english[wrg1]);
        if (wrg2 != 0) {
          put(" y ");
        }
      }
      if (wrg2 != 0) {
        put(" sumar " + english[wrg2] + " a la derecha.");
      }
      puts("");
      workArray[valuePointer] = wrg1;
      workArray[valuePointer + 1] += wrg2;
      outputPanel();
    }
    var ctr = 0;
    while (getPartialNumber(valuePointer + 1, 1) >= hou) {
      workArray[valuePointer + 1]  -= hou;
      workArray[valuePointer]++;
      ctr++;
    }
    if (ctr > 0) {
      puts("Mirando (" + rulerRange(0, 0) + " & " + rulerRange(valuePointer+1, valuePointer+1) + ") : restar " + english[ctr * hou] + " de " + rulerRange(valuePointer+1, valuePointer+1) + " y sumar " + english[ctr] + " a " + rulerRange(valuePointer, valuePointer) + ".");
      outputPanel();
    }
  } else {
    workArray[valuePointer] = 9;
    workArray[valuePointer + 1] += hou;
    puts("Ken 1 mutou");
    outputPanel();
  }
  resultPointer = valuePointer;
  valuePointer++;
  divisorPointer = 1;
  return "CHEATCHECK";
}

var valuePointer;
function divideBy2() {
  var processed = false;
  var left = 0;
  puts("  Procesando columna " + rulerRange(valuePointer, valuePointer));
  while (workArray[valuePointer] >= 2) {
    left++;
    workArray[valuePointer-1]++;
    workArray[valuePointer] -= 2;
  }
  if (left > 0) {
    puts("    Mirando " + ruler[valuePointer] + "... restar " + english[left * 2] + " de " + ruler[valuePointer] + " y sumar " + english[left] + " a " + ruler[valuePointer-1] + ".");
    processed = true;
  }
  if (workArray[valuePointer] == 1) {
    puts("    Mirando "  + ruler[valuePointer] + "...DOS UNO es CINCO.");
    workArray[valuePointer] = 5;
    processed = true;
  }
  var counter = 0;
  while (workArray[valuePointer+1] >= 2) {
    counter++;
    workArray[valuePointer]++;
    workArray[valuePointer+1] -= 2;
  }
  if (counter > 0) {
    puts("    Mirando " + ruler[valuePointer+1] + "... restar " + english[counter * 2] + " de " + ruler[valuePointer+1] + " y sumar " + english[counter] + " a " + ruler[valuePointer] + ".");
    processed = true;
  }
  if (processed == false) {
   puts("    Este dígito está vacío, nada que hacer...");
  }
  outputPanel();
  if (valuePointer < workArray.length-1) {
    valuePointer++;
    return "DIVBY2";
  } else {
    puts("Fin de la Fase III...continuando a la Fase IV.");
    resultPointer = 0;
    valuePointer = 1;
    puts("Fase IV:: Ahora, determinamos el " + nth(resultPointer+2) + " dígito (desde la izquierda) del resultado.");
    return "HASSAN";
  }
}

function subtractSquare() {
  var top = getPartialNumber(0, 1);
  var val = getPartialNumber(1, 2);
  val -= (top * top);
  puts("Restar el cuadrado de " + rulerRangeWithValue(0, 0) + " que es " + (top*top) + " de " + rulerRangeWithValue(1, 2) + " y ponerlo en " + rulerRange(1,2) + ".");
  putNumber(val, 1, 2);
  outputPanel();
  valuePointer = 1;
  if (getPartialNumber(1, workArray.length-1) == 0) {
    puts("FINISHED");
    return "FINISHED";
  } else {
    puts("Fase III:: Ahora vamos a dividir " + rulerRangeWithValue(1, workArray.length-1) + " por 2 (usando Kijo-ho o división china).");
    return "DIVBY2";
  }
}

function determineTopDigit() {
  var num = getPartialNumber(1, 2);
  var tmp = 9;
  while (tmp*tmp > num)  tmp--;
  puts("Fase II:: El número cuadrado perfecto que no excede de " + rulerRangeWithValue(p, p+1) + ", es " + tmp + ", así que lo ponemos en " + ruler[rp] + ".");
  workArray[rp] = tmp;
  outputPanel();
  return "SUBSQUARE";
}

function initialProcess() {
  var inputValue = document.getElementById("expression").value;
  // Input check
  if (inputValue.match(/^\d*(\.\d+)?$/) == null) {
    alert("Illegal Input");
    document.getElementById("expression").value = "";
    puts("error...");
    stepCounter = 1;
    return "INIT";
  }
  // Grouping 2 digits each
  inputValue = String(Number(inputValue));  // regularize (eliminate left zeros)
  var dp = inputValue.indexOf(".");
  if (dp == -1) {       // it's an integer
    inputValue = ((inputValue.length % 2) == 1) ? "0" + inputValue : inputValue;
  } else {              // it's a fraction number
    if (inputValue.indexOf("0.") == 0) {
      inputValue = inputValue.slice(2);
    } else {
      inputValue  = ((dp % 2) == 1) ? "0" + inputValue : inputValue;
      inputValue  = inputValue.replace(/\./, "");
    }
  }
  puts("Fase I:: Separar el valor mentalmente en pares de dígitos, y situarlos desde [B]. ([A] se reserva para el primer dígito de la respuesta.)");
  if (inputValue.substring(0, 1) === "0") {     // Place number to array
    puts("  Poner el valor " + inputValue.slice(1) + " de [C] a " + ruler[inputValue.length] + ".");
  } else {
    puts("  Poner el valor " + inputValue + " de [B] a " + ruler[inputValue.length] + ".");
  }
  workArray = num2array("0" + inputValue);  // append digit for answer
  outputPanel();
  return "TOPDIGIT";
}

// 
// Framework
// 
// HTML should define textArea with ID: 'displayArea', and call main() to start the process.
// Tutorial JavaScript file should define each functions and flow control as "procedure."

var stagePointer = "INIT";

var workArray;
var ruler = ["[A]", "[B]", "[C]", "[D]", "[E]", "[F]", "[G]", "[H]", "[I]", "[J]", "[K]", "[L]", "[M]", "[N]", "[O]", "[P]", "[Q]", "[R]", "[S]", "[T]", "[U]", "[V]", "[W]", "[X]", "[Y]", "[Z]", ];
var rp = 0;
var wrp = 0;
var xrp = 0;
var p = 1;
var english = ["CERO", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
var stepCounter=1;

function main() {   // Main loop
  put("PASO " + stepCounter + ": ");
  stepCounter++;
  stagePointer = procedure[stagePointer]();
}

function nth(n) {
  return n + (["er.","º","º"][((n+90)%100-10)%10-1]||"º");
}

function puts(content) {    // display to textArea with CR
  put(content + "\n");
}

function put(content) {     // display to textArea without CR
  var displayArea = document.getElementById("displayArea");
  displayArea.value += content;
  displayArea.scrollTop = displayArea.scrollHeight;
}

function num2array(val) {       // just put digits to an array
  var result = val.split("");
  for (i = 0; i < result.length; i++) {
    result[i] = Number(result[i]);
  }
  return result;
}

function putNumber(value, position, length) {
  while(workArray.length < position+length) {
    workArray.push(0);
  }
  value = Number(value);
  while(length > 1) {
    var num = value % 10;
    workArray[position+length-1] = num;
    value = Math.trunc(value / 10);
    length--;
  }
  workArray[position] = value;
}
function getPartialNumber(start, length) {      // get partial number
  var extra = start + length - workArray.length;
  while (extra > 0) {
    workArray.push(0);
    extra--;
  }
  var result = 0;
  for (i = start; i < start+length; i++) {
    result *= 10;
    result += workArray[i];
  }
  return result;
}

function rulerRange(start, end) {
  if (start == end)
    return ruler[start];
  else
    return ruler[start] + "-" + ruler[end];
}

function rulerRangeWithValue(start, end) {
  if (start == end)
    return ruler[start] + " (" + getPartialNumber(start, 1) + ")";
  else
    return rulerRange(start, end) + " (" + getPartialNumber(start, end-start+1) + ")";
}

function outputPanel() {        // display entire image
  var str = "";
  var hdr = "";
  var spacer = " ".repeat(10);
  for (i=0; i<workArray.length; i++) {
    str += "[" + workArray[i] + "] ";
    hdr += ruler[i] + " ";
  }
//  puts(spacer + "-".repeat(hdr.length-1));
  puts(spacer + "--- ".repeat(resultPointer+1));
  puts(spacer + hdr);
  puts(spacer + str);
  puts(spacer + "--- ".repeat(resultPointer+1));
}

function resetAll() {       // should be refactored later
  document.getElementById("expression").value = "";
  displayArea = document.getElementById("displayArea").value = "";
  resultPointer = 0;
  divisorPointer = 0;
  valuePointer = 0;
  stagePointer = "INIT";
  workArray = [];
  stepCounter=1;
  rp = 0;
  wrp = 0;
  xrp = 0;
  p = 1;
  document.input.text.focus();
}
