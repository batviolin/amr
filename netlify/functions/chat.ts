import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

function withTimeout<T>(promise: Promise<T>, ms: number = 5000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function generateChatExpertResponse(query: string, context: any, isHindi: boolean): string {
  const q = query.toLowerCase();

  if (isHindi) {
    if (q.includes('खुराक') || q.includes('डोज') || q.includes('बैसिलस') || q.includes('bacillus')) {
      return `🌾 **बैसिलस सबटिलिस छिड़काव की सही मात्रा:**\n\n• 15 लीटर टंकी में **50 ग्राम** (3-4 ग्राम प्रति लीटर)।\n• छिड़काव शाम 4 बजे के बाद करें।\n• रासायनिक कॉपर के साथ न मिलाएं।`;
    }
    if (q.includes('नीम') || q.includes('mix') || q.includes('मिलाकर')) {
      return `🌿 **नीम तेल व दवाओं का मिश्रण:**\n\n• 10,000 PPM नीम तेल को 2-3 मिली/लीटर मिला सकते हैं।\n• रसायनों का अनियंत्रित कॉकटेल न बनाएं।`;
    }
    return `🌾 **कृषि परामर्श:**\n\n1. विफल एंटीबायोटिक (जैसे स्ट्रेप्टोसाइक्लिन) तुरंत रोकें।\n2. बैसिलस सबटिलिस (3-4g/L) का शाम को छिड़काव करें।\n3. संक्रमित पौधों को नष्ट करें।`;
  }

  if (q.includes('dose') || q.includes('dosage') || q.includes('bacillus')) {
    return `🌾 **Bacillus subtilis Dosage:**\n\n• Foliar spray: **3–4 grams per liter** (approx. 50g per 15L knapsack).\n• Apply in late afternoon.\n• Do not mix directly with chemical coppers.`;
  }
  return `🌾 **Agronomic Recommendation:**\n\n1. Stop spraying failing antibiotics immediately.\n2. Apply Bacillus subtilis (3-4g/L) as a bio-rational alternative.\n3. Rogue infected plants and sterilize tools.`;
}

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { messages = [], context = {}, language = 'en' } = body;
    const isHindi = language === 'hi';

    const userMessages = messages.filter((m: any) => m.role === 'user');
    const latestQuery = userMessages.length > 0 ? userMessages[userMessages.length - 1].text : '';

    const formattedContents: any[] = [];
    let expectingRole = 'user';

    for (const m of messages) {
      const role = m.role === 'assistant' ? 'model' : 'user';
      if (formattedContents.length === 0 && role !== 'user') continue;
      if (role === expectingRole) {
        formattedContents.push({ role, parts: [{ text: m.text }] });
        expectingRole = expectingRole === 'user' ? 'model' : 'user';
      }
    }

    if (formattedContents.length === 0 && latestQuery) {
      formattedContents.push({ role: 'user', parts: [{ text: latestQuery }] });
    }

    const systemInstruction = `You are an expert Agricultural Extension Officer and Plant Pathologist specializing in Anti-Microbial Resistance (AMR) in crops. Respond concisely in ${isHindi ? 'HINDI (हिन्दी)' : 'ENGLISH'}.`;

    if (!process.env.GEMINI_API_KEY || formattedContents.length === 0) {
      const expertReply = generateChatExpertResponse(latestQuery, context, isHindi);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: expertReply }),
      };
    }

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedContents,
        config: { systemInstruction, temperature: 0.5 },
      }),
      5000
    );

    const reply = response.text?.trim() || generateChatExpertResponse(latestQuery, context, isHindi);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply }),
    };
  } catch (err: any) {
    const body = JSON.parse(event.body || '{}');
    const userMessages = (body.messages || []).filter((m: any) => m.role === 'user');
    const latestQuery = userMessages.length > 0 ? userMessages[userMessages.length - 1].text : '';
    const expertReply = generateChatExpertResponse(latestQuery, body.context, body.language === 'hi');
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: expertReply }),
    };
  }
};
