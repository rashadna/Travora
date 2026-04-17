export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { imageBase64 } = req.body;
  if (!imageBase64) return res.status(400).json({ error: 'No image' });

  try {
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { content: imageBase64 },
            features: [
              { type: 'LANDMARK_DETECTION', maxResults: 3 },
              { type: 'LABEL_DETECTION', maxResults: 5 },
              { type: 'WEB_DETECTION', maxResults: 3 }
            ]
          }]
        })
      }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
