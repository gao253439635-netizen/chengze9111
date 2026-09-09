import { config } from '../config';
import { logger } from '../logger';

/**
 * 线索即时通知：配置了 NOTIFY_WEBHOOK_URL 时，创建线索后 fire-and-forget POST。
 * 非阻塞、带 5s 超时与异常吞咽，绝不拖慢主流程（客户提交体验优先）。
 */
export function notifyLead(lead: any) {
  const url = config.notifyWebhookUrl;
  if (!url) return;
  const payload = {
    text:
      `新线索 #${lead.id} [${lead.status}]\n` +
      `称呼: ${lead.name || '匿名'}\n` +
      `联系: ${lead.contact || '-'}\n` +
      `意向: ${lead.project || '-'}\n` +
      `预算: ${lead.budget || '-'}\n` +
      `留言: ${lead.message || '-'}\n` +
      `来源: ${lead.source}`,
  };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: controller.signal,
  })
    .catch((e) => logger.warn('notify failed', { error: String((e as Error)?.message || e) }))
    .finally(() => clearTimeout(timer));
}
