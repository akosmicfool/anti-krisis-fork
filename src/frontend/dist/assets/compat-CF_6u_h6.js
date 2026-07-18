import { aM as createBatchScheduler, aN as withTimeout, aO as TimeoutError, aP as idCache, aQ as SocketClosedError, aR as __vitePreload, aS as WebSocketRequestError, aT as getHttpRpcClient } from "./index-DqUaPUte.js";
const socketClientCache = /* @__PURE__ */ new Map();
async function getSocketRpcClient(parameters) {
  const { getSocket: getSocket2, keepAlive = true, key = "socket", reconnect = true, url } = parameters;
  const { interval: keepAliveInterval = 3e4 } = typeof keepAlive === "object" ? keepAlive : {};
  const { attempts = 5, delay = 2e3 } = typeof reconnect === "object" ? reconnect : {};
  const id = JSON.stringify({ keepAlive, key, url, reconnect });
  let socketClient = socketClientCache.get(id);
  if (socketClient)
    return socketClient;
  let reconnectCount = 0;
  const { schedule } = createBatchScheduler({
    id,
    fn: async () => {
      const requests = /* @__PURE__ */ new Map();
      const subscriptions = /* @__PURE__ */ new Map();
      let error;
      let socket;
      let keepAliveTimer;
      let reconnectInProgress = false;
      function attemptReconnect() {
        if (reconnect && reconnectCount < attempts) {
          if (reconnectInProgress)
            return;
          reconnectInProgress = true;
          reconnectCount++;
          socket == null ? void 0 : socket.close();
          setTimeout(async () => {
            await setup().catch(console.error);
            reconnectInProgress = false;
          }, delay);
        } else {
          requests.clear();
          subscriptions.clear();
        }
      }
      async function setup() {
        const result = await getSocket2({
          onClose() {
            var _a, _b;
            for (const request of requests.values())
              (_a = request.onError) == null ? void 0 : _a.call(request, new SocketClosedError({ url }));
            for (const subscription of subscriptions.values())
              (_b = subscription.onError) == null ? void 0 : _b.call(subscription, new SocketClosedError({ url }));
            attemptReconnect();
          },
          onError(error_) {
            var _a, _b;
            error = error_;
            for (const request of requests.values())
              (_a = request.onError) == null ? void 0 : _a.call(request, error);
            for (const subscription of subscriptions.values())
              (_b = subscription.onError) == null ? void 0 : _b.call(subscription, error);
            attemptReconnect();
          },
          onOpen() {
            error = void 0;
            reconnectCount = 0;
          },
          onResponse(data) {
            const isSubscription = data.method === "eth_subscription";
            const id2 = isSubscription ? data.params.subscription : data.id;
            const cache = isSubscription ? subscriptions : requests;
            const callback = cache.get(id2);
            if (callback)
              callback.onResponse(data);
            if (!isSubscription)
              cache.delete(id2);
          }
        });
        socket = result;
        if (keepAlive) {
          if (keepAliveTimer)
            clearInterval(keepAliveTimer);
          keepAliveTimer = setInterval(() => {
            var _a;
            return (_a = socket.ping) == null ? void 0 : _a.call(socket);
          }, keepAliveInterval);
        }
        if (reconnect && subscriptions.size > 0) {
          const subscriptionEntries = subscriptions.entries();
          for (const [key2, { onResponse, body, onError }] of subscriptionEntries) {
            if (!body)
              continue;
            subscriptions.delete(key2);
            socketClient == null ? void 0 : socketClient.request({ body, onResponse, onError });
          }
        }
        return result;
      }
      await setup();
      error = void 0;
      socketClient = {
        close() {
          keepAliveTimer && clearInterval(keepAliveTimer);
          socket.close();
          socketClientCache.delete(id);
        },
        get socket() {
          return socket;
        },
        request({ body, onError, onResponse }) {
          var _a;
          if (error && onError)
            onError(error);
          const id2 = body.id ?? idCache.take();
          const callback = (response) => {
            if (typeof response.id === "number" && id2 !== response.id)
              return;
            if (body.method === "eth_subscribe" && typeof response.result === "string")
              subscriptions.set(response.result, {
                onResponse: callback,
                onError,
                body
              });
            onResponse(response);
          };
          if (body.method === "eth_unsubscribe")
            subscriptions.delete((_a = body.params) == null ? void 0 : _a[0]);
          requests.set(id2, { onResponse: callback, onError });
          try {
            socket.request({
              body: {
                jsonrpc: "2.0",
                id: id2,
                ...body
              }
            });
          } catch (error2) {
            onError == null ? void 0 : onError(error2);
          }
        },
        requestAsync({ body, timeout = 1e4 }) {
          return withTimeout(() => new Promise((onResponse, onError) => this.request({
            body,
            onError,
            onResponse
          })), {
            errorInstance: new TimeoutError({ body, url }),
            timeout
          });
        },
        requests,
        subscriptions,
        url
      };
      socketClientCache.set(id, socketClient);
      return [socketClient];
    }
  });
  const [_, [socketClient_]] = await schedule();
  return socketClient_;
}
async function getWebSocketRpcClient(url, options = {}) {
  const { keepAlive, reconnect } = options;
  return getSocketRpcClient({
    async getSocket({ onClose, onError, onOpen, onResponse }) {
      const WebSocket = await __vitePreload(() => import("./native-3KyBxzAR.js"), true ? [] : void 0).then((module) => module.WebSocket);
      const socket = new WebSocket(url);
      function onClose_() {
        socket.removeEventListener("close", onClose_);
        socket.removeEventListener("message", onMessage);
        socket.removeEventListener("error", onError);
        socket.removeEventListener("open", onOpen);
        onClose();
      }
      function onMessage({ data }) {
        if (typeof data === "string" && data.trim().length === 0)
          return;
        try {
          const _data = JSON.parse(data);
          onResponse(_data);
        } catch (error) {
          onError(error);
        }
      }
      socket.addEventListener("close", onClose_);
      socket.addEventListener("message", onMessage);
      socket.addEventListener("error", onError);
      socket.addEventListener("open", onOpen);
      if (socket.readyState === WebSocket.CONNECTING) {
        await new Promise((resolve, reject) => {
          if (!socket)
            return;
          socket.onopen = resolve;
          socket.onerror = reject;
        });
      }
      const { close: close_ } = socket;
      return Object.assign(socket, {
        close() {
          close_.bind(socket)();
          onClose_();
        },
        ping() {
          try {
            if (socket.readyState === socket.CLOSED || socket.readyState === socket.CLOSING)
              throw new WebSocketRequestError({
                url: socket.url,
                cause: new SocketClosedError({ url: socket.url })
              });
            const body = {
              jsonrpc: "2.0",
              id: null,
              method: "net_version",
              params: []
            };
            socket.send(JSON.stringify(body));
          } catch (error) {
            onError(error);
          }
        },
        request({ body }) {
          if (socket.readyState === socket.CLOSED || socket.readyState === socket.CLOSING)
            throw new WebSocketRequestError({
              body,
              url: socket.url,
              cause: new SocketClosedError({ url: socket.url })
            });
          return socket.send(JSON.stringify(body));
        }
      });
    },
    keepAlive,
    reconnect,
    url
  });
}
function webSocket(socketClient, { body, onError, onResponse }) {
  socketClient.request({
    body,
    onError,
    onResponse
  });
  return socketClient;
}
async function webSocketAsync(socketClient, { body, timeout = 1e4 }) {
  return socketClient.requestAsync({
    body,
    timeout
  });
}
async function getSocket(url) {
  const client = await getWebSocketRpcClient(url);
  return Object.assign(client.socket, {
    requests: client.requests,
    subscriptions: client.subscriptions
  });
}
const rpc = {
  /**
   * @deprecated use `getHttpRpcClient` instead.
   *
   * ```diff
   * -import { rpc } from 'viem/utils'
   * +import { getHttpRpcClient } from 'viem/utils'
   *
   * -rpc.http(url, params)
   * +const httpClient = getHttpRpcClient(url)
   * +httpClient.request(params)
   * ```
   */
  http(url, params) {
    return getHttpRpcClient(url).request(params);
  },
  /**
   * @deprecated use `getWebSocketRpcClient` instead.
   *
   * ```diff
   * -import { rpc } from 'viem/utils'
   * +import { getWebSocketRpcClient } from 'viem/utils'
   *
   * -rpc.webSocket(url, params)
   * +const webSocketClient = getWebSocketRpcClient(url)
   * +webSocketClient.request(params)
   * ```
   */
  webSocket,
  /**
   * @deprecated use `getWebSocketRpcClient` instead.
   *
   * ```diff
   * -import { rpc } from 'viem/utils'
   * +import { getWebSocketRpcClient } from 'viem/utils'
   *
   * -const response = await rpc.webSocketAsync(url, params)
   * +const webSocketClient = getWebSocketRpcClient(url)
   * +const response = await webSocketClient.requestAsync(params)
   * ```
   */
  webSocketAsync
};
export {
  getSocket as a,
  getWebSocketRpcClient as g,
  rpc as r
};
