# ES6_COMPLIANCE_RULES.js

export const ES6_RULES = `
ES6 Compliance Rules for JavaScript Code

1. Use Block-Scoped Variables
   - Prefer 'let' and 'const' over 'var'.
   - Use 'const' by default unless reassignment is needed.

2. Use Arrow Functions
   - Use arrow functions for callbacks and anonymous functions.
   - Avoid arrow functions when 'this' context must be preserved differently.

3. Use Template Literals
   - Prefer backticks (\`) over string concatenation.
   - Supports multi-line strings and embedded expressions.

4. Use Destructuring
   - Destructure objects and arrays to simplify assignments and function parameters.

5. Use Default Parameters
   - Declare default values in function signatures instead of conditional logic inside the body.

6. Use Spread and Rest Operators
   - Use '...' to expand arrays/objects or collect function arguments.

7. Use Shorthand Syntax
   - Use object shorthand: { foo } instead of { foo: foo }.
   - Use method shorthand in object literals.

8. Use ES6 Modules
   - Structure code using 'import' and 'export'.
   - Avoid CommonJS ('require' / 'module.exports') unless in Node.js context.

9. Avoid Hoisting Pitfalls
   - Be aware that 'let' and 'const' are not hoisted like 'var'.
   - Always declare variables at the top of their block.

10. Use Classes Instead of Prototypes
    - Define classes with 'class' syntax and use 'extends' for inheritance.
    - Use constructor methods and avoid prototype mutation.

11. Use Promises / Async-Await
    - Handle asynchronous operations using Promises or 'async/await'.
    - Avoid nested callbacks (callback hell).

12. Enforce Strict Mode
    - All ES6 modules are strict mode by default.
    - Avoid using 'with' statements or undeclared variables.

13. Avoid Deprecated or Legacy Syntax
    - Do not use 'var', 'arguments' object (prefer rest), or function declarations inside blocks.
    - Avoid modifying built-in objects or using non-standard features.

14. Use Symbol and Map/Set Where Appropriate
    - Use 'Symbol' for unique object property keys.
    - Use 'Map' and 'Set' instead of plain objects/arrays for non-string keys or deduplicated collections.

15. Write Modular, Clear Code
    - Keep files short and focused on a single purpose.
    - Favor pure functions and immutability.

END_OF_ES6_RULES
`;
