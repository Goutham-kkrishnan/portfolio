/* ===================================================
   SCENERY.JS — Multi-Layered Data & Software Engineering Background
   5 parallax layers rendered on a single fixed canvas
   =================================================== */

function initSceneryCanvas() {
    const canvas = document.getElementById('scenery-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, scrollY = 0, time = 0;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

    const CYAN  = { r: 0, g: 229, b: 255 };
    const CORAL = { r: 255, g: 78, b: 80 };

    function rgba(c, a) { return `rgba(${c.r},${c.g},${c.b},${a})`; }

    // ==========================================
    // LAYER 1: Circuit Board Traces (slowest)
    // ==========================================
    const circuits = [];
    function generateCircuits() {
        circuits.length = 0;
        const count = Math.floor(W / 120);
        for (let i = 0; i < count; i++) {
            const segments = [];
            let x = Math.random() * W;
            let y = Math.random() * H * 3;
            const segCount = 3 + Math.floor(Math.random() * 5);
            for (let s = 0; s < segCount; s++) {
                const dir = Math.random() > 0.5 ? 'h' : 'v';
                const len = 40 + Math.random() * 120;
                segments.push({ dir, len });
                if (dir === 'h') x += len * (Math.random() > 0.5 ? 1 : -1);
                else y += len;
            }
            circuits.push({
                startX: Math.random() * W,
                startY: Math.random() * H * 3,
                segments,
                color: Math.random() > 0.5 ? CYAN : CORAL,
                opacity: 0.03 + Math.random() * 0.04,
            });
        }
    }
    generateCircuits();
    window.addEventListener('resize', generateCircuits);

    function drawCircuits() {
        const parallax = scrollY * 0.03;
        circuits.forEach(circuit => {
            let x = circuit.startX;
            let y = circuit.startY - parallax;
            // Only draw if roughly in viewport range
            if (y > H + 200 || y < -H * 2) return;
            ctx.beginPath();
            ctx.moveTo(x, y);
            circuit.segments.forEach(seg => {
                if (seg.dir === 'h') x += seg.len;
                else y += seg.len;
                ctx.lineTo(x, y);
            });
            ctx.strokeStyle = rgba(circuit.color, circuit.opacity);
            ctx.lineWidth = 1;
            ctx.stroke();
            // Draw node dot at each corner
            ctx.fillStyle = rgba(circuit.color, circuit.opacity + 0.02);
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // ==========================================
    // LAYER 2: Data Flow Streams (bezier curves)
    // ==========================================
    const flowStreams = [];
    function generateFlows() {
        flowStreams.length = 0;
        for (let i = 0; i < 8; i++) {
            flowStreams.push({
                x1: -50 + Math.random() * 50,
                y1: Math.random() * H * 3,
                cp1x: W * 0.2 + Math.random() * W * 0.3,
                cp1y: Math.random() * H * 3,
                cp2x: W * 0.5 + Math.random() * W * 0.3,
                cp2y: Math.random() * H * 3,
                x2: W + Math.random() * 50,
                y2: Math.random() * H * 3,
                color: i % 2 === 0 ? CYAN : CORAL,
                opacity: 0.04 + Math.random() * 0.04,
                phase: Math.random() * Math.PI * 2,
            });
        }
    }
    generateFlows();
    window.addEventListener('resize', generateFlows);

    function drawFlows() {
        const parallax = scrollY * 0.1;
        flowStreams.forEach(f => {
            const wave = Math.sin(time * 0.3 + f.phase) * 20;
            const y1 = f.y1 - parallax + wave;
            const cp1y = f.cp1y - parallax;
            const cp2y = f.cp2y - parallax;
            const y2 = f.y2 - parallax - wave;
            if (Math.max(y1, cp1y, cp2y, y2) < -200 || Math.min(y1, cp1y, cp2y, y2) > H + 200) return;
            ctx.beginPath();
            ctx.moveTo(f.x1, y1);
            ctx.bezierCurveTo(f.cp1x, cp1y, f.cp2x, cp2y, f.x2, y2);
            ctx.strokeStyle = rgba(f.color, f.opacity);
            ctx.lineWidth = 1.5;
            ctx.stroke();
        });
    }

    // ==========================================
    // LAYER 3: Neural Network Graph
    // ==========================================
    const nnNodes = [];
    function generateNN() {
        nnNodes.length = 0;
        const count = 35;
        for (let i = 0; i < count; i++) {
            nnNodes.push({
                x: Math.random() * W,
                y: Math.random() * H * 3,
                r: 2 + Math.random() * 4,
                color: Math.random() > 0.6 ? CORAL : CYAN,
                pulsePhase: Math.random() * Math.PI * 2,
                connections: [],
            });
        }
        // Connect nearby nodes
        for (let i = 0; i < nnNodes.length; i++) {
            for (let j = i + 1; j < nnNodes.length; j++) {
                const dx = nnNodes[i].x - nnNodes[j].x;
                const dy = nnNodes[i].y - nnNodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 250) {
                    nnNodes[i].connections.push(j);
                }
            }
        }
    }
    generateNN();
    window.addEventListener('resize', generateNN);

    function drawNN() {
        const parallax = scrollY * 0.18;
        // Draw edges
        nnNodes.forEach((node, i) => {
            const ny = node.y - parallax;
            if (ny > H + 300 || ny < -300) return;
            node.connections.forEach(j => {
                const other = nnNodes[j];
                const oy = other.y - parallax;
                ctx.beginPath();
                ctx.moveTo(node.x, ny);
                ctx.lineTo(other.x, oy);
                ctx.strokeStyle = rgba(CYAN, 0.03);
                ctx.lineWidth = 0.5;
                ctx.stroke();
            });
        });
        // Draw nodes
        nnNodes.forEach(node => {
            const ny = node.y - parallax;
            if (ny > H + 50 || ny < -50) return;
            const pulse = 0.5 + 0.5 * Math.sin(time * 0.8 + node.pulsePhase);
            const alpha = 0.04 + pulse * 0.06;
            ctx.beginPath();
            ctx.arc(node.x, ny, node.r, 0, Math.PI * 2);
            ctx.fillStyle = rgba(node.color, alpha);
            ctx.fill();
            // Glow ring
            ctx.beginPath();
            ctx.arc(node.x, ny, node.r + 4 + pulse * 3, 0, Math.PI * 2);
            ctx.strokeStyle = rgba(node.color, alpha * 0.3);
            ctx.lineWidth = 0.5;
            ctx.stroke();
        });
    }

    // ==========================================
    // LAYER 4: Binary / Hex Rain (subtle)
    // ==========================================
    const binaryColumns = [];
    function generateBinary() {
        binaryColumns.length = 0;
        const colCount = Math.floor(W / 80);
        for (let i = 0; i < colCount; i++) {
            const chars = [];
            const count = 8 + Math.floor(Math.random() * 15);
            for (let c = 0; c < count; c++) {
                chars.push(Math.random() > 0.5 ? '1' : '0');
            }
            binaryColumns.push({
                x: 30 + i * 80 + Math.random() * 40,
                startY: Math.random() * H * 3,
                chars,
                speed: 0.2 + Math.random() * 0.3,
                opacity: 0.03 + Math.random() * 0.03,
            });
        }
    }
    generateBinary();
    window.addEventListener('resize', generateBinary);

    function drawBinary() {
        const parallax = scrollY * 0.25;
        ctx.font = '10px monospace';
        binaryColumns.forEach(col => {
            col.chars.forEach((ch, i) => {
                const y = col.startY + i * 16 - parallax + (time * col.speed * 10) % (col.chars.length * 16);
                if (y > H + 20 || y < -20) return;
                ctx.fillStyle = rgba(CYAN, col.opacity);
                ctx.fillText(ch, col.x, y);
            });
        });
    }

    // ==========================================
    // LAYER 5: Floating Code Vectors (fastest)
    // ==========================================
    const codeVectors = [];
    const vectorSymbols = ['</>','{ }','fn()','[ ]','λ','$_','>_','::','#!','→','∑','∂','π','⊕'];
    function generateVectors() {
        codeVectors.length = 0;
        const count = 20;
        for (let i = 0; i < count; i++) {
            codeVectors.push({
                x: Math.random() * W,
                y: Math.random() * H * 4,
                symbol: vectorSymbols[Math.floor(Math.random() * vectorSymbols.length)],
                size: 10 + Math.random() * 6,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.01,
                driftX: (Math.random() - 0.5) * 0.15,
                color: Math.random() > 0.5 ? CYAN : CORAL,
                opacity: 0.04 + Math.random() * 0.05,
            });
        }
    }
    generateVectors();
    window.addEventListener('resize', generateVectors);

    function drawVectors() {
        const parallax = scrollY * 0.4;
        codeVectors.forEach(v => {
            const y = v.y - parallax;
            const x = v.x + Math.sin(time * 0.2 + v.rotation) * 15;
            if (y > H + 50 || y < -50) return;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(v.rotation + time * v.rotSpeed);
            ctx.font = `${v.size}px 'Space Grotesk', monospace`;
            ctx.fillStyle = rgba(v.color, v.opacity);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(v.symbol, 0, 0);
            ctx.restore();
        });
    }

    // ==========================================
    // Main Render Loop
    // ==========================================
    function render() {
        time += 0.016; // ~60fps increment
        ctx.clearRect(0, 0, W, H);

        drawCircuits();   // Layer 1 — slowest parallax
        drawFlows();      // Layer 2
        drawNN();         // Layer 3
        drawBinary();     // Layer 4
        drawVectors();    // Layer 5 — fastest parallax

        requestAnimationFrame(render);
    }
    render();
}
