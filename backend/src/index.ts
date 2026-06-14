import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-mock-key',
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
});

// Schema for request validation
const GeneratePlanSchema = z.object({
  destination: z.string().min(1).max(50),
  days: z.number().min(1).max(30),
  preferences: z.array(z.string()).max(10),
  budgetLevel: z.enum(['low', 'medium', 'high']),
  departureCity: z.string().optional(),
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/travel-plans/generate', async (req, res) => {
  try {
    const input = GeneratePlanSchema.parse(req.body);
    
    // In MVP, we might not have a real API key provided by the user yet.
    if (!process.env.OPENAI_API_KEY) {
      console.warn('No OPENAI_API_KEY provided, returning mock data.');
      // Return mock data after a small delay
      return setTimeout(() => {
        res.json({
          success: true,
          data: {
            id: `plan_${Date.now()}`,
            title: `${input.destination} ${input.days} 日定制旅行`,
            summary: `为您量身定制的 ${input.destination} 之旅。`,
            destination: input.destination,
            days: input.days,
            places: [
              {
                id: "place_1",
                name: input.destination,
                country: input.destination,
                lat: 35.6762, // Mock coordinates
                lng: 139.6503,
                days: input.days,
                description: `探索 ${input.destination} 的美妙风景。`,
                tags: input.preferences
              }
            ],
            arcs: [],
            itinerary: Array.from({ length: input.days }, (_, i) => ({
              day: i + 1,
              city: input.destination,
              title: `第 ${i + 1} 天行程`,
              items: ["景点 A", "景点 B", "特色晚餐"]
            }))
          }
        });
      }, 1500);
    }

    const prompt = `
请作为一位专业的旅行规划师，为用户生成一份旅行路线。
用户需求：
- 目的地：${input.destination}
- 出发城市：${input.departureCity || '未提供'}
- 天数：${input.days} 天
- 偏好：${input.preferences.join(', ')}
- 预算：${input.budgetLevel}

要求：
1. 必须只返回一个 JSON，不要包含任何 Markdown 标记或代码块，不要解释文字。
2. JSON 格式必须严格符合以下结构：
{
  "title": "...",
  "summary": "...",
  "destination": "...",
  "days": ${input.days},
  "places": [
    {
      "id": "city_name_en",
      "name": "城市中文名",
      "country": "国家中文名",
      "lat": 数字纬度,
      "lng": 数字经度,
      "days": 停留天数,
      "description": "城市简短描述",
      "tags": ["标签1", "标签2"]
    }
  ],
  "arcs": [
    {
      "from": "起点城市名",
      "to": "终点城市名",
      "startLat": 纬度,
      "startLng": 经度,
      "endLat": 纬度,
      "endLng": 经度
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "city": "城市名",
      "title": "今天的主题",
      "items": ["活动1", "活动2"]
    }
  ]
}
注意：
- places 的总停留天数必须等于 ${input.days}。
- arcs 应该按顺序连接所有 places。
- itinerary 必须有 ${input.days} 天。
`;

    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "你是一个只输出 JSON 格式的旅行规划专家。" },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    let resultStr = completion.choices[0]?.message?.content;
    if (!resultStr) throw new Error("Empty response from AI");
    
    // Parse result
    const plan = JSON.parse(resultStr);
    plan.id = `plan_${Date.now()}`;
    
    res.json({
      success: true,
      data: plan
    });

  } catch (error) {
    console.error('Generation Error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: '输入参数错误' }
      });
    }
    res.status(500).json({
      success: false,
      error: { code: 'AI_GENERATION_FAILED', message: '路线生成失败，请稍后重试' }
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
