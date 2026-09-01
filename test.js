#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { build, generateConstants } = require('./build.js');

/**
 * Test script for the ChatGPT Archive Enhancer build system
 */

function testTemplateExtraction() {
    console.log('🧪 Testing template extraction...');
    
    const templatesDir = path.join(__dirname, 'templates');
    const preFile = path.join(templatesDir, 'pre.html');
    const postFile = path.join(templatesDir, 'post.html');
    
    // Check if template files exist
    if (!fs.existsSync(preFile)) {
        throw new Error('Pre template file not found');
    }
    
    if (!fs.existsSync(postFile)) {
        throw new Error('Post template file not found');
    }
    
    // Check if templates contain expected content
    const preContent = fs.readFileSync(preFile, 'utf8');
    const postContent = fs.readFileSync(postFile, 'utf8');
    
    if (!/<!doctype html>/i.test(preContent)) {
        throw new Error('Pre template does not contain valid HTML');
    }
    
    if (!postContent.includes('function getConversationMessages')) {
        throw new Error('Post template does not contain required JavaScript functions');
    }
    
    console.log('✅ Template extraction test passed');
}

function testConstantGeneration() {
    console.log('🧪 Testing constant generation...');
    
    const constants = generateConstants();
    
    if (!constants.pre || !constants.post) {
        throw new Error('Failed to generate constants');
    }
    
    // Test base64 encoding/decoding
    const preDecoded = Buffer.from(constants.pre, 'base64').toString('utf8');
    const postDecoded = Buffer.from(constants.post, 'base64').toString('utf8');
    
    if (!/<!doctype html>/i.test(preDecoded)) {
        throw new Error('Pre constant decoding failed');
    }
    
    if (!postDecoded.includes('function getConversationMessages')) {
        throw new Error('Post constant decoding failed');
    }
    
    console.log('✅ Constant generation test passed');
}

