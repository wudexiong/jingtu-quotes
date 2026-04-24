// 全局变量
let quotes = [];
let quoteCards = [];
const teachers = ['印光大师', '净空法师', '其他大德'];

// 语音相关变量
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let currentSpeechBtn = null;
let speechSettings = {
    rate: 1,
    pitch: 1,
    voice: '',
    autoPlay: false,
    autoCopy: false
};

// 读取并解析所有老师的txt文件
async function loadQuotes() {
    try {
        quotes = [];
        
        // 并行加载所有老师的语录
        const promises = teachers.map(async (teacher) => {
            const response = await fetch(`${teacher}.txt`);
            const text = await response.text();
            parseQuotes(text, teacher);
        });
        
        await Promise.all(promises);
        renderQuotes();
    } catch (error) {
        console.error('Failed to load quotes:', error);
        showError();
    }
}

// 解析txt文件内容
function parseQuotes(text, teacher) {
    const lines = text.trim().split('\n');
    
    lines.forEach(line => {
        line = line.trim();
        if (line) {
            quotes.push({
                text: line,
                teacher: teacher
            });
        }
    });
}

// 渲染语录卡片
function renderQuotes() {
    const container = document.querySelector('.quotes-container');
    container.innerHTML = '';
    
    quotes.forEach((quote, index) => {
        const card = document.createElement('div');
        card.className = 'quote-card';
        card.dataset.teacher = quote.teacher;
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="quote-content">
                <p class="quote-text">${quote.text}</p>
                <p class="quote-author">— ${quote.teacher}</p>
            </div>
            <div class="card-buttons">
                <button class="copy-btn" title="复制语录">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                </button>
                <button class="speech-btn" title="播放语音">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                </button>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    // 更新quoteCards变量
    quoteCards = document.querySelectorAll('.quote-card');
    
    // 添加触摸反馈
    addTouchFeedback();
    
    // 添加复制功能
    addCopyFunctionality();
    
    // 添加语音播放功能
    addSpeechFunctionality();
    
    // 添加语录卡片点击事件（自动播放和自动复制）
    addCardClickEvents();
}

// 添加复制功能
function addCopyFunctionality() {
    const copyBtns = document.querySelectorAll('.copy-btn');
    
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const quoteCard = btn.closest('.quote-card');
            const quoteText = quoteCard.querySelector('.quote-text').textContent;
            const quoteAuthor = quoteCard.querySelector('.quote-author').textContent;
            const fullQuote = `${quoteText}\n${quoteAuthor}`;
            
            // 尝试使用现代API复制
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(fullQuote)
                    .then(() => {
                        showCopySuccess(btn);
                    })
                    .catch(err => {
                        console.error('Failed to copy with clipboard API:', err);
                        // 回退到传统方法
                        fallbackCopyTextToClipboard(fullQuote, btn);
                    });
            } else {
                // 回退到传统方法
                fallbackCopyTextToClipboard(fullQuote, btn);
            }
        });
    });
}

// 传统复制方法（兼容性更好）
function fallbackCopyTextToClipboard(text, btn) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // 确保文本区域不在可视区域内
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    // 选择文本
    textArea.focus();
    textArea.select();
    
    try {
        // 执行复制命令
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess(btn);
        } else {
            console.error('Failed to copy with execCommand');
        }
    } catch (err) {
        console.error('Failed to copy:', err);
    } finally {
        // 清理
        document.body.removeChild(textArea);
    }
}

// 显示复制成功提示
function showCopySuccess(btn) {
    if (!btn) {
        // 如果没有按钮元素，创建一个临时的提示元素
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = '复制成功！';
        document.body.appendChild(toast);
        
        // 2秒后移除提示元素
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 2000);
        return;
    }
    
    const originalContent = btn.innerHTML;
    
    // 更改按钮内容为成功图标
    btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    `;
    
    // 添加成功样式
    btn.classList.add('copy-success');
    
    // 2秒后恢复原状
    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.classList.remove('copy-success');
    }, 2000);
}

// 添加语音播放功能
function addSpeechFunctionality() {
    const speechBtns = document.querySelectorAll('.speech-btn');
    
    speechBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const quoteCard = btn.closest('.quote-card');
            const quoteText = quoteCard.querySelector('.quote-text').textContent;
            
            // 停止当前正在播放的语音
            if (currentUtterance) {
                speechSynthesis.cancel();
                // 恢复之前按钮的状态
                if (currentSpeechBtn && currentSpeechBtn !== btn) {
                    currentSpeechBtn.classList.remove('speaking');
                    currentSpeechBtn.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                    `;
                }
            }
            
            // 播放新的语音（只播放语录内容，不包括老师名称）
            speakText(quoteText, btn);
        });
    });
}

