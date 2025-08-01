#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
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
    
    if (!preContent.includes('<!DOCTYPE html>')) {
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
    
    if (!preDecoded.includes('<!DOCTYPE html>')) {
        throw new Error('Pre constant decoding failed');
    }
    
    if (!postDecoded.includes('function getConversationMessages')) {
        throw new Error('Post constant decoding failed');
    }
    
    console.log('✅ Constant generation test passed');
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
