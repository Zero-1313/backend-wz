export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, kode } = req.body;
  const apiKey = process.env.VIPRESELLER_API_KEY;
  const apiId = process.env.VIPRESELLER_API_ID;

  if (!apiKey || !apiId) {
    return res.status(400).json({ error: "API Key atau ID belum diatur di environment" });
  }

  // Buat signature MD5
  const crypto = await import('crypto');
  const sign = crypto.createHash('md5').update(apiId + apiKey).digest('hex');

  const params = new URLSearchParams({
    key: apiKey,
    sign: sign,
    type: "order",
    service: kode,
    data_no: id,
    testing: "false"
  });

  try {
    const response = await fetch("https://vip-reseller.co.id/api/game-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    const text = await response.text();

    // Coba parse jadi JSON
    try {
      const json = JSON.parse(text);
      return res.status(200).json(json);
    } catch (e) {
      return res.status(500).json({ error: "Response bukan JSON", detail: text });
    }

  } catch (err) {
    return res.status(500).json({ error: "Gagal hubungi server", detail: err.message });
  }
    }
