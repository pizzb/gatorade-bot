// node console.js
const readline = require('readline');
const { execFile } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '// '
});

console.log('Welcome to the GATORADE Console. Made by pizzaburgz.');
console.log('Use command "help" to get started.');
rl.prompt();

rl.on('line', (line) => {
    const input = line.trim();

    if (input === 'exit') {
        rl.close();
        return;
    }

    if (input === 'run') {
        console.log('Running index.js...');
        execFile('node', ['index.js'], (error, stdout, stderr) => {
            if (error) {
                console.error(`Error:\n${stderr}`);
            } else {
                console.log(`Output:\n${stdout}`);
            }
        });
        console.log('Gatorade is now online and will stay online until this console is closed.');
        rl.prompt();
    } else if (input === 'reload') {
        console.log('Running deploy-commands.js... (please wait)');
        execFile('node', ['deploy-commands.js'], (error, stdout, stderr) => {
            if (error) {
                console.error(`Error:\n${stderr}`);
            } else {
                console.log(`Output:\n${stdout}`);
            }
            rl.prompt(); // Prompt again after command completes
        });
    } else if (input === 'help') {
        console.log('---- GATORADE CONSOLE HELP');
        console.log('help = list of commands');
        console.log('run = set the bot to online status');
        console.log('reload = refresh configuration');
        console.log('exit = terminate the console');
        console.log('----');
        rl.prompt(); // Prompt again after command completes
    } else {
        console.log(`Unknown command: "${input}"`);
        rl.prompt();
    }
});

rl.on('close', () => {
    console.log('Console closed.');
    process.exit(0);
});