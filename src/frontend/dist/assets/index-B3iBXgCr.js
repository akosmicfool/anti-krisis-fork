const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-BmkRJoEM.js","assets/index-GoAlzJgb.js","assets/index-D3Low12Q.js","assets/index-kPqGAi2-.css","assets/parseSignature-B1yuZolh.js","assets/index-BR0XLxjl.js","assets/index-CsGEH84p.js","assets/index-AnnY2b3c.js","assets/index-T2Pqjeq7.js","assets/index-CmoAzyu0.js","assets/compat-EpB2Q_2J.js","assets/ccip-DUZiJ23f.js","assets/index.es-DBnbDE_G.js"])))=>i.map(i=>d[i]);
import { bs as createConnector, bt as custom, bu as getAddress, bv as SwitchChainError, bw as ChainNotConfiguredError, bx as numberToHex, by as fromHex, bz as ConnectorNotConnectedError, bA as UserRejectedRequestError, bB as RpcRequestError, bC as keccak256, bD as stringToHex, bE as withRetry, aR as __vitePreload, aN as withTimeout, bF as ResourceUnavailableRpcError, bG as ProviderNotFoundError } from "./index-D3Low12Q.js";
import { bH } from "./index-D3Low12Q.js";
import { r as rpc } from "./compat-EpB2Q_2J.js";
mock.type = "mock";
function mock(parameters) {
  const transactionCache = /* @__PURE__ */ new Map();
  const features = parameters.features ?? { defaultConnected: false };
  let connected = features.defaultConnected;
  let connectedChainId;
  return createConnector((config) => ({
    id: "mock",
    name: "Mock Connector",
    type: mock.type,
    async setup() {
      connectedChainId = config.chains[0].id;
    },
    async connect({ chainId, withCapabilities } = {}) {
      if (features.connectError) {
        if (typeof features.connectError === "boolean")
          throw new UserRejectedRequestError(new Error("Failed to connect."));
        throw features.connectError;
      }
      const provider = await this.getProvider();
      const accounts = await provider.request({
        method: "eth_requestAccounts"
      });
      let currentChainId = await this.getChainId();
      if (chainId && currentChainId !== chainId) {
        const chain = await this.switchChain({ chainId });
        currentChainId = chain.id;
      }
      connected = true;
      return {
        accounts: withCapabilities ? accounts.map((x) => ({
          address: getAddress(x),
          capabilities: { foo: { bar: x } }
        })) : accounts.map((x) => getAddress(x)),
        chainId: currentChainId
      };
    },
    async disconnect() {
      connected = false;
    },
    async getAccounts() {
      if (!connected)
        throw new ConnectorNotConnectedError();
      const provider = await this.getProvider();
      const accounts = await provider.request({ method: "eth_accounts" });
      return accounts.map((x) => getAddress(x));
    },
    async getChainId() {
      const provider = await this.getProvider();
      const hexChainId = await provider.request({ method: "eth_chainId" });
      return fromHex(hexChainId, "number");
    },
    async isAuthorized() {
      if (!features.reconnect)
        return false;
      if (!connected)
        return false;
      const accounts = await this.getAccounts();
      return !!accounts.length;
    },
    async switchChain({ chainId }) {
      const provider = await this.getProvider();
      const chain = config.chains.find((x) => x.id === chainId);
      if (!chain)
        throw new SwitchChainError(new ChainNotConfiguredError());
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: numberToHex(chainId) }]
      });
      return chain;
    },
    onAccountsChanged(accounts) {
      if (accounts.length === 0)
        this.onDisconnect();
      else
        config.emitter.emit("change", {
          accounts: accounts.map((x) => getAddress(x))
        });
    },
    onChainChanged(chain) {
      const chainId = Number(chain);
      config.emitter.emit("change", { chainId });
    },
    async onDisconnect(_error) {
      config.emitter.emit("disconnect");
      connected = false;
    },
    async getProvider({ chainId } = {}) {
      const chain = config.chains.find((x) => x.id === chainId) ?? config.chains[0];
      const url = chain.rpcUrls.default.http[0];
      const request = async ({ method, params }) => {
        if (method === "eth_chainId")
          return numberToHex(connectedChainId);
        if (method === "eth_accounts")
          return parameters.accounts;
        if (method === "eth_requestAccounts")
          return parameters.accounts;
        if (method === "eth_signTypedData_v4") {
          if (features.signTypedDataError) {
            if (typeof features.signTypedDataError === "boolean")
              throw new UserRejectedRequestError(new Error("Failed to sign typed data."));
            throw features.signTypedDataError;
          }
        }
        if (method === "wallet_switchEthereumChain") {
          if (features.switchChainError) {
            if (typeof features.switchChainError === "boolean")
              throw new UserRejectedRequestError(new Error("Failed to switch chain."));
            throw features.switchChainError;
          }
          connectedChainId = fromHex(params[0].chainId, "number");
          this.onChainChanged(connectedChainId.toString());
          return;
        }
        if (method === "wallet_watchAsset") {
          if (features.watchAssetError) {
            if (typeof features.watchAssetError === "boolean")
              throw new UserRejectedRequestError(new Error("Failed to switch chain."));
            throw features.watchAssetError;
          }
          return connected;
        }
        if (method === "wallet_getCapabilities")
          return {
            "0x2105": {
              paymasterService: {
                supported: params[0] === "0x95132632579b073D12a6673e18Ab05777a6B86f8"
              },
              sessionKeys: {
                supported: true
              }
            },
            "0x14A34": {
              paymasterService: {
                supported: params[0] === "0x95132632579b073D12a6673e18Ab05777a6B86f8"
              }
            }
          };
        if (method === "wallet_sendCalls") {
          const hashes = [];
          const calls = params[0].calls;
          const from = params[0].from;
          for (const call of calls) {
            const { result: result2, error: error2 } = await rpc.http(url, {
              body: {
                method: "eth_sendTransaction",
                params: [
                  {
                    ...call,
                    ...typeof from !== "undefined" ? { from } : {}
                  }
                ]
              }
            });
            if (error2)
              throw new RpcRequestError({
                body: { method, params },
                error: error2,
                url
              });
            hashes.push(result2);
          }
          const id = keccak256(stringToHex(JSON.stringify(calls)));
          transactionCache.set(id, hashes);
          return { id };
        }
        if (method === "wallet_getCallsStatus") {
          const hashes = transactionCache.get(params[0]);
          if (!hashes)
            return {
              atomic: false,
              chainId: "0x1",
              id: params[0],
              status: 100,
              receipts: [],
              version: "2.0.0"
            };
          const receipts = await Promise.all(hashes.map(async (hash) => {
            const { result: result2, error: error2 } = await rpc.http(url, {
              body: {
                method: "eth_getTransactionReceipt",
                params: [hash],
                id: 0
              }
            });
            if (error2)
              throw new RpcRequestError({
                body: { method, params },
                error: error2,
                url
              });
            if (!result2)
              return null;
            return {
              blockHash: result2.blockHash,
              blockNumber: result2.blockNumber,
              gasUsed: result2.gasUsed,
              logs: result2.logs,
              status: result2.status,
              transactionHash: result2.transactionHash
            };
          }));
          const receipts_ = receipts.filter((x) => x !== null);
          if (receipts_.length === 0)
            return {
              atomic: false,
              chainId: "0x1",
              id: params[0],
              status: 100,
              receipts: [],
              version: "2.0.0"
            };
          return {
            atomic: false,
            chainId: "0x1",
            id: params[0],
            status: 200,
            receipts: receipts_,
            version: "2.0.0"
          };
        }
        if (method === "wallet_showCallsStatus")
          return;
        if (method === "personal_sign") {
          if (features.signMessageError) {
            if (typeof features.signMessageError === "boolean")
              throw new UserRejectedRequestError(new Error("Failed to sign message."));
            throw features.signMessageError;
          }
          method = "eth_sign";
          params = [params[1], params[0]];
        }
        const body = { method, params };
        const { error, result } = await rpc.http(url, { body });
        if (error)
          throw new RpcRequestError({ body, error, url });
        return result;
      };
      return custom({ request })({ retryCount: 0 });
    }
  }));
}
function extractRpcUrls(parameters) {
  var _a, _b, _c;
  const { chain } = parameters;
  const fallbackUrl = chain.rpcUrls.default.http[0];
  if (!parameters.transports)
    return [fallbackUrl];
  const transport = (_b = (_a = parameters.transports) == null ? void 0 : _a[chain.id]) == null ? void 0 : _b.call(_a, { chain });
  const transports = ((_c = transport == null ? void 0 : transport.value) == null ? void 0 : _c.transports) || [transport];
  return transports.map(({ value }) => (value == null ? void 0 : value.url) || fallbackUrl);
}
const tempoWalletIcon = 'data:image/svg+xml,<svg width="269" height="269" viewBox="0 0 269 269" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="269" height="269" fill="black"/><path d="M123.273 190.794H93.445L121.09 105.318H85.7334L93.445 80.2642H191.95L184.238 105.318H150.773L123.273 190.794Z" fill="white"/></svg>';
function tempoWallet(parameters = {}) {
  const { dialog: dialogOption, host, icon = tempoWalletIcon, name, rdns, ...providerParameters } = parameters;
  return _setup({
    createAdapter(accounts) {
      return accounts.dialog({
        dialog: dialogOption,
        host,
        icon,
        name,
        rdns
      });
    },
    icon,
    id: rdns ?? "xyz.tempo",
    name: name ?? "Tempo Wallet",
    providerParameters,
    rdns: rdns ?? "xyz.tempo",
    type: "injected"
  });
}
function createAccountsStorage(storage, namespace) {
  const prefix = `accounts.${namespace}`;
  return {
    async getItem(key) {
      return await storage.getItem(`${prefix}.${key}`, null) ?? null;
    },
    async removeItem(key) {
      await storage.removeItem(`${prefix}.${key}`);
    },
    async setItem(key, value) {
      await storage.setItem(`${prefix}.${key}`, value);
    }
  };
}
function createMemoryAccountsStorage() {
  const map = /* @__PURE__ */ new Map();
  return {
    async getItem(key) {
      return map.get(key) ?? null;
    },
    async removeItem(key) {
      map.delete(key);
    },
    async setItem(key, value) {
      map.set(key, value);
    }
  };
}
function _setup(parameters) {
  return createConnector((config) => {
    const chains = config.chains;
    let providerPromise;
    let accountsChanged;
    let chainChanged;
    let connect;
    let disconnect;
    async function getAccountsModule() {
      return await __vitePreload(() => import("./core-CSEhNrKF.js"), true ? [] : void 0).catch(() => {
        throw new Error('dependency "accounts" not found');
      });
    }
    async function getProvider() {
      providerPromise ?? (providerPromise = (async () => {
        const accounts = await getAccountsModule();
        return accounts.Provider.create({
          ...parameters.providerParameters,
          adapter: parameters.createAdapter(accounts),
          chains: config.chains,
          storage: parameters.providerParameters.storage ?? (config.storage ? createAccountsStorage(config.storage, parameters.id) : createMemoryAccountsStorage())
        });
      })());
      return await providerPromise;
    }
    return {
      icon: parameters.icon,
      id: parameters.id,
      name: parameters.name,
      rdns: parameters.rdns,
      type: parameters.type,
      async connect(connectParameters = {}) {
        const { chainId, isReconnecting, withCapabilities } = connectParameters;
        const capabilities = "capabilities" in connectParameters ? connectParameters.capabilities : void 0;
        let accounts = [];
        let currentChainId;
        if (isReconnecting) {
          accounts = await this.getAccounts().then((accounts2) => accounts2.map((address) => ({ address, capabilities: {} }))).catch(() => []);
        }
        try {
          if (!accounts.length && !isReconnecting) {
            const provider2 = await getProvider();
            const response = await provider2.request({
              method: "wallet_connect",
              params: [
                {
                  ...chainId ? { chainId } : {},
                  ...capabilities ? { capabilities } : {}
                }
              ]
            });
            accounts = response.accounts;
          }
          currentChainId ?? (currentChainId = await this.getChainId());
          if (!currentChainId)
            throw new ChainNotConfiguredError();
          const provider = await getProvider();
          if (connect) {
            provider.removeListener("connect", connect);
            connect = void 0;
          }
          if (!accountsChanged) {
            accountsChanged = this.onAccountsChanged.bind(this);
            provider.on("accountsChanged", accountsChanged);
          }
          if (!chainChanged) {
            chainChanged = this.onChainChanged.bind(this);
            provider.on("chainChanged", chainChanged);
          }
          if (!disconnect) {
            disconnect = this.onDisconnect.bind(this);
            provider.on("disconnect", disconnect);
          }
          return {
            accounts: withCapabilities ? accounts : accounts.map((account) => account.address),
            chainId: currentChainId
          };
        } catch (error) {
          const rpcError = error;
          if (rpcError.code === UserRejectedRequestError.code)
            throw new UserRejectedRequestError(rpcError);
          throw rpcError;
        }
      },
      async disconnect() {
        var _a;
        const provider = await getProvider();
        if (chainChanged) {
          provider.removeListener("chainChanged", chainChanged);
          chainChanged = void 0;
        }
        if (disconnect) {
          provider.removeListener("disconnect", disconnect);
          disconnect = void 0;
        }
        if (!connect) {
          connect = (_a = this.onConnect) == null ? void 0 : _a.bind(this);
          if (connect)
            provider.on("connect", connect);
        }
        await provider.request({ method: "wallet_disconnect" });
      },
      async getAccounts() {
        const provider = await getProvider();
        return await provider.request({ method: "eth_accounts" });
      },
      async getChainId() {
        const provider = await getProvider();
        return Number(await provider.request({ method: "eth_chainId" }));
      },
      async getClient({ chainId } = {}) {
        const provider = await getProvider();
        return Object.assign(provider.getClient({ chainId }), {
          account: provider.getAccount()
        });
      },
      async getProvider() {
        return await getProvider();
      },
      async isAuthorized() {
        try {
          const accounts = await withRetry(() => this.getAccounts());
          return !!accounts.length;
        } catch {
          return false;
        }
      },
      onAccountsChanged(accounts) {
        config.emitter.emit("change", {
          accounts
        });
      },
      onChainChanged(chain) {
        config.emitter.emit("change", { chainId: Number(chain) });
      },
      async onConnect(connectInfo) {
        const accounts = await this.getAccounts();
        if (accounts.length === 0)
          return;
        const chainId = Number(connectInfo.chainId);
        config.emitter.emit("connect", { accounts, chainId });
        const provider = await getProvider();
        if (connect) {
          provider.removeListener("connect", connect);
          connect = void 0;
        }
        if (!accountsChanged) {
          accountsChanged = this.onAccountsChanged.bind(this);
          provider.on("accountsChanged", accountsChanged);
        }
        if (!chainChanged) {
          chainChanged = this.onChainChanged.bind(this);
          provider.on("chainChanged", chainChanged);
        }
        if (!disconnect) {
          disconnect = this.onDisconnect.bind(this);
          provider.on("disconnect", disconnect);
        }
      },
      async onDisconnect(_error) {
        var _a;
        const provider = await getProvider();
        config.emitter.emit("disconnect");
        if (chainChanged) {
          provider.removeListener("chainChanged", chainChanged);
          chainChanged = void 0;
        }
        if (disconnect) {
          provider.removeListener("disconnect", disconnect);
          disconnect = void 0;
        }
        if (!connect) {
          connect = (_a = this.onConnect) == null ? void 0 : _a.bind(this);
          if (connect)
            provider.on("connect", connect);
        }
      },
      async setup() {
        var _a;
        if (!connect) {
          const provider = await getProvider();
          connect = (_a = this.onConnect) == null ? void 0 : _a.bind(this);
          if (connect)
            provider.on("connect", connect);
        }
      },
      async switchChain({ chainId }) {
        const chain = chains.find((chain2) => chain2.id === chainId);
        if (!chain)
          throw new SwitchChainError(new ChainNotConfiguredError());
        const provider = await getProvider();
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: numberToHex(chainId) }]
        });
        return chain;
      }
    };
  });
}
function baseAccount(parameters = {}) {
  let walletProvider;
  let accountsChanged;
  let chainChanged;
  let disconnect;
  return createConnector((config) => ({
    id: "baseAccount",
    name: "Base Account",
    rdns: "app.base.account",
    type: "baseAccount",
    async connect({ chainId, withCapabilities, ...rest } = {}) {
      var _a;
      try {
        const provider = await this.getProvider();
        const targetChainId = chainId ?? ((_a = config.chains[0]) == null ? void 0 : _a.id);
        if (!targetChainId)
          throw new ChainNotConfiguredError();
        let { accounts, currentChainId } = await (async () => {
          if (rest.isReconnecting)
            return {
              accounts: (await provider.request({
                method: "eth_accounts",
                params: []
              })).map((x) => ({ address: getAddress(x) })),
              currentChainId: await this.getChainId()
            };
          const response = await provider.request({
            method: "wallet_connect",
            params: [
              {
                capabilities: "capabilities" in rest && rest.capabilities ? rest.capabilities : {},
                chainIds: [
                  numberToHex(targetChainId),
                  ...config.chains.filter((x) => x.id !== targetChainId).map((x) => numberToHex(x.id))
                ]
              }
            ]
          });
          const orderedAccounts = await provider.request({
            method: "eth_accounts"
          });
          const accounts2 = orderedAccounts.map((account1) => response.accounts.find((account2) => account2.address === account1) ?? { address: account1 });
          return {
            accounts: accounts2.map((account) => ({
              address: getAddress(account.address),
              capabilities: account.capabilities ?? {}
            })),
            currentChainId: Number(response.chainIds[0])
          };
        })();
        if (!accountsChanged) {
          accountsChanged = this.onAccountsChanged.bind(this);
          provider.on("accountsChanged", accountsChanged);
        }
        if (!chainChanged) {
          chainChanged = this.onChainChanged.bind(this);
          provider.on("chainChanged", chainChanged);
        }
        if (!disconnect) {
          disconnect = this.onDisconnect.bind(this);
          provider.on("disconnect", disconnect);
        }
        if (chainId && currentChainId !== chainId) {
          const chain = await this.switchChain({ chainId }).catch((error) => {
            if (error.code === UserRejectedRequestError.code)
              throw error;
            return { id: currentChainId };
          });
          currentChainId = (chain == null ? void 0 : chain.id) ?? currentChainId;
        }
        return {
          // TODO(v3): Make `withCapabilities: true` default behavior
          accounts: withCapabilities ? accounts : accounts.map((account) => account.address),
          chainId: currentChainId
        };
      } catch (error) {
        if (/(user closed modal|accounts received is empty|user denied account|request rejected)/i.test(error.message))
          throw new UserRejectedRequestError(error);
        throw error;
      }
    },
    async disconnect() {
      const provider = await this.getProvider();
      if (accountsChanged) {
        provider.removeListener("accountsChanged", accountsChanged);
        accountsChanged = void 0;
      }
      if (chainChanged) {
        provider.removeListener("chainChanged", chainChanged);
        chainChanged = void 0;
      }
      if (disconnect) {
        provider.removeListener("disconnect", disconnect);
        disconnect = void 0;
      }
      provider.disconnect();
    },
    async getAccounts() {
      const provider = await this.getProvider();
      return (await provider.request({
        method: "eth_accounts"
      })).map((x) => getAddress(x));
    },
    async getChainId() {
      const provider = await this.getProvider();
      const chainId = await provider.request({
        method: "eth_chainId"
      });
      return Number(chainId);
    },
    async getProvider() {
      if (!walletProvider) {
        const preference = (() => {
          var _a;
          if (typeof parameters.preference === "string")
            return { options: parameters.preference };
          return {
            ...parameters.preference,
            options: ((_a = parameters.preference) == null ? void 0 : _a.options) ?? "all"
          };
        })();
        const { createBaseAccountSDK } = await (() => {
          try {
            return __vitePreload(() => import("./index-BmkRJoEM.js"), true ? __vite__mapDeps([0,1,2,3,4]) : void 0);
          } catch {
            throw new Error('dependency "@base-org/account" not found');
          }
        })();
        const sdk = createBaseAccountSDK({
          ...parameters,
          appChainIds: config.chains.map((x) => x.id),
          preference
        });
        walletProvider = sdk.getProvider();
      }
      return walletProvider;
    },
    async isAuthorized() {
      try {
        const accounts = await this.getAccounts();
        return !!accounts.length;
      } catch {
        return false;
      }
    },
    async switchChain({ addEthereumChainParameter, chainId }) {
      var _a, _b, _c, _d;
      const chain = config.chains.find((chain2) => chain2.id === chainId);
      if (!chain)
        throw new SwitchChainError(new ChainNotConfiguredError());
      const provider = await this.getProvider();
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: numberToHex(chain.id) }]
        });
        return chain;
      } catch (error) {
        if (error.code === 4902) {
          try {
            let blockExplorerUrls;
            if (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.blockExplorerUrls)
              blockExplorerUrls = addEthereumChainParameter.blockExplorerUrls;
            else
              blockExplorerUrls = ((_a = chain.blockExplorers) == null ? void 0 : _a.default.url) ? [(_b = chain.blockExplorers) == null ? void 0 : _b.default.url] : [];
            let rpcUrls;
            if ((_c = addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.rpcUrls) == null ? void 0 : _c.length)
              rpcUrls = addEthereumChainParameter.rpcUrls;
            else
              rpcUrls = [((_d = chain.rpcUrls.default) == null ? void 0 : _d.http[0]) ?? ""];
            const addEthereumChain = {
              blockExplorerUrls,
              chainId: numberToHex(chainId),
              chainName: (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.chainName) ?? chain.name,
              iconUrls: addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.iconUrls,
              nativeCurrency: (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.nativeCurrency) ?? chain.nativeCurrency,
              rpcUrls
            };
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [addEthereumChain]
            });
            return chain;
          } catch (error2) {
            throw new UserRejectedRequestError(error2);
          }
        }
        throw new SwitchChainError(error);
      }
    },
    onAccountsChanged(accounts) {
      if (accounts.length === 0)
        this.onDisconnect();
      else
        config.emitter.emit("change", {
          accounts: accounts.map((x) => getAddress(x))
        });
    },
    onChainChanged(chain) {
      const chainId = Number(chain);
      config.emitter.emit("change", { chainId });
    },
    async onDisconnect(_error) {
      config.emitter.emit("disconnect");
      const provider = await this.getProvider();
      if (accountsChanged) {
        provider.removeListener("accountsChanged", accountsChanged);
        accountsChanged = void 0;
      }
      if (chainChanged) {
        provider.removeListener("chainChanged", chainChanged);
        chainChanged = void 0;
      }
      if (disconnect) {
        provider.removeListener("disconnect", disconnect);
        disconnect = void 0;
      }
    }
  }));
}
coinbaseWallet.type = "coinbaseWallet";
function coinbaseWallet(parameters = {}) {
  let walletProvider;
  let accountsChanged;
  let chainChanged;
  let disconnect;
  return createConnector((config) => ({
    id: "coinbaseWalletSDK",
    name: "Coinbase Wallet",
    rdns: "com.coinbase.wallet",
    type: coinbaseWallet.type,
    async connect({ chainId, withCapabilities, ...rest } = {}) {
      try {
        const provider = await this.getProvider();
        const accounts = (await provider.request({
          method: "eth_requestAccounts",
          params: "instantOnboarding" in rest && rest.instantOnboarding ? [{ onboarding: "instant" }] : []
        })).map((x) => getAddress(x));
        if (!accountsChanged) {
          accountsChanged = this.onAccountsChanged.bind(this);
          provider.on("accountsChanged", accountsChanged);
        }
        if (!chainChanged) {
          chainChanged = this.onChainChanged.bind(this);
          provider.on("chainChanged", chainChanged);
        }
        if (!disconnect) {
          disconnect = this.onDisconnect.bind(this);
          provider.on("disconnect", disconnect);
        }
        let currentChainId = await this.getChainId();
        if (chainId && currentChainId !== chainId) {
          const chain = await this.switchChain({ chainId }).catch((error) => {
            if (error.code === UserRejectedRequestError.code)
              throw error;
            return { id: currentChainId };
          });
          currentChainId = (chain == null ? void 0 : chain.id) ?? currentChainId;
        }
        return {
          accounts: withCapabilities ? accounts.map((address) => ({ address, capabilities: {} })) : accounts,
          chainId: currentChainId
        };
      } catch (error) {
        if (/(user closed modal|accounts received is empty|user denied account|request rejected)/i.test(error.message))
          throw new UserRejectedRequestError(error);
        throw error;
      }
    },
    async disconnect() {
      var _a;
      const provider = await this.getProvider();
      if (accountsChanged) {
        provider.removeListener("accountsChanged", accountsChanged);
        accountsChanged = void 0;
      }
      if (chainChanged) {
        provider.removeListener("chainChanged", chainChanged);
        chainChanged = void 0;
      }
      if (disconnect) {
        provider.removeListener("disconnect", disconnect);
        disconnect = void 0;
      }
      provider.disconnect();
      (_a = provider.close) == null ? void 0 : _a.call(provider);
    },
    async getAccounts() {
      const provider = await this.getProvider();
      return (await provider.request({
        method: "eth_accounts"
      })).map((x) => getAddress(x));
    },
    async getChainId() {
      const provider = await this.getProvider();
      const chainId = await provider.request({
        method: "eth_chainId"
      });
      return Number(chainId);
    },
    async getProvider() {
      if (!walletProvider) {
        const { createCoinbaseWalletSDK } = await (() => {
          try {
            return __vitePreload(() => import("./index-BR0XLxjl.js"), true ? __vite__mapDeps([5,1,2,3,4]) : void 0);
          } catch {
            throw new Error('dependency "@coinbase/wallet-sdk" not found');
          }
        })();
        const sdk = createCoinbaseWalletSDK({
          ...parameters,
          appChainIds: config.chains.map((x) => x.id),
          preference: {
            options: "all",
            ...parameters.preference ?? {}
          }
        });
        walletProvider = sdk.getProvider();
      }
      return walletProvider;
    },
    async isAuthorized() {
      try {
        const accounts = await this.getAccounts();
        return !!accounts.length;
      } catch {
        return false;
      }
    },
    async switchChain({ addEthereumChainParameter, chainId }) {
      var _a, _b, _c, _d;
      const chain = config.chains.find((chain2) => chain2.id === chainId);
      if (!chain)
        throw new SwitchChainError(new ChainNotConfiguredError());
      const provider = await this.getProvider();
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: numberToHex(chain.id) }]
        });
        return chain;
      } catch (error) {
        if (error.code === 4902) {
          try {
            let blockExplorerUrls;
            if (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.blockExplorerUrls)
              blockExplorerUrls = addEthereumChainParameter.blockExplorerUrls;
            else
              blockExplorerUrls = ((_a = chain.blockExplorers) == null ? void 0 : _a.default.url) ? [(_b = chain.blockExplorers) == null ? void 0 : _b.default.url] : [];
            let rpcUrls;
            if ((_c = addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.rpcUrls) == null ? void 0 : _c.length)
              rpcUrls = addEthereumChainParameter.rpcUrls;
            else
              rpcUrls = [((_d = chain.rpcUrls.default) == null ? void 0 : _d.http[0]) ?? ""];
            const addEthereumChain = {
              blockExplorerUrls,
              chainId: numberToHex(chainId),
              chainName: (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.chainName) ?? chain.name,
              iconUrls: addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.iconUrls,
              nativeCurrency: (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.nativeCurrency) ?? chain.nativeCurrency,
              rpcUrls
            };
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [addEthereumChain]
            });
            return chain;
          } catch (error2) {
            throw new UserRejectedRequestError(error2);
          }
        }
        throw new SwitchChainError(error);
      }
    },
    onAccountsChanged(accounts) {
      if (accounts.length === 0)
        this.onDisconnect();
      else
        config.emitter.emit("change", {
          accounts: accounts.map((x) => getAddress(x))
        });
    },
    onChainChanged(chain) {
      const chainId = Number(chain);
      config.emitter.emit("change", { chainId });
    },
    async onDisconnect(_error) {
      config.emitter.emit("disconnect");
      const provider = await this.getProvider();
      if (accountsChanged) {
        provider.removeListener("accountsChanged", accountsChanged);
        accountsChanged = void 0;
      }
      if (chainChanged) {
        provider.removeListener("chainChanged", chainChanged);
        chainChanged = void 0;
      }
      if (disconnect) {
        provider.removeListener("disconnect", disconnect);
        disconnect = void 0;
      }
    }
  }));
}
metaMask.type = "metaMask";
function metaMask(parameters = {}) {
  let metamask;
  let metamaskPromise;
  return createConnector((config) => ({
    id: "metaMaskSDK",
    name: "MetaMask",
    rdns: ["io.metamask", "io.metamask.mobile"],
    type: metaMask.type,
    async connect({ chainId, isReconnecting, withCapabilities } = {}) {
      const instance = await this.getInstance();
      const provider = instance.getProvider();
      let accounts = [];
      if (isReconnecting)
        accounts = await this.getAccounts().catch(() => []);
      try {
        let signResponse;
        let connectWithResponse;
        if (!(accounts == null ? void 0 : accounts.length)) {
          const chainIds = config.chains.map((chain) => numberToHex(chain.id));
          if (parameters.connectAndSign || parameters.connectWith) {
            if (parameters.connectAndSign)
              signResponse = await instance.connectAndSign({
                chainIds,
                message: parameters.connectAndSign
              });
            else if (parameters.connectWith)
              connectWithResponse = await instance.connectWith({
                chainIds,
                method: parameters.connectWith.method,
                params: parameters.connectWith.params
              });
            accounts = await this.getAccounts();
          } else {
            const result = await instance.connect({ chainIds });
            accounts = result.accounts.map((x) => getAddress(x));
          }
        }
        let currentChainId = await this.getChainId();
        if (chainId && currentChainId !== chainId) {
          const chain = await this.switchChain({ chainId }).catch((error) => {
            if (error.code === UserRejectedRequestError.code)
              throw error;
            return { id: currentChainId };
          });
          currentChainId = (chain == null ? void 0 : chain.id) ?? currentChainId;
        }
        if (signResponse)
          provider.emit("connectAndSign", {
            accounts,
            chainId: numberToHex(currentChainId),
            signResponse
          });
        else if (connectWithResponse)
          provider.emit("connectWith", {
            accounts,
            chainId: numberToHex(currentChainId),
            connectWithResponse
          });
        return {
          // TODO(v3): Make `withCapabilities: true` default behavior
          accounts: withCapabilities ? accounts.map((address) => ({ address, capabilities: {} })) : accounts,
          chainId: currentChainId
        };
      } catch (err) {
        const error = err;
        if (error.code === UserRejectedRequestError.code)
          throw new UserRejectedRequestError(error);
        if (error.code === ResourceUnavailableRpcError.code)
          throw new ResourceUnavailableRpcError(error);
        throw error;
      }
    },
    async disconnect() {
      const instance = await this.getInstance();
      return instance.disconnect();
    },
    async getAccounts() {
      const instance = await this.getInstance();
      if (instance.accounts.length)
        return instance.accounts.map((x) => getAddress(x));
      const provider = instance.getProvider();
      const accounts = await provider.request({
        method: "eth_accounts"
      });
      return accounts.map((x) => getAddress(x));
    },
    async getChainId() {
      const instance = await this.getInstance();
      if (instance.getChainId())
        return Number(instance.getChainId());
      const provider = instance.getProvider();
      const chainId = await provider.request({ method: "eth_chainId" });
      return Number(chainId);
    },
    async getProvider() {
      const instance = await this.getInstance();
      return instance.getProvider();
    },
    async isAuthorized() {
      try {
        const timeout = 10;
        const accounts = await withRetry(async () => withTimeout(async () => {
          const accounts2 = await this.getAccounts();
          if (!accounts2.length)
            throw new Error("try again");
          return accounts2;
        }, { timeout }), { delay: timeout + 1, retryCount: 3 });
        return Boolean(accounts.length);
      } catch {
        return false;
      }
    },
    async switchChain({ addEthereumChainParameter, chainId }) {
      var _a, _b;
      const chain = config.chains.find(({ id }) => id === Number(chainId));
      if (!chain)
        throw new SwitchChainError(new ChainNotConfiguredError());
      const hexChainId = numberToHex(chainId);
      try {
        const instance = await this.getInstance();
        await instance.switchChain({
          chainId: hexChainId,
          chainConfiguration: {
            blockExplorerUrls: (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.blockExplorerUrls) ? [...addEthereumChainParameter.blockExplorerUrls] : ((_a = chain.blockExplorers) == null ? void 0 : _a.default.url) ? [chain.blockExplorers.default.url] : void 0,
            chainId: hexChainId,
            chainName: (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.chainName) ?? chain.name,
            iconUrls: addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.iconUrls,
            nativeCurrency: (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.nativeCurrency) ?? chain.nativeCurrency,
            rpcUrls: (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.rpcUrls) ? [...addEthereumChainParameter.rpcUrls] : ((_b = chain.rpcUrls.default) == null ? void 0 : _b.http) ? [...chain.rpcUrls.default.http] : void 0
          }
        });
        return chain;
      } catch (err) {
        const error = err;
        if (error.code === UserRejectedRequestError.code)
          throw new UserRejectedRequestError(error);
        throw new SwitchChainError(error);
      }
    },
    async onAccountsChanged(accounts) {
      config.emitter.emit("change", {
        accounts: accounts.map((x) => getAddress(x))
      });
    },
    onChainChanged(chain) {
      const chainId = Number(chain);
      config.emitter.emit("change", { chainId });
    },
    async onConnect(connectInfo) {
      const accounts = await this.getAccounts();
      if (accounts.length === 0)
        return;
      const chainId = Number(connectInfo.chainId);
      config.emitter.emit("connect", { accounts, chainId });
    },
    async onDisconnect(error) {
      if (error && error.code === 1013) {
        const provider = await this.getProvider();
        if (provider && Boolean((await this.getAccounts()).length))
          return;
      }
      config.emitter.emit("disconnect");
    },
    onDisplayUri(uri) {
      config.emitter.emit("message", { type: "display_uri", data: uri });
    },
    async getInstance() {
      var _a;
      if (!metamask) {
        if (!metamaskPromise) {
          const { createEVMClient } = await (async () => {
            try {
              return __vitePreload(() => import("./connectors-Dng6TIbO.js"), true ? [] : void 0);
            } catch {
              throw new Error('dependency "@metamask/connect-evm" not found');
            }
          })();
          const defaultDappParams = typeof window === "undefined" ? { name: "wagmi" } : { name: window.location.hostname, url: window.location.href };
          metamaskPromise = createEVMClient({
            ...parameters,
            api: {
              supportedNetworks: Object.fromEntries(config.chains.map((chain) => {
                var _a2;
                return [
                  numberToHex(chain.id),
                  ((_a2 = chain.rpcUrls.default) == null ? void 0 : _a2.http[0]) ?? ""
                ];
              }))
            },
            dapp: parameters.dapp ?? {
              ...defaultDappParams,
              ...parameters.dappMetadata
            },
            debug: parameters.debug ?? ((_a = parameters.logging) == null ? void 0 : _a.sdk),
            eventHandlers: {
              accountsChanged: this.onAccountsChanged.bind(this),
              chainChanged: this.onChainChanged.bind(this),
              connect: this.onConnect.bind(this),
              disconnect: this.onDisconnect.bind(this),
              displayUri: this.onDisplayUri.bind(this)
            },
            analytics: {
              integrationType: "wagmi"
            },
            ui: {
              ...parameters.ui,
              ...parameters.headless != null && {
                headless: parameters.headless
              }
            },
            ...parameters.mobile && { mobile: parameters.mobile }
          });
        }
        metamask = await metamaskPromise;
      }
      return metamask;
    }
  }));
}
function porto(parameters = {}) {
  const supportsEvents = (provider) => typeof provider.on === "function" && typeof provider.removeListener === "function";
  return createConnector((wagmiConfig) => {
    const chains = wagmiConfig.chains ?? parameters.chains ?? [];
    const transports = (() => {
      if (wagmiConfig.transports)
        return wagmiConfig.transports;
      return parameters.transports;
    })();
    let porto_promise;
    let accountsChanged;
    let chainChanged;
    let connect;
    let disconnect;
    return {
      async connect({ chainId = chains[0].id, ...rest } = {}) {
        const isReconnecting = "isReconnecting" in rest && rest.isReconnecting || false;
        const withCapabilities = "withCapabilities" in rest && rest.withCapabilities || false;
        let accounts = [];
        let currentChainId;
        if (isReconnecting) {
          [accounts, currentChainId] = await Promise.all([
            this.getAccounts().catch(() => []),
            this.getChainId().catch(() => void 0)
          ]);
          if (chainId && currentChainId !== chainId) {
            const chain = await this.switchChain({ chainId }).catch((error) => {
              if (error.code === UserRejectedRequestError.code)
                throw error;
              return { id: currentChainId };
            });
            currentChainId = (chain == null ? void 0 : chain.id) ?? currentChainId;
          }
        }
        const provider = await this.getProvider();
        try {
          if (!(accounts == null ? void 0 : accounts.length) && !isReconnecting) {
            const { RpcSchema } = await (() => {
              try {
                return __vitePreload(() => import("./connectors-CpOI07Hn.js"), true ? [] : void 0);
              } catch {
                throw new Error('dependency "porto" not found');
              }
            })();
            const { z } = await (() => {
              try {
                return __vitePreload(() => import("./connectors-BH5vXkVP.js"), true ? [] : void 0);
              } catch {
                throw new Error('dependency "porto/internal" not found');
              }
            })();
            const res = await provider.request({
              method: "wallet_connect",
              params: [
                {
                  ..."capabilities" in rest ? {
                    capabilities: z.encode(RpcSchema.wallet_connect.Capabilities, rest.capabilities ?? {})
                  } : {},
                  chainIds: [
                    numberToHex(chainId),
                    ...chains.filter((x) => x.id !== chainId).map((x) => numberToHex(x.id))
                  ]
                }
              ]
            });
            accounts = res.accounts;
            currentChainId = Number(res.chainIds[0]);
          }
          if (!currentChainId)
            throw new ChainNotConfiguredError();
          if (supportsEvents(provider)) {
            if (connect) {
              provider.removeListener("connect", connect);
              connect = void 0;
            }
            if (!accountsChanged) {
              accountsChanged = this.onAccountsChanged.bind(this);
              provider.on("accountsChanged", accountsChanged);
            }
            if (!chainChanged) {
              chainChanged = this.onChainChanged.bind(this);
              provider.on("chainChanged", chainChanged);
            }
            if (!disconnect) {
              disconnect = this.onDisconnect.bind(this);
              provider.on("disconnect", disconnect);
            }
          }
          return {
            accounts: accounts.map((account) => {
              if (typeof account === "object")
                return withCapabilities ? account : account.address;
              return withCapabilities ? { address: account, capabilities: {} } : account;
            }),
            chainId: currentChainId
          };
        } catch (err) {
          const error = err;
          if (error.code === UserRejectedRequestError.code)
            throw new UserRejectedRequestError(error);
          throw error;
        }
      },
      async disconnect() {
        const provider = await this.getProvider();
        if (supportsEvents(provider)) {
          if (chainChanged) {
            provider.removeListener("chainChanged", chainChanged);
            chainChanged = void 0;
          }
          if (disconnect) {
            provider.removeListener("disconnect", disconnect);
            disconnect = void 0;
          }
          if (!connect) {
            connect = this.onConnect.bind(this);
            provider.on("connect", connect);
          }
        }
        await provider.request({ method: "wallet_disconnect" });
      },
      async getAccounts() {
        const provider = await this.getProvider();
        const accounts = await provider.request({
          method: "eth_accounts"
        });
        return accounts.map((x) => getAddress(x));
      },
      async getChainId() {
        const provider = await this.getProvider();
        const hexChainId = await provider.request({
          method: "eth_chainId"
        });
        return Number(hexChainId);
      },
      async getPortoInstance() {
        porto_promise ?? (porto_promise = (async () => {
          const { Porto } = await (() => {
            try {
              return __vitePreload(() => import("./connectors-CpOI07Hn.js"), true ? [] : void 0);
            } catch {
              throw new Error('dependency "porto" not found');
            }
          })();
          return Porto.create({
            ...parameters,
            announceProvider: false,
            // @ts-ignore
            chains,
            // @ts-ignore
            transports
          });
        })());
        return await porto_promise;
      },
      async getProvider() {
        return (await this.getPortoInstance()).provider;
      },
      icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDIyIiBoZWlnaHQ9IjQyMiIgdmlld0JveD0iMCAwIDQyMiA0MjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MjIiIGhlaWdodD0iNDIyIiBmaWxsPSJibGFjayIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfMV8xNSkiPgo8cGF0aCBkPSJNODEgMjg2LjM2NkM4MSAyODAuODkzIDg1LjQ1MDUgMjc2LjQ1NSA5MC45NDA0IDI3Ni40NTVIMzI5LjUxMUMzMzUuMDAxIDI3Ni40NTUgMzM5LjQ1MiAyODAuODkzIDMzOS40NTIgMjg2LjM2NlYzMDYuMTg4QzMzOS40NTIgMzExLjY2MiAzMzUuMDAxIDMxNi4wOTkgMzI5LjUxMSAzMTYuMDk5SDkwLjk0MDRDODUuNDUwNSAzMTYuMDk5IDgxIDMxMS42NjIgODEgMzA2LjE4OFYyODYuMzY2WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOTAuOTQwNCAyMzQuODI4Qzg1LjQ1MDUgMjM0LjgyOCA4MSAyMzkuMjY2IDgxIDI0NC43MzlWMjcxLjUzMUM4My44NDMyIDI2OS42MzMgODcuMjYyMiAyNjguNTI2IDkwLjk0MDQgMjY4LjUyNkgzMjkuNTExQzMzMy4xODggMjY4LjUyNiAzMzYuNjA4IDI2OS42MzMgMzM5LjQ1MiAyNzEuNTMxVjI0NC43MzlDMzM5LjQ1MiAyMzkuMjY2IDMzNS4wMDEgMjM0LjgyOCAzMjkuNTExIDIzNC44MjhIOTAuOTQwNFpNMzM5LjQ1MiAyODYuMzY2QzMzOS40NTIgMjgwLjg5MyAzMzUuMDAxIDI3Ni40NTUgMzI5LjUxMSAyNzYuNDU1SDkwLjk0MDRDODUuNDUwNSAyNzYuNDU1IDgxIDI4MC44OTMgODEgMjg2LjM2NlYzMDYuMTlDODEgMzExLjY2NCA4NS40NTA1IDMxNi4xMDEgOTAuOTQwNCAzMTYuMTAxSDMyOS41MTFDMzM1LjAwMSAzMTYuMTAxIDMzOS40NTIgMzExLjY2NCAzMzkuNDUyIDMwNi4xOVYyODYuMzY2WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOTAuOTQwNCAxOTMuMjAxQzg1LjQ1MDUgMTkzLjIwMSA4MSAxOTcuNjM4IDgxIDIwMy4xMTJWMjI5LjkwM0M4My44NDMyIDIyOC4wMDYgODcuMjYyMiAyMjYuODk5IDkwLjk0MDQgMjI2Ljg5OUgzMjkuNTExQzMzMy4xODggMjI2Ljg5OSAzMzYuNjA4IDIyOC4wMDYgMzM5LjQ1MiAyMjkuOTAzVjIwMy4xMTJDMzM5LjQ1MiAxOTcuNjM4IDMzNS4wMDEgMTkzLjIwMSAzMjkuNTExIDE5My4yMDFIOTAuOTQwNFpNMzM5LjQ1MiAyNDQuNzM5QzMzOS40NTIgMjM5LjI2NSAzMzUuMDAxIDIzNC44MjggMzI5LjUxMSAyMzQuODI4SDkwLjk0MDRDODUuNDUwNSAyMzQuODI4IDgxIDIzOS4yNjUgODEgMjQ0LjczOVYyNzEuNTNDODEuMjE3NSAyNzEuMzg1IDgxLjQzODMgMjcxLjI0NSA4MS42NjI0IDI3MS4xMDlDODMuODMyNSAyNjkuNzk0IDg2LjMwNTQgMjY4LjkyNyA4OC45NTIzIDI2OC42MzVDODkuNjA1MSAyNjguNTYzIDkwLjI2ODQgMjY4LjUyNiA5MC45NDA0IDI2OC41MjZIMzI5LjUxMUMzMzAuMTgzIDI2OC41MjYgMzMwLjg0NiAyNjguNTYzIDMzMS40OTggMjY4LjYzNUMzMzQuNDE5IDI2OC45NTcgMzM3LjEyOCAyNjkuOTggMzM5LjQ1MiAyNzEuNTNWMjQ0LjczOVpNMzM5LjQ1MiAyODYuMzY2QzMzOS40NTIgMjgxLjAyMSAzMzUuMjA2IDI3Ni42NjMgMzI5Ljg5MyAyNzYuNDYyQzMyOS43NjcgMjc2LjQ1NyAzMjkuNjQgMjc2LjQ1NSAzMjkuNTExIDI3Ni40NTVIOTAuOTQwNEM4NS40NTA1IDI3Ni40NTUgODEgMjgwLjg5MyA4MSAyODYuMzY2VjMwNi4xODhDODEgMzExLjY2MiA4NS40NTA1IDMxNi4xMDEgOTAuOTQwNCAzMTYuMTAxSDMyOS41MTFDMzM1LjAwMSAzMTYuMTAxIDMzOS40NTIgMzExLjY2MiAzMzkuNDUyIDMwNi4xODhWMjg2LjM2NloiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPgo8cGF0aCBvcGFjaXR5PSIwLjMiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOTguMDE0NiAxMDRDODguNjE3NyAxMDQgODEgMTExLjU5NSA4MSAxMjAuOTY1VjE4OC4yNzZDODMuODQzMiAxODYuMzc5IDg3LjI2MjIgMTg1LjI3MiA5MC45NDA0IDE4NS4yNzJIMzI5LjUxMUMzMzMuMTg4IDE4NS4yNzIgMzM2LjYwOCAxODYuMzc5IDMzOS40NTIgMTg4LjI3NlYxMjAuOTY1QzMzOS40NTIgMTExLjU5NSAzMzEuODMzIDEwNCAzMjIuNDM3IDEwNEg5OC4wMTQ2Wk0zMzkuNDUyIDIwMy4xMTJDMzM5LjQ1MiAxOTcuNjM4IDMzNS4wMDEgMTkzLjIwMSAzMjkuNTExIDE5My4yMDFIOTAuOTQwNEM4NS40NTA1IDE5My4yMDEgODEgMTk3LjYzOCA4MSAyMDMuMTEyVjIyOS45MDNDODEuMjE3NSAyMjkuNzU4IDgxLjQzODMgMjI5LjYxOCA4MS42NjI0IDIyOS40ODJDODMuODMyNSAyMjguMTY3IDg2LjMwNTQgMjI3LjMgODguOTUyMyAyMjcuMDA4Qzg5LjYwNTEgMjI2LjkzNiA5MC4yNjg0IDIyNi44OTkgOTAuOTQwNCAyMjYuODk5SDMyOS41MTFDMzMwLjE4MyAyMjYuODk5IDMzMC44NDYgMjI2LjkzNiAzMzEuNDk4IDIyNy4wMDhDMzM0LjQxOSAyMjcuMzMgMzM3LjEyOCAyMjguMzUyIDMzOS40NTIgMjI5LjkwM1YyMDMuMTEyWk0zMzkuNDUyIDI0NC43MzlDMzM5LjQ1MiAyMzkuMzkzIDMzNS4yMDYgMjM1LjAzNiAzMjkuODkzIDIzNC44MzVDMzI5Ljc2NyAyMzQuODMgMzI5LjY0IDIzNC44MjggMzI5LjUxMSAyMzQuODI4SDkwLjk0MDRDODUuNDUwNSAyMzQuODI4IDgxIDIzOS4yNjUgODEgMjQ0LjczOVYyNzEuNTNMODEuMDcwNyAyNzEuNDgzQzgxLjI2NTMgMjcxLjM1NSA4MS40NjI1IDI3MS4yMyA4MS42NjI0IDI3MS4xMDlDODEuOTA4MyAyNzAuOTYgODIuMTU4MSAyNzAuODE3IDgyLjQxMTcgMjcwLjY3OUM4NC4zOTUzIDI2OS42MDUgODYuNjA1NCAyNjguODk0IDg4Ljk1MjMgMjY4LjYzNUM4OS4wMDUyIDI2OC42MjkgODkuMDU4IDI2OC42MjQgODkuMTExIDI2OC42MThDODkuNzEyNSAyNjguNTU3IDkwLjMyMjggMjY4LjUyNiA5MC45NDA0IDI2OC41MjZIMzI5LjUxMUMzMjkuNzM4IDI2OC41MjYgMzI5Ljk2NSAyNjguNTMgMzMwLjE5MiAyNjguNTM5QzMzMC42MzEgMjY4LjU1NSAzMzEuMDY3IDI2OC41ODcgMzMxLjQ5OCAyNjguNjM1QzMzNC40MTkgMjY4Ljk1NyAzMzcuMTI4IDI2OS45OCAzMzkuNDUyIDI3MS41M1YyNDQuNzM5Wk0zMzkuNDUyIDI4Ni4zNjZDMzM5LjQ1MiAyODEuMDIxIDMzNS4yMDYgMjc2LjY2MyAzMjkuODkzIDI3Ni40NjJMMzI5Ljg2NSAyNzYuNDYxQzMyOS43NDggMjc2LjQ1NyAzMjkuNjI5IDI3Ni40NTUgMzI5LjUxMSAyNzYuNDU1SDkwLjk0MDRDODUuNDUwNSAyNzYuNDU1IDgxIDI4MC44OTMgODEgMjg2LjM2NlYzMDYuMTg4QzgxIDMxMS42NjIgODUuNDUwNSAzMTYuMTAxIDkwLjk0MDQgMzE2LjEwMUgzMjkuNTExQzMzNS4wMDEgMzE2LjEwMSAzMzkuNDUyIDMxMS42NjIgMzM5LjQ1MiAzMDYuMTg4VjI4Ni4zNjZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjY5Ljg2OCAxMzEuNzUyQzI2OS44NjggMTI2LjI3OCAyNzQuMzE4IDEyMS44NCAyNzkuODA4IDEyMS44NEgzMTEuNjE4QzMxNy4xMDggMTIxLjg0IDMyMS41NTggMTI2LjI3OCAzMjEuNTU4IDEzMS43NTJWMTYxLjQ4NUMzMjEuNTU4IDE2Ni45NTkgMzE3LjEwOCAxNzEuMzk2IDMxMS42MTggMTcxLjM5NkgyNzkuODA4QzI3NC4zMTggMTcxLjM5NiAyNjkuODY4IDE2Ni45NTkgMjY5Ljg2OCAxNjEuNDg1VjEzMS43NTJaIiBmaWxsPSJ3aGl0ZSIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzFfMTUiPgo8cmVjdCB3aWR0aD0iMjU5IiBoZWlnaHQ9IjIxMyIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDgxIDEwNCkiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K",
      id: "xyz.ithaca.porto",
      async isAuthorized() {
        try {
          const accounts = await withRetry(() => this.getAccounts());
          return !!accounts.length;
        } catch {
          return false;
        }
      },
      name: "Porto",
      async onAccountsChanged(accounts) {
        wagmiConfig.emitter.emit("change", {
          accounts: accounts.map((x) => getAddress(x))
        });
      },
      onChainChanged(chain) {
        const chainId = Number(chain);
        wagmiConfig.emitter.emit("change", { chainId });
      },
      async onConnect(connectInfo) {
        const accounts = await this.getAccounts();
        if (accounts.length === 0)
          return;
        const chainId = Number(connectInfo.chainId);
        wagmiConfig.emitter.emit("connect", { accounts, chainId });
        const provider = await this.getProvider();
        if (supportsEvents(provider)) {
          if (connect) {
            provider.removeListener("connect", connect);
            connect = void 0;
          }
          if (!accountsChanged) {
            accountsChanged = this.onAccountsChanged.bind(this);
            provider.on("accountsChanged", accountsChanged);
          }
          if (!chainChanged) {
            chainChanged = this.onChainChanged.bind(this);
            provider.on("chainChanged", chainChanged);
          }
          if (!disconnect) {
            disconnect = this.onDisconnect.bind(this);
            provider.on("disconnect", disconnect);
          }
        }
      },
      async onDisconnect(_error) {
        const provider = await this.getProvider();
        wagmiConfig.emitter.emit("disconnect");
        if (supportsEvents(provider)) {
          if (chainChanged) {
            provider.removeListener("chainChanged", chainChanged);
            chainChanged = void 0;
          }
          if (disconnect) {
            provider.removeListener("disconnect", disconnect);
            disconnect = void 0;
          }
          if (!connect) {
            connect = this.onConnect.bind(this);
            provider.on("connect", connect);
          }
        }
      },
      async setup() {
        if (!connect) {
          const provider = await this.getProvider();
          if (!supportsEvents(provider))
            return;
          connect = this.onConnect.bind(this);
          provider.on("connect", connect);
        }
      },
      async switchChain({ chainId }) {
        const chain = chains.find((x) => x.id === chainId);
        if (!chain)
          throw new SwitchChainError(new ChainNotConfiguredError());
        const provider = await this.getProvider();
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: numberToHex(chainId) }]
        });
        return chain;
      },
      type: "injected"
    };
  });
}
safe.type = "safe";
function safe(parameters = {}) {
  const { shimDisconnect = false } = parameters;
  let provider_;
  let disconnect;
  return createConnector((config) => ({
    id: "safe",
    name: "Safe",
    type: safe.type,
    async connect({ withCapabilities } = {}) {
      var _a;
      const provider = await this.getProvider();
      if (!provider)
        throw new ProviderNotFoundError();
      const accounts = await this.getAccounts();
      const chainId = await this.getChainId();
      if (!disconnect) {
        disconnect = this.onDisconnect.bind(this);
        provider.on("disconnect", disconnect);
      }
      if (shimDisconnect)
        await ((_a = config.storage) == null ? void 0 : _a.removeItem("safe.disconnected"));
      return {
        // TODO(v3): Make `withCapabilities: true` default behavior
        accounts: withCapabilities ? accounts.map((address) => ({ address, capabilities: {} })) : accounts,
        chainId
      };
    },
    async disconnect() {
      var _a;
      const provider = await this.getProvider();
      if (!provider)
        throw new ProviderNotFoundError();
      if (disconnect) {
        provider.removeListener("disconnect", disconnect);
        disconnect = void 0;
      }
      if (shimDisconnect)
        await ((_a = config.storage) == null ? void 0 : _a.setItem("safe.disconnected", true));
    },
    async getAccounts() {
      const provider = await this.getProvider();
      if (!provider)
        throw new ProviderNotFoundError();
      return (await provider.request({ method: "eth_accounts" })).map(getAddress);
    },
    async getProvider() {
      const isIframe = typeof window !== "undefined" && (window == null ? void 0 : window.parent) !== window;
      if (!isIframe)
        return;
      if (!provider_) {
        const { default: SDK } = await (() => {
          try {
            return __vitePreload(() => import("./index-CsGEH84p.js"), true ? __vite__mapDeps([6,7,2,3]) : void 0);
          } catch {
            throw new Error('dependency "@safe-global/safe-apps-sdk" not found');
          }
        })();
        const sdk = new SDK(parameters);
        const safe2 = await withTimeout(() => sdk.safe.getInfo(), {
          timeout: parameters.unstable_getInfoTimeout ?? 10
        });
        if (!safe2)
          throw new Error("Could not load Safe information");
        const SafeAppProvider = await (async () => {
          const Provider = await (() => {
            try {
              return __vitePreload(() => import("./index-T2Pqjeq7.js").then((n) => n.i), true ? __vite__mapDeps([8,2,3,7,9,4,10,11]) : void 0);
            } catch {
              throw new Error('dependency "@safe-global/safe-apps-provider" not found');
            }
          })();
          if (typeof Provider.SafeAppProvider !== "function" && typeof Provider.default.SafeAppProvider === "function")
            return Provider.default.SafeAppProvider;
          return Provider.SafeAppProvider;
        })();
        provider_ = new SafeAppProvider(safe2, sdk);
      }
      return provider_;
    },
    async getChainId() {
      const provider = await this.getProvider();
      if (!provider)
        throw new ProviderNotFoundError();
      return Number(provider.chainId);
    },
    async isAuthorized() {
      var _a;
      try {
        const isDisconnected = shimDisconnect && // If shim exists in storage, connector is disconnected
        await ((_a = config.storage) == null ? void 0 : _a.getItem("safe.disconnected"));
        if (isDisconnected)
          return false;
        const accounts = await this.getAccounts();
        return !!accounts.length;
      } catch {
        return false;
      }
    },
    onAccountsChanged() {
    },
    onChainChanged() {
    },
    onDisconnect() {
      config.emitter.emit("disconnect");
    }
  }));
}
const version = "8.0.4";
walletConnect.type = "walletConnect";
function walletConnect(parameters) {
  const isNewChainsStale = parameters.isNewChainsStale ?? true;
  let provider_;
  let providerPromise;
  const NAMESPACE = "eip155";
  let accountsChanged;
  let chainChanged;
  let connect;
  let displayUri;
  let sessionDelete;
  let disconnect;
  return createConnector((config) => ({
    id: "walletConnect",
    name: "WalletConnect",
    type: walletConnect.type,
    async setup() {
      const provider = await this.getProvider().catch(() => null);
      if (!provider)
        return;
      if (!connect) {
        connect = this.onConnect.bind(this);
        provider.on("connect", connect);
      }
      if (!sessionDelete) {
        sessionDelete = this.onSessionDelete.bind(this);
        provider.on("session_delete", sessionDelete);
      }
    },
    async connect({ chainId, withCapabilities, ...rest } = {}) {
      var _a, _b;
      try {
        const provider = await this.getProvider();
        if (!provider)
          throw new ProviderNotFoundError();
        if (!displayUri) {
          displayUri = this.onDisplayUri;
          provider.on("display_uri", displayUri);
        }
        let targetChainId = chainId;
        if (!targetChainId) {
          const state = await ((_a = config.storage) == null ? void 0 : _a.getItem("state")) ?? {};
          const isChainSupported = config.chains.some((x) => x.id === state.chainId);
          if (isChainSupported)
            targetChainId = state.chainId;
          else
            targetChainId = (_b = config.chains[0]) == null ? void 0 : _b.id;
        }
        if (!targetChainId)
          throw new Error("No chains found on connector.");
        const isChainsStale = await this.isChainsStale();
        if (provider.session && isChainsStale)
          await provider.disconnect();
        if (!provider.session || isChainsStale) {
          const optionalChains = config.chains.filter((chain) => chain.id !== targetChainId).map((optionalChain) => optionalChain.id);
          await provider.connect({
            optionalChains: [targetChainId, ...optionalChains],
            ..."pairingTopic" in rest ? { pairingTopic: rest.pairingTopic } : {}
          });
          this.setRequestedChainsIds(config.chains.map((x) => x.id));
        }
        const accounts = (await provider.enable()).map((x) => getAddress(x));
        let currentChainId = await this.getChainId();
        if (chainId && currentChainId !== chainId) {
          const chain = await this.switchChain({ chainId }).catch((error) => {
            var _a2;
            if (error.code === UserRejectedRequestError.code && ((_a2 = error.cause) == null ? void 0 : _a2.message) !== "Missing or invalid. request() method: wallet_addEthereumChain")
              throw error;
            return { id: currentChainId };
          });
          currentChainId = (chain == null ? void 0 : chain.id) ?? currentChainId;
        }
        if (displayUri) {
          provider.removeListener("display_uri", displayUri);
          displayUri = void 0;
        }
        if (connect) {
          provider.removeListener("connect", connect);
          connect = void 0;
        }
        if (!accountsChanged) {
          accountsChanged = this.onAccountsChanged.bind(this);
          provider.on("accountsChanged", accountsChanged);
        }
        if (!chainChanged) {
          chainChanged = this.onChainChanged.bind(this);
          provider.on("chainChanged", chainChanged);
        }
        if (!disconnect) {
          disconnect = this.onDisconnect.bind(this);
          provider.on("disconnect", disconnect);
        }
        if (!sessionDelete) {
          sessionDelete = this.onSessionDelete.bind(this);
          provider.on("session_delete", sessionDelete);
        }
        return {
          accounts: withCapabilities ? accounts.map((address) => ({ address, capabilities: {} })) : accounts,
          chainId: currentChainId
        };
      } catch (error) {
        if (/(user rejected|connection request reset)/i.test(error == null ? void 0 : error.message)) {
          throw new UserRejectedRequestError(error);
        }
        throw error;
      }
    },
    async disconnect() {
      const provider = await this.getProvider();
      try {
        await (provider == null ? void 0 : provider.disconnect());
      } catch (error) {
        if (!/No matching key/i.test(error.message))
          throw error;
      } finally {
        if (chainChanged) {
          provider == null ? void 0 : provider.removeListener("chainChanged", chainChanged);
          chainChanged = void 0;
        }
        if (disconnect) {
          provider == null ? void 0 : provider.removeListener("disconnect", disconnect);
          disconnect = void 0;
        }
        if (!connect) {
          connect = this.onConnect.bind(this);
          provider == null ? void 0 : provider.on("connect", connect);
        }
        if (accountsChanged) {
          provider == null ? void 0 : provider.removeListener("accountsChanged", accountsChanged);
          accountsChanged = void 0;
        }
        if (sessionDelete) {
          provider == null ? void 0 : provider.removeListener("session_delete", sessionDelete);
          sessionDelete = void 0;
        }
        this.setRequestedChainsIds([]);
      }
    },
    async getAccounts() {
      const provider = await this.getProvider();
      return provider.accounts.map((x) => getAddress(x));
    },
    async getProvider({ chainId } = {}) {
      var _a;
      async function initProvider() {
        const optionalChains = config.chains.map((x) => x.id);
        if (!optionalChains.length)
          return;
        const { EthereumProvider } = await (() => {
          try {
            return __vitePreload(() => import("./index.es-DBnbDE_G.js"), true ? __vite__mapDeps([12,2,3]) : void 0);
          } catch {
            throw new Error('dependency "@walletconnect/ethereum-provider" not found');
          }
        })();
        return await EthereumProvider.init({
          ...parameters,
          disableProviderPing: true,
          optionalChains,
          projectId: parameters.projectId,
          rpcMap: Object.fromEntries(config.chains.map((chain) => {
            const [url] = extractRpcUrls({
              chain,
              transports: config.transports
            });
            return [chain.id, url];
          })),
          showQrModal: parameters.showQrModal ?? true
        });
      }
      if (!provider_) {
        if (!providerPromise)
          providerPromise = initProvider();
        provider_ = await providerPromise;
        provider_ == null ? void 0 : provider_.events.setMaxListeners(Number.POSITIVE_INFINITY);
      }
      if (chainId)
        await ((_a = this.switchChain) == null ? void 0 : _a.call(this, { chainId }));
      return provider_;
    },
    async getChainId() {
      const provider = await this.getProvider();
      return provider.chainId;
    },
    async isAuthorized() {
      try {
        const [accounts, provider] = await Promise.all([
          this.getAccounts(),
          this.getProvider()
        ]);
        if (!accounts.length)
          return false;
        const isChainsStale = await this.isChainsStale();
        if (isChainsStale && provider.session) {
          await provider.disconnect().catch(() => {
          });
          return false;
        }
        return true;
      } catch {
        return false;
      }
    },
    async switchChain({ addEthereumChainParameter, chainId }) {
      var _a, _b, _c;
      const provider = await this.getProvider();
      if (!provider)
        throw new ProviderNotFoundError();
      const chain = config.chains.find((x) => x.id === chainId);
      if (!chain)
        throw new SwitchChainError(new ChainNotConfiguredError());
      let listener = () => {
      };
      try {
        await Promise.all([
          new Promise((resolve) => {
            listener = (opts) => {
              if (opts.chainId === chainId) {
                config.emitter.off("change", listener);
                resolve();
              }
            };
            config.emitter.on("change", listener);
          }),
          provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: numberToHex(chainId) }]
          })
        ]);
        const requestedChains = await this.getRequestedChainsIds();
        this.setRequestedChainsIds([...requestedChains, chainId]);
        return chain;
      } catch (err) {
        config.emitter.off("change", listener);
        const error = err;
        if (/(user rejected)/i.test(error.message))
          throw new UserRejectedRequestError(error);
        try {
          let blockExplorerUrls;
          if (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.blockExplorerUrls)
            blockExplorerUrls = addEthereumChainParameter.blockExplorerUrls;
          else
            blockExplorerUrls = ((_a = chain.blockExplorers) == null ? void 0 : _a.default.url) ? [(_b = chain.blockExplorers) == null ? void 0 : _b.default.url] : [];
          let rpcUrls;
          if ((_c = addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.rpcUrls) == null ? void 0 : _c.length)
            rpcUrls = addEthereumChainParameter.rpcUrls;
          else
            rpcUrls = [...chain.rpcUrls.default.http];
          const addEthereumChain = {
            blockExplorerUrls,
            chainId: numberToHex(chainId),
            chainName: (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.chainName) ?? chain.name,
            iconUrls: addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.iconUrls,
            nativeCurrency: (addEthereumChainParameter == null ? void 0 : addEthereumChainParameter.nativeCurrency) ?? chain.nativeCurrency,
            rpcUrls
          };
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [addEthereumChain]
          });
          const requestedChains = await this.getRequestedChainsIds();
          this.setRequestedChainsIds([...requestedChains, chainId]);
          return chain;
        } catch (error2) {
          throw new UserRejectedRequestError(error2);
        }
      }
    },
    onAccountsChanged(accounts) {
      if (accounts.length === 0)
        this.onDisconnect();
      else
        config.emitter.emit("change", {
          accounts: accounts.map((x) => getAddress(x))
        });
    },
    onChainChanged(chain) {
      const chainId = Number(chain);
      config.emitter.emit("change", { chainId });
    },
    async onConnect(connectInfo) {
      const chainId = Number(connectInfo.chainId);
      const accounts = await this.getAccounts();
      config.emitter.emit("connect", { accounts, chainId });
    },
    async onDisconnect(_error) {
      this.setRequestedChainsIds([]);
      config.emitter.emit("disconnect");
      const provider = await this.getProvider();
      if (accountsChanged) {
        provider.removeListener("accountsChanged", accountsChanged);
        accountsChanged = void 0;
      }
      if (chainChanged) {
        provider.removeListener("chainChanged", chainChanged);
        chainChanged = void 0;
      }
      if (disconnect) {
        provider.removeListener("disconnect", disconnect);
        disconnect = void 0;
      }
      if (sessionDelete) {
        provider.removeListener("session_delete", sessionDelete);
        sessionDelete = void 0;
      }
      if (!connect) {
        connect = this.onConnect.bind(this);
        provider.on("connect", connect);
      }
    },
    onDisplayUri(uri) {
      config.emitter.emit("message", { type: "display_uri", data: uri });
    },
    onSessionDelete() {
      this.onDisconnect();
    },
    getNamespaceChainsIds() {
      var _a, _b, _c;
      if (!provider_)
        return [];
      const chainIds = (_c = (_b = (_a = provider_.session) == null ? void 0 : _a.namespaces[NAMESPACE]) == null ? void 0 : _b.accounts) == null ? void 0 : _c.map((account) => Number.parseInt(account.split(":")[1] || "", 10));
      return chainIds ?? [];
    },
    async getRequestedChainsIds() {
      var _a;
      return await ((_a = config.storage) == null ? void 0 : _a.getItem(this.requestedChainsStorageKey)) ?? [];
    },
    /**
     * Checks if the target chains match the chains that were
     * initially requested by the connector for the WalletConnect session.
     * If there is a mismatch, this means that the chains on the connector
     * are considered stale, and need to be revalidated at a later point (via
     * connection).
     *
     * There may be a scenario where a dapp adds a chain to the
     * connector later on, however, this chain will not have been approved or rejected
     * by the wallet. In this case, the chain is considered stale.
     */
    async isChainsStale() {
      if (!isNewChainsStale)
        return false;
      const connectorChains = config.chains.map((x) => x.id);
      const namespaceChains = this.getNamespaceChainsIds();
      if (namespaceChains.length && !namespaceChains.some((id) => connectorChains.includes(id)))
        return false;
      const requestedChains = await this.getRequestedChainsIds();
      return !connectorChains.every((id) => requestedChains.includes(id));
    },
    async setRequestedChainsIds(chains) {
      var _a;
      await ((_a = config.storage) == null ? void 0 : _a.setItem(this.requestedChainsStorageKey, chains));
    },
    get requestedChainsStorageKey() {
      return `${this.id}.requestedChains`;
    }
  }));
}
export {
  baseAccount,
  coinbaseWallet,
  bH as injected,
  metaMask,
  mock,
  porto,
  safe,
  tempoWallet,
  version,
  walletConnect
};
