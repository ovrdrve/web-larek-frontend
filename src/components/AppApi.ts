import { IOrder, IProduct } from '../types';
import { Api } from './base/api';

export class AppApi extends Api {
	protected cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);

		this.cdn = cdn;
	}

	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then(
			(res: { total: number; items: IProduct[] }) =>
				res.items.map((product) => ({
					...product,
					image: this.cdn + product.image,
				}))
		);
	}

	getProduct(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((product: IProduct) => ({
			...product,
			image: this.cdn + product.image,
		}));
	}

	postOrder(order: IOrder): Promise<IOrder> {
		return this.post('/order', order).then((order: IOrder) => order);
	}
}
