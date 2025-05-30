# Analizador Léxico en JavaScript

Este proyecto implementa un analizador léxico simple en Node.js para reconocer tokens válidos en un archivo fuente.

## Ejecutar

```bash
node lexer.js programa.txt
```

## Tokens Reconocidos

| Tipo               | Ejemplo        |
|--------------------|----------------|
| Palabra reservada  | `if`, `else`   |
| Identificador      | `nombre`       |
| Entero             | `123`          |
| Flotante           | `3.14`         |
| Operador           | `+`, `==`      |
| Delimitador        | `{`, `}`       |

## Autómata

Abrir `automata.html` en tu navegador para visualizar el autómata gráfico.
