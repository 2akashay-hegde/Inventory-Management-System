const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting API Verification Tests ---');

  // 1. GET /products
  console.log('\n[TEST 1] GET /products');
  let res = await request({ host: 'localhost', port: 5000, path: '/products', method: 'GET' });
  console.log('Status:', res.status, '| Total products fetched:', res.body.count);
  if (res.status !== 200 || !Array.isArray(res.body.data)) throw new Error('GET /products failed');
  const firstProd = res.body.data[0];

  // 2. GET /products/low-stock
  console.log('\n[TEST 2] GET /products/low-stock');
  res = await request({ host: 'localhost', port: 5000, path: '/products/low-stock', method: 'GET' });
  console.log('Status:', res.status, '| Low stock products found:', res.body.count);
  res.body.data.forEach(p => {
    if (p.quantity > p.minStock) throw new Error(`Product ${p.name} has qty ${p.quantity} > min ${p.minStock}`);
  });
  console.log('Validation passed: All returned items satisfy quantity <= minStock');

  // 3. POST /products
  console.log('\n[TEST 3] POST /products');
  const newProductPayload = {
    name: 'Test Desk Mat Extra Large',
    uniqueId: 'PRD-TEST-99',
    category: 'Accessories',
    price: 24.99,
    quantity: 12,
    minStock: 5
  };
  res = await request({
    host: 'localhost',
    port: 5000,
    path: '/products',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, newProductPayload);
  console.log('Status:', res.status, '| Created product ID:', res.body.data?.id, '| uniqueId:', res.body.data?.uniqueId);
  if (res.status !== 201 || !res.body.data?.id) throw new Error('POST /products failed');
  const createdId = res.body.data.id;

  // 3b. Duplicate POST /products check
  console.log('\n[TEST 3b] Duplicate uniqueId POST /products');
  const dupRes = await request({
    host: 'localhost',
    port: 5000,
    path: '/products',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, newProductPayload);
  console.log('Status:', dupRes.status, '| Message:', dupRes.body?.message);
  if (dupRes.status !== 400 || !dupRes.body?.message?.includes('already assigned')) {
    throw new Error('Duplicate check failed to return 400 with "already assigned" message');
  }
  console.log('Validation passed: Duplicate Unique ID properly blocked!');

  // 4. PUT /products/:id
  console.log(`\n[TEST 4] PUT /products/${createdId}`);
  res = await request({
    host: 'localhost',
    port: 5000,
    path: `/products/${createdId}`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  }, { quantity: 2 }); // Should trigger low stock
  console.log('Status:', res.status, '| Updated quantity:', res.body.data?.quantity);
  if (res.status !== 200 || res.body.data.quantity !== 2) throw new Error('PUT /products/:id failed');

  // 5. DELETE /products/:id
  console.log(`\n[TEST 5] DELETE /products/${createdId}`);
  res = await request({
    host: 'localhost',
    port: 5000,
    path: `/products/${createdId}`,
    method: 'DELETE'
  });
  console.log('Status:', res.status, '| Deleted product confirmation:', res.body.data?.id);
  if (res.status !== 200) throw new Error('DELETE /products/:id failed');

  console.log('\nAll 5 API Endpoints verified successfully!');
  process.exit(0);
}

runTests().catch(err => {
  console.error('API Verification failed:', err);
  process.exit(1);
});
