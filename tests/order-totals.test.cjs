/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
  module._compile(output.outputText, filename);
};

const { calculateOrderTotals, getPickupNameError, buildWhatsAppMessage } = require('../lib/whatsapp.ts');
const item = (dishId, price, quantity) => ({
  cartId: dishId, dishId, name: dishId, price, quantity, options: [], note: '',
});
const order = (items, orderType = 'takeaway', customerName = 'María López') => ({
  items, orderType, customerName, address: 'Av. Principal 1', tableNumber: '4', comment: '',
});

test('el táper se cobra por unidad y sigue los cambios de cantidad y modalidad', () => {
  const one = item('yuquitas-arrebozadas-del-tunche', 12, 1);
  assert.deepEqual(calculateOrderTotals(order([one])), {
    itemCount: 1, subtotal: 12, taperCount: 1, taperTotal: 1, total: 13,
  });
  const three = { ...one, quantity: 3 };
  assert.equal(calculateOrderTotals(order([three])).taperTotal, 3);
  const second = item('tortilla-amazonica', 14, 1);
  assert.equal(calculateOrderTotals(order([three, second])).total, 54);
  assert.equal(calculateOrderTotals(order([one, second])).total, 28);
  assert.equal(calculateOrderTotals(order([second])).total, 15);
  assert.equal(calculateOrderTotals(order([three, second], 'dineIn')).total, 50);
  assert.equal(calculateOrderTotals(order([three, second], 'takeaway')).total, 54);
});

test('el nombre es obligatorio sólo para llevar y admite texto con espacios alrededor', () => {
  assert.equal(getPickupNameError(order([], 'takeaway', '   ')), 'Ingresa el nombre de quien recogerá el pedido');
  assert.equal(getPickupNameError(order([], 'takeaway', ' María López ')), null);
  assert.equal(getPickupNameError(order([], 'dineIn', '')), null);
});

test('un carrito restaurado produce el mismo desglose en WhatsApp', () => {
  const saved = JSON.stringify(order([
    item('yuquitas-arrebozadas-del-tunche', 12, 2),
    item('tortilla-amazonica', 14, 1),
  ]));
  const restored = JSON.parse(saved);
  const totals = calculateOrderTotals(restored);
  assert.deepEqual(totals, { itemCount: 3, subtotal: 38, taperCount: 3, taperTotal: 3, total: 41 });
  const message = buildWhatsAppMessage(restored);
  assert.match(message, /Cliente:\* María López/);
  assert.match(message, /Subtotal: S\/ 38\.00/);
  assert.match(message, /Táper \(3 × S\/ 1\.00\): S\/ 3\.00/);
  assert.match(message, /Total estimado: S\/ 41\.00/);
  assert.throws(() => buildWhatsAppMessage({ ...restored, customerName: ' ' }), /Ingresa el nombre/);
  const dineIn = buildWhatsAppMessage({ ...restored, orderType: 'dineIn', customerName: '' });
  assert.doesNotMatch(dineIn, /Táper/);
  assert.match(dineIn, /Total estimado: S\/ 38\.00/);
});