// 使用 Web Speech API 播放文本
function speakText(text, btn) {
    // 检查浏览器是否支持 Web Speech API
    if ('speechSynthesis' in window) {
        // 恢复之前按钮的状态
        if (currentSpeechBtn && currentSpeechBtn !== btn) {
            currentSpeechBtn.classList.remove('speaking');
            currentSpeechBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
            `;
        }
        
        // 保存当前按钮的引用
        currentSpeechBtn = btn;
        
        // 创建新的 SpeechSynthesisUtterance 对象
        currentUtterance = new SpeechSynthesisUtterance(text);
        
        // 设置语音属性
        currentUtterance.rate = speechSettings.rate;
        currentUtterance.pitch = speechSettings.pitch;
        
        // 设置语音
        if (speechSettings.voice) {
            const voices = speechSynthesis.getVoices();
            const selectedVoice = voices.find(voice => voice.name === speechSettings.voice);
            if (selectedVoice) {
                currentUtterance.voice = selectedVoice;
            }
        }
        
        // 设置语言为中文
        currentUtterance.lang = 'zh-CN';
        
        // 播放开始时的回调
        currentUtterance.onstart = () => {
            if (btn) {
                btn.classList.add('speaking');
                btn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                `;
            }
        };
        
        // 播放结束时的回调
        currentUtterance.onend = () => {
            if (btn) {
                btn.classList.remove('speaking');
                btn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                `;
            }
            // 清空当前按钮引用
            currentSpeechBtn = null;
        };
        
        // 播放错误时的回调
        currentUtterance.onerror = () => {
            if (btn) {
                btn.classList.remove('speaking');
                btn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                `;
            }
            // 清空当前按钮引用
            currentSpeechBtn = null;
            console.error('语音播放失败');
        };
        
        // 开始播放
        speechSynthesis.speak(currentUtterance);
    } else {
        console.error('您的浏览器不支持 Web Speech API');
    }
}

// 筛选功能
function initFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有按钮的active类
            filterBtns.forEach(b => b.classList.remove('active'));
            // 添加当前按钮的active类
            btn.classList.add('active');
            
            const selectedTeacher = btn.dataset.teacher;
            
            // 筛选语录卡片
            quoteCards.forEach(card => {
                if (selectedTeacher === 'all' || card.dataset.teacher === selectedTeacher) {
                    card.style.display = 'block';
                    // 添加动画效果
                    card.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// 显示错误信息
function showError() {
    const container = document.querySelector('.quotes-container');
    container.innerHTML = `
        <div class="empty-state">
            <p>加载语录失败，请检查文件是否存在</p>
        </div>
    `;
}

// 添加触摸反馈
function addTouchFeedback() {
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // 为卡片添加触摸反馈
        quoteCards.forEach(card => {
            card.addEventListener('touchstart', () => {
                card.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', () => {
                card.style.transform = 'scale(1)';
            });
        });
    }
}

// 页面加载完成后初始化
window.addEventListener('load', () => {
    loadQuotes();
    initFilter();
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 本地存储功能 - 可以保存用户的阅读进度或偏好
function saveUserPreference(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getUserPreference(key, defaultValue) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
}

// 示例：保存用户最后选择的老师
function initLocalStorage() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            saveUserPreference('lastSelectedTeacher', btn.dataset.teacher);
        });
    });
    
    // 页面加载时恢复用户偏好
    const lastSelectedTeacher = getUserPreference('lastSelectedTeacher', 'all');
    const lastSelectedBtn = document.querySelector(`.filter-btn[data-teacher="${lastSelectedTeacher}"]`);
    if (lastSelectedBtn) {
        // 延迟执行，确保DOM已经完全加载
        setTimeout(() => {
            lastSelectedBtn.click();
        }, 100);
    }
}

// 添加下拉刷新功能
let startY = 0;
let isRefreshing = false;

document.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
    }
});

document.addEventListener('touchmove', (e) => {
    if (window.scrollY === 0 && e.touches[0].clientY > startY && !isRefreshing) {
        const pullDistance = e.touches[0].clientY - startY;
        if (pullDistance > 50) {
            isRefreshing = true;
            // 这里可以添加刷新动画
            setTimeout(() => {
                isRefreshing = false;
                // 刷新完成后的操作
                loadQuotes();
            }, 1000);
        }
    }
});

