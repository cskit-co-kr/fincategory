import axios from "axios";

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
    const response = await axios.post(`/api/transaction-list`, {
      userId: userid,
      page: page,
    });
    const result = await response.data;
    return result;
  }

  async transactionListPurchase(userid: number | undefined, page: number) {
    const response = await axios.post(`/api/transaction-list-purchase`, {
      userId: userid,
      page: page,
    });
    const result = await response.data;
    return result;
  }

  async saveAdsPurchase(body: any) {
    const response = await axios.post(`/api/save-ads-purchase`, body);
    const result = await response.data;
    return result;
  }

  async getAds1() {
    const response = await axios.get(`/api/get-ads1`);
    const result = await response.data;
    return result;
  }

  async getAds2() {
    const response = await axios.get(`/api/get-ads2`);
    const result = await response.data;
    return result;
  }

  async updateCategory(channel_id: string, category_id: string) {
    const response = await axios.post(`/api/update-category`, {
      channel_id: channel_id,
      category_id: category_id,
    });
    const result = await response.data;
    return result;
  }

  async updateLanguage(channel_id: string, language_id: string) {
    const response = await axios.post(`/api/update-language`, {
      channel_id: channel_id,
      language_id: language_id,
    });
    const result = await response.data;
    return result;
  }
}

const apiService = new ApiService();

export default apiService;
