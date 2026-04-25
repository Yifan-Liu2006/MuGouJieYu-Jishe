// DeepSeek API 调用封装 - 优化版（通过云函数代理）
import faqData from '../data/faq.json';

const SCF_URL =
  import.meta.env.VITE_SCF_URL ||
  'https://1419866445-kibp0xei1r.ap-guangzhou.tencentscf.com/';

// 缓存：同一问题5分钟内不重复请求
const cache = new Map();

// 重试配置
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// 延迟函数
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getFaqAnswer(question) {
  const normalized = question.trim();
  const list = faqData?.['常见问题'] || [];
  const hit = list.find((item) => item.question === normalized);
  return hit?.answer || null;
}

export async function askDeepSeek(question, retryCount = 0) {
  const normalizedQuestion = question?.trim();
  if (!normalizedQuestion) {
    return { success: false, error: '问题不能为空' };
  }

  // 常见问题快捷回复
  const faqAnswer = getFaqAnswer(normalizedQuestion);
  if (faqAnswer) {
    return { success: true, answer: faqAnswer, source: 'faq' };
  }

  // 检查缓存
  const cacheKey = normalizedQuestion.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.time < 300000) {
    return { success: true, answer: cached.answer, source: 'cache' };
  }

  try {
    const response = await fetch(SCF_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `你是一个专业、严谨的AI助手。你的回答必须遵守以下规则：
1. 可以回答任何类型的问题
2. 回答要专业、准确；如果是古建筑相关问题，需体现古建筑知识深度
3. 如果问到不确定的内容，如实告知"这个我暂时不确定，建议查阅专业文献"
4. 回答控制在200字以内，简洁明了`,
          },
          { role: 'user', content: normalizedQuestion },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      if (retryCount < MAX_RETRIES) {
        await delay(RETRY_DELAY * (retryCount + 1));
        return askDeepSeek(normalizedQuestion, retryCount + 1);
      }
      return { success: false, error: data.error || `HTTP ${response.status}` };
    }

    const answer = data.answer || '未获取到回答';

    // 存入缓存
    cache.set(cacheKey, {
      answer,
      time: Date.now(),
    });

    return { success: true, answer, source: 'api' };
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      await delay(RETRY_DELAY * (retryCount + 1));
      return askDeepSeek(normalizedQuestion, retryCount + 1);
    }
    return { success: false, error: '网络错误，请检查连接后重试' };
  }
}


// 清空缓存（可选）
export function clearCache() {
  cache.clear();
}

// 查看缓存大小
export function getCacheSize() {
  return cache.size;
}

export const sendToDeepSeek = askDeepSeek;