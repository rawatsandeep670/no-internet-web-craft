/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'SPA_ERROR_CACHE';
let FILE_VERSION = '-1';
let FALLBACK_URL = '';
let SW_VERSION = '-1';

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(resources);
};

// eslint-disable-next-line no-unused-vars
const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
};

const checkForNetwork = async ({ request }) => {
  try {
    const responseFromNetwork = await fetch(request);
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(FALLBACK_URL);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return error;
  }
};

async function postMessageToClient(clientId, eventData) {
  if (!clientId) return;

  // Get the client.
  // eslint-disable-next-line no-undef
  const client = await clients.get(clientId);

  // Exit early if we don't get the client.
  // Eg, if it closed.
  if (!client) return;

  // Send a message to the client.
  client.postMessage(eventData);
}

// eslint-disable-next-line no-unused-vars
self.addEventListener('activate', (event) => {
  // sw activated
});

// eslint-disable-next-line no-unused-vars
self.addEventListener('install', (event) => {
  // sw installed
});

self.addEventListener('message', async (event) => {
  const { data, source } = event;
  const messageData = data.data;
  switch (data.type) {
    case 'CACHE':
      if (FILE_VERSION !== messageData.version) {
        await caches.delete(CACHE_NAME);
        FILE_VERSION = messageData.version;
        FALLBACK_URL = messageData.url;
        await addResourcesToCache([messageData.url]);
      }
      postMessageToClient(source.id, { ...data, status: 'success' });
      break;
    case 'GET_CURRENT_SW_VERSION':
      if (messageData.version !== SW_VERSION) {
        SW_VERSION = messageData.version;
        return postMessageToClient(source.id, { ...data, update: true });
      }
      postMessageToClient(source.id, { ...data, update: false });
      break;
    default:
      console.log('Event not covered!', data);
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.destination === 'document') {
    event.respondWith(
      checkForNetwork({
        request: event.request,
      })
    );
  }
});
