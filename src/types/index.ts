export type TPayment = 'card' | 'cash';
export type TCategory =
	| 'софт-скил'
	| 'хард-скил'
	| 'кнопка'
	| 'дополнительно'
	| 'другое';

export interface IOrder {
	payment: TPayment;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: TCategory;
	price: number | null;
}

export interface IProductsData {
	items: IProduct[];
	preview: string | null;
}

export interface IBasketData {
	items: TBasketProductInfo[];
	getTotal(): number;
	containsItem(id: string): boolean;
	addItem(item: TBasketProductInfo): void;
	removeItem(id: string): void;
}

export interface IOrderData {
	getOrder(): IOrder;
	setOrderTotal(data: TOrderTotal): void;
	setContactsField(field: keyof TOrderContacts, value: string): void;
	setDetailsField(field: keyof TOrderDetails, value: string & TPayment): void
}

export type TBasketProductInfo = Pick<IProduct, 'id' | 'title' | 'price'> & {
	index: number;
};

export type TGalleryProductInfo = Omit<IProduct, 'description'>;

export type TPreviewProductInfo = IProduct & { isBtnDisabled: boolean };

export type TOrderTotal = Pick<IOrder, 'items' | 'total'>;

export type TOrderDetails = Pick<IOrder, 'address' | 'payment'>;

export type TOrderContacts = Pick<IOrder, 'email' | 'phone'>;

export interface IPage {
	counter: number;
	gallery: TGalleryProductInfo[];
	pageLock(value: boolean): void;
}

export interface IModal {
	content: HTMLElement;
}

export interface IBasket {
	items: TBasketProductInfo[];
	total: number;
}

export interface IForm {
	valid: boolean;
	error: string;
}

export interface ISuccess {
	total: number;
}
