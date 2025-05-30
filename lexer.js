// Importa el módulo 'fs' para manejar archivos
const fs = require('fs');

// Importa 'readline' para leer el archivo línea por línea
const readline = require('readline');

// Define los tipos de tokens que se pueden identificar
const TokenType = {
    palabraReservada: 'PALABRA_RESERVADA',
    identificador: 'IDENTIFICADOR',
    entero: 'ENTERO',
    flotante: 'FLOTANTE',
    operador: 'OPERADOR',
    delimitador: 'DELIMITADOR', // nota: hay un error tipográfico aquí, debería ser 'DELIMITADOR'
    error: 'ERROR'
};

// Define los patrones que describen cómo luce cada tipo de token (usando expresiones regulares)
const patrones = {
    palabraReservada: /^(if|else|for|while|function|return|class|let|print)$/,
    identificador: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
    entero: /^[0-9]+$/,
    flotante: /^[0-9]+\.[0-9]+$/,
    operador: /^([+\-*/=<>]=?|==|!=)$/, // incluye operadores simples y dobles
    delimitador: /^[(){};,]$/           // paréntesis, llaves, punto y coma, coma
};

// Arreglo para guardar los tokens encontrados
let resultadoTokens = [];

/**
 * Analiza una sola línea de código para encontrar tokens
 * @param {string} linea - El texto de la línea a analizar
 * @param {number} numero - El número de línea actual (para registro)
 */
function analizarLinea(linea, numero) {
    // Expresión regular para capturar todos los tokens válidos o posibles errores
    const regex = /([a-zA-Z_][a-zA-Z0-9_]*|[0-9]+(?:\.[0-9]+)?|==|!=|<=|>=|[=+\-*/<>;(),{}])|(\S+)/g;

    // Aplica la expresión regular y convierte el resultado en un array de coincidencias
    const matches = [...linea.matchAll(regex)];

    // Procesa cada token identificado por la expresión regular
    matches.forEach(match => {
        const token = match[1] || match[2]; // match[1] = válido, match[2] = error
        let tipo = null; // tipo se determinará más abajo

        // Recorre todos los patrones para encontrar el tipo del token
        for (const [clave, patron] of Object.entries(patrones)) {
            if (patron.test(token)) {
                tipo = TokenType[clave]; // Asigna el tipo correcto
                break; // Detiene la búsqueda si ya lo encontró
            }
        }

        // Si encontró un tipo válido, se registra como válido
        if (tipo) {
            console.log(`[Línea ${numero}] ✅ Token reconocido: '${token}' → ${tipo}`);
            resultadoTokens.push({ linea: numero, token, tipo, valido: true });
        } else {
            // Si no coincide con ningún patrón, es un error
            console.error(`[Línea ${numero}] ❌ Error: Token inválido '${token}'`);
            resultadoTokens.push({ linea: numero, token, tipo: "ERROR", valido: false });
        }
    });
}

/**
 * Lee y analiza un archivo línea por línea
 * @param {string} ruta - Ruta al archivo fuente
 */
function analizarArchivo(ruta) {
    // Crea un lector de línea a partir del archivo
    const lector = readline.createInterface({
        input: fs.createReadStream(ruta),
        crlfDelay: Infinity // Asegura compatibilidad entre sistemas operativos
    });

    let numeroLinea = 1; // Contador de líneas

    // Se ejecuta cada vez que se lee una línea
    lector.on('line', (linea) => {
        analizarLinea(linea, numeroLinea++); // Analiza esa línea
    });

    // Cuando se termina de leer todo el archivo
    lector.on('close', () => {
        // Guarda los resultados en un archivo JSON
        fs.writeFileSync("tokens.json", JSON.stringify(resultadoTokens, null, 2));
        console.log('✅ Análisis léxico finalizado. Archivo tokens.json generado.');
    });
}

// Obtiene el archivo fuente desde los argumentos de línea de comandos
const archivo = process.argv[2];


// Si no se proporciona un archivo, muestra error y termina
if (!archivo) {
    console.error('❌ Debes proporcionar la ruta del archivo fuente.');
    process.exit(1); // Código de salida 1 = error
}

// Llama a la función principal de análisis
analizarArchivo(archivo);
