
import { Client, Order, OrderStatus, Worker, ProductPrice, AgencySettings } from '../types';
import { INITIAL_CLIENTS, INITIAL_ORDERS } from '../constants';

const KEYS = {
  CLIENTS: 'jg_secure_clients_v2',
  ORDERS: 'jg_secure_orders_v2',
  WORKERS: 'jg_secure_workers_v2',
  PRICES: 'jg_secure_prices_v2',
  AGENCY: 'jg_agency_settings_v2',
};

// Secret key for a bit of extra obfuscation
const SECRET_SALT = 'JaguarGraphic_Secure_2024_@!';

const encrypt = (data: string): string => {
  const json = data;
  const encoded = btoa(unescape(encodeURIComponent(json)));
  return encoded.split('').reverse().join('') + "==";
};

const decrypt = (encodedData: string): string => {
  try {
    if (!encodedData) return '';
    const actualData = encodedData.slice(0, -2).split('').reverse().join('');
    return decodeURIComponent(escape(atob(actualData)));
  } catch (e) {
    console.error("Decryption failed", e);
    return '';
  }
};

const DEFAULT_AGENCY: AgencySettings = {
  name: 'JAGUAR GRAPHIC',
  description: 'وكالة الطباعة والإعلان الاحترافية',
  phone: '0672383396',
  email: 'contact@jaguargraphic.dz',
  address: 'الجزائر',
  logoUrl: 'https://i.ibb.co/60Md0hTy/jg.png'
};

export const storageService = {
  getEncryptedItem: (key: string) => {
    const data = localStorage.getItem(key);
    if (!data) return null;
    const decrypted = decrypt(data);
    return decrypted ? JSON.parse(decrypted) : null;
  },

  setEncryptedItem: (key: string, data: any) => {
    const json = JSON.stringify(data);
    const encrypted = encrypt(json);
    localStorage.setItem(key, encrypted);
  },

  // Agency Settings
  getAgencySettings: (): AgencySettings => {
    const data = storageService.getEncryptedItem(KEYS.AGENCY);
    return data || DEFAULT_AGENCY;
  },

  saveAgencySettings: (settings: AgencySettings) => {
    storageService.setEncryptedItem(KEYS.AGENCY, settings);
  },

  // Clients
  getClients: (): Client[] => {
    const data = storageService.getEncryptedItem(KEYS.CLIENTS);
    if (!data) {
      storageService.setEncryptedItem(KEYS.CLIENTS, INITIAL_CLIENTS);
      return INITIAL_CLIENTS;
    }
    return data;
  },

  saveClient: (client: Client) => {
    const clients = storageService.getClients();
    const existingIndex = clients.findIndex(c => c.id === client.id);
    if (existingIndex > -1) {
      clients[existingIndex] = client;
    } else {
      clients.push(client);
    }
    storageService.setEncryptedItem(KEYS.CLIENTS, clients);
  },

  updateClientPin: (clientId: string, newPin: string): boolean => {
    const clients = storageService.getClients();
    const index = clients.findIndex(c => c.id === clientId);
    if (index > -1) {
      clients[index].pin = newPin;
      storageService.setEncryptedItem(KEYS.CLIENTS, clients);
      return true;
    }
    return false;
  },

  deleteClient: (id: string) => {
    const clients = storageService.getClients().filter(c => c.id !== id);
    storageService.setEncryptedItem(KEYS.CLIENTS, clients);
  },

  // Workers
  getWorkers: (): Worker[] => {
    const data = storageService.getEncryptedItem(KEYS.WORKERS);
    return data || [];
  },

  saveWorker: (worker: Worker) => {
    const workers = storageService.getWorkers();
    const existingIndex = workers.findIndex(w => w.id === worker.id);
    if (existingIndex > -1) {
      workers[existingIndex] = worker;
    } else {
      workers.push(worker);
    }
    storageService.setEncryptedItem(KEYS.WORKERS, workers);
  },

  updateWorkerPin: (workerId: string, newPin: string): boolean => {
    const workers = storageService.getWorkers();
    const index = workers.findIndex(w => w.id === workerId);
    if (index > -1) {
      workers[index].pin = newPin;
      storageService.setEncryptedItem(KEYS.WORKERS, workers);
      return true;
    }
    return false;
  },

  deleteWorker: (id: string) => {
    const workers = storageService.getWorkers().filter(w => w.id !== id);
    storageService.setEncryptedItem(KEYS.WORKERS, workers);
  },

  // Prices
  getProductPrices: (): ProductPrice[] => {
    const data = storageService.getEncryptedItem(KEYS.PRICES);
    return data || [];
  },

  saveProductPrice: (product: ProductPrice) => {
    const products = storageService.getProductPrices();
    const existingIndex = products.findIndex(p => p.id === product.id);
    if (existingIndex > -1) {
      products[existingIndex] = product;
    } else {
      products.push(product);
    }
    storageService.setEncryptedItem(KEYS.PRICES, products);
  },

  deleteProductPrice: (id: string) => {
    const products = storageService.getProductPrices().filter(p => p.id !== id);
    storageService.setEncryptedItem(KEYS.PRICES, products);
  },

  // Orders
  getOrders: (): Order[] => {
    const data = storageService.getEncryptedItem(KEYS.ORDERS);
    if (!data) {
      storageService.setEncryptedItem(KEYS.ORDERS, INITIAL_ORDERS);
      return INITIAL_ORDERS;
    }
    return data;
  },

  saveOrder: (order: Order) => {
    const orders = storageService.getOrders();
    const existingIndex = orders.findIndex(o => o.id === order.id);
    if (existingIndex > -1) {
      orders[existingIndex] = order;
    } else {
      orders.push(order);
    }
    storageService.setEncryptedItem(KEYS.ORDERS, orders);
  },

  updateOrderStatus: (orderId: string, status: OrderStatus) => {
    const orders = storageService.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      storageService.setEncryptedItem(KEYS.ORDERS, orders);
    }
  },

  deleteOrder: (id: string) => {
    const orders = storageService.getOrders().filter(o => o.id !== id);
    storageService.setEncryptedItem(KEYS.ORDERS, orders);
  },

  exportData: () => {
    const data = {
      clients: storageService.getClients(),
      orders: storageService.getOrders(),
      workers: storageService.getWorkers(),
      prices: storageService.getProductPrices(),
      agency: storageService.getAgencySettings(),
      exportDate: new Date().toISOString(),
      version: '2.7-dynamic-agency'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jaguar_full_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  importData: (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.clients && parsed.orders) {
        storageService.setEncryptedItem(KEYS.CLIENTS, parsed.clients);
        storageService.setEncryptedItem(KEYS.ORDERS, parsed.orders);
        if (parsed.workers) storageService.setEncryptedItem(KEYS.WORKERS, parsed.workers);
        if (parsed.prices) storageService.setEncryptedItem(KEYS.PRICES, parsed.prices);
        if (parsed.agency) storageService.setEncryptedItem(KEYS.AGENCY, parsed.agency);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
};
