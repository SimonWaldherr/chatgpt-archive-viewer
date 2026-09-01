#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Build script to generate the base64 encoded template parts
 * for the ChatGPT Archive Enhancer Tool
 */

// Template file paths
const templateDir = path.join(__dirname, 'templates');
const outputFile = path.join(__dirname, 'index.html');
const exampleSourceFile = path.join(__dirname, 'example', 'chat-original.html');
const exampleOutputFile = path.join(__dirname, 'example', 'chat-enhanced.html');

// Read template parts
function readTemplate(filename) {
    const filePath = path.join(templateDir, filename);
    if (!fs.existsSync(filePath)) {
        throw new Error(`Template file not found: ${filePath}`);
    }
    return fs.readFileSync(filePath, 'utf8');
}

// Generate base64 encoded constants
function generateConstants() {
    const preTemplate = readTemplate('pre.html');
    const postTemplate = readTemplate('post.html');
    
    // Ensure UTF-8 encoding and create base64
    const preBase64 = Buffer.from(preTemplate, 'utf8').toString('base64');
    const postBase64 = Buffer.from(postTemplate, 'utf8').toString('base64');
    
    // Validate that decoding works correctly
    const preDecoded = Buffer.from(preBase64, 'base64').toString('utf8');
    const postDecoded = Buffer.from(postBase64, 'base64').toString('utf8');
    
    if (preDecoded !== preTemplate || postDecoded !== postTemplate) {
        throw new Error('UTF-8 encoding/decoding validation failed');
    }
    
    return {
        pre: preBase64,
        post: postBase64
    };
}

function extractJsonData(source) {
    const assignment = /(?:const|let|var)\s+jsonData\s*=\s*/g.exec(source);
    if (!assignment) {
        throw new Error('No jsonData assignment found in example archive');
    }
    const start = source.indexOf('[', assignment.index + assignment[0].length);
    let depth = 0;
    let quoted = false;
    let escaped = false;
    for (let index = start; index < source.length; index += 1) {
        const character = source[index];
        if (quoted) {
            if (escaped) escaped = false;
            else if (character === '\\') escaped = true;
            else if (character === '"') quoted = false;
            continue;
        }
        if (character === '"') quoted = true;
        else if (character === '[') depth += 1;
        else if (character === ']' && --depth === 0) return JSON.parse(source.slice(start, index + 1));
    }
    throw new Error('Incomplete jsonData array in example archive');
}

function buildExample() {
    if (!fs.existsSync(exampleSourceFile)) return;
    const conversations = extractJsonData(fs.readFileSync(exampleSourceFile, 'utf8'));
    const preTemplate = readTemplate('pre.html');
    const postTemplate = readTemplate('post.html');
    const json = JSON.stringify(conversations).replace(/<\/script/gi, '<\\/script');
    const output = `${preTemplate}\nwindow.__archiveViewerOptions = {"markdown":true};\nconst jsonData = ${json};\n${postTemplate}`;
    fs.writeFileSync(exampleOutputFile, output, 'utf8');
    console.log(`   - Example viewer: ${conversations.length} conversations`);
}

// Update index.html with new constants
function updateIndexHtml(constants) {
    let content = fs.readFileSync(outputFile, 'utf8');
    
    // Replace the pre constant
    content = content.replace(
        /const pre = "[^"]*";/,
        `const pre = "${constants.pre}";`
    );
    
    // Replace the post constant
    content = content.replace(
        /const post = "[^"]*";/,
        `const post = "${constants.post}";`
    );
    
    fs.writeFileSync(outputFile, content, 'utf8');
}

// Main build function
function build() {
    try {
        console.log('Building ChatGPT Archive Enhancer Tool...');
        
        // Create templates directory if it doesn't exist
        if (!fs.existsSync(templateDir)) {
            fs.mkdirSync(templateDir, { recursive: true });
            console.log('Created templates directory');
        }
        
        const constants = generateConstants();
        updateIndexHtml(constants);
        if (process.argv.includes('--example')) buildExample();
        
        console.log('✅ Build completed successfully!');
        console.log(`   - Pre template: ${constants.pre.length} chars (base64)`);
        console.log(`   - Post template: ${constants.post.length} chars (base64)`);
        
    } catch (error) {
        console.error('❌ Build failed:', error.message);
        process.exit(1);
    }
}

// Run build if called directly
if (require.main === module) {
    build();
}

module.exports = { build, buildExample, extractJsonData, generateConstants };
