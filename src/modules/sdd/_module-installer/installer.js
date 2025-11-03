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

    // Step 4: Validate Jira configuration
    await validateJiraConfig(config);

    console.log('✅ SDD module installed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Ensure your .env file contains Jira credentials');
    console.log('   2. Load pm-agent to start product workflows');
    console.log('   3. Load dev-agent to start development workflows');

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
 * Uninstall the module (cleanup)
 */
async function uninstallModule() {
  console.log('🗑️  Uninstalling Spec-Driven Development module...');

  try {
    console.log('   Note: Document directories will be preserved');
    console.log('   You can manually delete them if needed');

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
