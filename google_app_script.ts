// Google Apps Script
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, ping: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1'); // or your sheet name
    const data = JSON.parse(e.postData.contents);

    const time = new Date();
    const name = (data.name || '').toString().trim();
    const votes = data.votes || [];
    const userAgent = ''; // no longer recorded
    const ip = '';        // no longer recorded

    const lastRow = ss.getLastRow();
    let action = 'created';

    if (lastRow >= 2 && name) {
      const nameRange = ss.getRange(2, 2, lastRow - 1, 1).getValues(); // column B names
      const matchIndex = nameRange.findIndex(r => (r[0] || '').toString().toLowerCase().trim() === name.toLowerCase());
      if (matchIndex !== -1) {
        const rowNumber = matchIndex + 2; // offset header
        ss.getRange(rowNumber, 1, 1, 4).setValues([[
          time,
          name,
          votes[0] || '',
          votes[1] || ''
        ]]);
        action = 'updated';
      }
    }

    if (action === 'created') {
      ss.appendRow([time, name, votes[0] || '', votes[1] || '']);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok:true, action }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok:false, message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
