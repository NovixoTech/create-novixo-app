#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const prompts = require("prompts");
const kleur = require("kleur");

async function main() {
  console.log(kleur.green().bold("\n🚀 create-novixo-app\n"));
  console.log(kleur.gray("Scaffold a project pre-wired with the NovixoTech ecosystem\n"));

  const answers = await prompts([
    {
      type: "text",
      name: "projectName",
      message: "Project name:",
      initial: "my-novixo-app",
    },
    {
      type: "select",
      name: "template",
      message: "Choose a template:",
      choices: [
        { title: "React + Novixo (web app)", value: "react" },
        { title: "Node.js + Novixo (backend/CLI)", value: "node" },
        { title: "React Native + Novixo (mobile)", value: "react-native" },
      ],
    },
    {
      type: "multiselect",
      name: "packages",
      message: "Which NovixoTech packages do you want included?",
      choices: [
        { title: "novixo-engine (offline-first network SDK)", value: "novixo-engine", selected: true },
        { title: "novixo-ai (multi-provider AI client)", value: "novixo-ai", selected: true },
        { title: "novixo-agent-logger (AI audit trail)", value: "novixo-agent-logger", selected: false },
        { title: "novixo-react (React hooks)", value: "novixo-react", selected: true },
      ],
    },
  ]);

  if (!answers.projectName) {
    console.log(kleur.red("Cancelled."));
    process.exit(0);
  }

  const targetDir = path.join(process.cwd(), answers.projectName);

  if (fs.existsSync(targetDir)) {
    console.log(kleur.red(`\nFolder "${answers.projectName}" already exists. Choose a different name.\n`));
    process.exit(1);
  }

  console.log(kleur.gray(`\nCreating project in ./${answers.projectName}...\n`));

  fs.mkdirSync(targetDir, { recursive: true });

  const templateDir = path.join(__dirname, "templates", answers.template);
  if (fs.existsSync(templateDir)) {
    fs.copySync(templateDir, targetDir);
  }

  const pkgPath = path.join(targetDir, "package.json");
  const pkg = fs.existsSync(pkgPath) ? fs.readJsonSync(pkgPath) : { name: answers.projectName, version: "0.1.0", private: true };

  pkg.name = answers.projectName;
  pkg.dependencies = pkg.dependencies || {};

  for (const p of answers.packages) {
    pkg.dependencies[p] = "latest";
  }

  fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });

  console.log(kleur.green("✅ Project created!\n"));
  console.log(kleur.white("Next steps:\n"));
  console.log(kleur.cyan(`  cd ${answers.projectName}`));
  console.log(kleur.cyan("  npm install"));
  console.log(kleur.cyan("  npm start\n"));
  console.log(kleur.gray("Packages included:"));
  for (const p of answers.packages) {
    console.log(kleur.gray(`  • ${p}`));
  }
  console.log(kleur.green("\nHappy building! 🎉\n"));
}

main().catch(console.error);
