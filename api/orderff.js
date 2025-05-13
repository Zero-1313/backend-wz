export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, kode } = req.body;
  const apiKey = process.env.VIPRESELLER_API_KEY;
  const apiId = process.env.VIPRESELLER_API_ID;

  if (!apiKey || !apiId) {
    return res.status(400).json({ error: "API Key atau ID belum diatur di environment variable" });
  }

  const md5 = await import('crypto').then(mod => mod.createHash('md5'));
  const sign = md5.update(apiId + apiKey).digest('hex');

  try {
    const response = await fetch("https://vip-reseller.co.id/api/game-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: apiKey,
        sign,
        type: "order",
        service: kode,
        data_no: id,
        testing: true // ubah ke false jika sudah real
      }),
    });

    const text = await response.text();

    // cek apakah JSON valid
    try {
      const json = JSON.parse(text);
      return res.status(200).json(json);
    } catch (jsonErr) {
      return res.status(500).json({
        error: "Response bukan JSON",
        detail: text
      });
    }
  } catch (err) {
    return res.status(500).json({
      error: "Gagal hubungi server",
      detail: err.message
    });
  }
      }
