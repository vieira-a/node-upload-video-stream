const os = require('os');

function monitorarRecursos() {
    const numCores = os.cpus().length;

    // Função para calcular o uso de CPU e memória
    function calcularUso() {
        // Obtenha o uso inicial de CPU e a quantidade de memória usada pelo processo
        const usoInicialCpu = process.cpuUsage();
        const usoInicialMemoria = process.memoryUsage().rss;
        const tempoInicial = Date.now();

        // Após 1 segundo, calcule a diferença
        setTimeout(() => {
            const usoFinalCpu = process.cpuUsage();
            const usoFinalMemoria = process.memoryUsage().rss;
            const tempoFinal = Date.now();

            // Calcule a diferença de tempo de CPU em nanosegundos
            const diferencaCpuUser = usoFinalCpu.user - usoInicialCpu.user;
            const diferencaCpuSystem = usoFinalCpu.system - usoInicialCpu.system;
            const diferencaCpuTotal = diferencaCpuUser + diferencaCpuSystem;

            // Calcule a diferença de tempo real em nanosegundos
            const diferencaTempoReal = (tempoFinal - tempoInicial) * 1e6; // Converta ms para ns

            // Calcule a porcentagem de uso de CPU
            const usoCpuPorcentagem = (diferencaCpuTotal / diferencaTempoReal) * numCores * 100;

            // Calcule a porcentagem de memória usada em relação à memória total disponível
            const usoMemoriaPorcentagem = (usoFinalMemoria / os.totalmem()) * 100;

            console.log(`Uso da CPU: ${usoCpuPorcentagem.toFixed(2)}%`);
            console.log(`Uso de memória: ${usoMemoriaPorcentagem.toFixed(2)}%`);

            // Repita a função a cada segundo
            setTimeout(calcularUso, 1000);
        }, 1000);
    }

    // Inicia o monitoramento
    calcularUso();
}

// Exporte a função para que ela possa ser importada em outros arquivos
module.exports = monitorarRecursos;
