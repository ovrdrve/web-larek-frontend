import { IProductsData, IProduct } from '../types';
import { IEvents } from './base/events';

export class ProductsData implements IProductsData {
	protected _items: IProduct[];
	protected _preview: string | null;
	protected events: IEvents;

	constructor(events: IEvents) {
		this._items = [];
		this.events = events;
	}

	set items(products: IProduct[]) {
		this._items = products;
		this.events.emit('products:changed');
	}

	get items() {
		return this._items;
	}

	set preview(id: string) {
		this._preview = id;
		const product = this._items.find((item) => item.id === id);
		this.events.emit('product:selected', product);
	}
}
