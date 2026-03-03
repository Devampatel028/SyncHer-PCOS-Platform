const http = require('http');

function makeRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function fullTest() {
  const email = `check_${Date.now()}@test.com`;
  
  const regBody = JSON.stringify({ email, password: 'Test1234' });
  const regRes = await makeRequest({
    hostname: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(regBody) }
  }, regBody);
  
  const token = regRes.body.token;
  if (!token) { console.log('REGISTER FAILED:', JSON.stringify(regRes.body)); return; }
  console.log('TOKEN OK');

  const body = JSON.stringify({ age:24, weight:65, height:162, mainMeal:'Lunch', familyHistory:['PCOS'], mealsPerDay:3, dietPattern:'Mixed', smoking:'No', diagnosed:'I think I have symptoms', cycleLength:'28-31', symptoms:['Acne'] });
  const assessRes = await makeRequest({
    hostname: 'localhost', port: 5000, path: '/api/assessment/submit', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'Authorization': `Bearer ${token}` }
  }, body);

  const r = assessRes.body.report || assessRes.body;
  console.log('--- ASSESSMENT RESULT ---');
  console.log('pcosPrediction:', r.pcosPrediction);
  console.log('riskLevel:', r.riskLevel);
  console.log('BMI:', r.BMI);
  console.log('symptomScore:', r.symptomScore);
  console.log('lifestyleScore:', r.lifestyleScore);
  console.log('menstrualIrregularity:', r.menstrualIrregularity);
  console.log('tip[0]:', r.hormoneBalanceTips?.[0]);
  console.log('message:', r.personalizedMessage?.substring(0, 120));
  
  // Test chatbot
  console.log('\n--- CHATBOT TEST ---');
  const chatBody = JSON.stringify({ message: 'What foods help with PCOS?' });
  const chatRes = await makeRequest({
    hostname: 'localhost', port: 5000, path: '/api/chatbot', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(chatBody), 'Authorization': `Bearer ${token}` }
  }, chatBody);
  console.log('chatbot status:', chatRes.status);
  console.log('reply:', chatRes.body.reply?.substring(0, 150));
}

fullTest().catch(e => console.error('ERR:', e.message));
