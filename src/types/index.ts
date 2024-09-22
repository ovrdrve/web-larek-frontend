type TPayment = 'online' | 'cash';
type TCategory =
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
	total: number | null;
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
	addItem(item: TBasketProductInfo): void;
	removeItem(id: string): void;
}

export interface IOrderData {
	getOrder(): IOrder;
	setOrderTotal(orderTotalData: TOrderTotal): void;
	setOrderDetails(detailsData: TOrderDetails): void;
	setOrderContacts(contactsData: TOrderContacts): void;
}

export type TBasketProductInfo = Pick<IProduct, 'id' | 'title' | 'price'>;

export type TGalleryProductInfo = Omit<IProduct, 'description'>;

export type TOrderTotal = Pick<IOrder, 'items' | 'total'>;

export type TOrderDetails = Pick<IOrder, 'address' | 'payment'>;

export type TOrderContacts = Pick<IOrder, 'email' | 'phone'>;
