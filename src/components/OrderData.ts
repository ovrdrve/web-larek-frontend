import {
	IOrder,
	IOrderData,
	TPayment,
	TOrderTotal,
	TOrderDetails,
	TOrderContacts,
} from '../types';
import { IEvents } from './base/events';

export class OrderData implements IOrderData {
	protected payment: TPayment;
	protected email: string;
	protected phone: string;
	protected address: string;
	protected total: number;
	protected items: string[];
	protected error: string;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	getOrder(): IOrder {
		return {
			payment: this.payment,
			email: this.email,
			phone: this.phone,
			address: this.address,
			total: this.total,
			items: this.items,
		};
	}

	setOrderTotal(data: TOrderTotal): void {
		this.items = data.items;
		this.total = data.total;
	}

	setContactsField(field: keyof TOrderContacts, value: string): void {
		this[field] = value;
		this.isContactsValid();
	}

	setDetailsField(field: keyof TOrderDetails, value: string & TPayment): void {
		this[field] = value;
		this.isDetailsValid();
	}

	isContactsValid() {
		if (!this.email || !this.phone) {
			this.error = 'Необходимо заполнить поля';
		} else {
			this.error = '';
		}
		this.events.emit('validation.contacts:changed', { error: this.error });
	}

	isDetailsValid() {
		if (!this.payment || !this.address) {
			this.error = 'Необходимо заполнить поля';
		} else {
			this.error = '';
		}
		this.events.emit('validation.order:changed', { error: this.error });
	}
}
