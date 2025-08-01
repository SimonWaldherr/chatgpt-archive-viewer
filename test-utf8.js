#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * UTF-8 Encoding Test for ChatGPT Archive Enhancer
 */

function testUTF8Encoding() {
    console.log('🧪 Testing UTF-8 encoding...');
    
    const testContent = `
        Test content with UTF-8 characters:
        - German: äöüßÄÖÜ
        - French: éàèùâêîôûç
        - Spanish: ñáéíóú
        - Russian: привет
        - Chinese: 你好
        - Japanese: こんにちは
        - Emoji: 🌙🔍📚🎉
        - Special symbols: ©®™€£¥
    `;
    
    // Test base64 encoding/decoding cycle
    const base64 = Buffer.from(testContent, 'utf8').toString('base64');
    const decoded = Buffer.from(base64, 'base64').toString('utf8');
    
    if (decoded !== testContent) {
        throw new Error('UTF-8 base64 encoding/decoding failed');
    }
    
    // Test with actual templates
    const preFile = path.join(__dirname, 'templates', 'pre.html');
    const postFile = path.join(__dirname, 'templates', 'post.html');
    
    if (!fs.existsSync(preFile) || !fs.existsSync(postFile)) {
        throw new Error('Template files not found');
    }
    
    const preContent = fs.readFileSync(preFile, 'utf8');
    const postContent = fs.readFileSync(postFile, 'utf8');
    
    // Test encoding cycle with templates
    const preBase64 = Buffer.from(preContent, 'utf8').toString('base64');
    const postBase64 = Buffer.from(postContent, 'utf8').toString('base64');
    
    const preDecoded = Buffer.from(preBase64, 'base64').toString('utf8');
    const postDecoded = Buffer.from(postBase64, 'base64').toString('utf8');
    
    if (preDecoded !== preContent) {
        throw new Error('Pre template UTF-8 encoding failed');
    }
    
    if (postDecoded !== postContent) {
        throw new Error('Post template UTF-8 encoding failed');
    }
    
    // Check for UTF-8 meta tags
    if (!preContent.includes('charset="UTF-8"') && !preContent.includes('charset=UTF-8')) {
        throw new Error('Pre template missing UTF-8 charset declaration');
    }
    
    console.log('✅ UTF-8 encoding test passed');
}

function testUnicodeChars() {
    console.log('🧪 Testing Unicode character handling...');
    
    const unicodeTestCases = [
        'Simple ASCII text',
        'German umlauts: äöüßÄÖÜ',
        'French accents: éàèùâêîôûç',
        'Mathematical symbols: ∑∏∆√∞≠≤≥',
        'Currency symbols: €£¥₹₽',
        'Emoji: 🌟🚀💯🎯📊',
        'Mixed: Hello 世界! 🌍 Ça va? Привет! 🚀'
    ];
    
    for (const testCase of unicodeTestCases) {
        const base64 = Buffer.from(testCase, 'utf8').toString('base64');
        const decoded = Buffer.from(base64, 'base64').toString('utf8');
        
        if (decoded !== testCase) {
            throw new Error(`Unicode test failed for: ${testCase}`);
        }
    }
    
    console.log('✅ Unicode character test passed');
}

function runUTF8Tests() {
    try {
        console.log('🚀 Running UTF-8 encoding tests...\n');
        
        testUTF8Encoding();
        testUnicodeChars();
        
        console.log('\n🎉 All UTF-8 tests passed!');
        
    } catch (error) {
        console.error('\n❌ UTF-8 test failed:', error.message);
        process.exit(1);
    }
}

// Run tests if called directly
if (require.main === module) {
    runUTF8Tests();
}

module.exports = { runUTF8Tests };
