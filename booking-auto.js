/**
 * booking-auto.js
 * 這個腳本負責在 booking.asus.com 頁面自動執行預約流程：
 * 1. 按第一個 OK（立德會議室注意事項）
 * 2. 選擇立德8F會議室
 * 3. 按第二個 OK
 * 4. 填入日期
 * 5. 點擊開始搜尋
 *
 * 啟動方式：從 URL hash #autobook=YYYY/MM/DD 讀取日期
 */

(function () {
  'use strict';

  // ── 讀取 URL hash 中的日期 ────────────────────────────────
  function getDateFromHash() {
    const hash = window.location.hash; // e.g. #autobook=2026/05/08
    const match = hash.match(/autobook=([^&]+)/);
    if (match) {
      return decodeURIComponent(match[1]);
    }
    return null;
  }

  const targetDate = getDateFromHash();
  if (!targetDate) return; // 沒有自動化參數，正常瀏覽

  console.log(`[ASUS Booking Agent] 自動化啟動，目標日期：${targetDate}`);

  // ── 工具函式 ──────────────────────────────────────────────

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  // 等待元素出現
  function waitFor(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const t0 = Date.now();
      (function check() {
        const el = document.querySelector(selector);
        if (el) return resolve(el);
        if (Date.now() - t0 > timeout) return reject(new Error('等待逾時: ' + selector));
        setTimeout(check, 250);
      })();
    });
  }

  // 按包含指定文字的按鈕
  function clickByText(text, scope = document) {
    const btns = scope.querySelectorAll('button, .btn, [role="button"], input[type="button"], input[type="submit"]');
    for (const btn of btns) {
      if (btn.textContent.trim() === text || btn.value === text) {
        btn.click();
        return true;
      }
    }
    return false;
  }

  // 對 React/Vue 受控 input 設定值
  function setReactInput(el, value) {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, value);
    el.dispatchEvent(new Event('input',  { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
  }

  // ── 主流程 ────────────────────────────────────────────────
  async function run() {
    await sleep(1500); // 等待頁面 JS 初始化完成

    // STEP 1：第一個彈窗（立德會議室注意事項）→ 按 OK
    console.log('[Step 1] 等待第一個彈窗...');
    try {
      await waitFor('.modal.show, .modal[style*="display: block"], [role="dialog"]', 8000);
      await sleep(600);
      const clicked = clickByText('OK') || clickByText('確定') || clickByText('ok');
      if (!clicked) {
        const btn = document.querySelector('.modal.show button, [role="dialog"] button');
        if (btn) btn.click();
      }
      console.log('[Step 1] ✓ 已按第一個 OK');
    } catch {
      console.warn('[Step 1] 未偵測到第一個彈窗，繼續...');
    }

    await sleep(1000);

    // STEP 2：選擇「立德8F會議室(LiDe)」
    console.log('[Step 2] 選擇立德8F會議室...');
    const selects = document.querySelectorAll('select');
    let selected = false;

    for (const sel of selects) {
      for (const opt of sel.options) {
        if (opt.text.includes('立德8F') || opt.text.includes('8F')) {
          sel.value = opt.value;
          sel.dispatchEvent(new Event('change', { bubbles: true }));
          selected = true;
          console.log(`[Step 2] ✓ 已選擇：${opt.text}`);
          break;
        }
      }
      if (selected) break;
    }

    if (!selected) {
      console.warn('[Step 2] ⚠ 找不到立德8F選項，請手動選擇');
    }

    await sleep(1200);

    // STEP 3：第二個彈窗（立德8F注意事項）→ 按 OK
    console.log('[Step 3] 等待第二個彈窗...');
    try {
      await waitFor('.modal.show, [role="dialog"]', 5000);
      await sleep(600);
      const clicked = clickByText('OK') || clickByText('確定') || clickByText('ok');
      if (!clicked) {
        const btn = document.querySelector('.modal.show button, [role="dialog"] button');
        if (btn) btn.click();
      }
      console.log('[Step 3] ✓ 已按第二個 OK');
    } catch {
      console.warn('[Step 3] 未偵測到第二個彈窗，繼續...');
    }

    await sleep(1000);

    // STEP 4：填入日期（YYYY/MM/DD）
    console.log(`[Step 4] 填入日期：${targetDate}`);
    const dateSelectors = [
      'input[type="date"]',
      'input[name*="date" i]',
      'input[id*="date" i]',
      'input[placeholder*="日期"]',
      'input[placeholder*="Date" i]',
      '[class*="date" i] input',
      '[class*="Date"] input'
    ];

    let dateSet = false;
    for (const sel of dateSelectors) {
      const el = document.querySelector(sel);
      if (el) {
        // type="date" 需要 YYYY-MM-DD 格式
        const val = el.type === 'date'
          ? targetDate.replace(/\//g, '-')
          : targetDate;
        setReactInput(el, val);
        dateSet = true;
        console.log(`[Step 4] ✓ 日期已填入（${sel}）`);
        break;
      }
    }

    if (!dateSet) {
      console.warn('[Step 4] ⚠ 找不到日期輸入框，請手動填入');
    }

    await sleep(800);

    // STEP 5：點擊「開始搜尋」
    console.log('[Step 5] 點擊搜尋按鈕...');
    const allBtns = document.querySelectorAll('button, [role="button"], input[type="submit"]');
    let searchClicked = false;

    for (const btn of allBtns) {
      const t = btn.textContent.trim();
      if (t.includes('搜尋') || t.includes('Search') || t.includes('查詢') || t.includes('開始')) {
        btn.click();
        searchClicked = true;
        console.log(`[Step 5] ✓ 已點擊「${t}」`);
        break;
      }
    }

    if (!searchClicked) {
      // 嘗試 submit 按鈕
      const submitBtn = document.querySelector('button[type="submit"], .btn-primary, .btn-search');
      if (submitBtn) {
        submitBtn.click();
        searchClicked = true;
        console.log('[Step 5] ✓ 已點擊 submit 按鈕');
      }
    }

    if (!searchClicked) {
      console.warn('[Step 5] ⚠ 找不到搜尋按鈕，請手動點擊');
    }

    console.log('[ASUS Booking Agent] ✅ 自動化流程完成！');
  }

  run().catch(err => console.error('[ASUS Booking Agent] 發生錯誤：', err));

})();
