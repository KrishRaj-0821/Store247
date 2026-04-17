import { getProducts, updateProduct } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface ScannedItem {
  name: string;
  wholesalePrice: number;
  suggestedRetailPrice: number;
  productId?: string;
}

// Simulated AI extraction — replaces Gemini Vision if no API key configured
function simulateAIExtraction(): ScannedItem[] {
  return [
    { name: 'Basmati Rice 5kg', wholesalePrice: 380, suggestedRetailPrice: 450 },
    { name: 'Sunflower Oil 1L', wholesalePrice: 118, suggestedRetailPrice: 145 },
    { name: 'Tata Tea Gold 500g', wholesalePrice: 230, suggestedRetailPrice: 275 },
    { name: 'Aashirvaad Atta 10kg', wholesalePrice: 295, suggestedRetailPrice: 340 },
  ];
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    const apiKey = process.env.GEMINI_API_KEY;

    let scannedItems: ScannedItem[];

    if (apiKey && imageFile) {
      // Real Gemini Vision extraction
      const imageBytes = await imageFile.arrayBuffer();
      const base64Image = Buffer.from(imageBytes).toString('base64');

      const prompt = `You are analyzing a wholesale supplier invoice/bill.
Extract all product names and their prices from this image.
Return a JSON array of objects with this exact format:
[{"name": "Product Name", "wholesalePrice": 0.00}]
Only return the JSON array, nothing else. If you cannot read the image clearly, return an empty array [].`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: imageFile.type || 'image/jpeg',
                    data: base64Image,
                  }
                }
              ]
            }]
          }),
        }
      );

      const geminiData = await geminiRes.json();
      const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]';
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      const extracted: { name: string; wholesalePrice: number }[] = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

      // Add 20% markup for retail price suggestion
      scannedItems = extracted.map((item) => ({
        name: item.name,
        wholesalePrice: item.wholesalePrice,
        suggestedRetailPrice: Math.ceil(item.wholesalePrice * 1.2),
      }));
    } else {
      // Demo mode: simulate AI extraction
      scannedItems = simulateAIExtraction();
    }

    // Match products from DB by name similarity and auto-update prices
    const products = getProducts();
    const results = scannedItems.map((item) => {
      const match = products.find((p) => {
        const pName = p.name.toLowerCase();
        const iName = item.name.toLowerCase();
        return pName.includes(iName.split(' ')[0]) || iName.includes(pName.split(' ')[0]);
      });

      if (match) {
        const oldPrice = match.price;
        // Only update if price changed
        if (match.price !== item.suggestedRetailPrice) {
          updateProduct(match.id, {
            price: item.suggestedRetailPrice,
            priceHistory: [
              ...match.priceHistory,
              { price: oldPrice, date: new Date().toISOString().split('T')[0] },
            ],
          });
        }
        return {
          ...item,
          productId: match.id,
          productName: match.name,
          oldPrice,
          updated: true,
        };
      }

      return { ...item, productId: null, productName: item.name, updated: false };
    });

    return Response.json({
      success: true,
      mode: apiKey ? 'gemini' : 'demo',
      itemsFound: results.length,
      itemsUpdated: results.filter((r) => r.updated).length,
      results,
    });
  } catch (err) {
    console.error('[BillScan]', err);
    return Response.json({ error: 'Scan failed. Try again.' }, { status: 500 });
  }
}
