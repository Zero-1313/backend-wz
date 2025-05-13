export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, kode } = req.body;
  const apiKey = process.env.VIPRESELLER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key tidak ditemukan' });
  }

  try {
    const response = await fetch("https://vip-reseller.co.id/api/game-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: apiKey,
        type: "order",
        service: kode,
        data_no: id,
        testing: false
      })
    });

    const text = await response.text();
    try {
      const json = JSON.parse(text);
      return res.status(200).json(json);
    } catch {
      return res.status(500).json({ error: "Response bukan JSON", detail: text });
    }

  } catch (err) {
    return res.status(500).json({ error: "Gagal hubungi server", detail: err.message });
  }
}
