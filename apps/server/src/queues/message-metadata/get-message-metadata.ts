import type { TGenericObject, TMessageMetadata } from '@sharkord/shared';
import { getLinkPreview } from 'link-preview-js';
import { updateMessage } from '../../db/mutations/messages/update-message';

const metadataCache = new Map<string, TGenericObject>();

setInterval(
  () => metadataCache.clear(),
  1000 * 60 * 60 * 2 // clear cache every 2 hours
);

const urlMetadataParser = async (
  content: string
): Promise<TMessageMetadata[]> => {
  try {
    const urls = content
      .match(/(https?:\/\/[^\s]+)/g)
      ?.filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i);

    if (!urls) return [];

    const promises = urls.map(async (url) => {
      if (metadataCache.has(url)) return metadataCache.get(url);

      const metadata = await getLinkPreview(url);

      if (!metadata) return;

      metadataCache.set(url, metadata);

      return metadata;
    });

    const metadata = (await Promise.all(promises)) as TMessageMetadata[]; // TODO: fix these types

    return metadata ?? [];
  } catch {
    // ignore
  }

  return [];
};

export const processMessageMetadata = async (
  content: string,
  messageId: number
) => {
  const metadata = await urlMetadataParser(content);

  return updateMessage(messageId, {
    metadata
  });
};
