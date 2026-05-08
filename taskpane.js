/* taskpane.js — ASUS Booking Agent Office Add-in */

let meetingDateStr = ''; // YYYY/MM/DD

// ── Office 初始化 ─────────────────────────────────────────────
Office.onReady(function (info) {
  if (info.host === Office.HostType.Outlook) {
    loadMeetingDate();
  } else {
    showStatus('請在 Outlook 會議表單中開啟此面板', 'error');
  }
});

// ── 從 Outlook 會議讀取開始日期 ──────────────────────────────
function loadMeetingDate() {
  try {
    const item = Office.context.mailbox.item;

    if (!item || !item.start) {
      showStatus('找不到會議資訊，請在新增會議時開啟此面板', 'error');
      return;
    }

    item.start.getAsync(function (result) {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        const date = result.value; // JavaScript Date 物件
        const yyyy = date.getFullYear();
        const mm   = String(date.getMonth() + 1).padStart(2, '0');
        const dd   = String(date.getDate()).padStart(2, '0');

        meetingDateStr = `${yyyy}/${mm}/${dd}`;

        // 顯示日期
        document.getElementById('meeting-date').textContent = meetingDateStr;

        // 啟用按鈕
        const btn = document.getElementById('btn-open');
        btn.disabled = false;

      } else {
        showStatus('無法讀取會議日期：' + result.error.message, 'error');
      }
    });

  } catch (e) {
    showStatus('錯誤：' + e.message, 'error');
  }
}

// ── 開啟 Booking System（帶上日期參數）────────────────────────
function openBooking() {
  if (!meetingDateStr) {
    showStatus('尚未讀取到日期，請稍後再試', 'error');
    return;
  }

  // 將日期編碼後附在 URL hash，讓 booking 頁面的注入腳本讀取
  // 格式：#autobook=2026/05/08
  const encodedDate = encodeURIComponent(meetingDateStr);
  const url = `https://booking.asus.com/Booking/Index#autobook=${encodedDate}`;

  Office.context.ui.openBrowserWindow(url);

  showStatus(`✅ 已開啟預約頁面，日期：${meetingDateStr}`, 'success');
}

// ── 顯示狀態訊息 ─────────────────────────────────────────────
function showStatus(msg, type = 'info') {
  const el = document.getElementById('status-msg');
  el.textContent = msg;
  el.className = `status ${type}`;
}
