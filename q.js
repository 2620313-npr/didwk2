
document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "hub.html"; 
});

// DOM 요소 부르기
const runBtn = document.getElementById("runBtn");
const backBtn = document.getElementById("backBtn");
const circuit = document.getElementById("circuit");
const stateText = document.getElementById("state");
const descText = document.getElementById("desc");
const inputValueInput = document.getElementById("inputValue");

// 뒤로가기 버튼 이벤트
backBtn.addEventListener("click", () => {
    window.location.href = "hub.html"; 
});

// 초기 화면 셋팅
initCircuit();

function initCircuit() {
    circuit.innerHTML = `
        <div style="text-align: center; margin-top: 100px; color: #6b86a3;">
            <p style="font-weight: 600; margin-bottom: 8px;">양자 회로 준비 완료</p>
            <p style="font-size: 0.9rem; opacity: 0.8;">4자리 이진수를 입력하고 실행 버튼을 눌러주세요.</p>
        </div>
    `;
}

// 실행 버튼 클릭 이벤트
runBtn.bindClick = false; 
runBtn.addEventListener("click", async () => {
    if (runBtn.bindClick) return;
    
    // 입력값 검증 (4자리 2진수, 없을 시 기본값 1010)
    let inputVal = inputValueInput.value.trim();
    if (!/^[01]{4}$/.test(inputVal)) {
        inputVal = "1010";
        inputValueInput.value = "1010";
    }

    runBtn.bindClick = true;
    runBtn.disabled = true;
    runBtn.style.opacity = 0.6;

    const bits = inputVal.split("");

    try {
        // 1단계: 초기화
        await step1_Initialize(bits);
        await delay(2000);

        // 2단계: 양자 중첩
        await step2_Superposition(bits);
        await delay(2500);

        // 3단계: 양자 얽힘
        await step3_Entanglement(bits);
        await delay(2500);

        // 4단계: 양자 간섭
        await step4_Interference(bits);
        await delay(2500);

        // 5단계: 측정
        await step5_Measurement(bits);

    } catch (error) {
        console.error(error);
    } finally {
        runBtn.bindClick = false;
        runBtn.disabled = false;
        runBtn.style.opacity = 1;
    }
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 박스 형태의 회로 틀을 생성하는 공통 헬퍼 함수
 * @param {Array} bits - 현재 입력 비트 배열
 * @param {Function} fillContent - 각 라인의 셀들을 채울 콜백 함수
 */
function renderBoxCircuit(bits, fillContent) {
    let html = `
        <div class="q-register">
            ${bits.map((b, i) => `<div class="qubit" id="q-reg-${i}">|${b}⟩</div>`).join("")}
        </div>
        
        <div class="box-circuit-container" style="display: flex; flex-direction: column; gap: 12px; margin-top: 25px; padding: 10px;">
    `;

    for (let i = 0; i < 4; i++) {
        html += `
            <div class="circuit-row" style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 60px; font-weight: bold; color: #1e3a5f; background: rgba(120,160,200,0.15); padding: 6px 10px; border-radius: 6px; text-align: center; font-size: 0.85rem;">
                    q[${i}]
                </div>
                <div class="gate-flow" style="display: flex; flex-count: 1; gap: 8px; width: 100%;">
                    ${fillContent(i)}
                </div>
            </div>
        `;
    }

    html += `</div>`;
    circuit.innerHTML = html;
}

/* ==========================================================
   단계별 시각화 파트 (그리드 박스 변환 적용)
========================================================== */

// 1단계: 초기화 박스
async function step1_Initialize(bits) {
    stateText.innerText = "1단계: 큐비트 초기화 (Initialization)";
    descText.innerText = `입력값 [${bits.join(", ")}] 바탕으로 4개의 독립된 기저 상태 박스를 정렬합니다.`;

    renderBoxCircuit(bits, (rowIdx) => {
        return `
            <div class="q-node active" style="flex: 1; font-size:0.9rem;">입력 상태: |${bits[rowIdx]}⟩</div>
            <div class="q-node" style="flex: 1; opacity: 0.3; background: none; border-style: dashed;">대기 중</div>
            <div class="q-node" style="flex: 1; opacity: 0.3; background: none; border-style: dashed;">대기 중</div>
            <div class="q-node" style="flex: 1; opacity: 0.3; background: none; border-style: dashed;">대기 중</div>
        `;
    });
}

// 2단계: 아다마르 게이트 추가
async function step2_Superposition(bits) {
    stateText.innerText = "2단계: 아다마르 게이트 & 중첩 (Superposition)";
    descText.innerText = "아다마르(H) 박스를 통과하며 모든 큐비트가 0과 1이 공존하는 중첩 상태(┼)로 들어갑니다.";

    // 상단 레지스터 변경
    renderBoxCircuit(bits, (rowIdx) => {
        return `
            <div class="q-node" style="flex: 1; background: rgba(90,160,255,0.1);">|${bits[rowIdx]}⟩ 완료</div>
            <div class="q-node active" style="flex: 1; background: linear-gradient(135deg, #5aa9ff, #3f8cff); color: white; font-size:0.9rem;">H (중첩 연산)</div>
            <div class="q-node" style="flex: 1; opacity: 0.3; background: none; border-style: dashed;">대기 중</div>
            <div class="q-node" style="flex: 1; opacity: 0.3; background: none; border-style: dashed;">대기 중</div>
        `;
    });

    // 상단 동그라미 변화
    document.querySelectorAll(".qubit").forEach(q => {
        q.classList.add("super");
        q.innerText = "┼";
    });
}

// 3단계: 얽힘 (CNOT) 박스화
async function step3_Entanglement(bits) {
    stateText.innerText = "3단계: CNOT 게이트 & 양자 얽힘 (Entanglement)";
    descText.innerText = "서로 제어하고 영향을 주는 CNOT 회로망 박스가 활성화됩니다. 데이터들이 유기적으로 결합됩니다.";

    renderBoxCircuit(bits, (rowIdx) => {
        // q[0]-q[1] 쌍, q[2]-q[3] 쌍 결합 연출
        let role = (rowIdx % 2 === 0) ? "● 제어 큐비트 (Control)" : "┼ 타겟 큐비트 (Target)";
        return `
            <div class="q-node" style="flex: 1; opacity: 0.6;">|${bits[rowIdx]}⟩</div>
            <div class="q-node" style="flex: 1; opacity: 0.6;">H 통과</div>
            <div class="q-node active" style="flex: 1; background: #2b5c9a; color: white; font-size:0.85rem;">CNOT [${role}]</div>
            <div class="q-node" style="flex: 1; opacity: 0.3; background: none; border-style: dashed;">대기 중</div>
        `;
    });

    // 상단 구체 사이 관계선 배치
    const register = circuit.querySelector(".q-register");
    register.innerHTML = `
        <div class="qubit super">┼</div> <div class="entangle-line"></div>
        <div class="qubit super">┼</div> <div style="width: 25px;"></div>
        <div class="qubit super">┼</div> <div class="entangle-line"></div>
        <div class="qubit super">┼</div>
    `;
}

// 4단계: 양자 간섭 연산
async function step4_Interference(bits) {
    stateText.innerText = "4단계: 양자 간섭 연산 (Interference)";
    descText.innerText = "정답에 수렴하도록 확률 진폭을 조절(보강/소멸 간섭)하는 알고리즘 연산 박스를 진행합니다.";

    renderBoxCircuit(bits, (rowIdx) => {
        return `
            <div class="q-node" style="flex: 1; opacity: 0.5;">|${bits[rowIdx]}⟩</div>
            <div class="q-node" style="flex: 1; opacity: 0.5;">H 통과</div>
            <div class="q-node" style="flex: 1; opacity: 0.5;">CNOT 연계</div>
            <div class="q-node active interfere" style="flex: 1; background: linear-gradient(135deg, #70b5ff, #4a93ff); color: white; font-size:0.85rem;">간섭 위상 조절</div>
        `;
    });

    // 상단 원들에 웨이브 효과 주입
    document.querySelectorAll(".qubit").forEach(q => {
        q.classList.add("interfere");
    });
}

// 5단계: 최종 측정 결과 박스 도출
async function step5_Measurement(bits) {
    stateText.innerText = "5단계: 최종 측정 완료 (Measurement)";
    descText.innerText = `모든 확률 상자가 붕괴되어 확정된 고전 데이터 비트 [ ${bits.join(", ")} ]로 도출되었습니다.`;

    renderBoxCircuit(bits, (rowIdx) => {
        return `
            <div class="q-node" style="flex: 1; opacity: 0.4; background:#eee;">준비 완료</div>
            <div class="q-node" style="flex: 1; opacity: 0.4; background:#eee;">중첩 완료</div>
            <div class="q-node" style="flex: 1; opacity: 0.4; background:#eee;">얽힘 완료</div>
            <div class="q-node active" style="flex: 1; background: #1e3a5f; color: #fff; font-weight: 800;">결과값: ${bits[rowIdx]}</div>
        `;
    });

    // 상단 모니터링 최종값 표기
    const qubits = document.querySelectorAll(".qubit");
    qubits.forEach((q, idx) => {
        q.classList.remove("super", "interfere");
        q.innerText = bits[idx];
        q.style.background = "#1e3a5f";
        q.style.color = "white";
    });
}
