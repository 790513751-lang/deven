(() => {
  'use strict';

  const config = window.GUIDE_CONFIG || {};
  const $ = (selector) => document.querySelector(selector);
  const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
  const safeUrl = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
    } catch {
      return '';
    }
  };

  const icons = {
    apple: '<path d="M16.4 13.1c0-2.4 2-3.6 2.1-3.7a4.5 4.5 0 0 0-3.5-1.9c-1.5-.2-2.9.9-3.7.9-.8 0-2-1-3.3-.9a4.9 4.9 0 0 0-4.1 2.5c-1.8 3-.5 7.5 1.2 10 .9 1.2 1.9 2.5 3.3 2.4 1.3-.1 1.8-.8 3.4-.8 1.6 0 2 .8 3.4.8s2.3-1.2 3.1-2.4c1-1.4 1.4-2.8 1.4-2.9-.1 0-3.3-1.3-3.3-4Z"/><path d="M14 5.9c.7-.9 1.2-2.1 1.1-3.3-1.1 0-2.4.7-3.2 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.5-.6 3.2-1.5Z"/>',
    network: '<path d="M3 9a15 15 0 0 1 18 0M6 13a10 10 0 0 1 12 0m-9 4a5 5 0 0 1 6 0"/><circle cx="12" cy="21" r=".5"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    plane: '<path d="m3 11 18-7-5 17-5-6-8-4Zm8 4 6-7"/>',
    browser: '<circle cx="12" cy="12" r="9"/><path d="M3 9h18M8 3c2.7 2.9 2.7 14.1 0 18m8-18c-2.7 2.9-2.7 14.1 0 18"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.5"/>',
    check: '<path d="m5 12 4 4L19 6"/>'
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.info}</svg>`;
  const list = (items) => `<ol class="instructions">${items.map((item) => `<li><span>${item}</span></li>`).join('')}</ol>`;
  const notice = (text, warm = false) => `<div class="notice${warm ? ' warm' : ''}">${icon('info')}<span>${text}</span></div>`;
  const resource = (title, caption, url, label, symbol) => {
    const href = safeUrl(url);
    if (!href) return '';
    return `<div class="resource"><span class="resource-icon">${icon(symbol)}</span><div class="resource-copy"><strong>${escapeHTML(title)}</strong><small>${escapeHTML(caption)}</small></div><div class="resource-actions"><a class="resource-action" href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer external">${escapeHTML(label)} ↗</a><button class="copy-action" type="button" data-copy-url="${escapeHTML(href)}" aria-label="复制${escapeHTML(title)}链接">复制链接</button></div></div>`;
  };
  const channelResource = () => resource('Telegram 频道入口', '打开后按页面提示进入我们的频道或群', config.channelUrl, '进入频道', 'plane');
  const joinTelegram = () => list([
    '打开 Telegram，点击 <b>Start Messaging（开始聊天）</b>。',
    '选择手机号对应的国家或地区，输入你自己长期使用、能接收验证码的手机号。',
    '完成官方验证并设置名字后，回到本页点击下方“进入频道”。'
  ]) + channelResource() + notice('验证码只在 Telegram 官方 App 内输入。任何人向你索要验证码，都不要提供。');

  const flows = {
    iphone: [
      {
        label: '注册账号', sub: '自行创建 Apple 账号', title: '注册可用的 Apple 账号',
        description: '我们不提供 Apple 账号。请使用自己的邮箱和手机号，按 Apple 官方说明创建。',
        content: () => resource('创建 Apple 账号', 'Apple 官方账号页面', config.apple?.createUrl, '开始注册', 'apple') + resource('官方文字教程', '查看 Apple 的完整注册说明', config.apple?.tutorialUrl, '查看教程', 'browser') + list([
          '打开 Apple 官方账号页面，选择创建新账户。',
          '使用自己的邮箱、真实生日和可长期接收验证码的手机号；国家或地区选择能下载 Telegram 的地区，例如美国。',
          '按 Apple 页面完成邮箱和手机验证。若系统要求付款或账单资料，请按页面真实要求填写；无法完成时不要购买来路不明的共享账号。'
        ]) + notice('账号密码和验证码只在 Apple 官方页面输入。本页不会收集这些信息。', true),
        next: '账号已准备好'
      },
      {
        label: '准备网络', sub: '注册并连接网络工具', title: '注册并连接网络工具',
        description: '请先在系统浏览器中打开注册入口，按页面提示完成注册和连接。',
        content: () => resource('网络工具注册入口', '打开 KTM Cloud 注册页面', config.networkUrl, '浏览器打开', 'network') + list([
          '点击“浏览器打开”；如果当前在微信或 QQ 中，请点右上角“…”选择<b>在浏览器打开</b>。',
          '按页面提示注册、登录，并安装适合 iPhone 的客户端。',
          '按照网站说明导入配置并连接，确认客户端显示已连接后再回来。'
        ]) + notice('网络工具的套餐、付款和使用规则以对方页面显示为准，请在确认后自行选择。'),
        next: '网络已连接'
      },
      {
        label: '安装 TG', sub: '从 App Store 下载', title: '安装 Telegram 官方版',
        description: '保持网络连接，使用刚准备好的 Apple 账号从 App Store 下载。',
        content: () => resource('Telegram Messenger', 'Telegram 官方 App Store 页面', config.telegram?.iphoneUrl, '前往安装', 'download') + list([
          '点击“前往安装”，在 App Store 中确认应用名称为 <b>Telegram Messenger</b>。',
          '点击“获取”并等待安装完成。',
          '如果提示当前地区不可用，检查 App Store 登录的账号地区，再重新打开下载按钮。'
        ]) + notice('不要下载名称相近的第三方客户端。开发者应显示为 Telegram FZ-LLC。'),
        next: '已安装 Telegram'
      },
      {
        label: '进入频道', sub: '登录 TG 并加入', title: '登录 Telegram，进入频道',
        description: '最后完成手机号验证，再从本页进入我们的 Telegram 频道。',
        content: joinTelegram,
        next: '我已进入频道'
      }
    ],
    android: [
      {
        label: '准备网络', sub: '注册并连接网络工具', title: '注册并连接网络工具',
        description: '安卓不需要 Apple 账号。先打开网络工具注册链接并完成连接。',
        content: () => resource('网络工具注册入口', '打开 KTM Cloud 注册页面', config.networkUrl, '浏览器打开', 'network') + list([
          '点击“浏览器打开”；如果当前在微信或 QQ 中，请点右上角“…”选择<b>在浏览器打开</b>。',
          '按页面提示注册、登录，并安装适合安卓手机的客户端。',
          '导入配置并连接，确认客户端显示已连接后再回来。'
        ]) + notice('网络工具的套餐、付款和使用规则以对方页面显示为准，请在确认后自行选择。'),
        next: '网络已连接'
      },
      {
        label: '安装 TG', sub: '下载官方 APK', title: '下载 Telegram 安卓安装包',
        description: '点击官方下载按钮，浏览器会开始下载 Telegram APK。',
        content: () => resource('Telegram 官方 APK', '由 telegram.org 提供的安卓安装包', config.telegram?.androidApkUrl, '下载 APK', 'download') + resource('Telegram 安卓官网', '直接下载失败时打开此页面', config.telegram?.androidPageUrl, '打开官网', 'browser') + list([
          '下载完成后，打开 APK 文件并按系统提示安装。',
          '若手机询问是否允许浏览器“安装未知应用”，仅对本次下载所用浏览器临时允许。',
          '安装完成后关闭该权限，再打开 Telegram。'
        ]) + notice('安装包只从 telegram.org 官方地址下载。不要安装网盘或聊天群转发的改版 APK。', true),
        next: '已安装 Telegram'
      },
      {
        label: '进入频道', sub: '登录 TG 并加入', title: '登录 Telegram，进入频道',
        description: '完成手机号验证后，点击我们的频道入口。',
        content: joinTelegram,
        next: '我已进入频道'
      }
    ]
  };

  const storageKey = 'tg-guide-progress-v2';
  let progress = { device: 'iphone', iphone: { step: 0, completed: [] }, android: { step: 0, completed: [] } };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && ['iphone', 'android'].includes(saved.device)) progress.device = saved.device;
    for (const device of ['iphone', 'android']) {
      if (!saved?.[device]) continue;
      const max = flows[device].length;
      progress[device].step = Number.isInteger(saved[device].step) ? Math.min(max, Math.max(0, saved[device].step)) : 0;
      progress[device].completed = [...new Set((Array.isArray(saved[device].completed) ? saved[device].completed : []).filter((step) => Number.isInteger(step) && step >= 0 && step < max))];
    }
  } catch { /* Local progress is optional. */ }
  const save = () => { try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch { /* Local progress is optional. */ } };
  const deviceName = () => progress.device === 'iphone' ? '苹果手机' : '安卓手机';
  const applyHash = () => {
    const match = location.hash.match(/^#(iphone|android)\/(\d+|done)$/);
    if (!match) return false;
    const device = match[1];
    const max = flows[device].length;
    progress.device = device;
    progress[device].step = match[2] === 'done' ? max : Math.min(max - 1, Math.max(0, Number(match[2]) - 1));
    return true;
  };
  const setHash = () => {
    const current = progress[progress.device];
    const max = flows[progress.device].length;
    const hash = `#${progress.device}/${current.step === max ? 'done' : current.step + 1}`;
    if (location.hash !== hash) history.pushState(null, '', hash);
  };
  const navigate = (device, step, focus = true) => {
    progress.device = device;
    progress[device].step = Math.min(flows[device].length, Math.max(0, step));
    save(); setHash(); render();
    if (focus) {
      $('#guide').focus({ preventScroll: true });
      const rect = $('#guide').getBoundingClientRect();
      if (rect.top < 0 || rect.top > innerHeight * .6) $('#guide').scrollIntoView({ block: 'start', behavior: 'auto' });
    }
  };

  function render() {
    const { device } = progress;
    const current = progress[device];
    const flow = flows[device];
    const done = current.step === flow.length;
    document.querySelectorAll('[data-device]').forEach((element) => element.setAttribute('aria-pressed', String(element.dataset.device === device)));
    $('#step-nav').style.setProperty('--step-count', flow.length);
    $('#progress-label').textContent = done ? '已完成' : `${current.step + 1} / ${flow.length}`;
    $('#step-nav').innerHTML = flow.map((step, index) => `<button type="button" class="step-link${current.completed.includes(index) ? ' done' : ''}" data-step="${index}"${current.step === index ? ' aria-current="step"' : ''} aria-label="第 ${index + 1} 步：${step.label}${current.completed.includes(index) ? '，已确认完成' : ''}"><span class="step-number">${current.completed.includes(index) && current.step !== index ? icon('check') : String(index + 1).padStart(2, '0')}</span><span><strong>${step.label}</strong><small>${step.sub}</small></span></button>`).join('');
    if (!done) {
      const step = flow[current.step];
      $('#step-content').innerHTML = `<div class="step-kicker"><span>STEP ${String(current.step + 1).padStart(2, '0')} / ${String(flow.length).padStart(2, '0')}</span><span>${deviceName()}教程</span></div><h2 id="step-title">${step.title}</h2><p class="step-description">${step.description}</p>${step.content()}`;
      $('#next').innerHTML = `${step.next} <span aria-hidden="true">→</span>`;
      $('#previous').textContent = '上一步';
      $('#previous').disabled = current.step === 0;
    } else {
      $('#step-content').innerHTML = `<div class="success-state"><div class="success-symbol">${icon('check')}</div><h2 id="step-title">全部完成</h2><p>以后从下面的入口，就能再次进入我们的 Telegram 频道。</p>${channelResource()}${notice('建议在 Telegram 的“设置 → 隐私与安全”中开启两步验证，并妥善保存恢复邮箱。')}<button type="button" class="review-link" id="restart">重新查看这套教程</button></div>`;
      $('#next').innerHTML = '进入 Telegram 频道 ↗';
      $('#previous').textContent = '返回上一步';
      $('#previous').disabled = false;
    }
    document.title = `${done ? '完成引导' : flow[current.step].title} · ${config.brandName || 'TG 上手指南'}`;
  }

  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => { toast.hidden = true; }, 2200);
  }
  async function copyText(value, message) {
    try {
      await navigator.clipboard.writeText(value);
      showToast(message);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      showToast(message);
    }
  }
  function openHelp() {
    $('#help-content').innerHTML = `<details open><summary>微信或 QQ 里点链接没反应？</summary><p>点击右上角“…”菜单，选择“在浏览器打开”或“用默认浏览器打开”。也可以点击页面中的“复制链接”，粘贴到 Safari、Chrome 或手机自带浏览器。</p></details><details><summary>Apple 账号注册不成功？</summary><p>请使用自己的邮箱和能长期接收验证码的手机号，并按 Apple 官方页面要求填写信息。若账号地区要求你无法提供的付款或账单资料，不要购买来路不明的共享账号。</p></details><details><summary>安卓 APK 无法安装？</summary><p>确认安装包来自 telegram.org。只对下载所用浏览器临时允许“安装未知应用”，安装后关闭权限。系统提示不兼容时，请打开 Telegram 安卓官网查看其他下载方式。</p></details><details><summary>Telegram 收不到验证码？</summary><p>检查国家区号和手机号。已有账号的验证码可能发送到其他已登录设备。按倒计时等待，避免连续重复请求。</p><a href="https://telegram.org/faq#login-and-sms" target="_blank" rel="noopener noreferrer external">查看 Telegram 官方帮助 ↗</a></details>`;
    $('#contact-action').innerHTML = channelResource();
    if (!$('#help-dialog').open) $('#help-dialog').showModal();
  }

  const isEmbeddedBrowser = /MicroMessenger|QQ\//i.test(navigator.userAgent);
  const browserTip = $('#browser-tip');
  browserTip.classList.toggle('embedded', isEmbeddedBrowser);
  $('#browser-tip-text').innerHTML = isEmbeddedBrowser
    ? '<b>请先在系统浏览器打开本页：</b>点右上角“…” → 选择“在浏览器打开”，再开始操作。'
    : '<b>当前已在浏览器中。</b>点击下面的按钮会在新页面打开，完成后返回本教程继续。';
  $('#brand-name').textContent = config.brandName || 'TG 上手指南';

  document.addEventListener('click', (event) => {
    const device = event.target.closest('[data-device]');
    if (device) navigate(device.dataset.device, progress[device.dataset.device].step, false);
    const step = event.target.closest('[data-step]');
    if (step) navigate(progress.device, Number(step.dataset.step));
    if (event.target.closest('[data-help]')) openHelp();
    const copyUrl = event.target.closest('[data-copy-url]');
    if (copyUrl) copyText(copyUrl.dataset.copyUrl, '链接已复制，请粘贴到系统浏览器');
    if (event.target.closest('[data-copy-page]')) copyText(location.href, '本页网址已复制');
    if (event.target.closest('#restart')) {
      progress[progress.device].completed = [];
      navigate(progress.device, 0);
    }
  });
  $('#previous').addEventListener('click', () => navigate(progress.device, progress[progress.device].step - 1));
  $('#next').addEventListener('click', () => {
    const current = progress[progress.device];
    const max = flows[progress.device].length;
    if (current.step === max) {
      const channel = safeUrl(config.channelUrl);
      if (channel) window.open(channel, '_blank', 'noopener,noreferrer');
      return;
    }
    if (!current.completed.includes(current.step)) current.completed.push(current.step);
    navigate(progress.device, current.step + 1);
  });
  $('#close-help').addEventListener('click', () => $('#help-dialog').close());
  $('#help-dialog').addEventListener('click', (event) => {
    if (event.target !== $('#help-dialog')) return;
    const rect = event.target.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.target.close();
  });
  window.addEventListener('hashchange', () => { if (applyHash()) { save(); render(); } });
  applyHash(); render(); save();
})();

