import { IBasketData, TBasketProductInfo } from '../types';
import { IEvents } from './base/events';

export class BasketData implements IBasketData {
	protected _items: TBasketProductInfo[];
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
		this._items = [];
	}

	get items() {
		return this._items;
	}

	getTotal(): number {
		return this._items.reduce((total, item) => total + item.price, 0);
	}

	containsItem(id: string): boolean {
		return this._items.some((item) => item.id === id);
	}

	addItem(item: TBasketProductInfo): void {
		this._items.push(item);
		this.events.emit('basketProducts:changed');
	}

	removeItem(id: string): void {
		this._items = this._items.filter((item) => item.id !== id);
		this.events.emit('basketProducts:changed');
	}

	clear(): void {
		this._items = [];
	}
}
