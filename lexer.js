const fs = require('fs');
const readline = require('readline');

// Tipos de tokens
const TokenType = {
    palabraReservada: 'PALABRA_RESERVADA',
    identificador: 'IDENTIFICADOR',
    entero: 'ENTERO',
    flotante: 'FLOTANTE',
    operador: 'OPERADOR',
    delimitador: 'DELIMITADORR',
    error: 'ERROR'
};

// Patrones de cada tipo de token
const patrones = {
    palabraReservada: /^(if|else|for|while|function|return|class|let|print)$/,
    identificador: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
    entero: /^[0-9]+$/,
    flotante: /^[0-9]+\.[0-9]+$/,
    operador: /^([+\-*/=<>]=?|==|!=)$/,
    delimitador: /^[(){};,]$/
};

let resultadoTokens = [];

// Analiza una línea de código
function analizarLinea(linea, numero) {
    // Extrae todos los tokens posibles, incluyendo errores
    const regex = /([a-zA-Z_][a-zA-Z0-9_]*|[0-9]+(?:\.[0-9]+)?|==|!=|<=|>=|[=+\-*/<>;(),{}])|(\S+)/g;
    const matches = [...linea.matchAll(regex)];

    matches.forEach(match => {
        const token = match[1] || match[2]; // match[1] = válido, match[2] = error
        let tipo = null;

        for (const [clave, patron] of Object.entries(patrones)) {
            if (patron.test(token)) {
                tipo = TokenType[clave];
                break;
            }
        }

        if (tipo) {
            console.log(`[Línea ${numero}] ✅ Token reconocido: '${token}' → ${tipo}`);
            resultadoTokens.push({ linea: numero, token, tipo, valido: true });
        } else {
            console.error(`[Línea ${numero}] ❌ Error: Token inválido '${token}'`);
            resultadoTokens.push({ linea: numero, token, tipo: "ERROR", valido: false });
        }
    });
}

// Lee el archivo línea por línea
function analizarArchivo(ruta) {
    const lector = readline.createInterface({
        input: fs.createReadStream(ruta),
        crlfDelay: Infinity
    });

    let numeroLinea = 1;
    lector.on('line', (linea) => {
        analizarLinea(linea, numeroLinea++);
    });

    lector.on('close', () => {
        fs.writeFileSync("tokens.json", JSON.stringify(resultadoTokens, null, 2));
        console.log('✅ Análisis léxico finalizado. Archivo tokens.json generado.');
    });
}

// Inicia el análisis si hay archivo fuente
const archivo = process.argv[2];
if (!archivo) {
    console.error('❌ Debes proporcionar la ruta del archivo fuente.');
    process.exit(1);
}

analizarArchivo(archivo);
