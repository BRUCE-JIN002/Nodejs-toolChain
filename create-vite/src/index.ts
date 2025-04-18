import minimist from "minimist";
import chalk from "chalk";
import prompts from "prompts";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

type Framework = {
  name: string;
  display: string;
  color: Function;
  variants: FrameworkVariant[];
};

type FrameworkVariant = {
  name: string;
  display: string;
  color: Function;
  customCommand?: string;
};

const argv = minimist<{ template?: string; help?: boolean }>(
  process.argv.slice(2),
  { alias: { h: "help", t: "template" }, string: ["_"] }
);

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

function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, "");
}

const defaultTargetDir = "vite-project";

async function init() {
  const argTargetDir = formatTargetDir(argv._[0]);
  const argTemplate = argv.template || argv.t;

  const help = argv.help;

  if (help) {
    console.log(helpMessage);
    return;
  }

  let targetDir = argTargetDir || defaultTargetDir;

  const FRAMEWORKS: Framework[] = [
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
    return f.variants?.map((v) => v.name);
  }).reduce((a, b) => {
    return a.concat(b);
  }, []);

  let result: prompts.Answers<"projectName" | "framework" | "variant">;

  try {
    result = await prompts(
      [
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
          type:
            argTemplate && TEMPLATES.includes(argTemplate) ? null : "select",
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
          type: (framework: Framework) =>
            framework && framework.variants ? "select" : null,
          name: "variant",
          message: chalk.reset("Select a variant:"),
          choices: (framework: Framework) =>
            framework.variants.map((variant) => {
              const variantColor = variant.color;
              return {
                title: variantColor(variant.display || variant.name),
                value: variant.name
              };
            })
        }
      ],
      {
        onCancel: () => {
          throw new Error(chalk.red("✖") + " Operation cancelled");
        }
      }
    );
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return;
  }

  const { framework, variant } = result;
  const root = path.join(process.cwd(), targetDir);
  let template: string = variant || argTemplate;
  console.log(`\nScaffolding project in ${root}...`);

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    "../..",
    `template-${template}`
  );

  console.log(templateDir);

  const renameFiles: Record<string, any> = {
    _gitignore: ".gitignore"
  };

  const write = (file: string, content?: string) => {
    const targetPath = path.join(root, renameFiles[file] ?? file);
    if (content) {
      fs.writeFileSync(targetPath, content);
    } else {
      copy(path.join(templateDir, file), targetPath);
    }
  };

  function copyDir(srcDir: string, destDir: string) {
    fs.mkdirSync(destDir, { recursive: true });
    for (const file of fs.readdirSync(srcDir)) {
      const srcFile = path.resolve(srcDir, file);
      const destFile = path.resolve(destDir, file);
      copy(srcFile, destFile);
    }
  }

  function copy(src: string, dest: string) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      copyDir(src, dest);
    } else {
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
    console.log(
      `  cd ${
        cdProjectName.includes(" ") ? `"${cdProjectName}"` : cdProjectName
      }`
    );
  }
  console.log(`  npm install`);
  console.log(`  npm run dev`);
  console.log();
}

init().catch((e) => {
  console.error(e);
});
