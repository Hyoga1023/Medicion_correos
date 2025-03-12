let frutas = ["manzana", "pera", "uva", "sandía", "fresa", "kiwi", "plátano", "naranja", "limón", "mango"];
console.log(frutas);

frutas.push("mandarina");
console.log(frutas);

for (let i = 0; i < frutas.length; i++) {
    console.log(frutas[i]);
};

// Get the first item
let primeraFruta = frutas[0];
console.log("Primera fruta:", primeraFruta);

// Get the last item
let ultimaFruta = frutas[frutas.length - 1];
console.log("Última fruta:", ultimaFruta);
