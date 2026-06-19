const circuit = document.getElementById("circuit");
const runBtn = document.getElementById("runBtn");
const inputValue = document.getElementById("inputValue");

const state = document.getElementById("state");
const desc = document.getElementById("desc");

const steps = [
    { name: "AND", desc: "모두 1일 때 1 출력" },
    { name: "OR", desc: "하나라도 1이면 1 출력" },
    { name: "NOT", desc: "0↔1 반전" },
    { name: "XOR", desc: "다르면 1 출력" }
];

let nodes = [];

function createCircuit() {
    circuit.innerHTML = "";
    nodes = [];

    steps.forEach((s, i) => {
        const n = document.createElement("div");
        n.className = "node";
        n.innerText = s.name;
        circuit.appendChild(n);
        nodes.push(n);

        if (i !== steps.length - 1) {
            const l = document.createElement("div");
            l.className = "line";
            circuit.appendChild(l);
        }
    });
}

createCircuit();

runBtn.onclick = async () => {

    let data = inputValue.value.trim();
    if (data === "") data = "1010";

    for (let i = 0; i < steps.length; i++) {

        const step = steps[i];

        nodes[i].classList.add("active");

        desc.innerText = step.desc;
        state.innerText = `현재: ${step.name} / 입력: ${data}`;

        data = logic(step.name, data);

        await delay(800);

        nodes[i].classList.remove("active");
    }
};

function logic(type, bits) {
    const arr = bits.split("");

    if (type === "AND")
        return arr.every(v => v === "1") ? "1111" : "0000";

    if (type === "OR")
        return arr.includes("1") ? "1111" : "0000";

    if (type === "NOT")
        return arr.map(v => v === "1" ? "0" : "1").join("");

    if (type === "XOR")
        return arr.map(v => v !== arr[0] ? "1" : "0").join("");

    return bits;
}

function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}


document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "hub.html"; 
});