function testGeneratedDocument() {
    console.log('🧪 Testing generated viewer structure...');
    const constants = generateConstants();
    const pre = Buffer.from(constants.pre, 'base64').toString('utf8');
    const post = Buffer.from(constants.post, 'base64').toString('utf8');
    const output = `${pre}\nconst jsonData = [];\n${post}`;

    if ((output.match(/<!doctype html>/gi) || []).length !== 1) {
        throw new Error('Generated viewer must contain exactly one document declaration');
    }
    if ((output.match(/<\/html>/gi) || []).length !== 1) {
        throw new Error('Generated viewer must contain exactly one closing html tag');
    }
    if (!output.includes('window.addEventListener(\'DOMContentLoaded\', init)')) {
        throw new Error('Generated viewer initialization is missing');
    }
    if (!output.includes('chatgpt.com/c/')) {
        throw new Error('Generated viewer uses an outdated conversation URL');
    }

    const script = output.match(/<script>([\s\S]*)<\/script>/);
    if (!script) {
        throw new Error('Generated viewer script is missing');
    }
    // Compile without executing so syntax errors in the embedded viewer fail CI.
    new Function(script[1]);

    const context = {
        window: { addEventListener() {}, __archiveViewerOptions: { markdown: true } },
        Intl,
        Date,
        console
    };
    vm.createContext(context);
    vm.runInContext(`${script[1]}; globalThis.__viewerTest = { renderText, cleanExportArtifacts, normalizeSearchText, parseSearchQuery, evaluateSearch, sortedItems, setSort(value) { state.sort = value; } };`, context);
    const markdown = [
        '### ⭐ What is this?',
        '',
        '**Important** explanation. \uE200cite\uE202turn0search4\uE201',
        '',
        '- First item',
        '- Second item',
        '',
        '---',
        '',
        '| Name | Value |',
        '| --- | --- |',
        '| One | Two |'
    ].join('\n');
    const rendered = context.__viewerTest.renderText(markdown);
    if (!rendered.includes('<h4>⭐ What is this?</h4>') ||
        !rendered.includes('<strong>Important</strong>') ||
        !rendered.includes('<ul><li>First item</li><li>Second item</li></ul>') ||
        !rendered.includes('<hr>') ||
        !rendered.includes('<table>')) {
        throw new Error('Markdown blocks are not rendered correctly');
    }
    if (rendered.includes('turn0search4') || rendered.includes('\uE200cite')) {
        throw new Error('Internal citation markers are not removed');
    }

    const first = {
        id: 'first',
        title: 'Bayern Domain',
        titleSearch: 'bayern domain',
        created: new Date(2025, 1, 1),
        updated: new Date(2026, 0, 30),
        authors: new Set(['user', 'chatgpt']),
        models: new Set(['gpt-4o']),
        features: new Set(['code']),
        isArchived: false,
        messages: [{}, {}],
        searchText: 'bayern domain user registration chatgpt answer uber cafe'
    };
    const second = {
        id: 'second',
        title: 'Older update',
        titleSearch: 'older update',
        created: new Date(2026, 0, 1),
        updated: new Date(2025, 5, 1),
        authors: new Set(['user']),
        models: new Set(['gpt-3.5']),
        features: new Set(),
        isArchived: true,
        messages: [{}],
        searchText: 'unrelated conversation'
    };
    const terms = context.__viewerTest.parseSearchQuery('title:"bayern domain" from:assistant created:2025 updated:2026-01 after:2026 before:2026-02-01');
    if (!context.__viewerTest.evaluateSearch(first, terms).matches || context.__viewerTest.evaluateSearch(second, terms).matches) {
        throw new Error('Structured search filters are not evaluated correctly');
    }
    const advancedTerms = context.__viewerTest.parseSearchQuery('Café OR Bayern model:gpt-4 has:code messages:>=2 is:active');
    if (!context.__viewerTest.evaluateSearch(first, advancedTerms).matches || advancedTerms.alternatives.length !== 1) {
        throw new Error('Model, content, count, status, OR, or normalized text search is incorrect');
    }
    if (context.__viewerTest.normalizeSearchText('Über Café Straße') !== 'uber cafe strasse') {
        throw new Error('Diacritic-insensitive search normalization is incorrect');
    }
    context.__viewerTest.setSort('created-desc');
    if (context.__viewerTest.sortedItems([first, second])[0].id !== 'second') {
        throw new Error('Creation-date sorting is incorrect');
    }
    context.__viewerTest.setSort('updated-desc');
    if (context.__viewerTest.sortedItems([first, second])[0].id !== 'first') {
        throw new Error('Last-change sorting is incorrect');
    }

    console.log('✅ Generated viewer structure test passed');
}

function testBuild() {
    console.log('🧪 Testing build process...');
    
    // Backup original index.html
    const indexFile = path.join(__dirname, 'index.html');
    const backupFile = path.join(__dirname, 'index.html.backup');
    
    if (fs.existsSync(indexFile)) {
        fs.copyFileSync(indexFile, backupFile);
    }
    
    try {
        // Run build
        build();
        
        // Check if index.html was updated
        if (!fs.existsSync(indexFile)) {
            throw new Error('index.html was not created');
        }
        
        const content = fs.readFileSync(indexFile, 'utf8');
        
        if (!content.includes('const pre = "') || !content.includes('const post = "')) {
            throw new Error('Constants were not properly injected into index.html');
        }
        
        console.log('✅ Build process test passed');
        
    } finally {
        // Restore backup if it exists
        if (fs.existsSync(backupFile)) {
            fs.copyFileSync(backupFile, indexFile);
            fs.unlinkSync(backupFile);
        }
    }
}

function runTests() {
    try {
        console.log('🚀 Running ChatGPT Archive Enhancer tests...\n');
        
        testTemplateExtraction();
        testConstantGeneration();
        testGeneratedDocument();
        testBuild();
        
        console.log('\n🎉 All tests passed!');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        process.exit(1);
    }
}

// Run tests if called directly
if (require.main === module) {
    runTests();
}

module.exports = { runTests };
