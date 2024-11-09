
import axios from 'axios';



const fetchGPTResponse = async (prompt) => {
  const apiKey = 'sk-OqU0OrN9ccP2NCmppwQm4dLCY2mVo4GnRDXYlQutEgBDoo6F';  // (((((需要用自己的 API 金鑰)))))))
  try {
    const response = await axios.post(
      'https://api.chatanywhere.tech/v1/chat/completions', 
      {
        model: 'gpt-4o-mini', 
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },  // 系統訊息
          { role: 'user', content: prompt },  // 用戶的提示文本
        ],
        max_tokens: 100,         // 生成的最大字數
        temperature: 0.7,        // 生成文本的創造性（範圍 0-1）
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`, // 添加授權標頭
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content; // 返回生成的文本
  } catch (error) {
    console.error("Error fetching GPT-3.5 response:", error);
    return "Error fetching response.";
  }
};

export default fetchGPTResponse;