// 初始化语音设置
function initSpeechSettings() {
    const speechSettingsBtn = document.getElementById('speech-settings-btn');
    const speechSettingsPanel = document.getElementById('speech-settings-panel');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const rateInput = document.getElementById('rate');
    const rateValue = document.getElementById('rate-value');
    const pitchInput = document.getElementById('pitch');
    const pitchValue = document.getElementById('pitch-value');
    const voiceSelect = document.getElementById('voice');
    const autoPlayCheckbox = document.getElementById('auto-play');
    const autoCopyCheckbox = document.getElementById('auto-copy');
    
    // 加载用户保存的语音设置
    const savedSettings = getUserPreference('speechSettings', {
        rate: 1,
        pitch: 1,
        voice: '',
        autoPlay: false,
        autoCopy: false
    });
    
    speechSettings = savedSettings;
    rateInput.value = savedSettings.rate;
    rateValue.textContent = savedSettings.rate.toFixed(1);
    pitchInput.value = savedSettings.pitch;
    pitchValue.textContent = savedSettings.pitch.toFixed(1);
    autoPlayCheckbox.checked = savedSettings.autoPlay;
    autoCopyCheckbox.checked = savedSettings.autoCopy;
    
    // 打开语音设置面板
    speechSettingsBtn.addEventListener('click', () => {
        speechSettingsPanel.classList.add('show');
        // 确保语音列表已加载
        loadVoices();
    });
    
    // 关闭语音设置面板
    closeSettingsBtn.addEventListener('click', () => {
        speechSettingsPanel.classList.remove('show');
    });
    
    // 处理语速变化
    rateInput.addEventListener('input', () => {
        const rate = parseFloat(rateInput.value);
        speechSettings.rate = rate;
        rateValue.textContent = rate.toFixed(1);
        saveSpeechSettings();
    });
    
    // 处理音调变化
    pitchInput.addEventListener('input', () => {
        const pitch = parseFloat(pitchInput.value);
        speechSettings.pitch = pitch;
        pitchValue.textContent = pitch.toFixed(1);
        saveSpeechSettings();
    });
    
    // 处理音色变化
    voiceSelect.addEventListener('change', () => {
        speechSettings.voice = voiceSelect.value;
        saveSpeechSettings();
    });
    
    // 处理自动播放选项变化
    autoPlayCheckbox.addEventListener('change', () => {
        speechSettings.autoPlay = autoPlayCheckbox.checked;
        saveSpeechSettings();
    });
    
    // 处理自动复制选项变化
    autoCopyCheckbox.addEventListener('change', () => {
        speechSettings.autoCopy = autoCopyCheckbox.checked;
        saveSpeechSettings();
    });
    
    // 加载可用的语音列表
    function loadVoices() {
        const voices = speechSynthesis.getVoices();
        voiceSelect.innerHTML = '<option value="">默认</option>';
        
        voices.forEach(voice => {
            // 只添加中文语音
            if (voice.lang.includes('zh')) {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = `${voice.name} (${voice.lang})`;
                if (voice.name === speechSettings.voice) {
                    option.selected = true;
                }
                voiceSelect.appendChild(option);
            }
        });
    }
    
    // 监听语音列表加载完成事件
    speechSynthesis.onvoiceschanged = loadVoices;
    
    // 初始加载语音列表
    loadVoices();
}

// 保存语音设置到本地存储
function saveSpeechSettings() {
    saveUserPreference('speechSettings', speechSettings);
}

// 添加语录卡片点击事件（自动播放和自动复制）
function addCardClickEvents() {
    quoteCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // 避免点击按钮时触发卡片点击事件
            if (e.target.closest('.card-buttons')) {
                return;
            }
            
            const quoteText = card.querySelector('.quote-text').textContent;
            const quoteAuthor = card.querySelector('.quote-author').textContent;
            const fullQuote = `${quoteText}\n${quoteAuthor}`;
            
            // 根据用户设置执行自动播放
            if (speechSettings.autoPlay) {
                // 停止当前正在播放的语音
                if (currentUtterance) {
                    speechSynthesis.cancel();
                    // 恢复之前按钮的状态
                    if (currentSpeechBtn) {
                        currentSpeechBtn.classList.remove('speaking');
                        currentSpeechBtn.innerHTML = `
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                            </svg>
                        `;
                    }
                }
                
                // 获取当前卡片的语音播放按钮
                const speechBtn = card.querySelector('.speech-btn');
                // 播放语音
                speakText(quoteText, speechBtn);
            }
            
            // 根据用户设置执行自动复制
            if (speechSettings.autoCopy) {
                // 尝试使用现代API复制
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(fullQuote)
                        .then(() => {
                            // 显示复制成功提示
                            showCopySuccess(null);
                        })
                        .catch(err => {
                            console.error('Failed to copy with clipboard API:', err);
                            // 回退到传统方法
                            fallbackCopyTextToClipboard(fullQuote, null);
                        });
                } else {
                    // 回退到传统方法
                    fallbackCopyTextToClipboard(fullQuote, null);
                }
            }
        });
    });
}

// 初始化本地存储
window.addEventListener('load', () => {
    initLocalStorage();
    initSpeechSettings();
});