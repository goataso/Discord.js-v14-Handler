#!/usr/bin/env node

import { program } from 'commander';
import simpleGit from 'simple-git';
import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import inquirer from 'inquirer';
import { execSync } from 'node:child_process';


program
    .command('build [directory]')
    .description('Clone and setup a Discord.js local handler project')
    .argument('[directory]', 'Target directory for the project')
    .option('--force', 'Force delete existing cache before building')
    .action(async (directory, options) => {
        try {

            const HomeDir = path.resolve(directory || '.');

            if (fs.existsSync(HomeDir)) {
                fs.rmSync(HomeDir, { recursive: true, force: true });
            }

            const answers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'moduleType',
                    message: 'Select the module type:',
                    choices: ['ESModule', 'CommonJS']
                },
                {
                    type: 'list',
                    name: 'alreadyCloned',
                    message: 'Have you already cloned the repository?',
                    choices: ['Yes', 'No']
                }
            ]);

            if (answers.alreadyCloned === 'No') {
                console.log(chalk.blue('Cloning Discord.js handler repository...'));
                const git = simpleGit();
                const repoUrl = 'https://github.com/lifeisunusefull/Discord.js-v14-Handler.git';
                const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
                let i = 0;
                const loadingInterval = setInterval(() => {
                    process.stdout.write(`\r${chalk.cyan(spinner[i])} Cloning repository...`);
                    i = (i + 1) % spinner.length;
                }, 80);
                await git.clone(repoUrl, HomeDir);
                clearInterval(loadingInterval);
                process.stdout.write('\r' + chalk.green('✓ Repository cloned successfully!\n'));
            }

            if (answers.moduleType === 'ESModule') {
                console.log(chalk.blue('Converting to ESModule...'));
                ReadDir(HomeDir);
            } else {
                console.log(chalk.blue('Converting to CommonJS...'));
                ReadDirCommonJS(HomeDir);
            }

            const packageJson = {
                "name": "discord.js-v14-handler",
                "version": "1.1.0",
                "description": "",
                "main": "index.js",
                "scripts": {
                    "test": "echo \"Error: no test specified\" && exit 1"
                },
                "repository": {
                    "type": "git",
                    "url": "https://github.com/lifeisunusefull/Discord.js-v14-Handler.git"
                },
                "bugs": {
                    "url": "https://github.com/lifeisunusefull/Discord.js-v14-Handler/issues"
                },
                "type": answers.moduleType === 'ESModule' ? 'module' : 'commonjs',
                "author": "lifeisunusefull",
                "contributors": [
                    "AmtiXDev",
                    "iMorganSo"
                ],
                "license": "MIT",
                "dependencies": {
                    "@discordjs/rest": "^2.3.0",
                    "ascii-table": "^0.0.9",
                    "discord-api-types": "^0.37.98",
                    "discord.js": "^14.15.3",
                    "fs": "^0.0.1-security",
                    "humanize-duration": "^3.32.1"
                },
                "keywords": [
                    "discord",
                    "bot",
                    "client",
                    "node",
                    "discordapp"
                ]
            }

            fs.writeFileSync(path.join(HomeDir, 'package.json'), JSON.stringify(packageJson, null, 2));

            const installPackages = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'install',
                    message: 'Do you want to install the packages now?',
                    default: true
                }
            ]);

            if (installPackages.install) {
                console.log(chalk.blue('Installing packages...'));
                execSync('npm install discord.js @discordjs/rest discord-api-types ascii-table humanize-duration', { stdio: 'inherit' });
            }

            console.log(chalk.green('✔ Project setup completed successfully!'));
        } catch (error) {
            console.error(chalk.red('Error:', error.message));
            process.exit(1);
        }
    });

program.parse(process.argv);

function convertToESM(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(/module\.exports\.(\w+)\s*=\s*/g, 'export const $1 = ');
    content = content.replace(/module\.exports\s*=/, 'export default');
    content = content.replace(/const\s*{\s*([^}]+)\s*}\s*=\s*require\s*\(['"]([^'"]+)['"]\)/g,
        'import { $1 } from "$2"');
    content = content.replace(/const\s+(\w+)\s*=\s*require\s*\(['"]([^'"]+)['"]\)/g,
        'import $1 from "$2"');
    content = content.replace(/require\s*\(['"]([^'"]+)['"]\)/g,
        'import "$1"');
    content = content.replace(/exports\.(\w+)\s*=\s*/g, 'export const $1 = ');
    content = content.replace(/exports\s*=\s*{\s*([^}]+)\s*}/, (match, p1) => {
        return p1.split(',')
            .map(exp => `export const ${exp.trim()} = ${exp.trim()}`)
            .join('\n');
    });

    return content;
}

function convertToCommonJS(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(/export\s+const\s+(\w+)\s*=\s*/g, 'module.exports.$1 = ');
    content = content.replace(/export\s+default\s+/, 'module.exports = ');
    content = content.replace(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]([^'"]+)['"]/g,
        'const { $1 } = require("$2")');
    content = content.replace(/import\s+(\w+)\s+from\s*['"]([^'"]+)['"]/g,
        'const $1 = require("$2")');
    content = content.replace(/import\s*['"]([^'"]+)['"]/g,
        'require("$1")');

    return content;
}

function ReadDir(dir) {
    try {
        const dirName = path.resolve(dir);
        const files = fs.readdirSync(dirName, { withFileTypes: true });
        for (const file of files) {
            if (file.isDirectory()) {
                ReadDir(path.join(dir, file.name));
                continue;
            };
            if (file.name.endsWith('.js')) {
                const newContent = convertToESM(path.join(dir, file.name));
                fs.writeFileSync(path.join(dir, file.name), newContent);
            }
        }
    } catch (error) {
        console.error(`Error processing directory ${dir}:`, error);
    }
}

function ReadDirCommonJS(dir) {
    try {
        const dirName = path.resolve(dir);
        const files = fs.readdirSync(dirName, { withFileTypes: true });
        for (const file of files) {
            if (file.isDirectory()) {
                ReadDirCommonJS(path.join(dir, file.name));
                continue;
            };
            if (file.name.endsWith('.js')) {
                const newContent = convertToCommonJS(path.join(dir, file.name));
                fs.writeFileSync(path.join(dir, file.name), newContent);
            }
        }
    } catch (error) {
        console.error(`Error processing directory ${dir}:`, error);
    }
}
