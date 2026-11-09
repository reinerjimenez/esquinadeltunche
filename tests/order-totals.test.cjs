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

const { calculateOrderTotals, getPickupNameError, getPickupPhoneError, buildWhatsAppMessage } = require('../lib/whatsapp.ts');
const { menu } = require('../data/menu.ts');
const item = (dishId, price, quantity) => ({
  cartId: dishId, dishId, name: dishId, price, quantity, options: [], note: '',
});
const order = (items, orderType = 'takeaway', customerName = 'María López') => ({
  items, orderType, customerName, customerPhone: '987 654 321', address: 'Av. Principal 1', tableNumber: '4', comment: '',
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

test('bebidas embotelladas no generan táper, incluso con datos antiguos alterados', () => {
  const bottled = ['coca-cola-personal', 'inca-kola-personal', 'agua-mineral'];
  for (const id of bottled) {
    const price = menu.flatMap((category) => category.dishes).find((dish) => dish.id === id).price;
    const totals = calculateOrderTotals(order([{ ...item(id, price, 2), requiresTakeawayPackaging: true }]));
    assert.equal(totals.taperCount, 0, id);
    assert.equal(totals.total, price * 2, id);
  }
  const items = [item('yuquitas-arrebozadas-del-tunche', 12, 2), ...bottled.map((id) => {
    const price = menu.flatMap((category) => category.dishes).find((dish) => dish.id === id).price;
    return item(id, price, 1);
  })];
  assert.deepEqual(calculateOrderTotals(order(items)), {
    itemCount: 5, subtotal: 38, taperCount: 2, taperTotal: 2, total: 40,
  });
  assert.equal(calculateOrderTotals(order(items, 'dineIn')).taperTotal, 0);
  assert.equal(calculateOrderTotals(order([{ ...items[0], quantity: 3 }, ...items.slice(1)])).taperTotal, 3);
  assert.equal(calculateOrderTotals(order(items.slice(1))).taperTotal, 0);
  assert.equal(calculateOrderTotals(order([item('limonada-frozen-1-litro', 17, 1)])).taperTotal, 1);
});

test('celular peruano obligatorio para llevar y opcional en restaurante', () => {
  for (const phone of ['', '   ', '87654321', '812345678', '91234567', '51912345678', '+51 812345678', '91234abc9']) {
    assert.match(getPickupPhoneError({ orderType: 'takeaway', customerPhone: phone }), /celular/i, phone);
  }
  for (const phone of ['912345678', '+51 912 345 678', '(+51) 912-345-678']) {
    assert.equal(getPickupPhoneError({ orderType: 'takeaway', customerPhone: phone }), null, phone);
  }
  assert.equal(getPickupPhoneError({ orderType: 'dineIn', customerPhone: '' }), null);
});

test('WhatsApp rechaza datos de contacto inválidos y coincide con el total del carrito', () => {
  const items = [item('yuquitas-arrebozadas-del-tunche', 12, 2), item('coca-cola-personal', 5, 1)];
  const restored = JSON.parse(JSON.stringify(order(items)));
  assert.throws(() => buildWhatsAppMessage({ ...restored, customerName: ' ' }), /Ingresa el nombre/);
  assert.throws(() => buildWhatsAppMessage({ ...restored, customerPhone: '' }), /celular/i);
  assert.throws(() => buildWhatsAppMessage({ ...restored, customerPhone: '812345678' }), /celular/i);
  const totals = calculateOrderTotals(restored);
  const message = buildWhatsAppMessage(restored);
  assert.match(message, /Celular:\* 987654321/);
  assert.match(message, new RegExp(`Subtotal: S/ ${totals.subtotal.toFixed(2)}`));
  assert.match(message, new RegExp(`Táper \\(${totals.taperCount} × S/ 1\\.00\\): S/ ${totals.taperTotal.toFixed(2)}`));
  assert.match(message, new RegExp(`Total estimado: S/ ${totals.total.toFixed(2)}`));
  assert.doesNotMatch(buildWhatsAppMessage({ ...restored, orderType: 'dineIn', customerPhone: '' }), /Táper|Celular/);
});
