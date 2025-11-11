/* eslint-disable unicorn/prefer-node-protocol */
/**
 * Spec-Driven Development Module Installer
 * Custom installation logic for SDD module setup
 */

const fs = require('fs');
const path = require('path');

/**
 * Main installation function
 * Called by BMAD installer when processing the module
 */
async function installModule(config) {
  console.log('🚀 Installing Spec-Driven Development (SDD) module...');
  console.log(`   Version: ${config.module_version || '1.0.0-alpha'}`);
  console.log(`   Module Code: ${config.code || 'sdd'}`);

  try {
    // Step 1: Validate environment
    await validateEnvironment(config);

    // Step 2: Setup document directories
    await setupDirectories(config);

    // Step 3: Setup templates
    await setupTemplates(config);

    // Step 4: Setup agent sidecars
    await setupAgentSidecars(config);

    // Step 5: Validate Jira configuration
    await validateJiraConfig(config);

    // Step 6: Register standalone tasks
    await registerStandaloneTasks(config);

    console.log('✅ SDD module installed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Ensure your .env file contains Jira credentials');
    console.log('   2. Load pm-agent to start product workflows');
    console.log('   3. Load dev-agent to start development workflows');
    console.log('');
    console.log('🔧 Standalone commands available:');
    console.log('   - /generate-commit - Create git commits following SDD format');
    console.log('   - /create-pr - Create pull requests following SDD format');

    return {
      success: true,
      message: 'Module installed and configured',
    };
  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Validate that the environment meets module requirements
 */
async function validateEnvironment(config) {
  console.log('   Validating environment...');

  if (!config.project_root) {
    throw new Error('Project root not defined');
  }

  // Check if git is available (needed for dev-flow)
  try {
    const { execSync } = require('child_process');
    execSync('git --version', { stdio: 'ignore' });
    console.log('   ✓ Git is available');
  } catch {
    console.warn('   ⚠️  Git not found - dev-flow may not work properly');
  }

  // Check if gh CLI is available (needed for PR creation)
  try {
    const { execSync } = require('child_process');
    execSync('gh --version', { stdio: 'ignore' });
    console.log('   ✓ GitHub CLI (gh) is available');
  } catch {
    console.warn('   ⚠️  GitHub CLI (gh) not found - PR creation may not work');
  }

  console.log('   ✓ Environment validated');
}

/**
 * Setup document output directories
 */
async function setupDirectories(config) {
  console.log('   Setting up document directories...');

  const outputPath = config.output_document_path || path.join(config.project_root, 'docs', 'sdd');

  const directories = [outputPath, path.join(outputPath, 'prd'), path.join(outputPath, 'tech-spec')];

  for (const dir of directories) {
    if (fs.existsSync(dir)) {
      console.log(`   ✓ Directory exists: ${dir}`);
    } else {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`   ✓ Created directory: ${dir}`);
    }
  }

  console.log('   ✓ Document directories ready');
}

/**
 * Setup templates if they don't exist
 */
async function setupTemplates(config) {
  console.log('   Checking templates...');

  const moduleRoot = path.join(config.project_root, 'bmad', 'sdd');

  const requiredTemplates = [
    'templates/prd/template.md',
    'templates/tech-spec/template.md',
    'templates/commit/template.md',
    'templates/pr/template.md',
  ];

  let allTemplatesExist = true;

  for (const template of requiredTemplates) {
    const templatePath = path.join(moduleRoot, template);
    if (!fs.existsSync(templatePath)) {
      console.warn(`   ⚠️  Template missing: ${template}`);
      allTemplatesExist = false;
    }
  }

  if (allTemplatesExist) {
    console.log('   ✓ All templates are in place');
  } else {
    console.warn('   ⚠️  Some templates are missing - workflows may not work correctly');
  }
}

/**
 * Setup agent sidecar directories
 * Sidecar system provides persistent memory and knowledge for agents
 */
async function setupAgentSidecars(config) {
  console.log('   Setting up agent sidecar systems...');

  const moduleRoot = path.join(config.project_root, 'bmad', 'sdd');
  const agentsDir = path.join(moduleRoot, 'agents');

  // Ensure agents directory exists
  if (!fs.existsSync(agentsDir)) {
    console.warn('   ⚠️  Agents directory not found - skipping sidecar setup');
    return;
  }

  // Define sidecars that need to be set up
  const sidecars = ['pm-agent-sidecar', 'dev-agent-sidecar'];

  for (const sidecar of sidecars) {
    const sidecarPath = path.join(agentsDir, sidecar);

    if (fs.existsSync(sidecarPath)) {
      // Verify sidecar structure
      const requiredFiles = ['instructions.md', 'memories.md'];
      let sidecarComplete = true;

      for (const file of requiredFiles) {
        const filePath = path.join(sidecarPath, file);
        if (!fs.existsSync(filePath)) {
          console.warn(`   ⚠️  ${sidecar}/${file} missing`);
          sidecarComplete = false;
        }
      }

      // Create knowledge directory if it doesn't exist
      const knowledgeDir = path.join(sidecarPath, 'knowledge');
      if (!fs.existsSync(knowledgeDir)) {
        fs.mkdirSync(knowledgeDir, { recursive: true });
        console.log(`   ✓ Created ${sidecar}/knowledge directory`);
      }

      // Create sessions directory if it doesn't exist (for future use)
      const sessionsDir = path.join(sidecarPath, 'sessions');
      if (!fs.existsSync(sessionsDir)) {
        fs.mkdirSync(sessionsDir, { recursive: true });
        console.log(`   ✓ Created ${sidecar}/sessions directory`);
      }

      if (sidecarComplete) {
        console.log(`   ✓ ${sidecar} is ready`);
      }
    } else {
      console.warn(`   ⚠️  ${sidecar} directory not found - agent may not have persistent memory`);
    }
  }

  console.log('   ✓ Agent sidecar systems configured');
}

/**
 * Validate Jira configuration
 */
async function validateJiraConfig(config) {
  console.log('   Checking Jira configuration...');

  const envPath = config.jira_info_path || path.join(config.project_root, '.env');

  if (fs.existsSync(envPath)) {
    console.log(`   ✓ .env file found at: ${envPath}`);

    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasJiraUrl = envContent.includes('JIRA_API_URL') || envContent.includes('JIRA_URL');
    const hasJiraToken = envContent.includes('JIRA_API_TOKEN') || envContent.includes('JIRA_TOKEN');

    if (hasJiraUrl && hasJiraToken) {
      console.log('   ✓ Jira credentials appear to be configured');
    } else {
      console.warn('   ⚠️  Jira credentials may not be fully configured in .env');
      console.warn('      Make sure you have: JIRA_API_URL and JIRA_API_TOKEN');
    }
  } else {
    console.warn(`   ⚠️  .env file not found at: ${envPath}`);
    console.warn('      You will need to create it with Jira credentials');
  }
}

/**
 * Register standalone tasks as slash commands
 * Creates command files in .claude/commands/ for direct invocation
 */
async function registerStandaloneTasks(config) {
  console.log('   Registering standalone tasks...');

  const projectRoot = config.project_root;
  const commandsDir = path.join(projectRoot, '.claude', 'commands');

  // Ensure .claude/commands directory exists
  if (!fs.existsSync(commandsDir)) {
    fs.mkdirSync(commandsDir, { recursive: true });
    console.log('   ✓ Created .claude/commands directory');
  }

  // Define standalone tasks to register
  const standaloneTasks = [
    {
      name: 'generate-commit',
      taskPath: 'bmad/sdd/tasks/generate-commit.xml',
      description: 'Create git commits following SDD streamlined format',
    },
    {
      name: 'create-pr',
      taskPath: 'bmad/sdd/tasks/create-pr.xml',
      description: 'Create pull requests following SDD streamlined format',
    },
  ];

  for (const task of standaloneTasks) {
    const commandFilePath = path.join(commandsDir, `${task.name}.md`);

    // Create command file content
    const commandContent = `---
name: ${task.name}
description: ${task.description}
---

Execute the SDD standalone task: ${task.name}

<invoke-task path="{project-root}/${task.taskPath}" />
`;

    try {
      fs.writeFileSync(commandFilePath, commandContent, 'utf8');
      console.log(`   ✓ Registered /${task.name} command`);
    } catch (error) {
      console.warn(`   ⚠️  Failed to register /${task.name}: ${error.message}`);
    }
  }

  console.log('   ✓ Standalone tasks registered');
}

/**
 * Uninstall the module (cleanup)
 */
async function uninstallModule(config) {
  console.log('🗑️  Uninstalling Spec-Driven Development module...');

  try {
    console.log('   Note: Document directories will be preserved');
    console.log('   You can manually delete them if needed');

    // Remove standalone task commands
    if (config && config.project_root) {
      const commandsDir = path.join(config.project_root, '.claude', 'commands');
      const standaloneTasks = ['generate-commit', 'create-pr'];

      for (const taskName of standaloneTasks) {
        const commandFilePath = path.join(commandsDir, `${taskName}.md`);
        if (fs.existsSync(commandFilePath)) {
          fs.unlinkSync(commandFilePath);
          console.log(`   ✓ Removed /${taskName} command`);
        }
      }
    }

    console.log('✅ Module uninstalled successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Uninstall failed:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Export functions for BMAD installer
module.exports = {
  installModule,
  uninstallModule,
};
