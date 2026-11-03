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

const { menu } = require('../data/menu.ts');
const { getDishAvailability, getCategoryAvailability, getUnavailableCartItems } = require('../lib/availability.ts');
const { buildWhatsAppMessage } = require('../lib/whatsapp.ts');

const limaTime = (hour, minute, second = 0) => new Date(Date.UTC(2026, 10, 3, hour + 5, minute, second));
const makiId = menu.find((category) => category.id === 'makis').dishes[0].id;
const frappeId = menu.find((category) => category.id === 'frappes').dishes[0].id;
const regularId = menu.find((category) => category.id === 'desayunos').dishes[0].id;

test('frappés suspendidos y Camu Camu retirado', () => {
  assert.equal(getCategoryAvailability('frappes', limaTime(19, 0)).available, false);
  assert.equal(getDishAvailability(frappeId, limaTime(19, 0)).available, false);
  assert.equal(menu.flatMap((category) => category.dishes).some((dish) => /camu-camu/.test(dish.id)), false);
  assert.equal(getDishAvailability('camu-camu-vaso', limaTime(19, 0)).available, false);
  assert.equal(getDishAvailability(regularId, limaTime(19, 0)).available, true);
});

test('makis: apertura inclusiva y cierre exclusivo en hora de Lima', () => {
  assert.equal(getDishAvailability(makiId, limaTime(17, 59)).available, false);
  assert.equal(getDishAvailability(makiId, limaTime(18, 0)).available, true);
  assert.equal(getDishAvailability(makiId, limaTime(23, 29, 59)).available, true);
  assert.equal(getDishAvailability(makiId, limaTime(23, 30)).available, false);
  assert.equal(getDishAvailability(makiId, limaTime(23, 59)).available, false);
});

test('el carrito conserva y detecta productos no disponibles', () => {
  const items = [{ dishId: makiId }, { dishId: frappeId }, { dishId: 'camu-camu-vaso' }, { dishId: regularId }];
  assert.deepEqual(getUnavailableCartItems(items, limaTime(17, 0)).map((item) => item.dishId),
    [makiId, frappeId, 'camu-camu-vaso']);
  assert.deepEqual(getUnavailableCartItems(items, limaTime(19, 0)).map((item) => item.dishId),
    [frappeId, 'camu-camu-vaso']);
});

test('WhatsApp rechaza productos retirados o suspendidos', () => {
  const order = {
    items: [{ cartId: 'old', dishId: 'camu-camu-vaso', name: 'Camu Camu', price: 5, quantity: 1, options: [], note: '' }],
    orderType: 'dineIn', address: '', tableNumber: '1', customerName: '', comment: '',
  };
  assert.throws(() => buildWhatsAppMessage(order), /no disponibles/);
  order.items[0].dishId = frappeId;
  assert.throws(() => buildWhatsAppMessage(order), /no disponibles/);
  order.items[0].dishId = regularId;
  assert.match(buildWhatsAppMessage(order), /Detalle del pedido/);
  order.items[0].dishId = makiId;
  assert.throws(() => buildWhatsAppMessage(order, limaTime(17, 59)), /no disponibles/);
  assert.match(buildWhatsAppMessage(order, limaTime(18, 0)), /Detalle del pedido/);
  assert.throws(() => buildWhatsAppMessage(order, limaTime(23, 30)), /no disponibles/);
});
