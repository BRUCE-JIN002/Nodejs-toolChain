var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import minimist from "minimist";
import chalk from "chalk";
import prompts from "prompts";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const argv = minimist(process.argv.slice(2), { alias: { h: "help", t: "template" }, string: ["_"] });
const helpMessage = `\
Usage: create-vite [OPTION]... [DIRECTORY]

Create a new Vite project in JavaScript or TypeScript.
With no arguments, start the CLI in interactive mode.

Options:
  -t, --template NAME        use a specific template

Available templates:
${chalk.yellow("vanilla-ts     vanilla")}
${chalk.green("vue-ts         vue")}
${chalk.cyan("react-ts       react")}
${chalk.cyan("react-swc-ts   react-swc")}
${chalk.magenta("preact-ts      preact")}
${chalk.redBright("lit-ts         lit")}
${chalk.red("svelte-ts      svelte")}
${chalk.blue("solid-ts       solid")}
${chalk.blueBright("qwik-ts        qwik")}`;
function formatTargetDir(targetDir) {
    return targetDir === null || targetDir === void 0 ? void 0 : targetDir.trim().replace(/\/+$/g, "");
}
const defaultTargetDir = "vite-project";
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const argTargetDir = formatTargetDir(argv._[0]);
        const argTemplate = argv.template || argv.t;
        const help = argv.help;
        if (help) {
            console.log(helpMessage);
            return;
        }
        let targetDir = argTargetDir || defaultTargetDir;
        const FRAMEWORKS = [
            {
                name: "vue",
                display: "Vue",
                color: chalk.green,
                variants: [
                    {
                        name: "vue-ts",
                        display: "TypeScript",
                        color: chalk.blue
                    },
                    {
                        name: "vue",
                        display: "JavaScript",
                        color: chalk.yellow
                    }
                ]
            },
            {
                name: "react",
                display: "React",
                color: chalk.cyan,
                variants: [
                    {
                        name: "react-ts",
                        display: "TypeScript",
                        color: chalk.blue
                    },
                    {
                        name: "react-swc-ts",
                        display: "TypeScript + SWC",
                        color: chalk.blue
                    },
                    {
                        name: "react",
                        display: "JavaScript",
                        color: chalk.yellow
                    },
                    {
                        name: "react-swc",
                        display: "JavaScript + SWC",
                        color: chalk.yellow
                    }
                ]
            }
        ];
        const TEMPLATES = FRAMEWORKS.map((f) => {
            var _a;
            return (_a = f.variants) === null || _a === void 0 ? void 0 : _a.map((v) => v.name);
        }).reduce((a, b) => {
            return a.concat(b);
        }, []);
        let result;
        try {
            result = yield prompts([
                {
                    type: argTargetDir ? null : "text",
                    name: "projectName",
                    message: chalk.reset("Project name:"),
                    initial: defaultTargetDir,
                    onState: (state) => {
                        targetDir = formatTargetDir(state.value) || defaultTargetDir;
                    }
                },
                {
                    type: argTemplate && TEMPLATES.includes(argTemplate) ? null : "select",
                    name: "framework",
                    message: chalk.reset("Select a framework:"),
                    initial: 0,
                    choices: FRAMEWORKS.map((framework) => {
                        const frameworkColor = framework.color;
                        return {
                            title: frameworkColor(framework.display || framework.name),
                            value: framework
                        };
                    })
                },
                {
                    type: (framework) => framework && framework.variants ? "select" : null,
                    name: "variant",
                    message: chalk.reset("Select a variant:"),
                    choices: (framework) => framework.variants.map((variant) => {
                        const variantColor = variant.color;
                        return {
                            title: variantColor(variant.display || variant.name),
                            value: variant.name
                        };
                    })
                }
            ], {
                onCancel: () => {
                    throw new Error(chalk.red("✖") + " Operation cancelled");
                }
            });
        }
        catch (cancelled) {
            console.log(cancelled.message);
            return;
        }
        const { framework, variant } = result;
        const root = path.join(process.cwd(), targetDir);
        let template = variant || argTemplate;
        console.log(`\nScaffolding project in ${root}...`);
        const templateDir = path.resolve(fileURLToPath(import.meta.url), "../..", `template-${template}`);
        console.log(templateDir);
        const renameFiles = {
            _gitignore: ".gitignore"
        };
        const write = (file, content) => {
            var _a;
            const targetPath = path.join(root, (_a = renameFiles[file]) !== null && _a !== void 0 ? _a : file);
            if (content) {
                fs.writeFileSync(targetPath, content);
            }
            else {
                copy(path.join(templateDir, file), targetPath);
            }
        };
        function copyDir(srcDir, destDir) {
            fs.mkdirSync(destDir, { recursive: true });
            for (const file of fs.readdirSync(srcDir)) {
                const srcFile = path.resolve(srcDir, file);
                const destFile = path.resolve(destDir, file);
                copy(srcFile, destFile);
            }
        }
        function copy(src, dest) {
            const stat = fs.statSync(src);
            if (stat.isDirectory()) {
                copyDir(src, dest);
            }
            else {
                fs.copyFileSync(src, dest);
            }
        }
        if (!fs.existsSync(root)) {
            fs.mkdirSync(root, { recursive: true });
        }
        const files = fs.readdirSync(templateDir);
        for (const file of files) {
            write(file);
        }
        const cdProjectName = path.relative(process.cwd(), root);
        console.log(`\nDone. Now run:\n`);
        if (root !== process.cwd()) {
            console.log(`  cd ${cdProjectName.includes(" ") ? `"${cdProjectName}"` : cdProjectName}`);
        }
        console.log(`  npm install`);
        console.log(`  npm run dev`);
        console.log();
    });
}
init().catch((e) => {
    console.error(e);
});
