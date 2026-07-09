/*
  Google Apps Script untuk menerima pesanan dari website dan menambahkan baris baru ke Google Sheets.
  Langkah implementasi:
  1. Buat Google Sheet baru.
  2. Ganti SHEET_ID dengan ID Google Sheets Anda.
  3. Buat sheet bernama "Pesanan" atau sesuaikan SHEET_NAME.
  4. Terbitkan Apps Script sebagai web app dengan akses "Anyone, even anonymous".
  5. Salin URL web app dan tempelkan ke variabel GOOGLE_SHEETS_WEBAPP_URL di js/script.js.
*/

const SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';
const SHEET_NAME = 'Pesanan';

/**
 * Handler POST untuk menerima data JSON dari website.
 */
function doPost(e) {
  try {
    const payload = parsePayload(e);
    const sheet = getOrderSheet();
    const row = buildRow(payload);
    sheet.appendRow(row);
    return createJsonResponse({ success: true, message: 'Order berhasil disimpan.' });
  } catch (error) {
    return createJsonResponse({ success: false, message: error.message }, 500);
  }
}

/**
 * Handler GET sederhana untuk memverifikasi endpoint.
 */
function doGet(e) {
  return createJsonResponse({ success: true, message: 'Google Sheets order endpoint aktif.' });
}

function parsePayload(e) {
  let data = {};
  try {
    if (e.postData && e.postData.type === 'application/json') {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    }
  } catch (error) {
    throw new Error('Data request invalid atau bukan JSON.');
  }

  const required = ['customerName', 'whatsappNumber', 'productName', 'quantity', 'unitPrice', 'totalPayment', 'orderDate', 'status'];
  required.forEach(key => {
    if (typeof data[key] === 'undefined' || data[key] === null || data[key] === '') {
      throw new Error(`Field ${key} wajib diisi.`);
    }
  });

  return {
    timestamp: data.timestamp || new Date().toISOString(),
    orderDate: data.orderDate,
    customerName: data.customerName,
    whatsappNumber: data.whatsappNumber,
    productName: data.productName,
    quantity: parseInt(data.quantity, 10) || 0,
    unitPrice: parseInt(data.unitPrice, 10) || 0,
    totalPayment: parseInt(data.totalPayment, 10) || 0,
    orderAddress: data.orderAddress || '',
    orderNotes: data.orderNotes || '',
    status: data.status,
  };
}

function getOrderSheet() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Tanggal Pemesanan', 'Nama Pemesan', 'Nomor WhatsApp', 'Nama Barang', 'Jumlah', 'Harga Satuan', 'Total Pembayaran', 'Alamat', 'Catatan', 'Status Pesanan']);
  }
  return sheet;
}

function buildRow(order) {
  return [
    order.timestamp,
    order.orderDate,
    order.customerName,
    order.whatsappNumber,
    order.productName,
    order.quantity,
    order.unitPrice,
    order.totalPayment,
    order.orderAddress,
    order.orderNotes,
    order.status,
  ];
}

function createJsonResponse(payload, statusCode) {
  const response = ContentService.createTextOutput(JSON.stringify(payload));
  response.setMimeType(ContentService.MimeType.JSON);
  if (statusCode) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  } else {
    response.setHeader('Access-Control-Allow-Origin', '*');
  }
  return response;
}
