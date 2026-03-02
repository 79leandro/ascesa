/**
 * Script de Carga Completo do Projeto ASCESA
 *
 * Este script executa todas as etapas necessárias para iniciar o projeto:
 * 1. Instalar dependências
 * 2. Configurar ambiente
 * 3. Executar migrações do banco
 * 4. Seed (dados iniciais)
 * 5. Iniciar serviços
 *
 * Uso:
 *   npm run carga           - Carga completa (pergunte mode)
 *   npm run carga:local     - Carga modo local
 *   npm run carga:remoto    - Carga modo remoto
 *   npm run carga:api       - Apenas instalar e rodar API
 *   npm run carga:web       - Apenas instalar e rodar Web
 *   npm run carga:seed      - Apenas seed do banco
 *   npm run carga:kill      - Matar processos
 */

const { execSync } = require('child_process');
const readline = require('readline');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  log(` ${step}. ${message}`, 'cyan');
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
}

function run(command, cwd = null, showOutput = true) {
  try {
    const options = cwd ? { cwd, stdio: showOutput ? 'inherit' : 'pipe' } : { stdio: showOutput ? 'inherit' : 'pipe' };
    execSync(command, options);
    return true;
  } catch (error) {
    log(`Erro ao executar: ${command}`, 'red');
    return false;
  }
}

function question(text) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(text, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function killProcesses() {
  logStep(0, 'MATANDO PROCESSOS ANTERIORES');
  run('taskkill /F /IM node.exe 2>nul || echo Nenhum processo Node encontrado');
}

async function installDependencies() {
  logStep(1, 'INSTALANDO DEPENDÊNCIAS');

  log('Instalando dependências da API...', 'yellow');
  if (!run('npm install', 'api')) {
    log('Falha ao instalar dependências da API', 'red');
    return false;
  }

  log('Instalando dependências do Web...', 'yellow');
  if (!run('npm install', 'web')) {
    log('Falha ao instalar dependências do Web', 'red');
    return false;
  }

  log('Dependências instaladas com sucesso!', 'green');
  return true;
}

async function setupEnvironment(mode) {
  logStep(2, 'CONFIGURANDO AMBIENTE');

  const envContent = mode === 'local'
    ? `NEXT_PUBLIC_USE_REMOTE_API=false
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000`
    : `NEXT_PUBLIC_USE_REMOTE_API=true
NEXT_PUBLIC_API_URL=https://ascesa.onrender.com
NEXT_PUBLIC_SITE_URL=https://ascesa-six.vercel.app`;

  run(`echo "${envContent}" > web/.env.local`, null, false);
  log(`Ambiente configurado para: ${mode === 'local' ? 'LOCAL' : 'REMOTO'}`, 'green');
  return true;
}

async function runMigrations() {
  logStep(3, 'EXECUTANDO MIGRAÇÕES DO BANCO');

  log('Executando migrações...', 'yellow');
  if (!run('npx prisma migrate deploy', 'api')) {
    log('Migrações já executadas ou erro ao executar', 'yellow');
  } else {
    log('Migrações executadas com sucesso!', 'green');
  }
  return true;
}

async function runSeed() {
  logStep(4, 'EXECUTANDO SEED DO BANCO');

  const choice = await question('Deseja executar o seed do banco? (s/n): ');

  if (choice.toLowerCase() === 's' || choice.toLowerCase() === 'sim') {
    log('Executando seed...', 'yellow');
    if (run('npx prisma db seed', 'api')) {
      log('Seed executado com sucesso!', 'green');
    } else {
      log('Seed pode já ter sido executado ou erro', 'yellow');
    }
  } else {
    log('Seed ignorado pelo usuário', 'yellow');
  }
  return true;
}

async function startServices(mode) {
  logStep(5, 'INICIANDO SERVIÇOS');

  log(`Iniciando API (NestJS) na porta 3001...`, 'yellow');
  log(`Iniciando Web (Next.js) na porta ${mode === 'local' ? '3000' : '3000'}...`, 'yellow');

  if (mode === 'local') {
    run('cd api && npm run start:dev', null, true);
  } else {
    run('cd api && npm run start:dev', null, true);
  }
}

async function main() {
  console.clear();
  log('╔═══════════════════════════════════════════════════════════╗', 'magenta');
  log('║         🚀 SCRIPT DE CARGA - PROJETO ASCESA 🚀          ║', 'magenta');
  log('╚═══════════════════════════════════════════════════════════╝', 'magenta');

  // Perguntar modo de execução
  console.log('\nEscolha o modo de execução:');
  console.log('  [1] LOCAL   - API em localhost:3001');
  console.log('  [2] REMOTO  - API em ascesa.onrender.com');
  console.log('  [3] API ONLY - Apenas API');
  console.log('  [4] WEB ONLY - Apenas Web');
  console.log('  [0] SAIR');

  const choice = await question('\nDigite a opção: ');

  if (choice === '0') {
    log('Saindo...', 'yellow');
    process.exit(0);
  }

  // Opção inválida
  if (!['1', '2', '3', '4'].includes(choice)) {
    log('Opção inválida!', 'red');
    process.exit(1);
  }

  // Kill processes
  await killProcesses();

  // Install dependencies
  if (!await installDependencies()) {
    log('Falha ao instalar dependências', 'red');
    process.exit(1);
  }

  // Setup environment based on choice
  const mode = choice === '1' || choice === '3' ? 'local' : 'remote';

  if (choice !== '3') {
    await setupEnvironment(mode);
  }

  // Run migrations
  await runMigrations();

  // Ask for seed
  await runSeed();

  // Start services
  if (choice === '1' || choice === '2') {
    // Full stack
    log('\nIniciando stack completa...', 'green');
    run('concurrently "cd web && npm run dev" "cd api && npm run start:dev"', null, true);
  } else if (choice === '3') {
    // API only
    log('\nIniciando apenas API...', 'green');
    run('cd api && npm run start:dev', null, true);
  } else if (choice === '4') {
    // Web only
    log('\nIniciando apenas Web...', 'green');
    run('cd web && npm run dev', null, true);
  }
}

main().catch(console.error);
