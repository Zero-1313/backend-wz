export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, kode } = req.body;
  const apiKey = process.env.VIPRESELLER_API_KEY;
  const apiId = process.env.VIPRESELLER_API_ID;

  // VIP Reseller butuh "sign" MD5(apiId+apiKey)
  const crypto = require('crypto');
  const sign = crypto.createHash('md5').update(apiId + apiKey).digest('hex');

  const params = new URLSearchParams();
  params.append("key", apiKey);
  params.append("sign", sign);
  params.append("type", "order");
  params.append("service", kode);
  params.append("data_no", id);

  try {
    const response = await fetch("https://vip-reseller.co.id/api/game-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    const result = await response.json();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: "Gagal hubungi server", detail: err.message });
  }
                }
