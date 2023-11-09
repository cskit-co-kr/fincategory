import axios from 'axios';

export class ApiService {
  async getWallet(userid: number | undefined) {
    const response = await axios.post(`/api/get-wallet`, { userid: userid });
    const result = await response.data;
    return result;
  }

  async savePurchaseTransaction(body: any) {
    const response = await axios.post(`/api/save-purchase-transaction`, body);
    const result = await response.data;
    return result;
  }

  async transactionListUser(userid: number | undefined, page: number) {
    const response = await axios.post(`/api/transaction-list`, { userId: userid, page: page });
    const result = await response.data;
    return result;
  }

  async saveAdsPurchase(body: any) {
    const response = await axios.post(`/api/save-ads-purchase`, body);
    const result = await response.data;
    return result;
  }
}

const apiService = new ApiService();

export default apiService;
